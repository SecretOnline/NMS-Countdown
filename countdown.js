/**
 * Get everything ready
 */
function initPage() {
  var $ = document.querySelector.bind(document);
  var body = $('body');
  var main = $('main');

  function toggleIrc() {
    body.classList.toggle('open');
  }

  // Add fonts in later, to prevent render blocking
  var currStyle = $('link[rel="stylesheet"]');
  var geoSans = document.createElement('link');
  geoSans.rel = 'stylesheet';
  geoSans.href = 'fonts.css';
  geoSans.type = 'text/css';
  currStyle.parentNode.insertBefore(geoSans, currStyle);
  var robotoMono = document.createElement('link');
  robotoMono.rel = 'stylesheet';
  robotoMono.href = 'http://fonts.googleapis.com/css?family=Roboto+Mono:300';
  robotoMono.type = 'text/css';
  currStyle.parentNode.insertBefore(robotoMono, currStyle);
  var raleway = document.createElement('link');
  raleway.rel = 'stylesheet';
  raleway.href = 'http://fonts.googleapis.com/css?family=Raleway';
  raleway.type = 'text/css';
  currStyle.parentNode.insertBefore(raleway, currStyle);

  // Set up button
  var ircButton = $('.ircButton');
  ircButton.addEventListener('click', toggleIrc);

  // Load in images, and get them changing every 60 seconds
  preloadImages();
  setInterval(changeImage, 60000);
  changeImage();

  // Set up countdowns
  createCountdowns();
  var artist = document.createElement('h4');
  artist.classList.add('artist');
  artist.classList.add('center');
  $('.main-container').appendChild(artist);
}

/**
 * Loads all background images, and puts
 * them in an array for future use
 */
function preloadImages() {
  data_images.forEach(function(image) {
    var newImg = document.createElement('img');
    newImg.src = 'img/' + image;
    images.push(newImg);
  });
}

/**
 * Set the background to a random image
 */
function changeImage(bgIndex) {
  var $ = document.querySelector.bind(document);
  var bgElement = $('.bg');
  var body = $('body');
  bgElement.classList.remove('fadeout');
  bgElement.style.opacity = 1; // Manually specify opacity
  bgElement.style.backgroundImage = body.style.backgroundImage;

  if (typeof bgIndex === 'undefined' || bgIndex >= data_images.length)
    bgIndex = nextImageIndex();

  var image = data_images[bgIndex];
  if (image.artist)
    body.style.backgroundImage = 'url(img/' + image.src + ')';
  else
    body.style.backgroundImage = 'url(img/' + image + ')';
  // Start the crossfade after 100ms
  setTimeout(function() {
    if (image.artist)
      $('.artist').innerHTML = 'Artist: ' + image.artist;
    else {
      $('.artist').innerHTML = '';
    }
    bgElement.classList.add('fadeout');
    bgElement.style.opacity = ''; // Remove overly-specific rule to allow animation to work
  }, 100);

  return bgIndex;
}

/**
 * Return the source for a random image
 */
function nextImageIndex() {
  return Math.floor(Math.random() * data_images.length);
}

/**
 * Initialise all of the countdowns
 */
function createCountdowns() {
  var mainContainer = document.querySelector('.main-container');
  mainContainer.innerHTML = '';

  for (var i = 0; i < countdowns.length; i++) {
    // Create elements
    var container = document.createElement('div');
    var titleElement = document.createElement(i === 0 ? 'h1' : 'h2'); // First countdown is bigger
    var countElement = document.createElement(i === 0 ? 'h2' : 'h3');
    // Set up elements
    titleElement.innerHTML = countdowns[i].title;
    container.classList.add('countdown-container');
    container.classList.add('center');
    titleElement.classList.add('center');
    countElement.classList.add('countdown');
    countElement.classList.add('center');
    countElement.innerHTML = '<span class="d"></span>:<span class="h"></span>:<span class="m"></span>:<span class="s"></span>:<span class="ms"></span>';
    container.appendChild(titleElement);
    container.appendChild(countElement);
    // If there are countdowns, find which one to use
    if (countdowns[i].times && countdowns[i].times.length) {
      for (var j = 0; j < countdowns[i].times.length; j++) {
        if (new Date(countdowns[i].times[j]).getTime() - Date.now() > 0) {
          countdowns[i].currTime = j;
          break;
        }
      }
      // If a countdown was set, add to main container
      if (typeof countdowns[i].currTime !== 'undefined') {
        mainContainer.appendChild(container);
        countdowns[i].container = container;
      } else {
        // Show the finished text
        countElement.innerHTML = countdowns[i].endText;
        mainContainer.appendChild(container);
      }
    } else {
      // No countdowns were specified
      // If there is placeholder text, display it
      if (countdowns[i].noText) {
        countElement.innerHTML = countdowns[i].noText;
        mainContainer.appendChild(container);
      }
    }
  }

  interval = setInterval(function() {
    countdowns.forEach(function(countdown) {
      if (typeof countdown.currTime !== 'undefined')
        updateCountdown(countdown);
    });
  }, 7);
}

function updateCountdown(countdown) {
  var timeDiff = new Date(countdown.times[countdown.currTime]).getTime() - Date.now(); // What a mouthful.
  var cd = countdown.container.querySelector('.countdown');
  // Basically, for each interval (starting at ms), check if it overflowed.
  // If so, update the next interval.
  // Format numbers into a 2 (or 3) character string, and display.
  if (timeDiff > 0) {
    var ms = Math.floor(timeDiff % 1000);
    if (!countdown.oldMs || cs < countdown.oldMs) {
      var s = Math.floor((timeDiff % 60000) / 1000);
      if (!countdown.oldS || s < countdown.oldS) {
        var m = Math.floor((timeDiff % 3600000) / 60000);
        if (!countdown.oldM || m < countdown.oldM) {
          var h = Math.floor((timeDiff % 86400000) / 3600000);
          if (!countdown.oldH || h < countdown.oldH) {
            var d = Math.floor(timeDiff / 86400000).toString();
            if (d < 10)
              d = '0' + d;
            cd.querySelector('.d').innerHTML = d;
          }
          countdown.oldH = h;
          h = h.toString();
          if (h < 10)
            h = '0' + h;
          cd.querySelector('.h').innerHTML = h;
        }
        countdown.oldM = m;
        m = m.toString();
        if (m < 10)
          m = '0' + m;
        cd.querySelector('.m').innerHTML = m;
      }
      countdown.oldS = s;
      s = s.toString();
      if (s < 10)
        s = '0' + s;
      cd.querySelector('.s').innerHTML = s;
    }
    countdown.oldMS = ms;
    ms = ms.toString();
    if (ms < 100)
      ms = '0' + ms;
    if (ms < 10)
      ms = '0' + ms;
    cd.querySelector('.ms').innerHTML = ms;
  } else {
    // Countdown finished. Show end text for a minute
    cd.innerHTML = countdown.endText;
    countdown.oldTime = countdown.currTime;
    countdown.currTime = null;
    window.clearInterval(countdown.interval);
    setTimeout(function() {
      if (countdown.oldTime + 1 < countdown.times.length) {
        countdown.currTime = countdown.oldTime + 1;
        cd.innerHTML = '<span class="d"></span>:<span class="h"></span>:<span class="m"></span>:<span class="s"></span>:<span class="ms"></span>';
      }
    }, 60000);
  }
}

/**
 * Mainly to stop browser throwing several hundred errors every second
 * I'm going to leave this in in case someone wants to stop the clock.
 */
function stopAllCountdowns() {
  if (interval)
    window.clearInterval(interval);
}

window.addEventListener('DOMContentLoaded', initPage);

var countdowns = [
  {
    title: 'Countdown to No Man\'s Sky',
    endText: 'No Man\'s Sky Has Been Released',
    noText: 'Really Soon<sup>tm</sup>',
    times: []
  },
  {
    title: 'Next IGN Release',
    endText: 'New Video on IGN',
    times: [
      "2015-07-22T09:00:00-07:00",
      "2015-07-24T09:00:00-07:00",
      "2015-07-27T09:00:00-07:00",
      "2015-07-29T09:00:00-07:00",
      "2015-07-31T09:00:00-07:00"
    ]
  }
];

var interval;

var images = [];

// Long list of images
// 'img/' gets added on automatically
var data_images = [
  'AlpineFly.png',
  'Becron5.png',
  'BlueSpace.png',
  'Creature.png',
  'Diplo.png',
  {
    src: 'fan1.jpg',
    artist: '/u/Battlefront528'
  },
  {
    src: 'fan2.jpg',
    artist: '/u/NoMansSciFi (Combined screenshots)'
  },
  {
    src: 'fan3.jpg',
    artist: '/u/DurMan667'
  },
  {
    src: 'fan4.jpg',
    artist: '/u/PepsiTetraHepta'
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
