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
import Ajax from '../../net/ajax';
import connect from 'can-connect';
import connectDataUrl from 'can-connect/data/url/url';
import connectParse from 'can-connect/data/parse/parse';
import connectConstructor from 'can-connect/constructor/constructor';
import connectMap from 'can-connect/can/map/map';
import DefineList from 'cipherguard-mad/model/list/list';
import DefineMap from 'cipherguard-mad/model/map/map';

const Role = DefineMap.extend('cipherguard.model.Role', {
  id: 'string',
  name: 'string'
});
DefineMap.setReference('Role', Role);
Role.List = DefineList.extend({'#': {Type: Role}});

/**
 * Get the stored roles.
 * @returns {DefineList<Role>}
 */
Role.getCache = function() {
  return this.cache;
};

/**
 * Put the roles in cache
 * @param {DefineList<Role>} roles
 */
Role.setCache = function(roles) {
  this.cache = roles;
};

/**
 * Get role id from name.
 * @param {string} roleName
 */
Role.toId = function(roleName) {
  return this.cache.reduce((carry, item) => {
    if (roleName == item.name) {
      carry = item.id;
    }
    return carry;
  }, '');
};

Role.connection = connect([connectParse, connectDataUrl, connectConstructor, connectMap], {
  Map: Role,
  List: Role.List,
  url: {
    resource: '/',
    getListData: function(params) {
      params = params || {};
      params['api-version'] = 'v2';
      return Ajax.request({
        url: 'roles.json',
        type: 'GET',
        params: params
      });
    }
  }
});

export default Role;
