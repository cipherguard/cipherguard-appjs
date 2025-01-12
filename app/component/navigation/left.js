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
import Config from 'cipherguard-mad/config/config';
import DomData from 'can-dom-data';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MenuComponent from 'cipherguard-mad/component/menu';
import route from 'can-route';
import String from 'can-string';
import User from '../../model/map/user';

const NavigationLeft = MenuComponent.extend('cipherguard.component.AppNavigationLeft', /** @static */ {

  defaults: {
    selected: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  init: function(el, options) {
    this._initRouteListener();
    return this._super(el, options);
  },

  /**
   * Initialize the route listener
   * @private
   */
  _initRouteListener: function() {
    route.data.on('controller', () => {
      this._dispatchRoute();
    });
  },

  /**
   * @inheritdoc
   */
  afterStart: function() {
    this._initMenu();
    this._dispatchRoute();
    this._super();
  },

  /**
   * Init the menu.
   * @private
   */
  _initMenu: function() {
    // passwords
    const passwordsItem = new Action({
      id: 'js_app_nav_left_password_wsp_link',
      label: __('passwords'),
      cssClasses: ['password'],
      action: () => this._goToPasswordWorkspace()
    });
    this.insertItem(passwordsItem);

    // users
    const usersItem =  new Action({
      id:  'js_app_nav_left_user_wsp_link',
      label: __('users'),
      cssClasses: ['user'],
      action: () => this._goToUserWorkspace()
    });
    this.insertItem(usersItem);

    // Administration
    if (User.getCurrent().isAdmin()) {
      const plugins = Config.read('server.cipherguard.plugins');
      if (plugins.directorySync || plugins.multiFactorAuthentication || plugins.emailNotificationSettings) {
        const helpItem = new Action({
          id: 'js_app_nav_left_administration_link',
          label: __('administration'),
          cssClasses: ['administration'],
          action: () => this._goToAdministrationWorkspace()
        });
        this.insertItem(helpItem);
      }
    }

    // help
    const helpItem = new Action({
      id: 'js_app_nav_left_help_link',
      label: __('help'),
      cssClasses: ['help'],
      action: () => this._goHelp()
    });
    this.insertItem(helpItem);
  },

  /**
   * Go to the password workspace.
   * @private
   */
  _goToPasswordWorkspace: function() {
    const controller = 'Password';
    const action = 'index';
    route.data.update({controller: controller, action: action});
  },

  /**
   * Go to the user workspace
   */
  _goToUserWorkspace: function() {
    const controller = 'User';
    const action = 'index';
    route.data.update({controller: controller, action: action});
  },

  /**
   * Go to the administration workspace
   */
  _goToAdministrationWorkspace: function() {
    const controller = 'Administration';
    let action;
    const plugins = Config.read('server.cipherguard.plugins');
    if (plugins.multiFactorAuthentication) {
      action = "mfa";
    } else {
      action = "emailNotification";
    }

    route.data.update({controller: controller, action: action});
  },

  /**
   * Dispatch route
   * @private
   */
  _dispatchRoute: function() {
    const controller = route.data.controller;
    let workspace = String.underscore(controller);
    if (workspace == 'settings') {
      workspace = 'user';
    }
    if (this.options.selected != workspace) {
      const li = $(`li.${workspace}`);
      const itemClass = this.getItemClass();

      if (itemClass) {
        const data = DomData.get(li[0], itemClass.shortName);
        if (typeof data != 'undefined') {
          this.selectItem(data);
        }
      }
    }
  },

  /**
   * Go to the cipherguard help
   * @private
   */
  _goHelp: function() {
    const helpWindow = window.open();
    helpWindow.opener = null;
    helpWindow.location = 'https://help.cipherguard.com';
  }

});

export default NavigationLeft;
