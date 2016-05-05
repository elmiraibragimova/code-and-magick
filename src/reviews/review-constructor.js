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

  Review.prototype.remove = function() {
    this.element.removeEventListener('click', this._getQuizAnswer);
    DOMComponent.prototype.remove.call(this);
  };

  /**
   * @param {ClickEvent} evt
   */
  Review.prototype._onQuizAnswer = function(evt) {
    var active = Review.ACTIVE_CLASSNAME;

    var isActive = evt.target.classList.contains(active);
    var isQuiz = evt.target.classList.contains('review-quiz-answer');

    if (isQuiz && !isActive) {
      var answer = evt.target.classList.contains('review-quiz-answer-yes');

      this.data.setReviewUsefulness(answer, function() {
        var activeAnswer = evt.target.parentNode.querySelector('.' + active);

        if (activeAnswer) {
          activeAnswer.classList.remove(active);
        }

        evt.target.classList.add(active);
      });
    }
  };

  return Review;
});
