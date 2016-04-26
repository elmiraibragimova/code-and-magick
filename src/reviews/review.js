/**
 * @fileoverview Конструктор для создания отзыва.
 */

'use strict';

define([], function() {
  var template = document.querySelector('template');
  var sample;

  if ('content' in template) {
    sample = template.content.querySelector('.review');
  } else {
    sample = template.querySelector('.review');
  }

  /**
   * @param {Object} data
   * @param {Element} container
   * @constructor
   */
  var Review = function(data, container) {
    self = this;

    this.data = data;
    this.element = this._getReview();
    container.appendChild(this.element);

    this.element.addEventListener('click', this._onQuizAnswer);
  };

  Review.prototype = {
    /**
     * @const {string}
     */
    ACTIVE_CLASSNAME: 'review-quiz-answer-active',

    /**
     * @const {number}
     */
    IMAGE_LOAD_TIMEOUT: 10000,

    /**
     * @param {HTMLElement} review
     * @private
     */
    _insertImage: function(review) {
      var author = review.querySelector('.review-author');

      var authorImage = new Image(124, 124);

      authorImage.title = author.title = this.data.author.name;
      authorImage.alt = author.alt = 'Фотография пользователя ' + this.data.author.name;

      authorImage.onload = function() {
        clearTimeout(loadTimeout);

        authorImage.classList.add('review-author');
        review.replaceChild(authorImage, author);
      };

      authorImage.onerror = function() {
        clearTimeout(loadTimeout);
        review.classList.add('review-load-failure');
      };

      var loadTimeout = setTimeout(function() {
        author.src = '';
        review.classList.add('review-load-failure');
      }, self.IMAGE_LOAD_TIMEOUT);

      authorImage.src = this.data.author.picture;
    },

    /**
     * @param {HTMLElement} review
     * @private
     */
    _insertMark: function(review) {
      var mark = review.querySelector('.review-rating');
      var rating = this.data.rating;

      var marks = ['two', 'three', 'four', 'five'];

      if (rating > 1 && rating <= 5) {
        mark.classList.add('review-rating-' + marks[rating - 2]);
      }
    },

    /**
     * Создание DOM-элемента отзыва.
     * @return {HTMLElement}
     * @private
     */
    _getReview: function() {
      // Клонируем структуру шаблона.
      var reviewItem = sample.cloneNode(true);

      // Вставляем текст отзыва.
      var description = reviewItem.querySelector('.review-text');
      description.textContent = this.data.description;

      // Вставляем оценку.
      this._insertMark(reviewItem);

      // Вставляем изображение.
      this._insertImage(reviewItem);

      return reviewItem;
    },

    /**
     * @private
     */
    _onQuizAnswer: function(evt) {
      if (evt.target.classList.contains('review-quiz-answer')) {
        var activeAnswer = evt.target.parentNode.querySelector('.' + self.ACTIVE_CLASSNAME);

        if (activeAnswer) {
          activeAnswer.classList.remove(self.ACTIVE_CLASSNAME);
        }

        evt.target.classList.add(self.ACTIVE_CLASSNAME);
      }
    },

    remove: function() {
      this.element.removeEventListener('click', this._getQuizAnswer);
      this.element.parentNode.removeChild(this.element);
    }
  };

  return Review;
});
