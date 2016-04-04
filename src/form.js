'use strict';

(function() {
  var browserCookies = require('browser-cookies');

  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

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

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
   * Получение срока хранения `cookies`.
   * return {number} Количество дней, прошедших с последнего дня рождения.
   */
  var getStorageLife = function() {
    var MILLISEC_IN_DAY = 1000 * 24 * 60 * 60;

    var currentDate = new Date();
    var thisYear = currentDate.getFullYear();
    var lastBirthday = new Date(thisYear, 5, 28);

    if (currentDate < lastBirthday) {
      lastBirthday.setFullYear(thisYear - 1);
    }

    return Math.floor((currentDate - lastBirthday) / MILLISEC_IN_DAY);
  };

  /**
   * Сохранение информации, введенной пользователем.
   */
  var setReviewFormCookies = function() {
    var storageLife = getStorageLife();

    browserCookies.set('rating', marks.value, {
      expires: storageLife
    });
    browserCookies.set('name', formName.value, {
      expires: storageLife
    });
  };

  /**
   * Установка значений, введенных пользователем во время предыдущего посещения сайта.
   */
  var setPreviousValues = function() {
    marks.value = browserCookies.get('rating') || 3;
    formName.value = browserCookies.get('name') || '';
  };

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
    // Если оценка ниже '3', поле для отзыва становится обязательным.
    formText.required = marks.value < 3;

    var validName = formName.validity.valid;
    var validText = formText.validity.valid;

    // Если поле заполнено, удаляем метку на него.
    toggleVisibility(labelName, !validName);
    toggleVisibility(labelText, !validText);

    // Если заполнены оба обязательных поля, удаляем весь блок с метками.
    toggleVisibility(labelBox, !(validName && validText));

    // Если оба поля заполнены корректно, кнопка для отправки формы становится активной.
    formButtonSubmit.disabled = !(validName && validText);
  };

  var checkReviewForm = function() {
    validateReviewForm();
    setReviewFormCookies();
  };

  formButtonSubmit.disabled = true;
  formName.required = true;

  setPreviousValues();
  validateReviewForm();

  formName.oninput = checkReviewForm;
  formText.oninput = checkReviewForm;

  Array.prototype.slice.apply(marks).forEach(function(mark) {
    mark.onclick = function() {
      checkReviewForm();
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
