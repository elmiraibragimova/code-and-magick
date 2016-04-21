/**
 * @fileoverview Фильтрация списка.
 */

'use strict';

define([
  './filter-type'
], function(Filter) {
  /**
   * @const {number}
   */
  var TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

  /**
   * Фильтр для отзывов, написанных за последние две недели.
   * Отзывы отрисовываются по убыванию даты.
   * @param {Array.<Object>} reviewList
   */
  var getRecentReviews = function(reviewList) {
    var currentDate = new Date();
    var dayBeforeTwoWeeks = Math.floor(currentDate.valueOf() - TWO_WEEKS);

    reviewList = reviewList.filter(function(review) {
      var reviewDate = new Date(review.date).valueOf();

      return reviewDate >= dayBeforeTwoWeeks;
    });

    reviewList.sort(function(a, b) {
      var firstDate = new Date(a.date);
      var secondDate = new Date(b.date);

      return secondDate - firstDate;
    });

    return reviewList;
  };

  /**
   * Фильтр для хороших отзывов (выводятся по убыванию рейтинга).
   * @param {Array.<Object>} reviewList
   */
  var getGoodReviews = function(reviewList) {
    reviewList = reviewList.filter(function(review) {
      return review.rating >= 3;
    });

    reviewList.sort(function(a, b) {
      return b.rating - a.rating;
    });

    return reviewList;
  };

  /**
   * Фильтр для плохих отзывов (выводятся по возрастанию рейтинга).
   * @param {Array.<Object>} reviewList
   */
  var getBadReviews = function(reviewList) {
    reviewList = reviewList.filter(function(review) {
      return review.rating <= 2;
    });

    reviewList.sort(function(a, b) {
      return a.rating - b.rating;
    });

    return reviewList;
  };

  /**
   * Фильтр для популярных отзывов (выводятся по убыванию оценки отзыва).
   * @param {Array.<Object>} reviewList
   */
  var getPopularReviews = function(reviewList) {
    reviewList.sort(function(a, b) {
      return b.review_usefulness - a.review_usefulness;
    });
    return reviewList;
  };

  /**
   * Фильтрация отзывов.
   * @param {Array.<Object>} reviewList
   * @param {string} filter
   */
  return function(reviewList, filter) {
    var reviewsToFilter = reviewList.slice(0);

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
});
