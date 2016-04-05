'use strict';

(function() {
  var filter = document.querySelector('.reviews-filter');
  filter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');
  var template = document.querySelector('template');
  var sample;

  if ('content' in template) {
    sample = template.content.querySelector('.review');
  } else {
    sample = template.querySelector('.review');
  }

  /**
   * @param {HTMLElement} review
   * @param {string} path
   */
  var insertImage = function(review, path) {
    var author = review.querySelector('.review-author');
    var authorImage = new Image();

    authorImage.onload = function(evt) {
      author.src = evt.target.src;
      author.width = 124;
      author.height = 124;
    };

    authorImage.onerror = function() {
      review.classList.add('review-load-failure');
    };

    authorImage.src = path;
  };

  /**
   * @param {HTMLElement} review
   * @param {number} rating
   */
  var insertMark = function(review, rating) {
    var mark = review.querySelector('.review-rating');
    switch (rating) {
      case 2:
        mark.classList.add('review-rating-two');
        break;
      case 3:
        mark.classList.add('review-rating-three');
        break;
      case 4:
        mark.classList.add('review-rating-four');
        break;
      case 5:
        mark.classList.add('review-rating-five');
        break;
    }
  };

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   */
  var createReviewItem = function(data, container) {
    // Клонируем структуру шаблона.
    var reviewItem = sample.cloneNode(true);

    // Вставляем текст отзыва.
    var description = reviewItem.querySelector('.review-text');
    description.textContent = data.description;

    // Вставляем оценку.
    insertMark(reviewItem, data.rating);

    // Вставляем изображение.
    insertImage(reviewItem, data.author.picture);

    // Вставляем отзыв в разметку.
    container.appendChild(reviewItem);
  };

  window.reviews.forEach(function(review) {
    createReviewItem(review, reviewsContainer);
  });

  filter.classList.remove('invisible');
})();
