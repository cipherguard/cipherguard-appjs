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
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import User from './user';

const Comment = DefineMap.extend('cipherguard.model.Comment', {
  id: 'string',
  parent_id: 'string',
  foreign_model: 'string',
  foreign_key: 'string',
  content: 'string',
  created: 'string',
  modified: 'string',
  creator: User,
  modifier: User
});
DefineMap.setReference('Comment', Comment);
Comment.List = DefineList.extend({'#': {Type: Comment}});

/*
 * Default validation rules.
 * Keep these rules in sync with the cipherguard API.
 * @see https://github.com/cipherguard/cipherguard_api/src/Model/Table/CommentsTable.php
 */
Comment.validationRules = {
  id: [
    {rule: 'uuid'}
  ],
  content: [
    {rule: 'required', message: __('A comment is required.')},
    {rule: ['lengthBetween', 1, 255], message: __('The comment should be between %s and %s characters.', 1, 255)},
    {rule: 'utf8Extended', message: __('The comment should be a valid utf8 string.')}
  ]
};

Comment.connection = connect([connectParse, connectDataUrl, connectConstructor, connectMap], {
  Map: Comment,
  List: Comment.List,
  url: {
    resource: '/',
    createData: function(params) {
      return Ajax.request({
        url: 'comments/resource/{foreign_key}.json?api-version=v2',
        type: 'POST',
        params: params
      });
    },
    getListData: function(params) {
      params = params || {};
      params['api-version'] = 'v2';
      return Ajax.request({
        url: 'comments/resource/{foreignKey}.json',
        type: 'GET',
        params: params
      });
    },
    destroyData: function(params) {
      return Ajax.request({
        url: `comments/${params.id}.json?api-version=v2`,
        type: 'DELETE'
      });
    }
  }
});

export default Comment;
