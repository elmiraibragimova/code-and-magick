/**
 * @fileoverview Загрузка данных.
 */

'use strict';

define(function() {
  var reviewsSection = document.querySelector('.reviews');

  /**
   * @const {number}
   */
  var DATA_LOAD_TIMEOUT = 10000;

  var setReviewsAsFailed = function() {
    reviewsSection.classList.remove('reviews-list-loading');
    reviewsSection.classList.add('reviews-load-failure');
  };

  return function(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.onload = function(evt) {
      reviewsSection.classList.remove('reviews-list-loading');

      try {
        var loadedData = JSON.parse(evt.target.response);
      } catch (exeption) {
        reviewsSection.classList.add('reviews-load-failure');
      }

      callback(loadedData);
    };

    xhr.onerror = setReviewsAsFailed;
    xhr.ontimeout = setReviewsAsFailed;

    xhr.timeout = DATA_LOAD_TIMEOUT;

    reviewsSection.classList.add('reviews-list-loading');

    xhr.send();
  };
});
