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
 * @since         2.6.0
 */
import Button from 'cipherguard-mad/component/button';
import Component from 'cipherguard-mad/component/component';
import template from '../../../view/template/component/administration/mfa/primary_menu.stache';

const PrimaryMenu = Component.extend('cipherguard.component.administration.mfa.PrimaryMenu', /** @static */ {
  defaults: {
    template: template
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    this.saveButton = new Button('#js-mfa-settings-save-button', {state: {disabled: true}});
    this.saveButton.start();
  }

});

export default PrimaryMenu;
