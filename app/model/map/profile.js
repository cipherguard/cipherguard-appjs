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
import DefineMap from 'cipherguard-mad/model/map/map';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import ImageStorage from './image_storage';

const Profile = DefineMap.extend('cipherguard.model.Profile', {
  id: 'string',
  first_name: 'string',
  last_name: 'string',
  avatar: ImageStorage,

  /**
   * Return the user full name.
   * @return {string}
   */
  fullName: function() {
    return Profile.fullName(this);
  },

  /**
   * Get the avatar image path
   * @param {string} version (optional) The version to get
   * @return {string} The image path
   */
  avatarPath: function(version) {
    return Profile.avatarPath(this, version);
  }
});
DefineMap.setReference('Profile', Profile);

/**
 * Get full name.
 * @param profile
 * @return {string}
 */
Profile.fullName = function(profile) {
  const fullName = `${profile.first_name} ${profile.last_name}`;
  return fullName;
};

/**
 * Get avatar path.
 * @param profile
 * @param version
 * @return {*}
 */
Profile.avatarPath = function(profile, version) {
  if (typeof profile.avatar != 'undefined' && profile.avatar.url != undefined) {
    return profile.avatar.imagePath(version);
  } else {
    return 'img/avatar/user.png';
  }
};

/*
 * Default validation rules.
 * Keep these rules in sync with the cipherguard API.
 * @see https://github.com/cipherguard/cipherguard_api/src/Model/Table/PRofilesTable.php
 */
Profile.validationRules = {
  first_name: [
    {rule: 'required', message: __('A first name is required')},
    {rule: 'notEmpty', message: __('A first name is required')},
    {rule: 'utf8', message: __('First name should be a valid utf8 string.')},
    {rule: ['lengthBetween', 0, 255], message: __('The first name length should be maximum 255 characters.')}
  ],
  last_name: [
    {rule: 'required', message: __('A last name is required')},
    {rule: 'notEmpty', message: __('A last name is required')},
    {rule: 'utf8', message: __('Last name should be a valid utf8 string.')},
    {rule: ['lengthBetween', 0, 255], message: __('The last name length should be maximum 255 characters.')}
  ]
};

export default Profile;
