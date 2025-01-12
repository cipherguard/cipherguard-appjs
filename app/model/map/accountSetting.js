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
import Config from 'cipherguard-mad/config/config';
import connect from 'can-connect';
import connectDataUrl from 'can-connect/data/url/url';
import connectParse from 'can-connect/data/parse/parse';
import connectConstructor from 'can-connect/constructor/constructor';
import connectMap from 'can-connect/can/map/map';
import DefineList from 'cipherguard-mad/model/list/list';
import DefineMap from 'cipherguard-mad/model/map/map';

const AccountSetting = DefineMap.extend('cipherguard.model.AccountSetting', {
  id: 'string',
  user_id: 'string',
  property_id: 'string',
  property: 'string',
  value: 'string'
});
DefineMap.setReference('AccountSetting', AccountSetting);
AccountSetting.List = DefineList.extend({'#': {Type: AccountSetting}});

/**
 * Store the account settings in the config.
 * @param accountSettings
 */
AccountSetting.saveInConfig = function(accountSettings) {
  accountSettings.forEach(accountSetting => {
    Config.write(`accountSetting.${accountSetting.property}`, accountSetting.value);
  });
};

AccountSetting.connection = connect([connectParse, connectDataUrl, connectConstructor, connectMap], {
  Map: AccountSetting,
  List: AccountSetting.List,
  url: {
    resource: '/',
    getListData: function(params) {
      params = params || {};
      params['api-version'] = 'v2';
      return Ajax.request({
        url: '/account/settings.json',
        type: 'GET',
        params: params
      });
    }
  }
});

export default AccountSetting;
