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
import View from 'cipherguard-mad/view/view';

const FilterView = View.extend('cipherguard.view.component.navigation.Filter', /** @static */ {

}, /** @prototype */ {

  /**
   * Observe when the user update the filter
   */
  'form submit': function() {
    $(this.element).trigger('update');
  }

});
export default FilterView;
