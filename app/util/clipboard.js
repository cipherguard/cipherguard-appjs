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
 * @since         2.2.0
 */
import Plugin from './plugin';

class Clipboard {
  static copy(value, name) {
    name = name || null;
    const eventData = {
      name: name,
      data: value
    };
    Plugin.send('cipherguard.clipboard', eventData);
  }
}

export default Clipboard;
