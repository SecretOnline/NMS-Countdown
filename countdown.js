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

  // Set up button
  var ircButton = $('.ircButton');
  ircButton.addEventListener('click', toggleIrc);

  // Load in images, and get them changing every 60 seconds
  preloadImages();
  setInterval(changeImage, 60000);
  changeImage();

  // Set up countdowns
  createCountdowns();
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
function changeImage() {
  var $ = document.querySelector.bind(document);
  var bgElement = $('.bg');
  var body = $('body');
  bgElement.classList.remove('fadeout');
  bgElement.style.opacity = 1; // Manually specify opacity
  bgElement.style.backgroundImage = body.style.backgroundImage;

  body.style.backgroundImage = 'url(' + nextImage() + ')';
  // Start the crossfade after 100ms
  setTimeout(function() {
    bgElement.classList.add('fadeout');
    bgElement.style.opacity = ''; // Remove overly-specific rule to allow animation to work
  }, 100);
}

/**
 * Return the source for a random image
 */
function nextImage() {
  return images[Math.floor(Math.random() * data_images.length)].src;
}

/**
 * Return a string in the format dd:hh:mm:ss:ms from a number of milliseconds
 */
function toCountdownString(millis) {
  // Javascript doesn't have a nice way of formatting numbers
  // Instead wwe end up with stacks of code like this.
  var days = Math.floor(millis / 86400000).toString();
  if (days < 10)
    days = '0' + days;
  millis %= 86400000;
  var hours = Math.floor(millis / 3600000).toString();
  if (hours < 10)
    hours = '0' + hours;
  millis %= 3600000;
  var minutes = Math.floor(millis / 60000).toString();
  if (minutes < 10)
    minutes = '0' + minutes;
  millis %= 60000;
  var seconds = Math.floor(millis / 1000).toString();
  if (seconds < 10)
    seconds = '0' + seconds;
  millis %= 1000;
  var centiSecs = Math.floor(millis / 10).toString(); // Bet you've never seen a centisecond be used before...
  if (centiSecs < 10)
    centiSecs = '0' + centiSecs;

  return days + ':' + hours + ':' + minutes + ':' + seconds + ':' + centiSecs;
}

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
    countElement.classList.add('countdown');
    countElement.classList.add('center');
    titleElement.classList.add('center');
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

        // Must have a separate reference, or 'i' gets updated, and countdowns don't happen.
        var arrayIndex = i;

        countdowns[i].interval = setInterval(function() {
          updateCountdown(countdowns[arrayIndex]);
        }, 10);
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
}

function updateCountdown(countdown) {
  var timeDiff = new Date(countdown.times[countdown.currTime]).getTime() - Date.now(); // What a mouthful.
  var countdownElement = countdown.container.querySelector('.countdown');
  if (timeDiff > 0)
    countdownElement.innerHTML = toCountdownString(timeDiff);
  else {
    // Countdown finished. Show end text for a minute
    countdownElement.innerHTML = countdown.endText;
    window.clearInterval(countdown.interval);
    setTimeout(function() {
      if (countdown.currTime + 1 < countdown.times.length) {
        countdown.currTime++;
        countdowns[i].interval = setInterval(function() {
          updateCountdown(countdown);
        }, 10);
      }
    }, 60000);
  }
}

function stopAllCountdowns() {
  countdowns.forEach(function(cd) {
    if (cd.interval)
      window.clearInterval(cd.interval);
  });
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

var images = [];

// Long list of images
// 'img/' gets added on automatically
var data_images = [
  'AlpineFly.png',
  'Becron5.png',
  'BlueSpace.png',
  'Creature.png',
  'Diplo.png',
  'Fleet.png',
  'GlattrecSystem.png',
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
  'logo.png'
];
