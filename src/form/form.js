/**
 * @fileoverview Форма отзывов.
 */

'use strict';

define([
  './cookies',
  './validate',
  '../utils'
], function(cookies, validate, utils) {
  var formContainer = document.querySelector('.overlay-container');

  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formButtonSubmit = document.querySelector('button[type=submit]');

  var reviewForm = document.querySelector('.review-form');
  var marks = reviewForm.elements['review-mark'];

  var formName = document.querySelector('#review-name');
  var formText = document.querySelector('#review-text');

  var tipName = document.getElementById('review-tip-name');
  var tipText = document.getElementById('review-tip-text');

  formButtonSubmit.disabled = true;
  formName.required = true;

  var checkFields = function() {
    this.checkValidity();
  };

  var checkReviewForm = function() {
    validate(formText, marks, formName, formButtonSubmit);
    cookies.setReviewFormCookies(marks, formName);
  };

  formName.oninput = checkReviewForm;
  formText.oninput = checkReviewForm;

  Array.prototype.slice.apply(marks).forEach(function(mark) {
    mark.onclick = function() {
      checkReviewForm();
      utils.toggleVisibility(tipName, false);
      utils.toggleVisibility(tipText, false);
    };
  });

  formText.onblur = checkFields;
  formName.onblur = checkFields;

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();

    cookies.setPreviousValues(marks, formName);
    validate(formText, marks, formName, formButtonSubmit);

    utils.toggleVisibility(formContainer, true);
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    utils.toggleVisibility(formContainer, false);
  };

  formText.oninvalid = function() {
    utils.toggleVisibility(tipText, true);
  };

  formName.oninvalid = function() {
    utils.toggleVisibility(tipName, true);
  };

  formText.onfocus = function() {
    utils.toggleVisibility(tipText, false);
  };

  formName.onfocus = function() {
    utils.toggleVisibility(tipName, false);
  };
});
