'use strict';

define([
  './galleryConstructor'
], function(gallery) {

  var photoContainer = document.querySelector('.photogallery');
  var previews = photoContainer.querySelectorAll('img');

  var getPreviewsSrc = function() {
    var previewsSrc = [];

    for (var i = 0; i < previews.length; i++) {
      previewsSrc.push(previews[i].src);
      previews[i].dataset.number = [i];
    }

    return previewsSrc;
  };

  var previewsSrc = getPreviewsSrc();

  gallery.savePhotos(previewsSrc);

  photoContainer.addEventListener('click', function(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'IMG') {
      var currentPhoto = evt.target.dataset.number;
      gallery.openGallery(currentPhoto);
    }
  });
});
