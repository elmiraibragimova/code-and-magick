/**
 * @fileoverview Конструктор, описывающий базовую DOM-компоненту.
 */

'use strict';

define(function() {
  /**
   * @param {Object} data
   * @param {Function} template
   * @constructor
   */
  var DOMComponent = function(data, template) {
    this.data = data;
    this.element = template(data);
  };

  DOMComponent.prototype.insertIntoDOM = function(container) {
    container.appendChild(this.element);
  };

  DOMComponent.prototype.remove = function() {
    this.element.parentNode.removeChild(this.element);
  };

  return DOMComponent;
});
