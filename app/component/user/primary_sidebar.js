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
import GroupsFilterSidebarSectionComponent from '../user/groups_filter_sidebar_section';
import PrimarySidebarAbstractComponent from '../workspace/primary_sidebar';
import ShortcutsFilterSidebarSectionComponent from '../user/shortcuts_filter_sidebar_section';

import template from '../../view/template/component/user/primary_sidebar.stache';

const PrimarySidebarComponent = PrimarySidebarAbstractComponent.extend('cipherguard.component.user.PrimarySidebar', /** @static */ {

  defaults: {
    label: 'User Workspace Primary Sidebar',
    template: template,
    defaultFilter: null,
    selectedGroups: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    this._initShortcutsFilterSection();
    this._initGroupsFilterSection();
    this._super();
  },

  /**
   * Initialize the shortcuts filter section
   */
  _initShortcutsFilterSection: function() {
    const component = new ShortcutsFilterSidebarSectionComponent('#js_wsp_users_filter_shortcuts', {
      allFilter: this.options.defaultFilter
    });
    component.start();
  },

  /**
   * Initialize the groups filter section
   */
  _initGroupsFilterSection: function() {
    const component = new GroupsFilterSidebarSectionComponent('#js_wsp_users_groups', {
      selectedGroups: this.options.selectedGroups
    });
    component.start();
  }

});

export default PrimarySidebarComponent;
