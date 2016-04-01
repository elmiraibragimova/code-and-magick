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
  var marksValue;

  // Ссылки на поля.
  var fieldsName = document.querySelector('.review-fields-name');
  var fieldsText = document.querySelector('.review-fields-text');
  var formControl = document.querySelector('.review-fields');

  // Прячем ссылку на необязательное поле.
  fieldsText.classList.add('invisible');

  formButtonSubmit.disabled = true;
  formName.required = true;

  /**
   * Удаление ссылок на обязательные поля.
   */
  var removeLabels = function() {
    // Делаем видимыми все ссылки.
    // Ссылки на корректно заполненные поля скроем после проверки полей.
    fieldsText.classList.remove('invisible');
    fieldsName.classList.remove('invisible');
    formControl.classList.remove('invisible');

    // Проверяем поля и удаляем ссылки на заполненные правильно.
    if (formName.validity.valid) {
      fieldsName.classList.add('invisible');
    }

    if (formText.validity.valid) {
      fieldsText.classList.add('invisible');
    }

    if (!formButtonSubmit.disabled) {
      formControl.classList.add('invisible');
    }
  };

  /**
   * Проверка формы.
   */
  var validate = function() {
    // Получаем оценку - значение радиокнопки.
    marksValue = marks.value;

    // Если оценка ниже '3', поле для отзыва становится обязательным.
    // Второе условие необходимо для того, чтобы поле реагировало на каждое последующее
    // изменение оценки, а не только на первое.
    if (marksValue < 3) {
      formText.required = true;
    } else {
      formText.required = false;
    }

    // Если оба поля заполнены корректно,
    // кнопка для отправки формы становится активной.
    formButtonSubmit.disabled = !(formText.validity.valid && formName.validity.valid);

    removeLabels();
  };

  formName.oninput = validate;
  formText.oninput = validate;
  Array.prototype.slice.apply(marks).forEach(function(mark) {
    mark.onclick = validate;
  });


  // Проверяем, заполнено ли обязательное поле.
  formText.onblur = function() {
    formText.checkValidity();
  };

  formName.onblur = function() {
    formName.checkValidity();
  };

  // Если поля заполнены неправильно, появляется сообщение с подсказкой.
  formName.oninvalid = function(event) {
    var target = event.target.nextSibling.nextSibling;
    target.classList.remove('invisible');
  };

  formText.oninvalid = function() {
    var target = event.target.nextSibling.nextSibling;
    target.classList.remove('invisible');
  };

})();
