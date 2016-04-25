'use strict';

define([
  './form/form',
  './reviews/reviews',
  './game',
  './gallery'
], function(form, reviews, game, gallery) {

  var photoContainer = document.querySelector('.photogallery');
  var previews = photoContainer.querySelectorAll('img');

  gallery.init(previews);
});
