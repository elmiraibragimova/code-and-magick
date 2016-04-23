'use strict';

define([
  './form/form',
  './reviews/reviews',
  './game',
  './gallery'
], function(form, reviews, game, gallery) {

  var photoContainer = document.querySelector('.photogallery');
  var previews = photoContainer.querySelectorAll('img');

  // Сохраняем значения атрибутов src
  gallery.initPhotos(previews);

  // Открываем галерею при клике на изображение в блоке с картинками
  photoContainer.addEventListener('click', function(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'IMG') {
      var currentPhoto = evt.target.src;
      gallery.openGallery(currentPhoto);
    }
  });

});
