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
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import Profile from './profile';
import Role from './role';
import uuid from 'uuid/v4';

const User = DefineMap.extend('cipherguard.model.User', {
  id: 'string',
  username: 'string',
  email: 'string',
  active: 'boolean',
  last_logged_in: 'string',
  profile: Profile,
  role: Role,
  is_mfa_enabled: 'boolean',

  /**
   * Is the user an admin.
   * @return boolean
   */
  isAdmin: function() {
    return this.role && this.role.name == 'admin';
  },

  /**
   * Attempt a dry run of delete.
   * @returns {Promise}
   */
  deleteDryRun: function() {
    return Ajax.request({
      url: `users/${this.id}/dry-run.json?api-version=v2`,
      type: 'DELETE',
      silentNotify: true
    });
  }
});
DefineMap.setReference('User', User);
User.List = DefineList.extend({'#': {Type: User}});

User.validationRules = {
  id: [
    {rule: 'uuid'}
  ],
  username: [
    {rule: 'required', message:  __('A username is required.')},
    {rule: 'notEmpty', message:  __('A username is required.')},
    {rule: ['lengthBetween', 0, 255], message: __('The username length should be maximum 254 characters.')},
    {rule: ['email'], message: __('The username should be a valid email address.')}
  ]
};

/**
 * @inherited-doc
 */
User.getFilteredFields = function(filteredCase) {
  let filteredFields = false;

  switch (filteredCase) {
    case 'edit_profile':
      filteredFields = [
        'id',
        'profile.first_name',
        'profile.last_name'
      ];
      break;
  }

  return filteredFields;
};

/**
 * The current logged-in user
 * @type {User}
 */
User.current = null;

/**
 * Delete a user.
 * Use this function instead of the standard destroy function. The destroy function of the can layer does not get
 * extra parameters, however a http DELETE request can get a body we use to pass the transfer data.
 * @param {object} transfer The transfer of rights to apply before deleting the user.
 * @returns {Promise}
 * @inherits
 */
User.prototype.delete = function(transfer) {
  const request = {
    _xhr: null,
    id: uuid(),
    url: `users/${this.id}.json?api-version=v2`,
    method: 'DELETE',
    headers: {'X-CSRF-Token': Config.read('app.csrfToken')},
    beforeSend: xhr => { request._xhr = xhr; },
    data: {transfer: transfer}
  };

  Ajax._registerRequest(request);
  return $.ajax(request)
    .then(data => Ajax.handleSuccess(request, data))
    .then(() => {
      // Destroy the local entity.
      this.destroy();
    })
    .then(null, jqXHR => {
      let jsonData = {};
      if (jqXHR.responseText) {
        try {
          jsonData = $.parseJSON(jqXHR.responseText);
        } catch (e) { }
      }
      return Ajax.handleError(request, jsonData);
    });
};

/**
 * Get the logged-in user.
 * @return {User}
 */
User.getCurrent = function() {
  return User.current;
};

/**
 * Set the logged-in user.
 * @param user {User} The logged-in user
 */
User.setCurrent = function(user) {
  User.current = user;
};

/**
 * Update the user avatar
 * @param params {array} The file to save
 */
User.prototype.saveAvatar = function(file) {
  const request = {
    _xhr: null,
    id: uuid(),
    url: `users/${this.id}.json?api-version=v2`,
    method: 'POST',
    cache: false,
    contentType: false,
    processData: false,
    headers: {'X-CSRF-Token': Config.read('app.csrfToken')},
    beforeSend: xhr => { request._xhr = xhr; }
  };
  request.params = new FormData();
  request.params.id = this.id;
  request.params.append('id', this.id);
  request.params.append('profile[avatar][file]', file);
  request.data = request.params;

  // @todo Cannot use Ajax.request, the can ajax layer cannot use the multipart/form-data content type.
  Ajax._registerRequest(request);
  return $.ajax(request)
    .then(data => Ajax.handleSuccess(request, data)
      .then(data => {
        this.profile.assign({avatar: data.profile.avatar});
        this.dispatch('updated');
        Ajax._unregisterRequest(request);
        return Promise.resolve(this);
      }), jqXHR => {
      let jsonData = {};
      if (jqXHR.responseText) {
        try {
          jsonData = $.parseJSON(jqXHR.responseText);
        } catch (e) { }
      }
      return Ajax.handleError(request, jsonData);
    });
};

User.connection = connect([connectParse, connectDataUrl, connectConstructor, connectMap], {
  Map: User,
  List: User.List,
  url: {
    resource: '/',
    createData: function(params) {
      return Ajax.request({
        url: 'users.json?api-version=v2',
        type: 'POST',
        params: params
      });
    },
    updateData: function(params) {
      // Filter the attributes that need to be send by the request.
      const _params = User.filterAttributes(params);
      return Ajax.request({
        url: 'users/{id}.json?api-version=v2',
        type: 'PUT',
        params: _params
      });
    },
    getData: function(params) {
      params = params || {};
      params['api-version'] = 'v2';
      return Ajax.request({
        url: 'users/{id}.json',
        type: 'GET',
        params: params
      });
    },
    getListData: function(params) {
      params = params || {};
      params['api-version'] = 'v2';
      return Ajax.request({
        url: 'users.json',
        type: 'GET',
        params: params
      }).then(users => users);
    },
    destroyData: function() {
      // @see User::delete() function
      return Promise.resolve({});
    }
  }
});

export default User;
