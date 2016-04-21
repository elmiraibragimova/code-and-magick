/**
 * @fileoverview Запись и чтение cookies для формы отзывов.
 */

'use strict';

define(['browser-cookies'], function(browserCookies) {
  /**
   * @const {number}
   */
  var MILLISEC_IN_DAY = 1000 * 24 * 60 * 60;

  /**
   * Получение срока хранения `cookies`.
   * return {number} Количество дней, прошедших с последнего дня рождения.
   */
  var getStorageLife = function() {
    var currentDate = new Date();
    var thisYear = currentDate.getFullYear();
    var lastBirthday = new Date(thisYear, 5, 28);

    if (currentDate < lastBirthday) {
      lastBirthday.setFullYear(thisYear - 1);
    }

    return Math.floor((currentDate - lastBirthday) / MILLISEC_IN_DAY);
  };

  return {
    /**
     * Сохранение информации, введенной пользователем.
     */
    setReviewFormCookies: function(marks, formName) {
      var storageLife = getStorageLife();

      browserCookies.set('rating', marks.value, {
        expires: storageLife
      });
      browserCookies.set('name', formName.value, {
        expires: storageLife
      });
    },

    /**
     * Установка значений, введенных пользователем во время предыдущего посещения сайта.
     */
    setPreviousValues: function(marks, formName) {
      marks.value = browserCookies.get('rating') || 3;
      formName.value = browserCookies.get('name') || '';
    }
  };
});
