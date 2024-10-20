let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_singer = document.querySelector(".track-singer");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;
let isSeeking = false; 

let curr_track = document.createElement('audio');

let track_list = [
  {
    name: "Hương",
    singer: "Văn Mai Hương",
    image: "./Image/Huong.jpg",
    path: "./Music/Huong.mp3"
  },
  {
    name: "Tình Nào Không Như Tình Đầu",
    singer: "Trung Quân Idol",
    image: "./Image/TNKNTD.jpg",
    path: "./Music/TNKNTD.mp3"
  },
  {
    name: "Tình Đầu Quá Chén",
    singer: "Quang Hùng MasterD, Erik, Negav, Pháp Kiều (Anh Trai Say Hi)",
    image: "./Image/TinhDauQuaChen.jpg",
    path: "./Music/TinhDauQuaChen.mp3",
  },
  {
    name: "Bầu Trời Mới",
    singer: "Da LAB ft. Minh Tốc & Lam",
    image: "./Image/BTM.jpg",
    path: "./Music/BTM.mp3",
  },
  {
    name: "một đời",
    singer: "Changg, Minh Huy",
    image: "./Image/md.jpg",
    path: "./Music/md.mp3",
  },
  {
    name: "Em Không Hiểu",
    singer: "14 Casper & Bon Nghiêm (feat. buitruonglinh)",
    image: "./Image/ekh.jpg",
    path: "./Music/ekh.mp3",
  },
  {
    name: "I'm Thinking About You",
    singer: "Tlinh, Rhyder, WEAN, Đức Phúc, Hùng Huỳnh (Anh Trai Say Hi)",
    image: "./Image/i.jpg",
    path: "./Music/I'm Thinking About You.mp3",
  }
];

function random_bg_color() {
  let red = Math.floor(Math.random() * 400) + 64;
  let green = Math.floor(Math.random() * 400) + 64;
  let blue = Math.floor(Math.random() * 400) + 64;
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";
  document.body.style.background = bgColor;
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_singer.textContent = track_list[track_index].singer;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 100); 
  curr_track.addEventListener("ended", nextTrack); // Automatically move to next track when current one ends
  random_bg_color();
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

loadTrack(track_index);

function nextTrack() {
  if (track_index < track_list.length - 1) {
    track_index += 1;
    loadTrack(track_index);
    playTrack();
  } else {
    // Reset to the first track and stop playback
    track_index = 0;
    loadTrack(track_index);
    stopTrack();  // Stop the playback and reset the state
  }
}

function stopTrack() {
  pauseTrack();  // Pause the current track
  curr_track.currentTime = 0;  // Reset track time to the beginning
  seek_slider.value = 0;  // Reset seek slider
  curr_time.textContent = "00:00";  // Update current time display
}

function playpauseTrack() {
  if (!isPlaying) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
  loadTrack(track_index);
  playTrack();
}

seek_slider.addEventListener("mousedown", function() {
  isSeeking = true;
});

seek_slider.addEventListener("mouseup", function() {
  isSeeking = false;
  seekTo(); 
});

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function updateDisplayedTime(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = Math.floor(timeInSeconds - minutes * 60);

  if (seconds < 10) { seconds = "0" + seconds; }
  if (minutes < 10) { minutes = "0" + minutes; }

  return minutes + ":" + seconds;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  if (!isSeeking && !isNaN(curr_track.duration)) {
    let seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    if (seekPosition > 100) {
      seekPosition = 100;
    } else if (seekPosition < 0) {
      seekPosition = 0;
    }

    seek_slider.value = seekPosition;

    curr_time.textContent = updateDisplayedTime(curr_track.currentTime);
    total_duration.textContent = updateDisplayedTime(curr_track.duration);
  }
}

volume_slider.addEventListener("input", function() {
  setVolume();
});
