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
 * @since         2.6.0
 */
import $ from 'jquery';
import Action from 'cipherguard-mad/model/map/action';
import Component from 'cipherguard-mad/component/component';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MenuComponent from 'cipherguard-mad/component/menu';
import route from 'can-route';
import User from '../../model/map/user';
import uuid from 'uuid/v4';

import template from '../../view/template/component/breadcrumb/breadcrumb.stache';
import itemTemplate from '../../view/template/component/breadcrumb/breadcrumb_item.stache';

const WorkspaceBreadcrumbComponent = Component.extend('cipherguard.component.settings.WorkspaceBreadcrumb', /** @static */ {

  defaults: {
    template: template,
    status: 'hidden',
    filter: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  init: function(el, options) {
    this._super(el, options);
    this._initRouteListener();
  },

  /**
   * Initialize the route listener
   * @private
   */
  _initRouteListener: function() {
    // We have to proceed like following to execute the dispatch route in the scope of the instance, and be able to remove the listener when the component is destroyed.
    const executeFunc = () => this._dispatchRoute();
    route.data.on('action', executeFunc);
    this.state.on('destroyed', () => route.data.off('action', executeFunc));
  },

  /**
   * Dispatch route
   * @private
   */
  _dispatchRoute: function() {
    if (route.data.controller == 'Settings') {
      const section = route.data.action;
      this.refreshMenuItems(section);
    }
  },

  /**
   * @inheritdoc
   */
  afterStart: function() {
    // Create and render menu in the created container.
    const menuSelector = `#${this.getId()} ul`;
    this.options.menu = new MenuComponent(
      menuSelector, {
        itemTemplate: itemTemplate
      }
    );
    this.options.menu.start();

    /*
     * Store menu items in an array.
     * This contains the static part of the menu.
     */
    this.menuItems = [];
    // Contains the specific section menu items.
    this.sectionMenuItems = [];

    // All users item
    const allUsersItem = new Action({
      id: uuid(),
      label: __('All users'),
      action: () => route.data.update({controller: 'User', action: 'index'})
    });
    this.menuItems.push(allUsersItem);

    // Profile item
    const profileItem = new Action({
      id: uuid(),
      label: User.getCurrent().profile.fullName(),
      action: () => route.data.update({controller: 'Settings', action: 'profile'})
    });
    this.menuItems.push(profileItem);

    /*
     * Specific menu items, per section.
     * profile section.
     */
    this.sectionMenuItems['profile'] = [
      new Action({
        id: uuid(),
        label: __('Profile'),
        action: function() {
          return;
        }
      })
    ];
    // keys section.
    this.sectionMenuItems['keys'] = [
      new Action({
        id: uuid(),
        label: __('Keys inspector'),
        action: function() {
          return;
        }
      })
    ];
    // theme section.
    this.sectionMenuItems['theme'] = [
      new Action({
        id: uuid(),
        label: __('Theme'),
        action: function() {
          return;
        }
      })
    ];
    // MFA section.
    this.sectionMenuItems['mfa'] = [
      new Action({
        id: uuid(),
        label: __('Multi factor authentication'),
        action: function() {
          return;
        }
      })
    ];

    this._dispatchRoute();
  },

  /**
   * Load the current filter
   */
  load: function() {
    /*
     * To use if we need to load something.
     * Do not remove, it breaks the code.
     */
  },

  /**
   * Destroy the workspace.
   */
  destroy: function() {
    // Be sure that the primary workspace menu controller will be destroyed also.
    $(`#${this.getId()} ul`).empty();
    this._super();
  },

  /**
   * Refresh the menu items as per the section.
   * @param section
   */
  refreshMenuItems: function(section) {
    /*
     * The items of the menu are a combination of static items and section dynamic items.
     * If the section is recognised, we just assemble the 2 arrays. Otherwise, we just keep the static part.
     */
    const menuItems = (this.sectionMenuItems[section] !== undefined) ?
      $.merge($.merge([], this.menuItems), this.sectionMenuItems[section]) : this.menuItems;
    // Reset the menu.
    this.options.menu.reset();
    // Load the items.
    this.options.menu.load(menuItems);
  },

  /* ************************************************************** */
  /* LISTEN TO THE APP EVENTS */
  /* ************************************************************** */

  /**
   * Listen to request_settings_section event.
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} request_settings_section': function(el, ev) {
    const section = ev.data.section;
    this.refreshMenuItems(section);
  }

});

export default WorkspaceBreadcrumbComponent;
