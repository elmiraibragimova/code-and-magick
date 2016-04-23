/**
 * @fileoverview Фотогалерея.
 */

'use strict';

define([
  './utils'
], function(utils) {
  var gallery = document.querySelector('.overlay-gallery');

  var buttonClose = gallery.querySelector('.overlay-gallery-close');
  var buttonPrev = gallery.querySelector('.overlay-gallery-control-left');
  var buttonNext = gallery.querySelector('.overlay-gallery-control-right');

  var photoBox = gallery.querySelector('.overlay-gallery-preview');
  var currentNumber = gallery.querySelector('.preview-number-current');
  var totalNumber = gallery.querySelector('.preview-number-total');

  /**
   * @type {Array.<string>}
   */
  var photos = [];

  /**
   * @param {number} currentIndex
   */
  var _showPhoto = function(currentIndex) {
    var currentImage = photoBox.querySelector('img');
    if (currentImage) {
      photoBox.removeChild(currentImage);
      currentImage = null;
    }

    var image = new Image();
    image.onload = function() {
      photoBox.appendChild(image);
    };

    image.src = photos[currentIndex];

    var photoNumber = currentIndex + 1;
    currentNumber.innerHTML = photoNumber + '';

    utils.toggleVisibility(buttonNext, photoNumber < photos.length);
    utils.toggleVisibility(buttonPrev, photoNumber > 1);
  };

  var _selectPrev = function() {
    var currentIndex = _getCurrentIndex();

    if (currentIndex > 0 ) {
      currentIndex--;
      _showPhoto(currentIndex);
    }
  };

  var _selectNext = function() {
    var currentIndex = _getCurrentIndex();

    if (currentIndex < photos.length - 1) {
      currentIndex++;
      _showPhoto(currentIndex);
    }
  };

  var _getCurrentIndex = function() {
    var currentPhoto = photoBox.querySelector('img');
    var currentSrc = currentPhoto.src;

    return photos.indexOf(currentSrc);
  };

  var _closeGallery = function() {
    utils.toggleVisibility(gallery, false);
    _removeGalleryControls();
  };

  var _onCloseClick = function() {
    _closeGallery();
  };

  var _onCloseEsc = function(evt) {
    if (evt.keyCode === 27) {
      _closeGallery();
    }
  };

  var _initGalleryControls = function() {
    window.addEventListener('keydown', _onCloseEsc);
    buttonClose.addEventListener('click', _onCloseClick);
    buttonNext.addEventListener('click', _selectNext);
    buttonPrev.addEventListener('click', _selectPrev);
  };

  var _removeGalleryControls = function() {
    window.removeEventListener('keydown', _onCloseEsc);
    buttonClose.removeEventListener('click', _onCloseClick);
    buttonNext.removeEventListener('click', _selectNext);
    buttonPrev.removeEventListener('click', _selectPrev);
  };

  return {
    /**
     * @param {string} currentPhoto
     */
    openGallery: function(currentPhoto) {
      var currentIndex = photos.indexOf(currentPhoto);
      _showPhoto(currentIndex);

      totalNumber.innerHTML = photos.length + '';

      utils.toggleVisibility(gallery, true);
      _initGalleryControls();
    },

    /**
     * @param {NodeList} previews
     */
    initPhotos: function(previews) {
      for (var i = 0; i < previews.length; i++) {
        photos.push(previews[i].src);
      }
    }
  };

});
