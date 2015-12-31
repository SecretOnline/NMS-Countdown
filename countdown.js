var interval;
var startCountdowns = (function(win, doc) {
  'use strict';
  var $ = doc.querySelector.bind(doc);

  /**
   * Get everything ready
   */
  function initPage() {
    var body = $('body');
    var main = $('main');

    function toggleIrc() {
      body.classList.toggle('open');
    }

    // Add fonts in later, to prevent render blocking
    var currStyle = $('link[rel="stylesheet"]');
    var geoSans = doc.createElement('link');
    geoSans.rel = 'stylesheet';
    geoSans.href = 'fonts.css';
    geoSans.type = 'text/css';
    currStyle.parentNode.insertBefore(geoSans, currStyle);
    var robotoMono = doc.createElement('link');
    robotoMono.rel = 'stylesheet';
    robotoMono.href = 'http://fonts.googleapis.com/css?family=Roboto+Mono:300';
    robotoMono.type = 'text/css';
    currStyle.parentNode.insertBefore(robotoMono, currStyle);

    // Set up button
    var ircButton = $('.ircButton');
    ircButton.addEventListener('click', toggleIrc);

    if (win.location.hash === '#irc')
      toggleIrc();

    // Set up countdowns
    createCountdowns();
  }

  /**
   * Initialise all of the countdowns
   */
  function createCountdowns() {
    var mainContainer = doc.querySelector('.main-container');
    mainContainer.innerHTML = '';

    for (var i = 0; i < countdowns.length; i++) {
      // Create elements
      var container = doc.createElement('div');
      var titleElement = doc.createElement(i === 0 ? 'h1' : 'h2'); // First countdown is bigger
      var countElement = doc.createElement(i === 0 ? 'h2' : 'h3');
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
    iterateCountdowns();
  }

  /**
   * Tie countdown updating to the browser's redraw loop
   * Since that's how fast the browser is drawing, updates occured
   * only as often as necessary
   */
  function iterateCountdowns() {
    countdowns.forEach(function(countdown) {
      if (typeof countdown.currTime !== 'undefined')
        updateCountdown(countdown);
    });
    interval = requestAnimationFrame(iterateCountdowns);
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


  var countdowns = [{
    title: 'Countdown to No Man\'s Sky',
    endText: 'Now<sup>tm</sup>',
    noText: 'June 2016',
    times: []
  }, {
    title: 'E3 2016 (you must be deperate if you\'re here)',
    endText: 'E3 is on!',
    times: ['2016-06-14T12:00:00-08:00']
  }];

  if (doc.readyState !== 'loading')
    initPage();
  else
    win.addEventListener('DOMContentLoaded', function() {
      initPage();
    });

  //
  return iterateCountdowns;

})(window, document);

/**
 * Mainly to stop browser throwing several hundred errors every
 * second when something goes wrong
 * I'm going to leave this in in case someone wants to stop the
 * clock for whatever reason
 */
function stopCountdowns() {
  if (interval)
    window.cancelAnimationFrame(interval);
}
