/**
 * @fileoverview Вспомогательные методы.
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
    },

    /**
     * @param {Function} func
     * @param {number} wait
     * @return {Function}
     */
    throttle: function(func, time) {
      var previousEvoke = 0;

      return function() {
        var now = Date.now();
        if (now - previousEvoke > time) {
          previousEvoke = now;
          return func();
        }
        return null;
      };
    },

    /**
     * @param {HTMLElement} block
     * @return {boolean}
     */
    isVisible: function(block) {
      var bottom = block.getBoundingClientRect().bottom;
      return bottom > 0;
    },

    /**
     * @param {constructor} Child
     * @param {constructor} Ancestor
     */
    inherit: function(Child, Ancestor) {
      var EmptyChain = function() {};

      EmptyChain.prototype = Ancestor.prototype;
      Child.prototype = new EmptyChain();
    }
  };
});
