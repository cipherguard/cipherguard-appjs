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
import AuthService from '../../model/service/plugin/auth';
import ButtonDropdown from 'cipherguard-mad/component/button_dropdown';
import Config from 'cipherguard-mad/config/config';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import route from 'can-route';
import uuid from 'uuid/v4';

import template from '../../view/template/component/profile/header_dropdown.stache';

const HeaderProfileDropdownComponent = ButtonDropdown.extend('cipherguard.component.ProfileDropdown', /** @static */ {

  defaults: {
    label: null,
    cssClasses: [],
    template: template,
    contentElement: '#js_app_profile_dropdown .dropdown-content',
    user: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    this._super();
    this._initMenu();
  },

  /**
   * Init the menu
   */
  _initMenu: function() {
    const menu = this.options.menu;

    // profile
    const profileItem = new Action({
      id: uuid(),
      label: __('Profile'),
      action: () => this._goToUserProfile()
    });
    menu.insertItem(profileItem);

    // theme
    const plugins = Config.read('server.cipherguard.plugins');
    if (plugins && plugins.accountSettings) {
      const keysItem = new Action({
        id: uuid(),
        label: __('Theme'),
        action: () => this._goToTheme()
      });
      menu.insertItem(keysItem);
    }

    // Logout
    const logoutItem = new Action({
      id: uuid(),
      label: __('Logout'),
      action: () => this._logout()
    });
    menu.insertItem(logoutItem);
  },

  /**
   * Go to the user profile
   */
  _goToUserProfile: function() {
    const controller = 'Settings';
    const action = 'profile';
    route.data.update({controller: controller, action: action});
    this.view.close();
  },

  /**
   * Go to the manage your keys screen
   */
  _goToTheme: function() {
    const controller = 'Settings';
    const action = 'theme';
    route.data.update({controller: controller, action: action});
    this.view.close();
  },

  /**
   * Logout the user
   */
  _logout: async function() {
    try {
      await AuthService.logout();
      location.href = APP_URL;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * @inheritdoc
   */
  beforeRender: function() {
    this._super();
    this.setViewData('user', this.options.user);
  },

  /* ************************************************************** */
  /* LISTEN TO THE MODEL EVENTS */
  /* ************************************************************** */

  /**
   * Observe when the user is updated
   */
  '{user} updated': function() {
    this.refresh();
  }

});

export default HeaderProfileDropdownComponent;
