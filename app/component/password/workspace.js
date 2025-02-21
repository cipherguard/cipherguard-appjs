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
import BreadcrumbComponent from '../password/workspace_breadcrumb';
import ButtonComponent from 'cipherguard-mad/component/button';
import Component from 'cipherguard-mad/component/component';
import ComponentHelper from 'cipherguard-mad/helper/component';
import Config from 'cipherguard-mad/config/config';
import ConfirmDialogComponent from 'cipherguard-mad/component/confirm';
import getObject from 'can-util/js/get/get';
import GridComponent from '../password/grid';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadBus from 'cipherguard-mad/control/bus';
import PasswordSecondarySidebarComponent from '../password/password_secondary_sidebar';
import Plugin from '../../util/plugin';
import React from "react";
import ReactDOM from "react-dom";

import PrimaryMenuComponent from '../password/workspace_primary_menu';
import PrimarySidebarComponent from '../password/primary_sidebar';
import route from 'can-route';
import SecondaryMenuComponent from '../workspace/secondary_menu';

import Filter from '../../model/filter';
import Group from '../../model/map/group';
import Resource from '../../model/map/resource';
import ResourceService from '../../model/service/plugin/resource';
import Tag from '../../model/map/tag';

import commentDeleteConfirmTemplate from '../../view/template/component/comment/delete_confirm.stache';
import createButtonTemplate from '../../view/template/component/workspace/create_button.stache';
import importButtonTemplate from '../../view/template/component/workspace/import_button.stache';
import resourcesDeleteConfirmTemplate from '../../view/template/component/password/delete_confirm.stache';
import template from '../../view/template/component/password/workspace.stache';
import Action from "cipherguard-mad/model/map/action";
import uuid from "uuid/v4";
import ButtonDropdownComponent from "cipherguard-mad/component/button_dropdown";
import Validation from "cipherguard-mad/util/validation";
import HtmlHelper from "cipherguard-mad/helper/html";
import FolderSidebar from "../../../src/components/Workspace/Passwords/FolderSidebar/FolderSidebar";

const PasswordWorkspaceComponent = Component.extend('cipherguard.component.password.Workspace', /** @static */ {

  defaults: {
    name: 'password_workspace',
    template: template,
    silentLoading: false,
    loadedOnStart: false,
    selectedResources: new Resource.List(),
    selectedGroups: new Group.List(),
    selectedTags: new Tag.List(),
    filter: null,
    Resource: Resource,
    Tag: Tag,
    document: document
  },

  /**
   * Return the default filter used to filter the workspace
   * @return {Filter}
   */
  getDefaultFilterSettings: function() {
    const filter = new Filter({
      id: 'default',
      type: 'default',
      label: __('All items'),
      order: ['Resource.modified DESC']
    });
    return filter;
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    const primaryMenu = this._initPrimaryMenu();
    const secondaryMenu = this._initSecondaryMenu();
    const mainActionButton = this._initMainActionButton();
    const importButton = this._initImportButton();
    const breadcrumb = this._initBreadcrumb();
    const primarySidebar = this._initPrimarySidebar();
    const grid = this._initGrid();

    primaryMenu.start();
    secondaryMenu.start();
    mainActionButton.start();
    if (importButton) {
      importButton.start();
    }
    breadcrumb.start();
    primarySidebar.start();
    grid.start();

    this.intialFilter();

    this.on();
    this._super();
  },

  /**
   * Filter the workspace
   * @returns {Promise<void>}
   */
  intialFilter: async function() {
    // Filter the workspace
    const filter = await this.getFilter();
    MadBus.trigger('filter_workspace', {filter: filter});
    // If filter on a folder, scroll to this folder.
    if (filter.type === 'folder' && filter.folder.id !== null) {
      MadBus.trigger('scroll_to_folder', filter.folder);
    }
  },

  /**
   * Get the filter to apply to the workspace.
   * @return {Filter}
   */
  getFilter: async function() {
    let filter = PasswordWorkspaceComponent.getDefaultFilterSettings();
    filter.viewResourceId = null;

    const action = route.data.action;
    switch (action) {
      case 'commentsView':
      case 'view': {
        if (Validation.uuid(route.data.id)) {
          filter.selectedResourceId = route.data.id;
        }
        break;
      }
      case 'viewFolder': {
        if (Validation.uuid(route.data.id)) {
          const folderId = route.data.id;
          const folders = await Plugin.requestUntilSuccess("cipherguard.storage.folders.get");
          const folder = folders.find(item => item.id === folderId);
          if (folder) {
            filter = new Filter({
              id: `workspace_filter_folder_${folderId}`,
              type: 'folder',
              folder: folder,
              label: __('%s (folder)', folder.name),
              rules: {
                'has-parent': folder.id
              },
              order: ['Resource.modified DESC']
            });
          }
        }
        break;
      }
    }

    return filter;
  },

  /**
   * Init the primary workspace menu.
   * The menu is not instantiated as a child of this component DOM Element, remove it manually from the DOM when
   * this component is destroyed.
   * @see destroy()
   * @return {Component}
   */
  _initPrimaryMenu: function() {
    const $el = $('#js_wsp_primary_menu_wrapper');
    const options = {selectedResources: this.options.selectedResources};
    const component = ComponentHelper.create($el, 'last', PrimaryMenuComponent, options);
    this.addLoadedDependency(component);
    return component;
  },

  /**
   * Init the secondary workspace menu.
   * The menu is not instantiated as a child of this component DOM Element, remove it manually from the DOM when
   * this component is destroyed.
   * @see destroy()
   * @return {Component}
   */
  _initSecondaryMenu: function() {
    const component = ComponentHelper.create(
      $('#js_wsp_secondary_menu_wrapper'),
      'last',
      SecondaryMenuComponent, {
        selectedItems: this.options.selectedResources
      }
    );
    this.addLoadedDependency(component);
    return component;
  },

  /**
   * Initialize the workspace main action button.
   * @return {Component}
   */
  _initMainActionButton: function() {
    const pluginFoldersEnabled = Config.read('server.cipherguard.plugins.folders');
    if (pluginFoldersEnabled) {
      return this._initProMainActionButton();
    } else {
      return this._iniCeMainActionButton();
    }
  },

  /**
   * Init the main action button for the CE.
   * @returns {*|mad.Component}
   * @private
   */
  _iniCeMainActionButton: function() {
    const selector = $('.main-action-wrapper');
    const options = {
      id: 'js_wsp_create_button',
      template: createButtonTemplate,
      tag: 'button',
      cssClasses: ['button', 'primary'],
      events: {
        click: function() {
          MadBus.trigger('request_resource_create');
        }
      }
    };
    const component = ComponentHelper.create(selector, 'last', ButtonComponent, options);
    this.options.mainButton = component;
    this.addLoadedDependency(component);
    return component;
  },

  /**
   * Init the main action button for the Pro.
   * @returns {*|mad.Component}
   * @private
   */
  _initProMainActionButton: function() {
    const items = [
      new Action({
        id: uuid(),
        label: __('New password'),
        cssClasses: ['create-resource'],
        action: () => {
          button.view.close();
          const folderParentId = this.filter.folder ? this.filter.folder.id : null;
          MadBus.trigger('request_resource_create', {folderParentId});
        }
      }),
      new Action({
        id: uuid(),
        label: __('New folder'),
        cssClasses: ['create-folder'],
        action: () => {
          button.view.close();
          const folderParentId = this.filter.folder ? this.filter.folder.id : null;
          Plugin.send('cipherguard.plugin.folders.open-create-dialog', {folderParentId});
        }
      })
    ];

    const button = ComponentHelper.create(
      $('.main-action-wrapper'),
      'last',
      ButtonDropdownComponent, {
        id: 'js_wsp_create_button',
        template: createButtonTemplate,
        tag: 'a',
        cssClasses: ['button', 'primary'],
        silentLoading: false,
        items: items
      }
    );

    this.options.mainButton = button;
    this.addLoadedDependency(button);
    return button;
  },

  /**
   * Initialize the workspace import action button.
   * @return {Component}
   */
  _initImportButton: function() {
    if (Config.read('server.cipherguard.plugins.import')) {
      const selector = $('.main-action-wrapper');
      const options = {
        id: 'js_wsp_pwd_import_button',
        template: importButtonTemplate,
        tag: 'button',
        cssClasses: ['button']
      };
      const component = ComponentHelper.create(selector, 'last', ButtonComponent, options);
      this.options.importButton = component;
      this.addLoadedDependency(component);
      return component;
    }
  },

  /**
   * Initialize the workspace breadcrumb
   * @return {Component}
   */
  _initBreadcrumb: function() {
    const component = new BreadcrumbComponent('#js_wsp_password_breadcrumb', {
      rootFilter: PasswordWorkspaceComponent.getDefaultFilterSettings()
    });
    this.addLoadedDependency(component);
    return component;
  },

  /**
   * Initialize the primary sidebar component
   * @return {Component}
   */
  _initPrimarySidebar: function() {
    const component = new PrimarySidebarComponent('#js_password_workspace_primary_sidebar', {
      defaultFilter: PasswordWorkspaceComponent.getDefaultFilterSettings(),
      selectedResources: this.options.selectedResources,
      selectedGroups: this.options.selectedGroups,
      selectedTags: this.options.selectedTags
    });
    this.addLoadedDependency(component);
    return component;
  },

  /**
   * Initialize the grid component
   * @return {Component}
   */
  _initGrid: function() {
    const component = new GridComponent('#js_wsp_pwd_browser', {
      selectedResources: this.options.selectedResources,
    });
    this.addLoadedDependency(component);
    this.grid = component;
    return component;
  },

  /**
   * Init the secondary sidebar.
   * @return {Component}
   * @private
   */
  _initSecondarySidebar: function() {
    this.latestSelectedSidebar = 'resource';
    this._destroySecondarySidebar();
    const showSidebar = Config.read('ui.workspace.showSidebar');
    if (!showSidebar) {
      return;
    }
    this.destroyFolderSecondarySidebar();

    const resource = this.options.selectedResources[0];
    const options = {
      id: 'js_pwd_details',
      resource: resource,
      cssClasses: ['panel', 'aside', 'js_wsp_pwd_sidebar_second']
    };
    const component = ComponentHelper.create(this.element, 'last', PasswordSecondarySidebarComponent, options);
    this.options.passwordSecondarySidebar = component;
    return component;
  },

  /**
   * Init the folder secondary sidebar.
   * @return {Component}
   * @private
   */
  _initFolderSecondarySidebar: async function(folder) {
    const requestId = uuid();
    this.folderSecondarySidebarRequestId = requestId;
    this.folderSecondarySidebarFolder = folder;
    this.latestSelectedSidebar = 'folder';

    this.destroyFolderSecondarySidebar();
    const showSidebar = Config.read('ui.workspace.showSidebar');
    if (!showSidebar) {
      return;
    }

    const folderSecondarySidebarElement = HtmlHelper.create(this.element, 'last', '<div id="js_folder_details">test</div>');
    this.folderSecondarySidebarRef = React.createRef();
    const folders = await Plugin.requestUntilSuccess("cipherguard.storage.folders.get");
    let groups = [];
    let users = [];
    let permissions = [];
    this.renderFolderSecondarySidebar(folderSecondarySidebarElement[0], folder, folders, groups, users, permissions);

    // Request the folder details from the API.
    let folderDetails = await this.findFolderForSecondarySidebar(folder);
    if (this.folderSecondarySidebarRequestId !== requestId) {
      return;
    }

    // Update the folder secondary sidebar with the retrieved information.
    users = [folderDetails.creator, folderDetails.modifier];
    this.renderFolderSecondarySidebar(folderSecondarySidebarElement[0], folder, folders, groups, users, permissions);
  },

  /**
   * Find folders details (permissions, creator, modifier)
   * @param {object} folder The folder to retrieve the detail for
   * @returns {Promise<object>}
   */
  findFolderForSecondarySidebar: async function(folder) {
    const url = new URL(`${APP_URL}folders/${folder.id}.json?api-version=2&contain[creator.profile]=true&contain[modifier.profile]=true`);
    const fetchOptions = {};
    const response = await fetch(url, fetchOptions);
    const responseJson = await response.json();

    return responseJson.body;
  },

  /**
   * Destroy the folder secondary sidebar.
   */
  destroyFolderSecondarySidebar: function() {
    $('#js_folder_details').remove();
    this.folderSecondarySidebarRef = null;
  },

  /**
   * Render the folder secondary sidebar
   * @param element
   * @param folder
   * @param folders
   * @param groups
   * @param users
   * @returns {Promise<void>}
   */
  renderFolderSecondarySidebar: async function(element, folder, folders, groups, users, permissions) {
    ReactDOM.render(<FolderSidebar
      ref={this.folderSecondarySidebarRef}
      folder={folder}
      folders={folders}
      groups={groups}
      permissions={permissions}
      onClose={this.handleFolderSecondarySidebarClose}
      onEditPermissions={this.handleFolderSecondarySidebarOpenShareDialogForFolder}
      onSelectFolderParent={this.handleFolderSecondarySidebarSelectFolder}
      onSelectRoot={this.handleFolderSecondarySidebarSelectRootFolder}
      users={users}
    />, element);
  },

  /**
   * Handle when the user want to close the folder sidebar.
   */
  handleFolderSecondarySidebarClose: function() {
    Config.write('ui.workspace.showSidebar', false);
    MadBus.trigger('workspace_sidebar_state_change');
  },

  /**
   * Handle when the user wants to open the share dialog from the folder secondary sidebar.
   * @param {object} folder The folder to open the share dialog for
   */
  handleFolderSecondarySidebarOpenShareDialogForFolder: function (folder) {
    const foldersIds = [folder.id];
    Plugin.send("cipherguard.plugin.folders.open-share-dialog", {foldersIds});
  },

  /**
   * Handle when the user selects a folder from the folder secondary sidebar.
   * @param {object} folder The selected folder
   */
  handleFolderSecondarySidebarSelectFolder: function(folder) {
    const filter = new Filter({
      id: `workspace_filter_folder_${folder.id}`,
      type: 'folder',
      folder: folder,
      label: __('%s (folder)', folder.name),
      rules: {
        'has-parent': folder.id
      },
      order: ['Resource.modified DESC']
    });
    MadBus.trigger('filter_workspace', {filter});
  },

  /**
   * Handle when the user selects the root folder from the folder secondary sidebar.
   * @param {object} folder The selected folder
   */
  handleFolderSecondarySidebarSelectRootFolder: function() {
    const filter = new Filter({
      id: `workspace_filter_folder_root`,
      type: 'folder',
      folder: {
        id: null,
        name: 'root'
      },
      label: __('%s (folder)', 'root'),
      rules: {
        'has-parent': null
      },
      order: ['Resource.modified DESC']
    });
    MadBus.trigger('filter_workspace', {filter});
  },

  /**
   * Destroy the secondary sidebar
   * @private
   */
  _destroySecondarySidebar: function() {
    if (this.options.passwordSecondarySidebar) {
      this.options.passwordSecondarySidebar.destroyAndRemove();
      this.options.passwordSecondarySidebar = null;
    }
  },

  /**
   * Open the resource create dialog.
   * @param {string} folderParentId The parent folder id
   */
  openCreateResourceDialog: function(folderParentId) {
    ResourceService.openCreateDialog(folderParentId);
  },

  /**
   * Open the resource edit dialog.
   * @param {Resource} resource The target user entity.
   */
  openEditResourceDialog: function(resource) {
    ResourceService.openEditDialog(resource.id);
  },

  /**
   * Open the bulk resources share dialog.
   *
   * @param {Resource.List} resources The target resources.
   */
  openShareResourcesDialog: function(resources) {
    ResourceService.openShareDialog(resources.map(resource => resource.id));
  },

  /**
   * Open the resource(s) delete dialog.
   *
   * @param {Resource.List} resources The resource to delete
   */
  openDeleteResourcesDialog: function(resources) {
    const multipleDelete = resources.length > 1;
    const dialog = ConfirmDialogComponent.instantiate({
      label: __('Delete password?'),
      content: resourcesDeleteConfirmTemplate,
      submitButton: {
        label: multipleDelete ? __('delete passwords') : __('delete password'),
        cssClasses: ['warning']
      },
      action: () => this._deleteResources(resources)
    });
    dialog.setViewData('multipleDelete', multipleDelete);
    dialog.setViewData('resources', resources);
    dialog.start();
  },

  /**
   * Perform the resource(s) delete
   *
   * @param {Resource.List} resources The resource to delete
   */
  _deleteResources: async function(resources) {
    this.state.loaded = false;
    this.options.selectedResources.splice(0, this.options.selectedResources.length);
    const resourcesIds = resources.reduce((carry, resource) => [...carry, resource.id], []);
    try {
      await ResourceService.deleteAllByIds(resourcesIds);
      let notificationTitle = "app_resources_delete_success";
      if (resources.length > 1) {
        notificationTitle = "app_resources_delete_all_success";
      }
      MadBus.trigger('cipherguard_notify', { status: 'success', title: notificationTitle });
    } catch (error) {
      MadBus.trigger('cipherguard_notify', { status: 'error', message: error.message, force: true });
    }
    this.state.loaded = true;
  },

  /**
   * Delete a comment
   * @param {Comment} comment The target comment
   */
  deleteComment: function(comment) {
    const confirm = ConfirmDialogComponent.instantiate({
      label: __('Do you really want to delete?'),
      content: commentDeleteConfirmTemplate,
      submitButton: {
        label: __('delete comment'),
        cssClasses: ['warning']
      },
      action: function() {
        comment.destroy();
      }
    });
    confirm.start();
  },

  /**
   * Observe when a resource is updated.
   * If the resource is currently selected, update the instance instance in selectedResources array
   * @param {DefineMap.prototype} model The model reference
   * @param {HTMLEvent} ev The event which occurred
   * @param {Resource} resource The updated resource
   */
  '{Resource} updated': function(model, ev, resource) {
    const resourceSelectedIndex = this.options.selectedResources.indexOf(resource);
    if (resourceSelectedIndex != -1) {
      this.options.selectedResources[resourceSelectedIndex].assign(resource);
    }
  },

  /**
   * Observe when a resource is destroyed.
   * - Remove it from the list of selected resources;
   * @param {DefineMap} model The target model
   * @param {Event} event The even
   * @param {DefineMap} destroyedItem The destroyed item
   */
  '{Resource} destroyed': function(model, event, destroyedItem) {
    this.options.selectedResources.remove(destroyedItem);
  },

  /**
   * Observe when a tag is destroyed.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   * @param {Group} tag The destroyed tag
   */
  '{Tag} destroyed': function (el, ev, tag) {
    const selectedTags = this.options.selectedTags;
    if (selectedTags.indexOf({ id: tag.id }) != -1) {
      const filter = PasswordWorkspaceComponent.getDefaultFilterSettings();
      MadBus.trigger('filter_workspace', {filter: filter});
    }
  },

  /**
   * Observe when a tag is destroyed.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   * @param {Group} tag The destroyed tag
   */
  '{document} cipherguard.storage.folders.updated': function (el, ev) {
    const folders = ev.data;
    if (this.filter.type === 'folder' && this.filter.folder.id !== null) {
      const foldersIds = folders.map(folder => folder.id);
      if (!foldersIds.includes(this.filter.folder.id)) {
        const filter = PasswordWorkspaceComponent.getDefaultFilterSettings();
        MadBus.trigger('filter_workspace', {filter: filter});
      }
    }
  },

  /**
   * Observe when resources are selected
   * @param {HTMLElement} el The element the event occurred on
   */
  '{selectedResources} length': function() {
    const selectedResources = this.options.selectedResources;
    if (selectedResources.length == 1) {
      const component = this._initSecondarySidebar();
      if (component) {
        component.start();
      }
      const url = new URL(window.location);
      const matches = url.pathname.match('^\/app\/passwords\/view\/(.*)$');
      if (!matches || matches[1] !== selectedResources[0].id) {
        route.data.update({controller: 'Password', action: 'view', id: selectedResources[0].id});
      }
    } else {
      this._destroySecondarySidebar();
      route.data.update({controller: 'Password', action: 'index'});
    }
  },

  /**
   * Observe when the workspace sidebar setting change.
   */
  '{mad.bus.element} workspace_sidebar_state_change': function() {
    if (Config.read('ui.workspace.showSidebar')) {
      if (this.latestSelectedSidebar === 'resource') {
        const resource = this.options.selectedResources[0];
        if (resource) {
          const component = this._initSecondarySidebar(resource);
          if (component) {
            component.start();
          }
        }
      } else if (this.latestSelectedSidebar === 'folder') {
        // @todo if the folder has been unselected then it's not relevant. It can lead to error if the folder has been
        // deleted in the meantime.
        this._initFolderSecondarySidebar(this.folderSecondarySidebarFolder);
      }
    } else {
      this.destroyFolderSecondarySidebar();
      this._destroySecondarySidebar();
    }
  },

  /**
   * Observe when the user wants to import a password
   */
  '{importButton.element} click': function() {
    MadBus.trigger('cipherguard.import-passwords');
  },

  /**
   * When a new filter is applied to the workspace.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} filter_workspace': function(el, ev) {
    const filter = ev.data.filter;
    this.filter = filter;

    // Unselect all group if the filter does not target a group (dirty).
    if (!filter.rules['is-shared-with-group']) {
      this.options.selectedGroups.splice(0, this.options.selectedGroups.length);
    }

    // Disable the main button, if a folder is selected and the user doesn't have the permission to write into it.
    if (filter.type === 'folder') {
      this.destroyFolderSecondarySidebar();
      if (filter.folder.id !== null) {
        this._initFolderSecondarySidebar(filter.folder);
        if (filter.folder.permission.type < 7) {
          this.options.mainButton.state.disabled = true;
          this.options.importButton.state.disabled = true;
        } else {
          this.options.mainButton.state.disabled = false;
          this.options.importButton.state.disabled = false;
        }
      } else {
        this.options.mainButton.state.disabled = false;
        this.options.importButton.state.disabled = false;
      }
    } else {
      this.destroyFolderSecondarySidebar();
      this.options.mainButton.state.disabled = false;
      this.options.importButton.state.disabled = false;
    }
  },

  /**
   * Observe when the user requests a resource creation
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_resource_create': function(el, ev) {
    let folderParentId = null;
    if (ev.data && ev.data.folderParentId !== null) {
      folderParentId = ev.data.folderParentId;
    }
    // Can be an event coming from a React component.
    if (ev.detail && ev.detail.folderParentId !== null) {
      folderParentId = ev.detail.folderParentId;
    }
    this.openCreateResourceDialog(folderParentId);
  },

  /**
   * Observe when the user wants to edit a resource
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_resource_edit': function(el, ev) {
    const resource = ev.data.resource;
    this.openEditResourceDialog(resource);
  },

  /**
   * Observe when the user wants to delete a resource
   *
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_resource_delete': function(el, ev) {
    const resource = ev.data.resource;
    const resources = new Resource.List([resource]);
    this.openDeleteResourcesDialog(resources);
  },

  /**
   * Observe when the user wants to delete resources
   *
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_resources_delete': function(el, ev) {
    const resources = ev.data.resources;
    this.openDeleteResourcesDialog(resources);
  },

  /**
   * Observe when the user wants to share a resource
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_resource_share': function(el, ev) {
    const resource = ev.data.resource;
    this.openShareResourcesDialog([resource]);
  },

  /**
   * Observe when the user wants to share a resources
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_resources_share': function(el, ev) {
    const resources = ev.data.resources;
    this.openShareResourcesDialog(resources);
  },

  /**
   * Listen to the workspace request_export
   */
  '{mad.bus.element} request_export': function() {
    const resourcesIds = this.options.selectedResources.reduce((carry, resource) => [...carry, resource.id], []);
    Plugin.send('cipherguard.plugin.export_resources', resourcesIds);
  },

  /**
   * Observe when the plugin informs that an import is complete.
   * If a tag has been created for the import, then the same tag will be selected in the workspace.
   * If no tag has been created (no tag integration) then just refresh the workspace.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} cipherguard.plugin.import-passwords-complete': function(el, ev) {
    const selectTag = getObject(ev, 'data.tag');
    MadBus.trigger('tags_updated', { selectTag });
    ResourceService.updateLocalStorage();
  },

  /**
   * Observe when the plugin informs that the share operation has been completed.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} cipherguard.share.complete': async function(el, ev) {
    await ResourceService.updateLocalStorage();
    MadBus.trigger('permissions_updated', this.options.selectedResources);
  },

  /**
   * Observe when the plugin informs that the user wants to go to the edit dialog from the share dialog
   */
  '{mad.bus.element} cipherguard.share.go-to-edit': function() {
    const resource = this.options.selectedResources.get(0);
    MadBus.trigger('request_resource_edit', {resource: resource});
  },

  /**
   * Observe to comment delete request.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_delete_comment': function(el, ev) {
    const comment = ev.data.comment;
    this.deleteComment(comment);
  }
});

export default PasswordWorkspaceComponent;
