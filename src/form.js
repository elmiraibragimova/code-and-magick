'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var reviewForm = document.querySelector('.review-form');
  var marks = reviewForm.elements['review-mark'];

  var formButtonSubmit = document.querySelector('button[type=submit]');
  var formName = document.querySelector('#review-name');
  var formText = document.querySelector('#review-text');

  var labelName = document.querySelector('.review-fields-name');
  var labelText = document.querySelector('.review-fields-text');
  var labelBox = document.querySelector('.review-fields');

  var tipName = document.getElementById('review-tip-name');
  var tipText = document.getElementById('review-tip-text');


  var checkFields = function() {
    this.checkValidity();
  };

  /**
   * @param {HTMLElement} elem
   * @param {boolean} isVisible
   */
  var toggleVisibility = function(elem, isVisible) {
    elem.classList[(!isVisible) ? 'add' : 'remove']('invisible');
  };

  /**
   * Проверка формы.
   */
  var validateReviewForm = function() {
    var validName = formName.validity.valid;
    var validText = formText.validity.valid;

    // Если поле заполнено, удаляем метку на него.
    toggleVisibility(labelName, !validName);
    toggleVisibility(labelText, !validText);

    // Если заполнены оба обязательных поля, удаляем весь блок с метками.
    toggleVisibility(labelBox,  !(validName && validText));

    // Если оценка ниже '3', поле для отзыва становится обязательным.
    formText.required = marks.value < 3;

    // Если оба поля заполнены корректно, кнопка для отправки формы становится активной.
    formButtonSubmit.disabled = !(validName && validText);
  };

  formButtonSubmit.disabled = true;
  formName.required = true;

  validateReviewForm();

  formName.oninput = validateReviewForm;
  formText.oninput = validateReviewForm;

  Array.prototype.slice.apply(marks).forEach(function(mark) {
    mark.onclick = function() {
      validateReviewForm();
      toggleVisibility(tipName, false);
      toggleVisibility(tipText, false);
    };
  });

  formText.onblur = checkFields;
  formName.onblur = checkFields;

  formText.oninvalid = function() {
    toggleVisibility(tipText, true);
  };

  formName.oninvalid = function() {
    toggleVisibility(tipName, true);
  };

  formText.onfocus = function() {
    toggleVisibility(tipText, false);
  };

  formName.onfocus = function() {
    toggleVisibility(tipName, false);
  };
})();
