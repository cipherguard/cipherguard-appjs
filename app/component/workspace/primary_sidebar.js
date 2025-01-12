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
import Component from 'cipherguard-mad/component/component';
//import PrimarySidebarView from 'app/view/component/workspace/primary_sidebar';

import template from '../../view/template/component/workspace/primary_sidebar.stache';

const PrimarySidebarComponent = Component.extend('cipherguard.component.workspace.PrimarySidebar', /** @static */ {

  defaults: {
    label: 'Sidebar Component',
    //viewClass: PrimarySidebarView,
    template: template
  }

}, /** @prototype */ {

});

export default PrimarySidebarComponent;
