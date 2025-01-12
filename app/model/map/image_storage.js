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
import DefineMap from 'cipherguard-mad/model/map/map';

const ImageStorage = DefineMap.extend('cipherguard.model.ImageStorage', {
  /**
   * Get the image path
   * @param {cipherguard.model.ImageStorage} img The target image
   * @param {string} version (optional) The version to get
   * @return {string} The image path
   */
  imagePath: function(version) {
    if (typeof this.url == 'undefined') {
      return '';
    }
    if (typeof this.url[version] == 'undefined') {
      return '';
    } else {
      return this.url[version];
    }
  }
});
DefineMap.setReference('ImageStorage', ImageStorage);

export default ImageStorage;
