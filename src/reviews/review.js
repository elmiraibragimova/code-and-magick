/**
 * @fileoverview Конструктор для создания отзыва.
 */

'use strict';

define([
  './getTemplate'
], function(template) {
  /**
   * @const {string}
   */
  var ACTIVE_CLASSNAME = 'review-quiz-answer-active';

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

  Review.prototype = {
    /**
     * param {ClickEvent} evt
     * @private
     */
    _onQuizAnswer: function(evt) {
      if (evt.target.classList.contains('review-quiz-answer')) {
        var activeAnswer = evt.target.parentNode.querySelector('.' + ACTIVE_CLASSNAME);

        if (activeAnswer) {
          activeAnswer.classList.remove(ACTIVE_CLASSNAME);
        }

        evt.target.classList.add(ACTIVE_CLASSNAME);
      }
    },

    remove: function() {
      this.element.removeEventListener('click', this._getQuizAnswer);
      this.element.parentNode.removeChild(this.element);
    }
  };

  return Review;
});
