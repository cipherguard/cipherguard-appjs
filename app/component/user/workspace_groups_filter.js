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
import Component from 'cipherguard-mad/component/component';
import Group from '../../model/map/group';
import PeopleGroupsListComponent from '../group/people_groups_list';

import template from '../../view/template/component/user/workspace_groups_filter.ejs!';

const WorkspaceGroupsFilterComponent = Component.extend('cipherguard.component.user.workspace_groups_filter', /** @static */ {

  defaults: {
    template: template,
    selectedGroups: new Group.List()
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    const peopleGroupsList = new PeopleGroupsListComponent('#js_wsp_users_groups_list', {
      selectedGroups: this.options.selectedGroups
    });
    peopleGroupsList.start();
  }

});

export default WorkspaceGroupsFilterComponent;
