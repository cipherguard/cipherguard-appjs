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
 */
import $ from 'jquery';
import Ajax from 'cipherguard-mad/net/ajax';
import Config from 'cipherguard-mad/config/config';
import DialogComponent from 'cipherguard-mad/component/dialog';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import MadBus from 'cipherguard-mad/control/bus';
import MfaRequiredComponent from '../component/mfa/mfa_required';

/**
 * @inherits cipherguard-mad/Ajax
 * @see mad.net.Ajax
 * @parent cipherguard-mad/Ajax
 *
 * Override the cipherguard mad ajax class.
 * Broadcast notification events on POST/PUT/DELETE requests
 *
 */
const AppAjax = Ajax.extend('app.net.Ajax', /** @static */ {

  /**
   * @inheritsdoc
   */
  request: function(request) {
    // Set the CSRF request header.
    request.beforeSend = function(xhr) {
      request._xhr = xhr;
      const csrfToken = Config.read('app.csrfToken');
      xhr.setRequestHeader('X-CSRF-Token', csrfToken);
    };

    return this._super(request);
  },

  /**
   * @inheritsdoc
   */
  handleSuccess: function(request, data) {
    return this._super(request, data)
      .then(data => {
        this._triggerNotification(request, request._response);
        return Promise.resolve(data);
      });
  },

  /**
   * @inheritsdoc
   */
  handleError: function(request, data) {
    return this._super(request, data)
      .then(null, data => {
        this._triggerNotification(request, request._response);
        this._mfaRequired(request, request._response);
        return Promise.reject(data);
      });
  },

  /**
   * Trigger a notification event.
   *
   * @param request
   * @param response
   * @private
   */
  _triggerNotification: function(request, response) {
    /*
     * send a notification on the event bus for any successful response.
     * the notification system will take care of filtering what should be displayed.
     */
    if (MadBus.bus && (request.silentNotify === undefined || !request.silentNotify)) {
      MadBus.trigger('cipherguard_notify', {
        title: response.header.title,
        status: response.header.status,
        data: response
      });
    }
  },

  /**
   * Redirect the user to the multiple factor authentication page if required
   *
   * @param request
   * @param response
   * @private
   */
  _mfaRequired: function(request, response) {
    if (response.header) {
      if (response.header.code === 403 && response.header.message === 'MFA authentication is required.') {
        // If the mfa required dialog is already displayed.
        if ($('.mfa-required-dialog').length > 0) {
          return;
        }

        const dialog = DialogComponent.instantiate({
          label: __('MFA Required'),
          cssClasses: ['mfa-required-dialog', 'dialog-wrapper']
        }).start();

        /*
         * attach the component to the dialog
         * let the server redirect where needed
         */
        dialog.add(MfaRequiredComponent, {url: '/'});
      }
      return true;
    }
    return false;
  }

}, /** @prototype */ {

});

export default AppAjax;
