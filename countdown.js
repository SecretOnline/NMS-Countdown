function initPage() {
  var $ = document.querySelector.bind(document);
  var body = $('body');
  var main = $('main');

  function toggleIrc() {
    body.classList.toggle('open');
  }

  var currStyle = $('link[rel="stylesheet"]');
  var fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.href = 'fonts.css';
  currStyle.parentNode.insertBefore(fonts, currStyle);

  var ircContainer = $('.ircContainer');
  ircContainer.innerHTML = '<iframe src="https://kiwiirc.com/client/irc.snoonet.org/?nick=NoManNaut&theme=basic#nomanssky" class="irc"></iframe>';

  var ircButton = $('.ircButton');
  ircButton.addEventListener('click', toggleIrc);
}

window.addEventListener('load', initPage);
