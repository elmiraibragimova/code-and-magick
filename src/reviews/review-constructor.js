/**
 * @fileoverview Конструктор для создания отзыва.
 */

'use strict';

define([
  './get-template',
  '../utils',
  '../dom-component'
], function(template, utils, DOMComponent) {
  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(data, container) {
    DOMComponent.call(this, data, template);
    DOMComponent.prototype.insertIntoDOM.call(this, container);

    this.element.addEventListener('click', this._onQuizAnswer.bind(this));
  };

  utils.inherit(Review, DOMComponent);

  /**
   * @const {string}
   */
  Review.ACTIVE_CLASSNAME = 'review-quiz-answer-active';

  /**
   * param {ClickEvent} evt
   * @private
   */
  Review.prototype._onQuizAnswer = function(evt) {
    if (evt.target.classList.contains('review-quiz-answer')) {
      var active = Review.ACTIVE_CLASSNAME;
      var activeAnswer = evt.target.parentNode.querySelector('.' + active);

      if (activeAnswer) {
        activeAnswer.classList.remove(active);
      }

      evt.target.classList.add(active);
    }
  };

  Review.prototype.remove = function() {
    this.element.removeEventListener('click', this._getQuizAnswer);
    DOMComponent.prototype.remove.call(this);
  };

  return Review;
});
