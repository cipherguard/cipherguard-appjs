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
import Action from 'cipherguard-mad/model/map/action';
import Component from 'cipherguard-mad/component/component';
import Clipboard from '../../util/clipboard';
import Config from 'cipherguard-mad/config/config';
import Button from 'cipherguard-mad/component/button';
import ButtonDropdownComponent from 'cipherguard-mad/component/button_dropdown';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadBus from 'cipherguard-mad/control/bus';
import PermissionType from '../../model/map/permission_type';
import Resource from '../../model/map/resource';
import ResourceService from '../../model/service/plugin/resource';

import template from '../../view/template/component/password/workspace_primary_menu.stache';

const PasswordWorkspaceMenuComponent = Component.extend('cipherguard.component.PasswordWorkspaceMenu', /** @static */ {

  defaults: {
    label: 'Workspace Menu Controller',
    tag: 'ul',
    selectedResources: new Resource.List(),
    template: template
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    // Copy secret button
    const copySecretButton = new Button('#js_wk_menu_secretcopy_button', {
      state: {disabled: true},
      events: {
        click: () => this._copySecret()
      }
    });
    copySecretButton.start();
    /*
     * @todo Check how the click event is resolved, if the stopImmediatePropagation/stopPropagation of the button avoid this callback to eb called, it would be magic ... magic...
     * copySecretButton.on('click', () => this._copySecret());
     */
    this.secretCopyButton = copySecretButton;

    // Edit button
    const editButton = new Button('#js_wk_menu_edition_button', {
      state: {disabled: true},
      events: {
        click: () => this._edit()
      }
    });
    editButton.start();
    this.editButton = editButton;

    // Share button
    const shareButton = new Button('#js_wk_menu_sharing_button', {
      state: {disabled: true},
      events: {
        click: () => this._share()
      }
    });
    shareButton.start();
    this.shareButton = shareButton;

    // Export
    this._initExportButton();

    // More button items
    const moreButtonMenuItems = [];

    // Copy login
    const copyLoginItem = new Action({
      id: 'js_wk_menu_copy_login_action',
      label: __('copy username to clipboard'),
      cssClasses: [],
      action: () => this._copyLogin()
    });
    moreButtonMenuItems.push(copyLoginItem);

    // Copy secret
    const copySecretItem = new Action({
      id: 'js_wk_menu_copy_secret_action',
      label: __('copy password to clipboard'),
      cssClasses: [],
      action: () => this._copySecret()
    });
    moreButtonMenuItems.push(copySecretItem);

    // Delete
    const deleteItem = new Action({
      id: 'js_wk_menu_delete_action',
      label: __('delete'),
      cssClasses: [],
      action: () => this._delete()
    });
    moreButtonMenuItems.push(deleteItem);

    // Copy permalink
    const copyPermalinkItem = new Action({
      id: 'js_wk_menu_copy_permalink_action',
      label: __('copy permalink to clipboard'),
      cssClasses: [],
      action: () => this._copyPermalink()
    });
    moreButtonMenuItems.push(copyPermalinkItem);

    const moreButton = new ButtonDropdownComponent('#js_wk_menu_more_button', {
      state: {disabled: true},
      items: moreButtonMenuItems,
      template: null
    });
    moreButton.start();
    this.moreButton = moreButton;
  },

  /**
   * Init export button.
   * @private
   */
  _initExportButton: function() {
    if (Config.read('server.cipherguard.plugins.export')) {
      const exportButtonSelector = '#js_wk_menu_export_button';
      $(exportButtonSelector).removeClass('hidden');
      const exportButton = new Button(exportButtonSelector, {
        state: {disabled: true},
        events: {
          click: () => this._export()
        }
      });
      exportButton.start();
      this.exportButton = exportButton;
    }
  },

  /**
   * Copy login to clipboard.
   */
  _copyLogin: function() {
    const item = this.options.selectedResources[0];
    Clipboard.copy(item.username, 'username');
  },

  /**
   * Decrypt and copy secret to clipboard
   */
  _copySecret: function() {
    const resource = this.options.selectedResources[0];
    ResourceService.decryptSecretAndCopyToClipboard(resource.id);
  },

  /**
   * Copy permalink to clipboard
   */
  _copyPermalink: function() {
    Clipboard.copy(this.options.selectedResources[0].getPermalink(), 'permalink');
  },

  /**
   * Delete
   */
  _delete: function() {
    const resources = this.options.selectedResources.slice(0);
    MadBus.trigger('request_resources_delete', {resources: resources});
  },

  /**
   * Edit
   */
  _edit: function() {
    const resource = this.options.selectedResources[0];
    MadBus.trigger('request_resource_edit', {resource: resource});
  },

  /**
   * Share
   */
  _share: function() {
    const resources = this.options.selectedResources;
    if (resources.length > 1) {
      MadBus.trigger('request_resources_share', {resources: resources});
    } else {
      MadBus.trigger('request_resource_share', {resource: resources[0]});
    }
  },

  /**
   * Export
   */
  _export: function() {
    const type = 'csv';
    MadBus.trigger('request_export', {type: type});
  },

  /**
   * Observe when a resource is selected
   */
  '{selectedResources} length': function() {
    const resources = this.options.selectedResources;
    switch (resources.length) {
      case 0: {
        this.reset();
        break;
      }
      case 1: {
        this.reset();
        this.resourceSelected();
        break;
      }
      default: {
        this.reset();
        this.resourcesSelected();
      }
    }
  },

  /**
   * Observe when a resource is selected
   */
  '{selectedResources} remove': function() {
    const resources = this.options.selectedResources;
    switch (resources.length) {
      case 0: {
        this.reset();
        break;
      }
      case 1: {
        this.reset();
        this.resourceSelected();
        break;
      }
      default: {
        this.reset();
        this.resourcesSelected();
      }
    }
  },

  /**
   * A resource is selected, adapt the buttons states.
   */
  resourceSelected: function() {
    const resource = this.options.selectedResources[0];
    const permission = resource.permission;
    const canEdit = permission.isAllowedTo(PermissionType.UPDATE);
    const canAdmin = permission.isAllowedTo(PermissionType.ADMIN);
    const moreButtonDeleteItemId = 'js_wk_menu_delete_action';
    const moreButtonCopyLoginItemId = 'js_wk_menu_copy_login_action';
    this.secretCopyButton.state.disabled = false;
    this.editButton.state.disabled = !canEdit;
    this.shareButton.state.disabled = !canAdmin;
    if (Config.read('server.cipherguard.plugins.export')) {
      this.exportButton.state.disabled = false;
    }
    this.moreButton.state.disabled = false;
    if (canEdit) {
      this.moreButton.enableItem(moreButtonDeleteItemId);
    } else {
      this.moreButton.disableItem(moreButtonDeleteItemId);
    }
    if (resource.username == null) {
      this.moreButton.disableItem(moreButtonCopyLoginItemId);
    } else {
      this.moreButton.enableItem(moreButtonCopyLoginItemId);
    }
  },

  /**
   * Resourecs is selected, adapt the buttons states.
   */
  resourcesSelected: function() {
    const moreButtonDeleteItemId = 'js_wk_menu_delete_action';
    const moreButtonCopyLoginItemId = 'js_wk_menu_copy_login_action';
    const moreButtonCopySecretItemId = 'js_wk_menu_copy_secret_action';
    const moreButtonCopyPermalinkItemId = 'js_wk_menu_copy_permalink_action';
    const resources = this.options.selectedResources;
    const {canDelete, canShare} = resources.reduce((carry, resource) => ({
      canDelete: resource.permission.isAllowedTo(PermissionType.UPDATE) && carry.canDelete,
      canShare: resource.permission.isAllowedTo(PermissionType.ADMIN) && carry.canShare
    }), {canDelete: true, canShare: true});

    // Enable/disable single actions
    if (resources.length > 1) {
      this.moreButton.disableItem(moreButtonCopyLoginItemId);
      this.moreButton.disableItem(moreButtonCopySecretItemId);
      this.moreButton.disableItem(moreButtonCopyPermalinkItemId);
    } else {
      this.moreButton.enableItem(moreButtonCopyLoginItemId);
      this.moreButton.enableItem(moreButtonCopySecretItemId);
      this.moreButton.enableItem(moreButtonCopyPermalinkItemId);
    }

    // Enable the export button if it can be.
    if (Config.read('server.cipherguard.plugins.export')) {
      this.exportButton.state.disabled = false;
    }

    // The user can delete the resources
    if (canDelete) {
      this.moreButton.enableItem(moreButtonDeleteItemId);
    } else {
      this.moreButton.disableItem(moreButtonDeleteItemId);
    }

    // The user can share the resources
    if (canShare) {
      this.shareButton.state.disabled = false;
    } else {
      this.shareButton.state.disabled = true;
    }

    // Disable the more button if there is no enabled action.
    const enableMoreButtons = this.moreButton.options.items.reduce((carry, item) => {
      carry = item.enabled || carry;
      return carry;
    }, false);
    this.moreButton.state.disabled = !enableMoreButtons;
  },

  /**
   * Reset the buttons states to their original.
   */
  reset: function() {
    const moreButtonCopyLoginItemId = 'js_wk_menu_copy_login_action';
    const moreButtonCopySecretItemId = 'js_wk_menu_copy_secret_action';
    const moreButtonCopyPermalinkItemId = 'js_wk_menu_copy_permalink_action';
    this.secretCopyButton.state.disabled = true;
    this.editButton.state.disabled = true;
    this.shareButton.state.disabled = true;
    this.moreButton.state.disabled = true;
    // Enable the export button if it can be.
    if (Config.read('server.cipherguard.plugins.export')) {
      this.exportButton.state.disabled = true;
    }
    this.moreButton.enableItem(moreButtonCopyLoginItemId);
    this.moreButton.enableItem(moreButtonCopySecretItemId);
    this.moreButton.enableItem(moreButtonCopyPermalinkItemId);
  }

});

export default PasswordWorkspaceMenuComponent;
