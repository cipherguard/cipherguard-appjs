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
import $ from 'jquery';
import AuthService from '../../model/service/plugin/auth';
import Component from 'cipherguard-mad/component/component';
import HtmlHelper from 'cipherguard-mad/helper/html';

const MfaComponent = Component.extend('cipherguard.component.settings.mfa', /** @static */ {

  defaults: {}

}, /** @prototype */ {
  /**
   * @inheritdoc
   */
  afterStart: async function() {
    const isAuthenticated = await AuthService.isAuthenticated();
    if (isAuthenticated) {
      const iframeContent = `<iframe id='js_mfa_iframe' src='${APP_URL}/mfa/setup/select' width='100%' height='100%'></iframe>`;
      HtmlHelper.create($(this.element), 'inside_replace', iframeContent);
    }
  }
});

export default MfaComponent;
