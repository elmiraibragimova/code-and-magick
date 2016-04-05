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
   * @param {Obkect} path
   */
  var insertImage = function(review, path) {
    /**
     * @const {number}
     */
    var IMAGE_LOAD_TIMEOUT = 10000;

    var author = review.querySelector('.review-author');
    author.title = path.name;
    author.alt = 'Фотография пользователя ' + path.name;

    var authorImage = new Image();

    authorImage.onload = function(evt) {
      clearTimeout(loadTimeout);
      author.src = evt.target.src;
      author.width = 124;
      author.height = 124;
    };

    authorImage.onerror = function() {
      review.classList.add('review-load-failure');
    };

    authorImage.src = path.picture;

    var loadTimeout = setTimeout(function() {
      author.src = '';
      review.classList.add('review-load-failure');
    }, IMAGE_LOAD_TIMEOUT);
  };

  /**
   * @param {HTMLElement} review
   * @param {number} rating
   */
  var insertMark = function(review, rating) {
    var mark = review.querySelector('.review-rating');

    var marks = {
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five'
    };

    if (rating > 1 && rating <= 5) {
      mark.classList.add('review-rating-' + marks[rating]);
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
    insertImage(reviewItem, data.author);

    // Вставляем отзыв в разметку.
    container.appendChild(reviewItem);
  };

  window.reviews.forEach(function(review) {
    createReviewItem(review, reviewsContainer);
  });

  filter.classList.remove('invisible');
})();
