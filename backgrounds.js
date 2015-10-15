(function(win, doc) {
  'use strict';
  var $ = doc.querySelector.bind(doc);

  function initBackgrounds() {
    var artist = doc.createElement('h4');
    artist.classList.add('artist');
    artist.classList.add('center');
    $('.main-container').appendChild(artist);

    // Set up background changing
    setInterval(changeImage, 60000);
    // For whaever reason, I need to do this twice.
    changeImage();
    changeImage();
  }

  /**
   * Set the background to a random image
   */
  function changeImage(bgIndex) {
    var $ = doc.querySelector.bind(doc);
    var bgElement = $('.bg');
    var body = $('body');

    bgElement.classList.add('fadein');
    bgElement.style.opacity = ''; // Manually specify opacity

    if (typeof bgIndex === 'number' && bgIndex <= data_images.length)
      nextBgIndex = bgIndex;

    if (data_images[nextBgIndex].artist)
      $('.artist').innerHTML = 'Artist: ' + data_images[nextBgIndex].artist;
    else {
      $('.artist').innerHTML = '';
    }
    // Start the crossfade after 100ms
    setTimeout(function() {
      body.style.backgroundImage = bgElement.style.backgroundImage;

      nextBgIndex = nextImageIndex();
      var image = data_images[nextBgIndex];
      if (image.artist)
        bgElement.style.backgroundImage = 'url(img/' + image.src + ')';
      else
        bgElement.style.backgroundImage = 'url(img/' + image + ')';
      bgElement.classList.remove('fadein');
      bgElement.style.opacity = 0; // Remove overly-specific rule to allow animation to work
    }, 1000);

    return bgIndex;
  }

  /**
   * Return the source for a random image
   */
  function nextImageIndex() {
    return Math.floor(Math.random() * data_images.length);
  }

  var nextBgIndex = 0;

  // Long list of images
  // 'img/' gets added on automatically
  var data_images = [
    'AlpineFly.png',
    'Becron5.png',
    'BlueSpace.png',
    'Creature.png',
    'Diplo.png', {
      src: 'fan1.jpg',
      artist: '/u/Battlefront528'
    }, {
      src: 'fan2.jpg',
      artist: '/u/NoMansSciFi (Combined screenshots)'
    }, {
      src: 'fan3.jpg',
      artist: '/u/DurMan667'
    }, {
      src: 'fan4.jpg',
      artist: '/u/PepsiTetraHepta'
    }, {
      src: 'fan5.jpg',
      artist: '/u/secret_online'
    }, {
      src: 'fan6.jpg',
      artist: '/u/ChrisDNorris'
    }, {
      src: 'fan7.jpg',
      artist: '/u/betrion'
    }, {
      src: 'fan8.jpg',
      artist: '/u/phobox91'
    },
    'Fleet.png',
    'GlattrecSystem.png',
    'IGN1.jpg',
    'IGN2.jpg',
    'IGN3.png',
    'IGN4.jpg',
    'IGN5.jpg',
    'IGN6.jpg',
    'IGN7.jpg',
    'IGNPlanet1.jpg',
    'IGNPlanet2.jpg',
    'IGNPlanet3.jpg',
    'NewEridu.png',
    'NightDrone.png',
    'NoMansSky_GalacticMap.png',
    'NoMansSky_Monolith.png',
    'NoMansSky_SpaceStationTube.png',
    'OvalWalker.png',
    'RedSpace.png',
    'SunsetBots.png',
    'station1.jpg',
    'station2.jpg',
    'station3.jpg',
    'station4.png',
    'logo.png'
  ];

  win.addEventListener('DOMContentLoaded', function() {
    initBackgrounds();
  });
  if (doc.readyState !== 'loading')
    initBackgrounds();

})(window, document);
