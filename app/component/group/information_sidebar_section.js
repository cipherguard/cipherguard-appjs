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

import template from '../../view/template/component/group/information_sidebar_section.stache';

const InformationSidebarSectionComponent = SecondarySidebarSectionComponent.extend('cipherguard.component.group.InformationSidebarSection', /** @static */ {

  defaults: {
    label: 'Sidebar Section Information Controller',
    template: template,
    group: null
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  beforeRender: function() {
    this._super();
    this.setViewData('group', this.options.group);
  },

  /**
   * Observe when the item is updated
   */
  '{group} updated': function() {
    this.refresh();
  }

});

export default InformationSidebarSectionComponent;
