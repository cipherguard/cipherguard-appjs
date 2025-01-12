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
import Filter from '../../model/filter';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadBus from 'cipherguard-mad/control/bus';
import MenuComponent from 'cipherguard-mad/component/menu';
import PrimarySidebarSectionComponent from '../workspace/primary_sidebar_section';

import template from '../../view/template/component/password/shortcuts_filter_sidebar_section.stache';

const ShortcutsFilterSidebarSectionComponent = PrimarySidebarSectionComponent.extend('cipherguard.component.password.ShortcutsFilterSidebarSection', /** @static */ {

  defaults: {
    allFilter: null,
    template: template
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    this.options.menu = this._initShortcutsList();
    this._super();
  },

  /**
   * Init the shortcuts list.
   */
  _initShortcutsList: function() {
    const menu = new MenuComponent('#js_wsp_password_shortcuts_filter_list');
    menu.start();

    // All
    const allItem = new Action({
      id: 'js_pwd_wsp_filter_all',
      label: __('All items'),
      filter: this.options.allFilter
    });
    menu.insertItem(allItem);
    menu.selectItem(allItem);

    // Favorite
    const favoriteItem = new Action({
      id: 'js_pwd_wsp_filter_favorite',
      label: __('Favorite'),
      filter: new Filter({
        id: 'workspace_filter_favorite',
        type: 'favorite',
        label: __('Favorite'),
        rules: {
          'is-favorite': true
        },
        order: ['Resource.modified DESC']
      })
    });
    menu.insertItem(favoriteItem);

    // Modified
    const modifiedItem = new Action({
      id: 'js_pwd_wsp_filter_modified',
      label: __('Recently modified'),
      filter: new Filter({
        id: 'workspace_filter_modified',
        type: 'modified',
        label: __('Recently modified'),
        order: ['Resource.modified DESC']
      })
    });
    menu.insertItem(modifiedItem);

    // Shared with me
    const sharedItem = new Action({
      id: 'js_pwd_wsp_filter_share',
      label: __('Shared with me'),
      filter: new Filter({
        id: 'workspace_filter_shared',
        type: 'shared_with_me',
        label: __('Shared with me'),
        rules: {
          'is-shared-with-me': true
        },
        order: ['Resource.modified DESC']
      })
    });
    menu.insertItem(sharedItem);

    // I own
    const ownItem = new Action({
      id: 'js_pwd_wsp_filter_own',
      label: __('Items I own'),
      filter: new Filter({
        id: 'workspace_filter_own',
        type: 'owner',
        label: __('Items I own'),
        rules: {
          'is-owned-by-me': true
        },
        order: ['Resource.modified DESC']
      })
    });
    menu.insertItem(ownItem);

    return menu;
  },

  /**
   * An item has been selected
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{element} item_selected': function(el, ev) {
    const item = ev.data.item;
    MadBus.trigger('filter_workspace', {filter: item.filter});
  },

  /**
   * Listen to the workspace is filtered
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   */
  '{mad.bus.element} filter_workspace': function(el, ev) {
    const filter = ev.data.filter;
    const menu = this.options.menu;
    menu.unselectAll();

    // If the filter is relative to a filter registered in this component, select it.
    menu.options.items.forEach(item => {
      if (item.filter.id == filter.id) {
        menu.selectItem(item);
      } else if (filter.id == 'search' && item.filter.id == 'default') {
        menu.selectItem(item);
      }
    });
  }
});

export default ShortcutsFilterSidebarSectionComponent;
