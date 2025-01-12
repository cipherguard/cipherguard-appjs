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
import FeedbackComponent from 'cipherguard-mad/form/feedback';
import Form from 'cipherguard-mad/form/form';
import TextboxComponent from 'cipherguard-mad/form/element/textbox';
import User from '../../model/map/user';

import template from '../../view/template/form/comment/add.stache';

const CreateForm = Form.extend('cipherguard.form.comment.Create', /** @static */ {

  defaults: {
    foreignModel: null,
    foreignKey: null,
    template: template,
    commentContentField: null
  }
}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  init: function(el, options) {
    this._super(el, options);
    this.setViewData('user', User.getCurrent());
  },

  /**
   * @inheritdoc
   */
  afterStart: function() {
    // parent_id hidden field
    this.addElement(
      new TextboxComponent(`#${this.element.id} .js_comment_parent_id`, {
        modelReference: 'Comment.parent_id'
      }).start()
    );

    // foreign_key hidden field
    this.addElement(
      new TextboxComponent(`#${this.element.id} .js_comment_foreign_key`, {
        modelReference: 'Comment.foreign_key'
      }).start().setValue(this.options.foreignKey)
    );

    // feedback.
    this.options.commentContentField = new TextboxComponent(`#${this.element.id} .js_comment_content`, {
      modelReference: 'Comment.content'
    }).start();
    this.addElement(
      this.options.commentContentField,
      new FeedbackComponent(`#${this.element.id} .js_comment_content_feedback`, {}).start()
    );
  },

  /**
   * Empty content of the comment content field.
   */
  emptyContent: function() {
    this.options.commentContentField.setValue('');
  },

  /* ************************************************************** */
  /* LISTEN TO THE VIEW EVENTS */
  /* ************************************************************** */

  /**
   * State ready.
   * Empty the comment content field.
   */
  stateReady: function() {
    this.options.commentContentField.setValue('');
  },

  /**
   * State hidden.
   * @param go
   */
  stateHidden: function(go) {
    this._super(go);
    /*
     * Reinitialize number of validations to avoid inline validation
     * each time the form appears.
     */
    this.validations = 0;
  }
});

export default CreateForm;
