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
import Group from '../../model/map/group';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadMap from 'cipherguard-mad/util/map/map';
import SecondarySidebarSectionComponent from '../workspace/secondary_sidebar_section';
import Tree from 'cipherguard-mad/component/tree';
import TreeView from 'cipherguard-mad/view/component/tree';

import template from '../../view/template/component/group_user/user_groups_sidebar_section.stache';
import groupListItemTemplate from '../../view/template/component/group_user/user_groups_list_item.stache';

const UserGroupsSidebarSectionComponent = SecondarySidebarSectionComponent.extend('cipherguard.component.group_user.UserGroupsSidebarSection', /** @static */ {

  defaults: {
    label: 'Sidebar Section User Groups Component',
    template: template,
    user: null,
    Group: Group
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    const tree = this._initTree();
    this._findUserGroups()
      .then(groups => {
        if (!groups.length) {
          this.state.empty = true;
          $('.empty-group-feedback').removeClass('hidden');
        }
        tree.load(groups);
        this.state.loaded = true;
        tree.state.loaded = true;
      });
  },

  /**
   *
   * Initialize the tree
   * @return {Component}
   */
  _initTree: function() {
    const map = this._getTreeMap();

    const tree = new Tree('#js_user_groups_list', {
      loadedOnStart: false,
      cssClasses: ['groups', 'shared-with'],
      viewClass: TreeView,
      itemClass: Group,
      itemTemplate: groupListItemTemplate,
      prefixItemId: 'js_user_groups_list_',
      map: map
    });
    tree.start();

    return tree;
  },

  /**
   * Get the tree map
   *
   * @return {mad.Map}
   */
  _getTreeMap: function() {
    return new MadMap({
      id: 'id',
      name: 'name',
      role: {
        key: 'groups_users',
        func: (value, map, item, mappedValues) => this._mapRoleField(value, map, item, mappedValues)
      }
    });
  },

  /**
   * Map the role field
   *
   * @inheritdoc
   */
  _mapRoleField: function(value) {
    return value.reduce((carry, item) => {
      if (item.user_id == this.options.user.id) {
        carry = item.is_admin ? __('Group manager') : __('Member');
      }
      return carry;
    }, null);
  },

  /**
   * Find the groups the users is member of
   *
   * @return {promise}
   */
  _findUserGroups: function() {
    const findOptions = {
      contain: {group_user: 1},
      order: ['Group.name ASC'],
      filter: {
        'has-users': this.options.user.id
      }
    };
    return Group.findAll(findOptions);
  },

  /* ************************************************************** */
  /* LISTEN TO THE MODEL EVENTS */
  /* ************************************************************** */

  /**
   * Observe when a group is created.
   * Update the component.
   */
  '{Group} created': function() {
    this.refresh();
  },

  /**
   * Observe when a group is updated.
   * Update the component.
   */
  '{Group} updated': function() {
    this.refresh();
  },

  /**
   * Observe when a group is deleted.
   * Update the component.
   */
  '{Group} deleted': function() {
    this.refresh();
  }

});

export default UserGroupsSidebarSectionComponent;
