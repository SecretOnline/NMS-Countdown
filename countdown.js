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

  var ircContainer = $('.ircContainer');
  ircContainer.innerHTML = '<iframe src="https://kiwiirc.com/client/irc.snoonet.org/?nick=NoManNaut&theme=basic#nomanssky" class="irc"></iframe>';

  var ircButton = $('.ircButton');
  ircButton.addEventListener('click', toggleIrc);

  setInterval(changeImage, 60000);
  changeImage();

  timeout = setInterval(setCountdown, 10);
  minorTimeout = setInterval(setMinorCountdown, 10);
}

function changeImage() {
  var $ = document.querySelector.bind(document);
  var bgElement = $('.bg');
  var body = $('body');
  bgElement.classList.remove('fadeout');
  bgElement.style.opacity = 1; // Manually specify opacity
  bgElement.style.backgroundImage = body.style.backgroundImage;
  setTimeout(function() {
    bgElement.classList.add('fadeout');
    bgElement.style.opacity = ''; // Remove overly-specific rule to allow animation to work
  }, 1000);

  body.style.backgroundImage = 'url(img/' + nextImage() + ')';

}

function nextImage() {
  return data_images[Math.floor(Math.random() * data_images.length)];
}

function setCountdown() {
  var cd = document.querySelector('.countdown');
  if (typeof releaseDate !== 'undefined') {
    // WHAT? THERE'S A DATE?
    var releaseMillis = new Date(releaseDate).getTime();
    var timeDiff = releaseMillis - Date.now();

    if (timeDiff > 0)
      cd.innerHTML = toCountdownString(timeDiff);
    else {
      cd.innerHTML = 'No Man\'s Sky Has Been Released';
      window.clearInterval(timeout);
    }
  }
  // Try remove the interval
  else if (timeout) {
    cd.innerHTML = 'Really Soon<sup>tm</sup>';
    window.clearInterval(timeout);
  }
}

function setMinorCountdown() {
  var setTime = false;
  var cd = document.querySelector('.minor-countdown');
  for (var i = 0; i < minorCountdowns.length; i++) {
    var timerMillis = new Date(minorCountdowns[i]).getTime();
    var timeDiff = timerMillis - Date.now();
    if (timeDiff > 0) {
      cd.innerHTML = toCountdownString(timeDiff);
      setTime = true;
      break;
    }
  }
  if (!setTime) {
    cd.innerHTML = 'No more countdowns have been specified';
    window.clearInterval(minorTimeout);
  }
}

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

window.addEventListener('load', initPage);

var timeout;
var minorTimeout;
var releaseDate;
//var releaseDate = sorry, can't talk about it;
var minorCountdowns = [
  "2015-07-17T09:00:00-07:00",
  "2015-07-20T09:00:00-07:00",
  "2015-07-22T09:00:00-07:00",
  "2015-07-24T09:00:00-07:00",
  "2015-07-27T09:00:00-07:00",
  "2015-07-29T09:00:00-07:00",
  "2015-07-31T09:00:00-07:00"
];

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
