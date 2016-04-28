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
   * @type {number}
   */
  var currentPhotoIndex;

  /**
   * @type {HTMLImageElement}
   */
  var photo;

  /**
   * @enum {number}
   */
  var KeyCode = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var Gallery = function() {
    /**
     * @type {Array.<string>}
     */
    this.photos = [];

    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
    this._selectNext = this._selectNext.bind(this);
    this._selectPrev = this._selectPrev.bind(this);
  };

  Gallery.prototype = {
    _showCurrentPhoto: function() {
      photo.src = this.photos[currentPhotoIndex];

      var photoNumber = currentPhotoIndex + 1;
      currentNumber.innerHTML = photoNumber + '';

      utils.toggleVisibility(buttonNext, currentPhotoIndex < this.photos.length - 1);
      utils.toggleVisibility(buttonPrev, currentPhotoIndex > 0);
    },

    _selectPrev: function() {
      if (currentPhotoIndex > 0 ) {
        currentPhotoIndex -= 1;
        this._showCurrentPhoto();
      }
    },

    _selectNext: function() {
      if (currentPhotoIndex < this.photos.length - 1) {
        currentPhotoIndex += 1;
        this._showCurrentPhoto();
      }
    },

    _closeGallery: function() {
      utils.toggleVisibility(gallery, false);
      this._removeGalleryControls();
    },

    _onCloseClick: function() {
      this._closeGallery();
    },

    _onDocumentKeyDown: function(evt) {
      switch (evt.keyCode) {
        case KeyCode.ESC:
          this._closeGallery();
          break;
        case KeyCode.LEFT:
          this._selectPrev();
          break;
        case KeyCode.RIGHT:
          this._selectNext();
          break;
      }
    },

    _setGalleryControls: function() {
      document.addEventListener('keydown', this._onDocumentKeyDown);
      buttonClose.addEventListener('click', this._onCloseClick);
      buttonNext.addEventListener('click', this._selectNext);
      buttonPrev.addEventListener('click', this._selectPrev);
    },

    _removeGalleryControls: function() {
      document.removeEventListener('keydown', this._onDocumentKeyDown);
      buttonClose.removeEventListener('click', this._onCloseClick);
      buttonNext.removeEventListener('click', this._selectNext);
      buttonPrev.removeEventListener('click', this._selectPrev);
    },

    openGallery: function(currentIndex) {
      if (!photoBox.querySelector('img')) {
        photo = photoBox.appendChild(new Image());
      }

      totalNumber.innerHTML = this.photos.length + '';

      utils.toggleVisibility(gallery, true);
      this._setGalleryControls();

      currentPhotoIndex = parseInt(currentIndex, 10);
      this._showCurrentPhoto();
    },

    savePhotos: function(previews) {
      this.photos = previews.slice();
    }
  };

  return new Gallery();
});
