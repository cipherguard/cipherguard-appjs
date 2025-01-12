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
import DefineList from 'cipherguard-mad/model/list/list';
import DefineMap from 'cipherguard-mad/model/map/map';
import Group from './group';
import User from './user';

const GroupUser = DefineMap.extend('cipherguard.model.GroupUser', {
  id: 'string',
  group_id: 'string',
  user_id: 'string',
  is_admin: 'boolean',
  user: User,
  group: Group
});
DefineMap.setReference('GroupUser', GroupUser);
GroupUser.List = DefineList.extend({'#': {Type: GroupUser}});

/**
 * Sort the groups users alphabetically.
 */
GroupUser.List.prototype.sortAlphabetically = function() {
  this.sort((a, b) => {
    const aValue = a.user ? a.user.profile.first_name : a.group.name;
    const bValue = b.user ? b.user.profile.first_name : b.group.name;
    if (aValue < bValue) {
      return -1;
    } else if (aValue > bValue) {
      return 1;
    }
    return 0;
  });
};

export default GroupUser;
