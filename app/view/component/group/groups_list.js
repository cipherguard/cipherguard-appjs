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
import DomData from 'can-dom-data';
import domEvents from 'can-dom-events';
import TreeView from 'cipherguard-mad/view/component/tree';

const GroupsListView = TreeView.extend('cipherguard.view.component.GroupsList', /** @static */ {

}, /** @prototype */ {

  /**
   * Mousedown event.
   *
   * We use this event to display the contextual menu
   * @param {HTMLElement} el The element the event occurred on
   * @param {HTMLEvent} ev The event which occurred
   * @returns {boolean}
   */
  '{element} .more-ctrl a mousedown': function(el, ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const $li = $(el).closest('li');
    const itemClass = this.getController().getItemClass();
    const group = DomData.get($li[0], itemClass.shortName);
    domEvents.dispatch(this.element, {type: 'item_menu_clicked', data: {group: group, srcEv: ev}});

    return false;
  }

});

export default GroupsListView;
