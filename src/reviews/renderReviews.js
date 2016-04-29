/**
 * @fileoverview Загрузка, фильтрация и отрисовка списка отзывов.
 */

'use strict';

define([
  '../utils',
  './load',
  '../filter/filter',
  '../filter/filter-type',
  './review'
], function(utils, loader, filter, Filter, Review) {
  var filtersContainer = document.querySelector('.reviews-filter');
  var moreButton = document.querySelector('.reviews-controls-more');

  var reviewsContainer = document.querySelector('.reviews-list');

  /**
   * @const {string}
   */
  var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

  /**
   * @const {Filter.<string>}
   */
  var DEFAULT_FILTER = Filter.ALL;

  /**
   * @const {number}
   */
  var PAGE_SIZE = 3;

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
   * @type {Array.<Review>}
   */
  var renderedReviews = [];


  /**
   * @param {Array.<Object>} reviewList
   * @param {number} page
   * @param {boolean} replace
   */
  var renderReviews = function(reviewList, page, replace) {
    if (replace) {
      renderedReviews.forEach(function(review) {
        review.remove();
      });

      renderedReviews = [];
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    reviewList.slice(from, to).forEach(function(review) {
      renderedReviews.push(new Review(review, reviewsContainer));
    });

    utils.toggleVisibility(moreButton, isNextPageAvailable(reviewList, page + 1, PAGE_SIZE));
  };

  /**
   * @param {Filter} filterType
   */
  var setFilterEnabled = function(filterType) {
    localStorage.lastFilter = filterType;

    filteredReviews = filter(reviews, filterType);
    pageNumber = 0;

    renderReviews(filteredReviews, pageNumber, true);

    var input = document.querySelector('#' + filterType);
    input.checked = true;
  };

  var setFiltersEnabled = function() {
    filtersContainer.addEventListener('click', function(evt) {
      var input = evt.target.nodeName === 'INPUT';

      if (input) {
        setFilterEnabled(evt.target.id);
      }
    });

    filtersContainer.addEventListener('keydown', function(evt) {
      var label = evt.target.classList.contains('reviews-filter-item');
      var key = ([13, 32].indexOf(evt.keyCode) > -1);

      if (key && label) {
        evt.preventDefault();

        var filterType = evt.target.getAttribute('for');
        setFilterEnabled(filterType);
      }
    });
  };

  /**
   * @param {Array} reviewList
   * @param {number} page
   * @param {number} pageSize
   * @return {boolean}
   */
  var isNextPageAvailable = function(reviewList, page, pageSize) {
    return page < Math.ceil(reviewList.length / pageSize);
  };

  var setMoreButtonEnabled = function() {
    moreButton.addEventListener('click', function() {
      pageNumber++;
      renderReviews(filteredReviews, pageNumber);
    });
  };


  utils.toggleVisibility(filtersContainer, false);

  loader(REVIEWS_LOAD_URL, function(loadedReviews) {
    reviews = loadedReviews;

    utils.toggleVisibility(filtersContainer, true);

    setFiltersEnabled();

    if (localStorage.lastFilter) {
      DEFAULT_FILTER = localStorage.lastFilter;
    }

    setFilterEnabled(DEFAULT_FILTER);

    setMoreButtonEnabled();
  });
});
