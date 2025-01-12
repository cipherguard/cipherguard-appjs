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
import User from './user';

const ActionLog = DefineMap.extend('cipherguard.model.ActionLog', {
  id: 'string',
  type: 'string',
  data: 'any',
  creator: User,
  created: 'string'
});
DefineMap.setReference('ActionLog', ActionLog);
ActionLog.List = DefineList.extend({'#': {Type: ActionLog}});

ActionLog.connection = connect([connectParse, connectDataUrl, connectConstructor, connectMap], {
  Map: ActionLog,
  List: ActionLog.List,
  url: {
    resource: '/',
    getListData: function(params) {
      params['api-version'] = 'v2';
      return Ajax.request({
        url: 'actionlog/resource/{foreignKey}.json',
        type: 'GET',
        params: params
      });
    }
  }
});

export default ActionLog;
