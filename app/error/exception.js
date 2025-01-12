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

// Initialize the error namespaces.
cipherguard.error = cipherguard.error || {};
cipherguard.error.WRONG_PARAMETER = "Wrong parameter [%0]";
cipherguard.error.MISSING_OPTION = "The option [%0] should be defined";
cipherguard.error.ELEMENT_NOT_FOUND = "The element [%0] could not be found";

const CipherguardException = cipherguard.Exception = function() {
};

CipherguardException.get = function(exception_message) {
  const reps = Array.prototype.slice.call(arguments, 1);
  const message = exception_message.replace(/%(\d+)/g, (s, key) => reps[key] || s);
  return new Error(message);
};
