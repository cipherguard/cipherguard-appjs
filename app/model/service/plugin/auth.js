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
 * @since         2.11.0
 */
import MadBus from 'cipherguard-mad/control/bus';
import Plugin from '../../../util/plugin';

export default class AuthService {

  /**
   * Check if the user is authenticated
   * @param {object} options Optional parameters
   * - options.requestApi {bool}, get the status from the API, default true.
   * @return {Promise<bool>}
   */
  static async isAuthenticated(options) {
    return await Plugin.request("cipherguard.auth.is-authenticated", [options]);
  }

  /**
   * Logout the user
   * @return {Promise}
   */
  static logout() {
    clearInterval(AuthService.checkAuthStatusLoopInterval);
    return Plugin.request('cipherguard.plugin.auth.logout');
  }

  /**
   * Start an invertval to check if the user is authenticated.
   * - In the case the user is logged out, trigger a cipherguard.auth.logged-out event.
   */
  static startCheckAuthStatusLoop() {
    AuthService.checkAuthStatusLoopInterval = setInterval(async () => {
      const isAuthenticated = await AuthService.isAuthenticated({ requestApi: false });
      if (!isAuthenticated) {
        clearInterval(AuthService.checkAuthStatusLoopInterval);
        MadBus.trigger('auth_auto_logged_out');
      }
    }, 1000);
  }
}
