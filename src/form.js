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
  }

  var showTip = function() {
    toggleVisibility(tipName, formName.validity.valid);
    toggleVisibility(tipText, formText.validity.valid);
  }

  /**
   * @param {HTMLElement} elem
   * @param {boolean} isVisible
   */
  var toggleVisibility = function(elem, isVisible) {
    elem.classList[isVisible ? 'add' : 'remove']('invisible');
  }

  /**
   * Удаление подсказок и меток на необязательные и правильно заполненные поля.
   */
  var removeLabels = function() {
    [labelName, labelText, labelBox].forEach(function(label) {
      toggleVisibility(label, false);
    });

    toggleVisibility(labelName, formName.validity.valid);
    toggleVisibility(labelText, formText.validity.valid);
    toggleVisibility(labelBox, formText.validity.valid && formName.validity.valid);

    // toggleVisibility(tipName, true);
    // toggleVisibility(tipText, true);
  };

  /**
   * Проверка формы.
   */
  var validate = function() {
    // Если оценка ниже '3', поле для отзыва становится обязательным.
    formText.required = marks.value < 3;

    // Удаляем метки на корректно заполненные поля.
    removeLabels();

    // Если оба поля заполнены корректно, кнопка для отправки формы становится активной.
    formButtonSubmit.disabled = !(formText.validity.valid && formName.validity.valid);
  };

  formButtonSubmit.disabled = true;
  formName.required = true;

  removeLabels();

  formName.oninput = validate;
  formText.oninput = validate;
  Array.prototype.slice.apply(marks).forEach(function(mark) {
    mark.onclick = validate;
  });

  formText.onblur = checkFields;
  formName.onblur = checkFields;
  formName.oninvalid = showTip;
  formText.oninvalid = showTip;

  formText.onkeyup = function() {
    toggleVisibility(tipText, true);
  };

  formName.onkeyup = function() {
    toggleVisibility(tipName, true);
  };
})();
