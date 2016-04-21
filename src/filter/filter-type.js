/**
 * @fileoverview Список доступных видов фильтрации.
 */

'use strict';

define(function() {
  /**
   * @enum {string}
   */
  return {
    'ALL': 'reviews-all',
    'RECENT': 'reviews-recent',
    'GOOD': 'reviews-good',
    'BAD': 'reviews-bad',
    'POPULAR': 'reviews-popular'
  };
});
