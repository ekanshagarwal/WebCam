let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let timer = document.querySelector(".timer");
let filterLayer = document.querySelector(".filter-layer");
let allFIlters = document.querySelectorAll(".filter");

let recordFlag = false;
let recorder;
let chunks = [];
let timerID;
let counter = 0;
let transparentColor = "transparent";

let constraints = {
  video: true,
  audio: true,
};

// navigator -> global browser info
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;

  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    // Conversion of media chunks data to video
    let blob = new Blob(chunks, { type: "video/mp4" });

    if (db) {
      let videoId = shortid();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: `vid-${videoId}`,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }
    let videoURL = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = videoURL;
    a.download = "stream.mp4";
    a.click();
  });
});

function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    counter++;
    let totalSeconds = counter;
    let hours = Number.parseInt(totalSeconds / 3600);
    let minutes = Number.parseInt((totalSeconds % 3600) / 60);
    let seconds = (totalSeconds % 3600) % 60;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hours}:${minutes}:${seconds}`;
  }
  timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;

  recordFlag = !recordFlag;

  if (recordFlag) {
    // Start
    recorder.start();
    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    // Stop
    recorder.stop();
    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture");

  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);
  // filtering
  tool.fillStyle = transparentColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);

  let imageURL = canvas.toDataURL();

  if (db) {
    let imageId = shortid();
    let dbTransaction = db.transaction("images", "readwrite");
    let imageStore = dbTransaction.objectStore("images");
    let imageEntry = {
      id: `img-${imageId}`,
      url: imageURL,
    };
    imageStore.add(imageEntry);

    setTimeout(() => {
      captureBtn.classList.remove("scale-capture");
    }, 1000);
  }

  // let a = document.createElement("a");
  // a.href = imageURL;
  // a.download = "image.jpg";
  // a.click();
});

allFIlters.forEach((filterElem) => {
  filterElem.addEventListener("click", (e) => {
    // Set
    transparentColor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
    // Set
    filterLayer.style.backgroundColor = transparentColor;
  });
});

let gallery = document.querySelector(".gallery");
gallery.addEventListener("click", (e) => {
  location.assign("./gallery.html");
});
