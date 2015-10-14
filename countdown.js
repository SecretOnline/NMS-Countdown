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

  if (localStorage) {
    if (localStorage.getItem('nms-autoplay'))
      toggleAudio();
    if (localStorage.getItem('nms-repeat'))
      toggleShuffle();
  }

  // Set up button
  var ircButton = $('.ircButton');
  ircButton.addEventListener('click', toggleIrc);
  $('.button-next').addEventListener('click', changeAudio);
  $('.button-play').addEventListener('click', toggleAudio);
  $('.button-shuffle').addEventListener('click', toggleShuffle);
  $('.button-volUp').addEventListener('click', volUp);
  $('.button-volDown').addEventListener('click', volDown);

  if (window.location.hash === '#irc')
    body.classList.add('open');

  // Set up countdowns
  createCountdowns();
  var artist = document.createElement('h4');
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
 * Mix up the playlist, or set it back to straight
 */
function shuffleAudio() {
  var newPl = [];

  // If we're shuffling
  if (document.querySelector('.repeat-svg.hidden')) {
    // Add songs to temporary list
    var tempPl = [];
    data_songs.forEach(function(song) {
      tempPl.push(song);
    });
    // Take a random song out, put in new list
    while (tempPl.length > 0) {
      var index = Math.floor(Math.random() * tempPl.length);
      newPl.push(tempPl[index]);
      tempPl.splice(index, 1);
    }
  } else {
    // Put songs in list in order
    data_songs.forEach(function(song) {
      newPl.push(song);
    });
  }

  playlist = newPl;
}

/**
 * Change the song to the next one in the list
 */
function changeAudio() {
  var $ = document.querySelector.bind(document);
  currSongIndex++;
  // If we've gone too far, recreate the playlist
  if (currSongIndex == playlist.length) {
    currSongIndex = 0;
    shuffleAudio();
  }

  // If the player doesn't exist yet, create it
  if (!player) {
    player = document.createElement('audio');
    // Play if autoplay play button is playing
    if ($('.play-svg.hidden'))
      player.autoplay = true;
    // Set volume if stored
    if (localStorage)
      player.volume = localStorage.getItem('nms-vol') || 0.5;
    // Add listeners
    player.addEventListener('ended', changeAudio);
    player.addEventListener('timeupdate', changeAudioProgress);
  }

  // Set player source, and artist information
  player.src = 'audio/' + playlist[currSongIndex].src;
  $('.song-title').innerHTML = playlist[currSongIndex].title;
  $('.song-artist').innerHTML = playlist[currSongIndex].artist;
  $('.song-artist-link').href = playlist[currSongIndex].artistLink;
  $('.progress-bar').style.width = 0;
}

/**
 * Toggle play state
 */
function toggleAudio() {
  var playSVG = document.querySelector('.play-svg');
  var pauseSVG = document.querySelector('.pause-svg');
  // If we should play
  if (pauseSVG.classList.contains('hidden')) {
    // Play is player exists
    if (player)
      player.play();
    // Store autoplay
    if (localStorage)
      localStorage.setItem('nms-autoplay', true);
  } else {
    // Pause of player exists
    if (player)
      player.pause();
    // Remove autoplay from storage
    if (localStorage)
      localStorage.removeItem('nms-autoplay');
  }
  // Toggle which icon is visible
  playSVG.classList.toggle('hidden');
  pauseSVG.classList.toggle('hidden');
}

/**
 * Toggle playlist shuffling
 */
function toggleShuffle() {
  var shuffleSVG = document.querySelector('.shuffle-svg');
  var repeatSVG = document.querySelector('.repeat-svg');
  // Toggle icons
  shuffleSVG.classList.toggle('hidden');
  repeatSVG.classList.toggle('hidden');

  // Store shuffle state
  if (localStorage)
    if (shuffleSVG.classList.contains('hidden'))
      localStorage.setItem('nms-repeat', true);
    else
      localStorage.removeItem('nms-repeat');

    // Recreate playlist
  shuffleAudio();
}

/**
 * Increase volume
 */
function volUp() {
  // Cap at 1 (otherwise exception is thrown)
  var vol = Math.min(player.volume + 0.1, 1);
  player.volume = vol;

  // Store volume
  if (localStorage)
    localStorage.setItem('nms-vol', vol);
}

/**
 * Decrease volume
 */
function volDown() {
  // Cap at 0 (otherwise exception thrown)
  var vol = Math.max(player.volume - 0.1, 0);
  player.volume = vol;

  // Store volume
  if (localStorage)
    localStorage.setItem('nms-vol', vol);
}

/**
 * Update the progress bar with song progress
 */
function changeAudioProgress() {
  document.querySelector('.progress-bar').style.width = ((player.currentTime / player.duration) * 100) + '%';
}

/**
 * Set the background to a random image
 */
function changeImage(bgIndex) {
  var $ = document.querySelector.bind(document);
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
    countElement.innerHTML = '<span class="d"></span>d:<span class="h"></span>h:<span class="m"></span>m:<span class="s"></span>s:<span class="ms"></span>';
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

  // Set interval for next update
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

window.addEventListener('DOMContentLoaded', function() {
  initPage();
  shuffleAudio();
  changeAudio();
});

var countdowns = [{
  title: 'Countdown to No Man\'s Sky',
  endText: 'No Man\'s Sky Has Been Released',
  noText: 'It\'s a secret<sup>tm</sup>',
  times: []
}, {
  title: 'Paris Games Week - Sony Conference',
  endText: 'Sony on stage!',
  times: [
    "2015-10-27T17:00+00:00"
  ]
}];

var interval;

var nextBgIndex = 0;
var playlist = [];
var currSongIndex = 0;
var player;

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

var data_songs = [{
  title: 'Atlas',
  artist: 'JayKob',
  artistLink: 'https://soundcloud.com/jaykobmusic',
  src: 'JayKob/Atlas.mp3'
}, {
  title: 'First Step [1969]',
  artist: 'JayKob',
  artistLink: 'https://soundcloud.com/jaykobmusic',
  src: 'JayKob/FirstStep.mp3'
}, {
  title: 'Soleth Prime',
  artist: 'JayKob',
  artistLink: 'https://soundcloud.com/jaykobmusic',
  src: 'JayKob/SolethPrime.mp3'
}, {
  title: 'The Lore',
  artist: 'JayKob',
  artistLink: 'https://soundcloud.com/jaykobmusic',
  src: 'JayKob/TheLore.mp3'
}]
