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
import PrimarySidebarSectionView from '../../view/component/workspace/primary_sidebar_section';

//import template from 'app/view/template/component/workspace/sidebar_section.ejs!';

const PrimarySidebarSectionComponent = Component.extend('cipherguard.component.workspace.SecondarySidebarSection', /** @static */ {

  defaults: {
    label: 'Primary Sidebar Section Component',
    viewClass: PrimarySidebarSectionView
  }

}, /** @prototype */ {

});

export default PrimarySidebarSectionComponent;
