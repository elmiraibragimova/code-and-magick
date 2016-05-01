/**
 * @fileoverview Фотогалерея.
 */

'use strict';

define([
  '../utils'
], function(utils) {
  var gallery = document.querySelector('.overlay-gallery');

  var buttonClose = gallery.querySelector('.overlay-gallery-close');
  var buttonPrev = gallery.querySelector('.overlay-gallery-control-left');
  var buttonNext = gallery.querySelector('.overlay-gallery-control-right');

  var photoBox = gallery.querySelector('.overlay-gallery-preview');
  var currentNumber = gallery.querySelector('.preview-number-current');
  var totalNumber = gallery.querySelector('.preview-number-total');

  /**
   * @const {RegExp}
   */
  var PATTERN = /#photo\/(\S+)/;

  /**
   * @type {number}
   */
  var currentIndex;

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
    this._clearHash = this._clearHash.bind(this);
    this._selectNext = this._selectNext.bind(this);
    this._selectPrev = this._selectPrev.bind(this);

    window.addEventListener('hashchange', this.onHashChange.bind(this));
  };

  Gallery.prototype = {
    _show: function() {
      photo.src = this.photos[currentIndex];

      var photoNumber = currentIndex + 1;
      currentNumber.innerHTML = photoNumber + '';

      utils.toggleVisibility(buttonNext, currentIndex < this.photos.length - 1);
      utils.toggleVisibility(buttonPrev, currentIndex > 0);
    },

    _selectPrev: function() {
      if (currentIndex > 0 ) {
        currentIndex -= 1;
        this.setPhotoHash(this.photos[currentIndex]);
      }
    },

    _selectNext: function() {
      if (currentIndex < this.photos.length - 1) {
        currentIndex += 1;
        this.setPhotoHash(this.photos[currentIndex]);
      }
    },

    _closeGallery: function() {
      utils.toggleVisibility(gallery, false);
      this._removeGalleryControls();
    },

    _onDocumentKeyDown: function(evt) {
      switch (evt.keyCode) {
        case KeyCode.ESC:
          this._clearHash();
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
      buttonClose.addEventListener('click', this._clearHash);
      buttonNext.addEventListener('click', this._selectNext);
      buttonPrev.addEventListener('click', this._selectPrev);
    },

    _removeGalleryControls: function() {
      document.removeEventListener('keydown', this._onDocumentKeyDown);
      buttonClose.removeEventListener('click', this._clearHash);
      buttonNext.removeEventListener('click', this._selectNext);
      buttonPrev.removeEventListener('click', this._selectPrev);
    },

    setPhotoHash: function(src) {
      location.hash = '#photo/' + src;
    },

    _clearHash: function() {
      location.hash = '';
    },

    onHashChange: function() {
      var result = location.hash.match(PATTERN);

      if (result) {
        this.openGallery(result[1]);
      } else {
        this._closeGallery();
      }
    },

    openGallery: function(currentPhoto) {
      if (!photoBox.querySelector('img')) {
        photo = photoBox.appendChild(new Image());
      }

      if (isNaN(currentPhoto)) {
        currentIndex = this.photos.indexOf(currentPhoto);
      } else {
        currentIndex = parseInt(currentPhoto, 10);
      }

      totalNumber.innerHTML = this.photos.length + '';

      utils.toggleVisibility(gallery, true);
      this._setGalleryControls();

      this._show();
    },

    savePhotos: function(previews) {
      this.photos = previews.slice();
    }
  };

  return new Gallery();
});
