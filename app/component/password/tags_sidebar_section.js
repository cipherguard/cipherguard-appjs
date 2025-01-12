/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SARL (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SARL (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         2.0.0
 */
import $ from 'jquery';
import DomData from 'can-dom-data';
import Filter from '../../model/filter';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadBus from 'cipherguard-mad/control/bus';
import MadMap from 'cipherguard-mad/util/map/map';
import PermissionType from '../../model/map/permission_type';
import SecondarySidebarSectionComponent from '../workspace/secondary_sidebar_section';
import Resource from '../../model/map/resource';
import Tag from '../../model/map/tag';
import User from '../../model/map/user';
import TreeComponent from 'cipherguard-mad/component/tree';
import View from 'cipherguard-mad/view/view';
import '../../../lib/jquery.tag-editor.js';
import '../../../lib/autocomplete.js';

import template from '../../view/template/component/password/tag_sidebar_section.stache';
import itemTemplate from '../../view/template/component/tag/tree_item.stache';
import tagUpdateFormTemplate from '../../view/template/form/tag/resource_tag_update.stache';

const TagSidebarSectionComponent = SecondarySidebarSectionComponent.extend('cipherguard.component.password.TagSidebarSection', /** @static */ {

  defaults: {
    label: 'Sidebar Section Tag Controller',
    template: template,
    resource: null,
    formError: null,
    Tag: Tag
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  beforeRender: function() {
    this._super();
    this._editing = false;
    this.setViewData('resource', this.options.resource);
  },

  /**
   * @inheritdoc
   */
  afterStart: function() {
    const tree = this._initTree();
    this.options.tree = tree;
    if (this.state.opened) {
      this.open();
    }
    this._super();
  },

  /**
   *
   * Initialize the tree
   * @return {mad.Component}
   */
  _initTree: function() {
    const map = this._getTreeMap();
    const tree = new TreeComponent('#js_rs_details_tags_list', {
      cssClasses: ['tags', 'tags-list'],
      itemClass: Tag,
      itemTemplate: itemTemplate,
      prefixItemId: 'js_rs_details_tags_list_',
      map: map
    });
    tree.start();

    return tree;
  },

  /**
   * @inheritdoc
   */
  open: function() {
    $('.processing-wrapper', this.element).show();
    this.options.tree.reset();
    this._findResourceTags()
      .then(tags => this._loadTags(tags));

    this._super();
  },

  /**
   * Find the resource tags.
   * @returns {Promise<tags>}
   */
  _findResourceTags: async function() {
    const id = this.options.resource.id;
    const contain = { tag: 1 };
    const resource = await Resource.findOne({ id, contain });
    $('.processing-wrapper', this.element).hide();

    return resource.tags;
  },

  /**
   * Get the tree map
   *
   * @return {mad.Map}
   */
  _getTreeMap: function() {
    return new MadMap({
      id: 'id',
      label: 'slug'
    });
  },

  /**
   * Enable the edit mode.
   */
  enableEditMode: function() {
    this.state.loaded = false;
    this._editing = true;
    this.options.tree.state.hidden = true;
    this._hideEmptyMessage();

    const slugs = this.options.tags.attr()
      .reduce((accumulator, currentValue) => [...accumulator, currentValue.slug], []);
    const formHtml = View.render(tagUpdateFormTemplate);
    $('.accordion-content', this.element).append(formHtml);

    const tagEditorSelector = '#js_edit_tags_form';
    $(tagEditorSelector).tagEditor({
      startTags: slugs,
      onSave: data => this._onFormSave(data),
      beforeDelete: slug => this._beforeDeleteTag(slug),
      beforeInsert: slug => this._beforeInsertTag(slug),
      canDelete: slug => this._canDeleteTag(slug)
    });
    $(tagEditorSelector).removeClass('hidden');

    // Give the focus to the editor.
    const tagEditorInputText = '#js_tag_editor_input_text';
    $(tagEditorInputText).focus();

    Tag.findAll()
      .then(tags => {
        this.options.allTags = tags;
        this._initAutocomplete({
          tags: tags,
          existingTags: slugs
        });
        this.state.loaded = true;
      });
  },

  /**
   * Disable the edit mode
   */
  disableEditMode: function() {
    this._editing = false;
    const tagEditorSelector = '#js_edit_tags_form';
    $(tagEditorSelector).remove();
    this.options.tree.state.hidden = false;
    if (!this.options.tags.length) {
      this._showEmptyMessage();
    }
  },

  /**
   * Hide the empty message if any.
   */
  _hideEmptyMessage: function() {
    $('.empty-content', this.element).addClass('hidden');
  },

  /**
   * Show the empty message if required.
   */
  _showEmptyMessage: function() {
    $('.empty-content', this.element).removeClass('hidden');
  },

  /**
   * Init the autocomplete component
   * @param {Object} options options dictionary
   */
  _initAutocomplete: function(options) {
    // All tags
    const tags = options.tags;
    // Tags that are already in the editor
    const editorTags = options.existingTags;
    const canUpdate = this.options.resource.permission.isAllowedTo(PermissionType.UPDATE);
    const slugs = this._extractTagSlugs(tags, canUpdate);

    // eslint-disable-next-line no-undef
    new autoComplete({
      selector: '#js_tag_editor_input_text',
      minChars: 1,
      source: (term, suggest) => {
        term = term.toLowerCase();
        const matches = slugs.filter(item => editorTags.indexOf(item) === -1 && item.toLowerCase().indexOf(term) != -1);
        suggest(matches);
      }
    });
  },

  /**
   * Extract tag slugs
   * @param {can.Model.List} tags The list of tags
   * @param {boolean} withIsShared With the shared tags
   * @return {array} List of slugs
   */
  _extractTagSlugs: function(tags, withIsShared) {
    withIsShared = withIsShared || false;
    return tags.attr()
      .reduce((accumulator, currentValue) => {
      // Remove #shared-tags from the autocomplete list if the user is not admin of the resource.
        if (/^#/.test(currentValue.slug) && !withIsShared) {
          return accumulator;
        }
        return [...accumulator, currentValue.slug];
      }, []);
  },

  /**
   * When the form is updated
   * @param {array} slugs The list of tags slugs.
   */
  _onFormSave: async function(slugs) {
    const tags = await Tag.updateResourceTags(this.options.resource.id, slugs);
    this.disableEditMode();
    this._loadTags(tags);
    MadBus.trigger('resource_tags_updated', [this.options.resource]);
  },

  /**
   * Load tags
   * @param {can.List} tags The list of tags
   */
  _loadTags: function(tags) {
    this.options.tags = tags;
    this.options.tree.reset();
    if (!tags.length) {
      this._showEmptyMessage();
    } else {
      this._hideEmptyMessage();
      this.options.tree.load(tags);
    }
  },

  /**
   * Before a tag is deleted from the tag editor.
   * Validate the change, return false if the validation failed.
   * A user without edit right on the resource cannot edit shared tags.
   * @param {string} slug The tag slug to validate
   */
  _beforeDeleteTag: function(slug) {
    if (!this._canDeleteTag(slug)) {
      const message = __('You do not have the permission to edit shared tags on this resource.');
      this._errorForm(message);
      return false;
    }
    return true;
  },

  /**
   * An error occurred on the edit tag form.
   * Display a message.
   * @param {string} message
   */
  _errorForm: function(message) {
    const $feedback = $('#js_edit_tags_form .message');
    $feedback.text(message)
      .removeClass('notice')
      .removeClass('hidden')
      .addClass('error');
    this.options.formError = message;
  },

  /**
   * Clear form error.
   * Sets the message to null and hides the message div
   */
  _clearFormError: function() {
    const $feedback = $('#js_edit_tags_form .message');
    $feedback.text('')
      .addClass('hidden');
    this.options.formError = null;
  },

  /**
   * Before a tag is inserted from the tag editor.
   * Validate the change, return false if the validation failed.
   * A user without edit right on the resource cannot edit shared tags.
   * @param {string} slug The tag slug to validate
   */
  _beforeInsertTag: function(slug) {
    const isShared = /^#/.test(slug);
    const canUpdate = this.options.resource.permission.isAllowedTo(PermissionType.UPDATE);
    const isAdmin = User.getCurrent().isAdmin();
    const isNewTag = !this.options.allTags.filter(tag => tag.slug === slug).length;
    let valid = true;

    if (isShared && !isAdmin) {
      if (!canUpdate) {
        const message = __('You do not have the permission to change shared tags on this resource.');
        this._errorForm(message);
        valid = false;
      }
      /*
       * else if (isNewTag) {
       *   const message = __('You do not have the permission to create new shared tags.');
       *   this._errorForm(message);
       *   valid = false;
       * }
       */
    }
    return valid;
  },

  /**
   * Determine if a tag can be deleted
   * return true if it can be and false otherwise
   *
   * @param {string} slug
   */
  _canDeleteTag: function(slug) {
    if (/^#/.test(slug) && !this.options.resource.permission.isAllowedTo(PermissionType.UPDATE)) {
      return false;
    }
    return true;
  },

  /**
   * Cancel the changes
   */
  '{element} #js_tags_editor_cancel click': function() {
    this.disableEditMode();
  },

  /**
   * Save the list of tags
   */
  '{element} #js_edit_tags_button click': function() {
    if (!this._editing) {
      this.enableEditMode();
    } else {
      this.disableEditMode();
    }
  },

  /**
   * Save the list of tags
   */
  '{element} em.empty-content click': function() {
    if (!this._editing) {
      this.enableEditMode();
    } else {
      this.disableEditMode();
    }
  },

  /**
   * Listens to the tageditor change event
   * Used to reset the form error status
   */
  '{element} #js_tag_editor_input_text input': function() {
    if (this.options.formError) {
      this._clearFormError();
      this.options.formError = null;
    }
  },

  /**
   * Observer when a tag is selected.
   * @param {HTMLElement} el The element the event occurred on
   */
  '{element} a.tag click': function(el) {
    const li = el.closest('li');
    const tag = DomData.get(li, Tag.shortName);
    const filter = new Filter({
      id: `workspace_filter_tag_${tag.id}`,
      type: 'tag',
      label: tag.slug + __(' (tag)'),
      rules: {
        'has-tag': tag.slug
      },
      tag: tag
    });
    MadBus.trigger('filter_workspace', {filter: filter});
  },

  /**
   * Observer when the user press escape.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{element} keydown': function(el, ev) {
    if (ev.which == 27) {
      this._destroyForm();
    }
  },

  /**
   * Observe when a tag is deleted
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{Tag} destroyed': function(el, ev) {
    if (this.state.opened) {
      this.open();
    }
  },

});

export default TagSidebarSectionComponent;
