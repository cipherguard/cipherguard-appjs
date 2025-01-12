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
import SecondarySidebarSectionComponent from '../workspace/secondary_sidebar_section';

import template from '../../view/template/component/gpgkey/gpgkey_sidebar_section.stache';

const GpgKeySidebarSectionComponent = SecondarySidebarSectionComponent.extend('cipherguard.component.gpgkey.GpgKeySidebarSection', /** @static */ {

  defaults: {
    label: 'Sidebar Section Gpgkey Controller',
    template: template,
    gpgkey: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  beforeRender: function() {
    this._super();
    // pass the new resource to the view
    const gpgkey = this.options.gpgkey;
    this.setViewData('gpgkey', gpgkey);
  }

});

export default GpgKeySidebarSectionComponent;
