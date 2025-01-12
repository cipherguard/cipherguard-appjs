/**
 * Cipherguard ~ Open source password manager for teams
 * Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cipherguard SA (https://www.cipherguard.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.cipherguard.com Cipherguard(tm)
 * @since         2.6.0
 */
import $ from 'jquery';
import Action from 'cipherguard-mad/model/map/action';
import Component from 'cipherguard-mad/component/component';
import Config from 'cipherguard-mad/config/config';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import UsersDirectorySettings from '../administration/users_directory/users_directory_settings';
import MenuComponent from 'cipherguard-mad/component/menu';
import MfaSettings from '../administration/mfa/mfa_settings';
import EmailNotificationSettingsComponent from '../administration/email_notification/email_notification_settings';
import route from 'can-route';
import template from '../../view/template/component/administration/workspace.stache';
import uuid from 'uuid/v4';

const AdministrationWorkspace = Component.extend('cipherguard.component.administration.Workspace', /** @static */ {

  defaults: {
    name: 'administration_workspace',
    template: template,
    sections: [
      'profile',
      'keys'
    ],
    // Override the silentLoading parameter.
    silentLoading: false
  }
}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  init: function(el, options) {
    this._super(el, options);
  },

  /**
   * @inheritdoc
   */
  afterStart: function() {
    $('#js_wsp_primary_menu_wrapper').empty();
    $('#js_wsp_administration_breadcrumb').empty();
    this._initPrimarySidebar();
    this._initMfaSection();
    this._initUsersDirectorySection();
    this._initEmailNotificationSection();
  },

  /**
   * Init the primary sidebar.
   */
  _initPrimarySidebar: function() {
    const plugins = Config.read('server.cipherguard.plugins');
    const menu = new MenuComponent('#js_wk_administration_menu', {});
    menu.start();

    if (plugins.multiFactorAuthentication) {
      const mfaSettings = new Action({
        id: uuid(),
        name: 'mfa',
        label: __('Multi Factor Authentication'),
        action: () => this._goToSection('mfa')
      });
      menu.insertItem(mfaSettings);
      if (/mfa/.test(route.data.action)) {
        menu.selectItem(mfaSettings);
      }
    }

    if (plugins.directorySync) {
      const usersDirectorySettingsItem = new Action({
        id: uuid(),
        name: 'usersDirectory',
        label: __('Users Directory'),
        action: () => this._goToSection('usersDirectory')
      });
      menu.insertItem(usersDirectorySettingsItem);
      if (/usersDirectory/.test(route.data.action)) {
        menu.selectItem(usersDirectorySettingsItem);
      }
    }

    if (plugins.emailNotificationSettings) {
      const emailNotificationSettingsItem = new Action({
        id: 'js_app_nav_left_email_notification_link',
        name: 'emailNotification',
        label: __('Email Notifications'),
        action: () => this._goToSection('emailNotification')
      });
      menu.insertItem(emailNotificationSettingsItem);
      if (/emailNotification/.test(route.data.action)) {
        menu.selectItem(emailNotificationSettingsItem);
      }
    }
  },

  /**
   * Init the mfa section
   * @private
   */
  _initMfaSection: function() {
    if (route.data.action != 'mfa') { return; }
    const section = new MfaSettings('#js_wk_administration_main');
    section.start();
  },

  /**
   * Init the users directory section.
   * @private
   */
  _initUsersDirectorySection: function() {
    if (route.data.action != 'usersDirectory') { return; }
    const section = new UsersDirectorySettings('#js_wk_administration_main');
    section.start();
  },

  /**
   * Init the email notification section.
   * @private
   */
  _initEmailNotificationSection: function() {
    if (route.data.action != 'emailNotification') { return; }
    const section = new EmailNotificationSettingsComponent('#js_wk_administration_main');
    section.start();
  },

  /**
   * /**
   * Go to a section
   * @private
   */
  _goToSection: function(section) {
    route.data.update({controller: 'Administration', action: section});
    this.refresh();
  }

});
export default AdministrationWorkspace;
