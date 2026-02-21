console.log("Welcome To Spotify");

let songIndex = 0;
let audioElement = new Audio("songs/10.mp3");
let masterPlay = document.getElementById("masterPlay");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let masterSongName = document.getElementById("masterSongName");
let currentTimeLabel = document.getElementById("currentTimeLabel");
let totalTimeLabel = document.getElementById("totalTimeLabel");
let songItemPlay = Array.from(document.getElementsByClassName("songItemPlay"));
let isSeeking = false;
let aboutNav = document.getElementById("aboutNav");
let aboutModal = document.getElementById("aboutModal");
let aboutClose = document.getElementById("aboutClose");

let songs = [
  { songName: "Khawne Gorachand Khawne Kaalaa", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
  { songName: "DARKHAAST", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
  { songName: "Tomake Chuye Dilam Female Version", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
  { songName: "Khat", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
  { songName: "Why This Kolaveri Di?", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
  { songName: "Hua Hain Aaj Pehli Baar", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
  { songName: "Nei Khoti Nei", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
  { songName: "Ehsaas", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
  { songName: "Long Distance Love", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" }
];

const makeAllPlays = () => {
  songItemPlay.forEach((element) => {
    element.classList.remove("fa-pause-circle");
    element.classList.add("fa-play-circle");
  });
};

const setMasterToPlay = () => {
  masterPlay.classList.remove("fa-pause-circle");
  masterPlay.classList.add("fa-play-circle");
  gif.style.opacity = 0;
};

const setMasterToPause = () => {
  masterPlay.classList.remove("fa-play-circle");
  masterPlay.classList.add("fa-pause-circle");
  gif.style.opacity = 1;
};

const formatTime = (timeInSeconds) => {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) return "0:00";
  const totalSeconds = Math.floor(timeInSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const updateTimeLabels = () => {
  if (currentTimeLabel) currentTimeLabel.innerText = formatTime(audioElement.currentTime);
  if (totalTimeLabel) totalTimeLabel.innerText = formatTime(audioElement.duration);
};

const playSongAtIndex = (index) => {
  songIndex = index;
  audioElement.src = songs[songIndex].filePath;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  myProgressBar.value = 0;
  if (currentTimeLabel) currentTimeLabel.innerText = "0:00";
  if (totalTimeLabel) totalTimeLabel.innerText = "0:00";
  audioElement.play();
  makeAllPlays();
  const current = document.getElementById(songIndex.toString());
  if (current) {
    current.classList.remove("fa-play-circle");
    current.classList.add("fa-pause-circle");
  }
  setMasterToPause();
};

masterPlay.addEventListener("click", () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    setMasterToPause();
    const current = document.getElementById(songIndex.toString());
    if (current) {
      current.classList.remove("fa-play-circle");
      current.classList.add("fa-pause-circle");
    }
  } else {
    audioElement.pause();
    setMasterToPlay();
    const current = document.getElementById(songIndex.toString());
    if (current) {
      current.classList.remove("fa-pause-circle");
      current.classList.add("fa-play-circle");
    }
  }
});

audioElement.addEventListener("timeupdate", () => {
  if (audioElement.duration && !isSeeking) {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100, 10);
    myProgressBar.value = progress;
  }
  updateTimeLabels();
});

audioElement.addEventListener("loadedmetadata", updateTimeLabels);

myProgressBar.addEventListener("pointerdown", () => {
  isSeeking = true;
});

myProgressBar.addEventListener("pointerup", () => {
  isSeeking = false;
});

myProgressBar.addEventListener("input", () => {
  if (audioElement.duration) {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
  }
  updateTimeLabels();
});

songItemPlay.forEach((element) => {
  element.addEventListener("click", (e) => {
    let clickedIndex = parseInt(e.target.id, 10);
    if (songIndex === clickedIndex && !audioElement.paused) {
      audioElement.pause();
      e.target.classList.remove("fa-pause-circle");
      e.target.classList.add("fa-play-circle");
      setMasterToPlay();
      return;
    }
    playSongAtIndex(clickedIndex);
  });
});

document.getElementById("next").addEventListener("click", () => {
  songIndex = (songIndex + 1) % songs.length;
  playSongAtIndex(songIndex);
});

document.getElementById("previous").addEventListener("click", () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  playSongAtIndex(songIndex);
});

audioElement.addEventListener("ended", () => {
  songIndex = (songIndex + 1) % songs.length;
  playSongAtIndex(songIndex);
});

masterSongName.innerText = songs[songIndex].songName;
updateTimeLabels();

if (aboutNav && aboutModal && aboutClose) {
  aboutNav.addEventListener("click", () => {
    aboutModal.classList.remove("hidden");
  });

  aboutClose.addEventListener("click", () => {
    aboutModal.classList.add("hidden");
  });

  aboutModal.addEventListener("click", (e) => {
    if (e.target === aboutModal) {
      aboutModal.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      aboutModal.classList.add("hidden");
    }
  });
}
