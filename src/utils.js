/**
 * @fileoverview Вспомогательные методы
 */

'use strict';

define(function() {
  return {
    /**
     * @param {HTMLElement} elem
     * @param {boolean} isVisible
     */
    toggleVisibility: function(elem, isVisible) {
      elem.classList[(!isVisible) ? 'add' : 'remove']('invisible');
    }
  };
});
