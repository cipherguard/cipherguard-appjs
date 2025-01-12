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
import Action from 'cipherguard-mad/model/map/action';
import Clipboard from '../../util/clipboard';
import ContextualMenuComponent from 'cipherguard-mad/component/contextual_menu';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadBus from 'cipherguard-mad/control/bus';
import PermissionType from '../../model/map/permission_type';
import ResourceService from '../../model/service/plugin/resource';

const GridContextualMenuComponent = ContextualMenuComponent.extend('cipherguard.component.password.GridContextualMenu', /** @static */ {

  defaults: {
    resource: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    const items = [];
    const resource = this.options.resource;
    const canUpdate = resource.permission.isAllowedTo(PermissionType.UPDATE);
    const canAdmin = resource.permission.isAllowedTo(PermissionType.ADMIN);
    const isSafeUrl = resource.safeUrl() != '';

    // Add Copy username action.
    const copyUsernameItem = new Action({
      id: 'js_password_browser_menu_copy_username',
      label: __('Copy username'),
      enabled: resource.username != null,
      action: () => this._copyLogin()
    });
    items.push(copyUsernameItem);

    // Add Copy password action.
    const copyPasswordItem = new Action({
      id: 'js_password_browser_menu_copy_password',
      label: __('Copy password'),
      action: () => this._copySecret()
    });
    items.push(copyPasswordItem);

    // Add Copy URI action.
    const copyUriItem = new Action({
      id: 'js_password_browser_menu_copy_uri',
      label: __('Copy URI'),
      enabled: resource.uri != null,
      action: () => this._copyUri()
    });
    items.push(copyUriItem);

    // Add Copy permalink action.
    const copyPermalinkItem = new Action({
      id: 'js_password_browser_menu_copy_permalink',
      label: __('Copy permalink'),
      action: () => this._copyPermalink()
    });
    items.push(copyPermalinkItem);

    // Add Open URI in a new tab action.
    const openUriItem = new Action({
      id: 'js_password_browser_menu_open_uri',
      label: __('Open URI in a new tab'),
      enabled: resource.uri != null && isSafeUrl,
      cssClasses: ['separator-after'],
      action: () => this._openUri()
    });
    items.push(openUriItem);

    // Add Edit action.
    const editItem = new Action({
      id: 'js_password_browser_menu_edit',
      label: __('Edit'),
      enabled: canUpdate,
      action: () => this._edit()
    });
    items.push(editItem);

    // Add Share action.
    const shareItem = new Action({
      id: 'js_password_browser_menu_share',
      label: __('Share'),
      enabled: canAdmin,
      action: () => this._share()
    });
    items.push(shareItem);

    // Add Delete action.
    const deleteItem = new Action({
      id: 'js_password_browser_menu_delete',
      label: __('Delete'),
      enabled: canUpdate,
      action: () => this._delete()
    });
    items.push(deleteItem);

    this.load(items);
    this._super();
  },

  /**
   * Copy login to clipboard
   */
  _copyLogin: function() {
    Clipboard.copy(this.options.resource.username, 'username');
    this.remove();
  },

  /**
   * Copy secret to clipboard
   */
  _copySecret: function() {
    const resourceId = this.options.resource.id;
    ResourceService.decryptSecretAndCopyToClipboard(resourceId);
    this.remove();
  },

  /**
   * Copy uri to clipboard
   */
  _copyUri: function() {
    Clipboard.copy(this.options.resource.uri, 'URL');
    this.remove();
  },

  /**
   * Copy permalink to clipboard
   */
  _copyPermalink: function() {
    Clipboard.copy(this.options.resource.getPermalink(), 'permalink');
    this.remove();
  },

  /**
   * Open uri in a new tab
   */
  _openUri: function() {
    const uri = this.options.resource.safeUrl();
    window.open(uri, '_blank', 'noopener,noreferrer');
    this.remove();
  },

  /**
   * Edit the resource
   */
  _edit: function() {
    const resource = this.options.resource;
    MadBus.trigger('request_resource_edit', {resource: resource});
    this.remove();
  },

  /**
   * Share the resource
   */
  _share: function() {
    const resource = this.options.resource;
    MadBus.trigger('request_resource_share', {resource: resource});
    this.remove();
  },

  /**
   * Delete the resource
   */
  _delete: function() {
    const resource = this.options.resource;
    MadBus.trigger('request_resource_delete', {resource: resource});
    this.remove();
  }

});

export default GridContextualMenuComponent;
