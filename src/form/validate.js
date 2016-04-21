/**
 * @fileoverview Валидация формы отзывов.
 */

'use strict';

define(['../utils'], function(utils) {

  var labelName = document.querySelector('.review-fields-name');
  var labelText = document.querySelector('.review-fields-text');
  var labelBox = document.querySelector('.review-fields');

  /**
   * Проверка формы.
   */
  return function(text, marks, name, buttonSubmit) {
    // Если оценка ниже '3', поле для отзыва становится обязательным.
    text.required = marks.value < 3;

    var validName = name.validity.valid;
    var validText = text.validity.valid;

    // Если поле заполнено, удаляем метку на него.
    utils.toggleVisibility(labelName, !validName);
    utils.toggleVisibility(labelText, !validText);

    // Если заполнены оба обязательных поля, удаляем весь блок с метками.
    utils.toggleVisibility(labelBox, !(validName && validText));

    // Если оба поля заполнены корректно, кнопка для отправки формы становится активной.
    buttonSubmit.disabled = !(validName && validText);
  };
});
