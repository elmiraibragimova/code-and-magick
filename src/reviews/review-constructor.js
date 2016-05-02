/**
 * @fileoverview Конструктор для создания отзыва.
 */

'use strict';

define([
  './get-template'
], function(template) {
  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(data, container) {
    this.data = data;
    this.element = template(this.data);
    container.appendChild(this.element);

    this.element.addEventListener('click', this._onQuizAnswer);
  };

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
      var active = this.constructor.ACTIVE_CLASSNAME;
      var activeAnswer = evt.target.parentNode.querySelector('.' + active);

      if (activeAnswer) {
        activeAnswer.classList.remove(active);
      }

      evt.target.classList.add(active);
    }
  };

  Review.prototype.remove = function() {
    this.element.removeEventListener('click', this._getQuizAnswer);
    this.element.parentNode.removeChild(this.element);
  };

  return Review;
});
