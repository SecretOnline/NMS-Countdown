(function(win, doc) {
  'use strict';
  var $ = doc.querySelector.bind(doc);

  function initAudio() {
    // Get preferences from local storage
    if (localStorage) {
      if (localStorage.getItem('nms-autoplay'))
        toggleAudio();
      if (localStorage.getItem('nms-repeat'))
        toggleShuffle();
    }
    // Add buton click listeners
    $('.button-next').addEventListener('click', changeAudio);
    $('.button-play').addEventListener('click', toggleAudio);
    $('.button-shuffle').addEventListener('click', toggleShuffle);
    $('.button-volUp').addEventListener('click', volUp);
    $('.button-volDown').addEventListener('click', volDown);
    shuffleAudio();
    changeAudio();
  }

  /**
   * Mix up the playlist, or set it back to straight
   */
  function shuffleAudio() {
    var newPl = [];

    // If we're shuffling
    if (doc.querySelector('.repeat-svg.hidden')) {
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
    currSongIndex++;
    // If we've gone too far, recreate the playlist
    if (currSongIndex == playlist.length) {
      currSongIndex = 0;
      shuffleAudio();
    }

    // If the player doesn't exist yet, create it
    if (!player) {
      player = doc.createElement('audio');
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

    if ($('.play-svg.hidden'))
      player.play();
  }

  /**
   * Toggle play state
   */
  function toggleAudio() {
    var playSVG = doc.querySelector('.play-svg');
    var pauseSVG = doc.querySelector('.pause-svg');
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
    var shuffleSVG = doc.querySelector('.shuffle-svg');
    var repeatSVG = doc.querySelector('.repeat-svg');
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
    doc.querySelector('.progress-bar').style.width = ((player.currentTime / player.duration) * 100) + '%';
  }

  var playlist = [];
  var currSongIndex = 0;
  var player;

  var data_songs = [{
    title: 'NoSkyInSpace',
    artist: '/u/nhingy',
    artistLink: 'https://soundcloud.com/nhingy',
    src: 'nhingy/NoSkyInSpace.mp3'
  }, {
    title: 'Atlas',
    artist: 'JayKob',
    artistLink: 'https://soundcloud.com/jaykobmusic',
    src: 'JayKob/Atlas.mp3'
  }, {
    title: 'Dark Matter',
    artist: 'JayKob',
    artistLink: 'https://soundcloud.com/jaykobmusic',
    src: 'JayKob/DarkMatter.mp3'
  }, {
    title: 'First Step [1969]',
    artist: 'JayKob',
    artistLink: 'https://soundcloud.com/jaykobmusic',
    src: 'JayKob/FirstStep.mp3'
  }, {
    title: 'Oria V',
    artist: 'JayKob',
    artistLink: 'https://soundcloud.com/jaykobmusic',
    src: 'JayKob/OriaV.mp3'
  }, {
    title: 'Pulsar',
    artist: 'JayKob',
    artistLink: 'https://soundcloud.com/jaykobmusic',
    src: 'JayKob/Pulsar.mp3'
  }, {
    title: 'Sayall',
    artist: 'JayKob',
    artistLink: 'https://soundcloud.com/jaykobmusic',
    src: 'JayKob/Sayall.mp3'
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
  }, {
    title: 'A Familiar Place',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/AFamiliarPlace.mp3'
  }, {
    title: 'A First Night\'s Dream',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/AFirstNightsDream.mp3'
  }, {
    title: 'A New Dawn',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/ANewDawn.mp3'
  }, {
    title: 'Burning Desire',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/BurningDesire.mp3'
  }, {
    title: 'Darkness Settles',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/DarknessSettles.mp3'
  }, {
    title: 'Entering the Realm of Giants',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/EnteringTheRealmOfGiants.mp3'
  }, {
    title: 'Escape Velocity',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/EscapeVelocity.mp3'
  }, {
    title: 'Flashing Lights',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/FlashingLights.mp3'
  }, {
    title: 'Hyperdrive',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/Hyperdrive.mp3'
  }, {
    title: 'If That\'s what it Takes',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/IfThatsWhatItTakes.mp3'
  }, {
    title: 'Leaving the Habitable Zone',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/LeavingTheHabitableZone.mp3'
  }, {
    title: 'Lifting Off',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/LiftingOff.mp3'
  }, {
    title: 'Looking at the Stars',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/LookingAtTheStars.mp3'
  }, {
    title: 'Looking Back',
    artist: 'Eric Warncke',
    artistLink: 'https://soundcloud.com/ericwarncke',
    src: 'EricWarncke/LookingBack.mp3'
  }];

  if (doc.readyState !== 'loading')
    initAudio();
  else
    win.addEventListener('DOMContentLoaded', function() {
      initAudio();
    });

})(window, document);
