/**
 * @fileoverview Шаблон для отзыва.
 */

'use strict';

define([
], function() {
  var template = document.querySelector('template');
  var sample;

  if ('content' in template) {
    sample = template.content.querySelector('.review');
  } else {
    sample = template.querySelector('.review');
  }

  /**
   * @const {number}
   */
  var IMAGE_LOAD_TIMEOUT = 10000;

  /**
   * @param {HTMLElement} review
   * @param {string} name
   * @param {string} picture
   */
  var insertImage = function(review, name, picture) {
    var author = review.querySelector('.review-author');

    var authorImage = new Image(124, 124);

    authorImage.title = author.title = name;
    authorImage.alt = author.alt = 'Фотография пользователя ' + name;

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
    }, IMAGE_LOAD_TIMEOUT);

    authorImage.src = picture;
  };

  /**
   * @param {HTMLElement} review
   * @param {number} rating
   */
  var insertMark = function(review, rating) {
    var mark = review.querySelector('.review-rating');

    var marks = ['two', 'three', 'four', 'five'];

    if (rating > 1 && rating <= 5) {
      mark.classList.add('review-rating-' + marks[rating - 2]);
    }
  };

  /**
   * Создание DOM-элемента отзыва.
   * @param {Object} data
   */
  return function(data) {
    // Клонируем структуру шаблона.
    var reviewItem = sample.cloneNode(true);

    // Вставляем текст отзыва.
    var description = reviewItem.querySelector('.review-text');
    description.textContent = data.getDescription();

    // Вставляем оценку.
    insertMark(reviewItem, data.getRating());

    // Вставляем изображение.
    var name = data.getAuthorName();
    var picture = data.getAuthorPicture();
    insertImage(reviewItem, name, picture);

    return reviewItem;
  };
});
