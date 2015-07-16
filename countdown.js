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

  setInterval(changeImage, 30000);
  changeImage();
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

window.addEventListener('load', initPage);

// Long list of images
// 'img/' gets added on automatically
var data_images = [
  'AlpineFly.png',
  'Becron5.png',
  'Creature.png',
  'Diplo.png',
  'Fleet.png',
  'GlattrecSystem.png',
  'NewEridu.png',
  'NoMansSky_GalacticMap.png',
  'NoMansSky_Monolith.png',
  'NoMansSky_SpaceStationTube.png',
  'station1.jpg',
  'station2.jpg',
  'station3.jpg'
];
