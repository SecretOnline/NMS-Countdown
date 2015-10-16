(function(win, doc) {
  'use strict';
  var $ = doc.querySelector.bind(doc);

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

  function initBackgrounds() {
    changeImage();
    changeNextImage();

    setInterval(function() {
      doImageFadeIn();
    }, 60000);
  }

  /**
   * Set the background to a random image
   */
  function changeImage() {
    var img = data_images[nextBgIndex];
    if (img.src)
      $('body').style.backgroundImage = 'url(img/' + img.src + ')';
    else
      $('body').style.backgroundImage = 'url(img/' + img + ')';

    var artist = $('.artist');
    if (!artist) {
      artist = doc.createElement('h4');
      artist.classList.add('artist');
      artist.classList.add('center');
      $('.main-container').appendChild(artist);
    }
    if (img.artist)
      artist.innerHTML = 'Artist: ' + img.artist;
    else
      artist.innerHTML = '';
  }

  function changeNextImage() {
    nextBgIndex = Math.floor(Math.random() * data_images.length);

    var img = data_images[nextBgIndex];
    if (img.src)
      $('.bg').style.backgroundImage = 'url(img/' + img.src + ')';
    else
      $('.bg').style.backgroundImage = 'url(img/' + img + ')';
  }

  function doImageFadeIn(index) {
    if (index)
      nextBgIndex = index;

    var bg = $('.bg');
    var body = $('body');
    bg.style.opacity = '';
    bg.classList.add('fadein');


    setTimeout(function() {
      bg.style.opacity = 0;
      bg.classList.remove('fadein');
      changeImage();
      changeNextImage();

    }, 1000);
  }

  var nextBgIndex = Math.floor(Math.random() * data_images.length);

  if (doc.readyState !== 'loading')
    initBackgrounds();
  else
    win.addEventListener('load', function() {
      initBackgrounds();
    });

})(window, document);
