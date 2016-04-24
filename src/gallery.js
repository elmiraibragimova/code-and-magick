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
   * @type {number}
   */
  var currentPhotoIndex;

  /**
   * @enum {number}
   */
  var KeyCode = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * @param {number} currentIndex
   */
  var _showCurrentPhoto = function() {
    var currentImage = photoBox.querySelector('img');
    if (currentImage) {
      photoBox.removeChild(currentImage);
      currentImage = null;
    }

    var image = new Image();
    image.onload = function() {
      photoBox.appendChild(image);
    };

    image.src = photos[currentPhotoIndex];

    var photoNumber = currentPhotoIndex + 1;
    currentNumber.innerHTML = photoNumber + '';

    utils.toggleVisibility(buttonNext, photoNumber < photos.length);
    utils.toggleVisibility(buttonPrev, photoNumber > 1);
  };

  var _selectPrev = function() {
    if (currentPhotoIndex > 0 ) {
      currentPhotoIndex -= 1;
      _showCurrentPhoto();
    }
  };

  var _selectNext = function() {
    if (currentPhotoIndex < photos.length - 1) {
      currentPhotoIndex += 1;
      _showCurrentPhoto();
    }
  };

  var _closeGallery = function() {
    utils.toggleVisibility(gallery, false);
    _removeGalleryControls();
  };

  var _onCloseClick = function() {
    _closeGallery();
  };

  var _onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case KeyCode.ESC:
        _closeGallery();
        break;
      case KeyCode.LEFT:
        _selectPrev();
        break;
      case KeyCode.RIGHT:
        _selectNext();
        break;
    }
  };

  var _initGalleryControls = function() {
    document.addEventListener('keydown', _onDocumentKeyDown);
    buttonClose.addEventListener('click', _onCloseClick);
    buttonNext.addEventListener('click', _selectNext);
    buttonPrev.addEventListener('click', _selectPrev);
  };

  var _removeGalleryControls = function() {
    document.removeEventListener('keydown', _onDocumentKeyDown);
    buttonClose.removeEventListener('click', _onCloseClick);
    buttonNext.removeEventListener('click', _selectNext);
    buttonPrev.removeEventListener('click', _selectPrev);
  };

  return {
    /**
     * @param {string} currentPhoto
     */
    openGallery: function(currentIndex) {
      totalNumber.innerHTML = photos.length + '';

      utils.toggleVisibility(gallery, true);
      _initGalleryControls();

      currentPhotoIndex = parseInt(currentIndex, 10);
      _showCurrentPhoto();
    },

    /**
     * @param {NodeList} previews
     */
    initPhotos: function(previews) {
      for (var i = 0; i < previews.length; i++) {
        photos.push(previews[i].src);
        previews[i].dataset.number = i;
      }
    }
  };
});
