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
import Component from 'cipherguard-mad/component/component';
import SecondarySidebarState from '../../model/state/secondary_sidebar_state';

const SecondarySidebarSection = Component.extend('cipherguard.component.workspace.SecondarySidebarSection', /** @static */ {

  defaults: {
    label: 'SecondarySidebar Component',
    stateClass: SecondarySidebarState
  }

}, /** @prototype */ {

  /**
   * Open the section.
   */
  open: function() {
    $('.accordion-content', this.element).slideDown(50);
    $(this.element).removeClass('closed');
    this.state.opened = true;
  },

  /**
   * Close the section
   */
  close: function() {
    $('.accordion-content', this.element).slideUp(50);
    $(this.element).addClass('closed');
    this.state.opened = false;
  },

  /**
   * Observe when accordion-header is clicked.
   */
  '{element} a.accordion-trigger click': function() {
    if (!this.state.opened) {
      this.open();
    } else {
      this.close();
    }
  }

});

export default SecondarySidebarSection;
