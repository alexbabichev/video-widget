


$('document').ready(function () {

  initialiseMediaPlayer($('.splayer'));











});

// -----------------------------------------------------------------------------

function initialiseMediaPlayer($els) {
  $.each($els, function (i, el) {
    createMediaPlayer(el);
  });
}

// -----------------------------------------------------------------------------

function createMediaPlayer(splayer) {

  var $splayer = $(splayer),
      $player = $splayer.find('video'),
      player = $player.get(0);

  // init
  player.controls = false;
  player.addEventListener('timeupdate', updateProgressBar);
  player.addEventListener('loadedmetadata', function() {
    $splayer.find('.duration').text(formatTime(player.duration));
    $player.attr('duration', player.duration);
  });
  player.addEventListener('ended', function() {
    player.currentTime = 0;
  });

  $splayer.find('.js_volume').val(player.volume);

  // play & pause
  $splayer.find('.js_play, .player-overlay').click(function () {
    var $btn = $splayer.find('.js_play');
    if (player.paused || player.ended) {
  		$btn.addClass('pause').removeClass('play');
      $splayer.find('.player-overlay i').hide();
      player.play();
  	} else {
      $btn.addClass('play').removeClass('pause');
      $splayer.find('.player-overlay i').show();
  		player.pause();
  	}
  });

  // progressBar
  function updateProgressBar() {
    var progressBar = $splayer.find('.js_progressbar').get(0);
    var percentage = Math.floor((100 / this.duration) * this.currentTime);
    var currentTime = $splayer.find('.time').get(0);
  	progressBar.value = percentage;
    currentTime.innerHTML = formatTime(this.currentTime);
  }

  $splayer.find('.js_progressbar').hover(
    function(e) {
      $(this).next('span').removeClass('hidden');
    }, function() {
      $(this).next('span').addClass('hidden');
    }
  );

  $splayer.find('.js_progressbar').mousemove(function (e) {
    var x = e.pageX - $(this).offset().left,
        track = player.duration*trackTime($(this).width(), x);
    $(this).next('span').text(formatTime(track)).css('left', x+'px');
  });

  $splayer.find('.js_progressbar').click(function (e) {
    var x = e.pageX - $(this).offset().left,
        track = player.duration * trackTime($(this).width(), x),
        progressBar = $splayer.find('.js_progressbar').get(0),
        percentage = Math.floor((100 / player.duration) * track),
        currentTime = $splayer.find('.time').get(0);
    progressBar.value = percentage;
    player.currentTime = track;
  });

  // volume
  $splayer.find('.js_volume').click(function (e) {
    var x = e.pageX - $(this).offset().left;
    player.volume = trackTime($(this).width(), x);
    $(this).val(player.volume);
    if (player.muted)
      player.muted = false;
  });

  // muted
  $splayer.find('.js_mute').click(function () {
    var $volume = $(this).next();
    if (player.muted) {
      player.muted = false;
      $volume.val(player.volume);
      $(this).find('.fa').removeClass('fa-volume-off').addClass('fa-volume-up');
   }
   else {
      player.muted = true;
      $volume.val(0);
      $(this).find('.fa').removeClass('fa-volume-up').addClass('fa-volume-off');
   }
  });

  // fullscreen
  $splayer.find('.js_expand').click(function () {
    $splayer.toggleClass('fullscreen');
    if ($splayer.hasClass('fullscreen')) {
      $('.splayer').not('.fullscreen').hide();
      $(this).find('.fa').removeClass('fa-expand').addClass('fa-compress');
      if (player.requestFullscreen)  player.requestFullscreen();
      else if (player.mozRequestFullScreen)  player.mozRequestFullScreen();
      else if (player.webkitRequestFullscreen)  player.webkitRequestFullscreen();
      else if (player.msRequestFullscreen)  player.webkitRequestFullscreen();
    } else {
      $('.splayer').show();
      $(this).find('.fa').removeClass('fa-compress').addClass('fa-expand');
      if (player.exitFullScreen) player.exitFullScreen();
      else if (player.webkitExitFullScreen) player.webkitExitFullScreen();
      else if (player.mozExitFullScreen) player.mozExitFullScreen();
      else if (player.oExitFullScreen) player.oExitFullScreen();
      else if (player.msExitFullScreen) player.msExitFullScreen();
    }
  });

}

// -----------------------------------------------------------------------------

function trackTime(width, x) {
  return Math.floor((100 / width) * x)/100;
}

function formatTime(time) {
  var minutes = parseInt(time / 60, 10);
  var seconds = parseInt(time % 60);
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return minutes+':'+seconds;
}

// -----------------------------------------------------------------------------
