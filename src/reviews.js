'use strict';

(function() {
  var filtersContainer = document.querySelector('.reviews-filter');
  var moreButton = document.querySelector('.reviews-controls-more');

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
   * @const {number}
   */
  var PAGE_SIZE = 3;

  /**
   * @const {string}
   */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /**
   * @type {Array.<Object>}
   */
  var reviews = [];

  /**
   * @type {Array.<Object>}
   */
  var filteredReviews = [];

  /**
   * @type {number}
   */
  var pageNumber = 0;

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
   * @const {Filter}
   */
  var DEFAULT_FILTER = Filter.ALL;

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

  var setReviewsAsFailed = function() {
    reviewsSection.classList.remove('reviews-list-loading');
    reviewsSection.classList.add('reviews-load-failure');
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
      moreButton.classList.remove('invisible');

      try {
        var loadedData = JSON.parse(evt.target.response);
      } catch (exeption) {
        reviewsSection.classList.add('reviews-load-failure');
      }

      callback(loadedData);
    };

    xhr.onerror = setReviewsAsFailed;
    xhr.ontimeout = setReviewsAsFailed;

    xhr.timeout = LOAD_TIMEOUT;

    reviewsSection.classList.add('reviews-list-loading');
    filtersContainer.classList.add('invisible');

    xhr.send();
  };

  /**
   * @param {Array.<Object>} reviews
   * @param {number} page
   * @param {boolean} replace
   */
  var renderReviews = function(reviews, page, replace) {
    if (replace) {
      reviewsContainer.innerHTML = '';
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    reviews.slice(from, to).forEach(function(review) {
      createReviewItem(review, reviewsContainer);
    });
  };

  /**
   * Фильтр для отзывов, написанных за последние две недели.
   * Отзывы отрисовываются по убыванию даты.
   * @param {Array.<Object>} reviews
   */
  var getRecentReviews = function(reviews) {
    var currentDate = new Date();
    var dayBeforeTwoWeeks = Math.floor(currentDate.valueOf() - TWO_WEEKS);

    reviews = reviews.filter(function(review) {
      var reviewDate = new Date(review.date).valueOf();

      return reviewDate >= dayBeforeTwoWeeks;
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
   */
  var setFilterEnabled = function(filter) {
    filteredReviews = getFilteredReviews(reviews, filter);
    pageNumber = 0;

    renderReviews(filteredReviews, pageNumber, true);
  };

  var setFiltersEnabled = function() {
    filtersContainer.addEventListener('click', function(evt) {
      var label = evt.target.classList.contains('reviews-filter-item');
      var input = evt.target.nodeName === 'INPUT';

      if (label || input) {
        setFilterEnabled(evt.target.id);
      }
    });

    filtersContainer.addEventListener('keydown', function(evt) {
      var label = evt.target.classList.contains('reviews-filter-item');
      var key = ([13, 32].indexOf(evt.keyCode) > -1);

      if (key && label) {
        evt.preventDefault();

        var filter = evt.target.getAttribute('for');
        setFilterEnabled(filter);
      }
    });
  };

  /**
   * @param {Array} reviews
   * @param {number} page
   * @param {number} pageSize
   * @return {boolean}
   */
  var isNextPageAvailable = function(reviews, page, pageSize) {
    return page < Math.floor(reviews.length / pageSize);
  };

  var setMoreButtonEnabled = function() {
    moreButton.addEventListener('click', function() {
      if (isNextPageAvailable(reviews, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderReviews(filteredReviews, pageNumber);
      }
    });
  };

  getReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setFiltersEnabled();
    setFilterEnabled(DEFAULT_FILTER);
    setMoreButtonEnabled();
  });
})();
