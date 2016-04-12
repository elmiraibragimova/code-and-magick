'use strict';

(function() {
  var filtersContainer = document.querySelector('.reviews-filter');

  var reviewsSection = document.querySelector('.reviews');
  var reviewsContainer = document.querySelector('.reviews-list');
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
  var TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

  /**
   * @const {number}
   */
  var LOAD_TIMEOUT = 10000;

  /**
   * @const {string}
   */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /**
   * @enum {string}
   */
  var Filter = {
    'ALL': 'reviews-all',
    'RECENT': 'reviews-recent',
    'GOOD': 'reviews-good',
    'BAD': 'reviews-bad',
    'POPULAR': 'reviews-popular'
  };

  /**
   * @param {HTMLElement} review
   * @param {Object} path
   */
  var insertImage = function(review, path) {
    var author = review.querySelector('.review-author');

    var authorImage = new Image(124, 124);

    authorImage.title = author.title = path.name;
    authorImage.alt = author.alt = 'Фотография пользователя ' + path.name;

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
    }, LOAD_TIMEOUT);

    authorImage.src = path.picture;
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

  /**
   * @param {function(Array.<Object>)} callback
   */
  var getReviews = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', REVIEWS_LOAD_URL);

    xhr.onload = function(evt) {
      reviewsSection.classList.remove('reviews-list-loading');
      filtersContainer.classList.remove('invisible');

      try {
        var loadedData = JSON.parse(evt.target.response);
      } catch (exeption) {
        reviewsSection.classList.add('reviews-load-failure');
      }

      callback(loadedData);
    };

    xhr.onerror = function() {
      reviewsSection.classList.remove('reviews-list-loading');
      reviewsSection.classList.add('reviews-load-failure');
    };

    xhr.timeout = LOAD_TIMEOUT;
    xhr.ontimeout = function() {
      reviewsSection.classList.remove('reviews-list-loading');
      reviewsSection.classList.add('reviews-load-failure');
    };

    reviewsSection.classList.add('reviews-list-loading');
    filtersContainer.classList.add('invisible');

    xhr.send();
  };

  /**
   * @param {Array.<Object>} reviews
   */
  var renderReviews = function(reviews) {
    reviewsContainer.innerHTML = '';
    reviews.forEach(function(review) {
      createReviewItem(review, reviewsContainer);
    });
  };

  /**
   * Фильтр для отзывов, написанных за последние две недели.
   * Отзывы отрисовываются по убыванию даты.
   * (На самом деле они вообще не отрисовываются, так как последние из них
   * были оставлены больше двух недель назад).
   * @param {Array.<Object>} reviews
   */
  var getRecentReviews = function(reviews) {
    var currentDate = new Date();
    var dayBeforeTwoWeeks = Math.floor(currentDate.valueOf() - TWO_WEEKS);

    reviews = reviews.filter(function(review) {
      var reviewDate = new Date(review.date).valueOf();

      return reviewDate <= dayBeforeTwoWeeks;
    });

    reviews.sort(function(a, b) {
      var firstDate = new Date(a.date);
      var secondDate = new Date(b.date);

      return secondDate - firstDate;
    });

    return reviews;
  };

  /**
   * Фильтр для хороших отзывов (выводятся по убыванию рейтинга).
   * @param {Array.<Object>} reviews
   */
  var getGoodReviews = function(reviews) {
    reviews = reviews.filter(function(review) {
      return review.rating >= 3;
    });

    reviews.sort(function(a, b) {
      return b.rating - a.rating;
    });

    return reviews;
  };

  /**
   * Фильтр для плохих отзывов (выводятся по возрастанию рейтинга).
   * @param {Array.<Object>} reviews
   */
  var getBadReviews = function(reviews) {
    reviews = reviews.filter(function(review) {
      return review.rating <= 2;
    });

    reviews.sort(function(a, b) {
      return a.rating - b.rating;
    });

    return reviews;
  };

  /**
   * Фильтр для популярных отзывов (выводятся по убыванию оценки отзыва).
   * @param {Array.<Object>} reviews
   */
  var getPopularReviews = function(reviews) {
    reviews.sort(function(a, b) {
      return b.review_usefulness - a.review_usefulness;
    });
    return reviews;
  };

  /**
   * Фильтрация отзывов.
   * @param {Array.<Object>} reviews
   * @param {string} filter
   */
  var getFilteredReviews = function(reviews, filter) {
    var reviewsToFilter = reviews.slice(0);

    switch (filter) {
      case Filter.ALL:
        return reviewsToFilter;

      case Filter.RECENT:
        return getRecentReviews(reviewsToFilter);

      case Filter.GOOD:
        return getGoodReviews(reviewsToFilter);

      case Filter.BAD:
        return getBadReviews(reviewsToFilter);

      case Filter.POPULAR:
        return getPopularReviews(reviewsToFilter);
    }

    return reviewsToFilter;
  };

  /**
   * @param {Filter} filter
   * @param {Array.<Object>} reviews
   */
  var setFilterEnabled = function(filter, reviews) {
    var filteredReviews = getFilteredReviews(reviews, filter);
    renderReviews(filteredReviews);
  };

  /**
   * @param {Array.<Object>} reviews
   */
  var setFiltrsEnabled = function(reviews) {
    var filters = filtersContainer.querySelectorAll('.reviews-filter input');
    for (var i = 0; i < filters.length; i++) {
      filters[i].onclick = function() {
        setFilterEnabled(this.id, reviews);
      };
    }
  };

  getReviews(function(loadedReviews) {
    var reviews = loadedReviews;
    setFiltrsEnabled(reviews);
    renderReviews(reviews);
  });
})();
