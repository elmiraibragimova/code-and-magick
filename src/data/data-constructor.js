/**
 * @fileoverview Конструктор для хранения данных отзыва.
 */

'use strict';

define(function() {
  /**
   * @param {Object} data
   * @constructor
   */
  var Data = function(data) {
    this.data = data;
  };

  Data.prototype.getAuthorName = function() {
    return this.data.author.name;
  };

  Data.prototype.getAuthorPicture = function() {
    return this.data.author.picture;
  };

  Data.prototype.getDate = function() {
    return this.data.date;
  };

  Data.prototype.getRating = function() {
    return this.data.rating;
  };

  Data.prototype.getDescription = function() {
    return this.data.description;
  };

  Data.prototype.getReviewUsefulness = function() {
    return this.data.review_usefulness;
  };

  Data.prototype.increaseUsefulness = function() {
    this.data.review_usefulness += 1;
  };

  Data.prototype.decreaseUsefulness = function() {
    this.data.review_usefulness -= 1;
  };

  return Data;
});
