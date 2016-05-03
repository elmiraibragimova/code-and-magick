'use strict';

define([
  './gallery-constructor'
], function(gallery) {

  var photoContainer = document.querySelector('.photogallery');
  var previews = photoContainer.querySelectorAll('img');

  var getPreviewsSrc = function() {
    var previewsSrc = [];

    for (var i = 0; i < previews.length; i++) {
      previewsSrc.push(previews[i].getAttribute('src'));
    }

    return previewsSrc;
  };

  var previewsSrc = getPreviewsSrc();

  gallery.savePhotos(previewsSrc);

  gallery.onHashChange();

  photoContainer.addEventListener('click', function(evt) {
    evt.preventDefault();

    var target = evt.target;

    if (target.tagName === 'IMG') {
      gallery.setPhotoHash(target.getAttribute('src'));
    }
  });
});
