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
import DialogComponent from 'cipherguard-mad/component/dialog';
import HtmlHelper from 'cipherguard-mad/helper/html';
// eslint-disable-next-line no-unused-vars
import I18n from 'cipherguard-mad/util/lang/i18n';
import progressTemplate from '../../view/template/component/dialog/progress.stache';

const ProgressDialog = DialogComponent.extend('cipherguard.component.ProgressDialog', /** @static */ {

  defaults: {
    label: 'Progress dialog component',
    template: progressTemplate
  },

  /**
   * Instantiate a new Dialog.
   *
   * @param {Object} [options] option values for the component.  These get added to
   * this.options and merged with defaults static variable
   * @return {Dialog}
   */
  instantiate: function(options) {
    // Create the DOM entry point for the dialog
    let refElt = $('body');
    let position = 'first';

    // If a dialog already exist, position the new one right after.
    const $existingDialog = $('.dialog-wrapper:last');
    if ($existingDialog.length) {
      refElt = $existingDialog;
      position = "after";
    }

    // Insert the element in the page DOM.
    const $el = HtmlHelper.create(refElt, position, '<div/>');

    return new ProgressDialog($el[0], options);
  }

}, /** @prototype */ {

});

export default ProgressDialog;
