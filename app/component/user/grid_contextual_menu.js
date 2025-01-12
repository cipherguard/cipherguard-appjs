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
import MadBus from 'cipherguard-mad/control/bus';
import User from '../../model/map/user';
import Config from "cipherguard-mad/config/config";

const GridContextualMenuComponent = ContextualMenuComponent.extend('cipherguard.component.user.GridContextualMenu', /** @static */ {

  defaults: {
    user: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    const user = this.options.user;

    // Is the user an admin.
    const isAdmin = User.getCurrent().isAdmin();

    const isActiveUser = user.active;

    // Is the selected user same as the current user.
    const isSelf = User.getCurrent().id == user.id;

    // Copy public key
    const copyPublicKeyItem = new Action({
      id: 'js_user_browser_menu_copy_key',
      label: 'Copy public key',
      action: () => this._copyPublicKey()
    });
    this.insertItem(copyPublicKeyItem);

    // Copy email
    const copyEmailItem = new Action({
      id: 'js_user_browser_menu_copy_email',
      label: 'Copy email address',
      cssClasses: (isAdmin ? ['separator-after'] : []),
      action: () => this._copyEmail()
    });
    this.insertItem(copyEmailItem);

    /*
     * Edit
     * Only admin can edit
     */
    if (isAdmin) {
      const editItem = new Action({
        id: 'js_user_browser_menu_edit',
        label: 'Edit',
        action: () => this._edit()
      });
      this.insertItem(editItem);
    }

    /*
     * Resend invitation
     * Only admin can send
     */
    if (isAdmin) {
      const resendInviteItem = new Action({
        id: 'js_user_browser_menu_resend_invite',
        label: 'Resend invite',
        enabled: !isActiveUser,
        action: () => this._resendInvite()
      });
      this.insertItem(resendInviteItem);
    }

    /*
     * Remove mfa user settings
     * Only admin can send
     */
    if (isAdmin && this.isMfaPluginEnabled()) {
      const removeMfaSettings = new Action({
        id: 'js_user_browser_menu_remove_mfa_settings',
        label: 'Disable MFA',
        enabled: user.is_mfa_enabled,
        action: () => this._removeMfaSettings()
      });

      this.insertItem(removeMfaSettings);
    }

    /*
     * Delete
     * Only admin can delete, but admin cannot delete its own account
     */
    if (isAdmin && !isSelf) {
      const deleteItem = new Action({
        id: 'js_user_browser_menu_delete',
        label: 'Delete',
        action: () => this._delete()
      });
      this.insertItem(deleteItem);
    }

    this._super();
  },

  /**
   * Check if MFA plugin is enabled
   * @returns {boolean|*|mixed}
   */
  isMfaPluginEnabled: function() {
    const plugins = Config.read('server.cipherguard.plugins');

    return plugins && plugins.multiFactorAuthentication;
  },

  /**
   * Copy public key to clipboard
   */
  _copyPublicKey: function() {
    const gpgkey = this.options.user.gpgkey;
    Clipboard.copy(gpgkey.armored_key, 'public key');
    this.remove();
  },

  /**
   * Copy email to clipboard
   */
  _copyEmail: function() {
    const user = this.options.user;
    Clipboard.copy(user.username, 'email');
    this.remove();
  },

  /**
   * Edit the user
   */
  _edit: function() {
    const user = this.options.user;
    MadBus.trigger('request_user_edition', {user: user});
    this.remove();
  },

  /**
   * Delete the user
   */
  _delete: function() {
    const user = this.options.user;
    MadBus.trigger('request_user_deletion', {user: user});
    this.remove();
  },

  /**
   * Resend invitation the user that didn't complete the setup
   */
  _resendInvite: function() {
    const user = this.options.user;
    MadBus.trigger('request_resend_invitation', {user: user});
    this.remove();
  },


  _removeMfaSettings: function() {
    const user = this.options.user;
    MadBus.trigger('request_remove_mfa_settings', {user: user});
    this.remove();
  },
});

export default GridContextualMenuComponent;
