setTimeout(() => {
  if (db) {
    // videos retrieval
    // image retrieval

    let videoDBTransaction = db.transaction("video", "readonly");
    let videoStore = videoDBTransaction.objectStore("video");
    let videoRequest = videoStore.getAll(); // Event driven

    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");

      videoResult.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);

        mediaElem.innerHTML = `<div class="media">
        <video autoplay loop src="${url}"></video>
    </div>
    <div class="delete action">DELETE</div>
    <div class="download action">DOWNLOAD</div>`;

        galleryCont.appendChild(mediaElem);

        // Listeners
        let dleteBtn = mediaElem.querySelector(".delete");
        dleteBtn.addEventListener("click", deleteListner);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListner);
      });
    };

    // image Retrieval
    let imageDBTransaction = db.transaction("images", "readonly");
    let imageStore = imageDBTransaction.objectStore("images");
    let imageRequest = imageStore.getAll(); // Event driven
    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");

      imageResult.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);
        let url = imageObj.url;

        mediaElem.innerHTML = `<div class="media">
        <img src="${url}"></img>
    </div>
    <div class="delete action">DELETE</div>
    <div class="download action">DOWNLOAD</div>`;

        galleryCont.appendChild(mediaElem);

        // Listeners
        let dleteBtn = mediaElem.querySelector(".delete");
        dleteBtn.addEventListener("click", deleteListner);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListner);
      });
    };
  }
}, 100);

// UI remove, DB remove
function deleteListner(e) {
  // DB removal
  let id = e.target.parentElement.getAttribute("id");
  if (id.slice(0, 3) === "vid") {
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (id.slice(0, 3) === "img") {
    let imageDBTransaction = db.transaction("images", "readwrite");
    let imageStore = imageDBTransaction.objectStore("images");
    imageStore.delete(id);
  }

  // UI removal
  e.target.parentElement.remove();
}

function downloadListner(e) {
  let id = e.target.parentElement.getAttribute("id");
  if (id.slice(0, 3) === "vid") {
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");

    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = (e) => {
      let videoResult = videoRequest.result;

      let videoURL = URL.createObjectURL(videoResult.blobData);
      let a = document.createElement("a");
      a.href = videoURL;
      a.download = "stream.mp4";
      a.click();
    };
  } else if (id.slice(0, 3) === "img") {
    let imageDBTransaction = db.transaction("images", "readwrite");
    let imageStore = imageDBTransaction.objectStore("images");
    let imageRequest = imageStore.get(id);

    imageRequest.onsuccess = (e) => {
      let imageResult = imageRequest.result;
      let imageURL = imageResult.url;
      let a = document.createElement("a");
      a.href = imageURL;
      a.download = "image.jpg";
      a.click();
    };
  }
}
