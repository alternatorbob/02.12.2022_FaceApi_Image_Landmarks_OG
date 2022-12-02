import { cropCanvas, toBase64 } from "./utils.js";

let faceapi;
let img;
let detections;
const width = 900;
const height = 600;
let canvas, ctx;
let detectionBoxes = [];

// by default all options are set to true
const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};

async function make() {
  img = new Image();
  img.src = "assets/people.jpeg";
  img.width = width;
  img.height = height;

  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");

  faceapi = await ml5.faceApi(detectionOptions, modelReady);
}
// call app.map.init() once the DOM is loaded
window.addEventListener("DOMContentLoaded", function () {
  make();
});

function modelReady() {
  console.log("ready!");
  faceapi.detect(img, gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  detections = result;
  ctx.drawImage(img, 0, 0, width, height);

  if (detections) {
    drawBoxes(detections);
    addClick(detections);
  }
}

function drawBox(detection) {
  const alignedRect = detection.alignedRect;
  const { _x, _y, _width, _height } = alignedRect._box;

  ctx.rect(_x, _y, _width, _height);
  ctx.strokeStyle = "#00ff00";
  ctx.stroke();
}

function drawBoxes(detections) {
  if (detections.length > 0) {
    detections.forEach((face) => {
      const aR = face.alignedRect._box;
      const faceBox = { x: aR._x, y: aR._y, w: aR._width, h: aR._height };
      detectionBoxes.push(faceBox);

      let { _x, _y, _width, _height } = face.alignedRect._box;
      ctx.rect(_x, _y, _width, _height);
      ctx.strokeStyle = "#ff0000";
      ctx.stroke();
    });
  }
}

// listener, using W3C style for example
function addClick() {
  canvas.addEventListener(
    "click",
    (e) => {
      if (detections.length > 0) {
        const [isCollision, lastCollision] = collides(
          detectionBoxes,
          e.offsetX,
          e.offsetY
        );
        console.log("click: " + e.offsetX + "/" + e.offsetY);
        if (isCollision) {
          // console.log("collision: " + isCollision.x + "/" + isCollision.y);
          // console.log("last collision:", lastCollision);
          // console.log("detections[lastCollision]:", detections[lastCollision]);
          cropCanvas(canvas, detections[lastCollision]);
          drawBox(detections[lastCollision]);
        } else {
          console.log("no collision");
        }
      }
    },
    false
  );
}

// prettier-ignore
function collides(rects, x, y) {
  let isCollision = false;
  let lastCollision = -1;
  for (let i = 0, len = rects.length; i < len; i++) {
      let left = rects[i].x, right = rects[i].x+rects[i].w;
      let top = rects[i].y, bottom = rects[i].y+rects[i].h;
      if (right >= x
          && left <= x
          && bottom >= y
          && top <= y) {
            lastCollision = i
            isCollision = rects[i];
      }
  }
  return [isCollision, lastCollision];
}

function drawLandmarks(detections) {
  // mouth
  ctx.beginPath();
  detections.parts.mouth.forEach((item, idx) => {
    if (idx === 0) {
      ctx.moveTo(item._x, item._y);
    } else {
      ctx.lineTo(item._x, item._y);
    }
  });
  ctx.closePath();
  ctx.stroke();

  // nose
  ctx.beginPath();
  detections.parts.nose.forEach((item, idx) => {
    if (idx === 0) {
      ctx.moveTo(item._x, item._y);
    } else {
      ctx.lineTo(item._x, item._y);
    }
  });
  ctx.stroke();

  // // left eye
  ctx.beginPath();
  detections.parts.leftEye.forEach((item, idx) => {
    if (idx === 0) {
      ctx.moveTo(item._x, item._y);
    } else {
      ctx.lineTo(item._x, item._y);
    }
  });
  ctx.closePath();
  ctx.stroke();

  // // right eye
  ctx.beginPath();
  detections.parts.rightEye.forEach((item, idx) => {
    if (idx === 0) {
      ctx.moveTo(item._x, item._y);
    } else {
      ctx.lineTo(item._x, item._y);
    }
  });

  ctx.closePath();
  ctx.stroke();

  // // right eyebrow
  ctx.beginPath();
  detections.parts.rightEyeBrow.forEach((item, idx) => {
    if (idx === 0) {
      ctx.moveTo(item._x, item._y);
    } else {
      ctx.lineTo(item._x, item._y);
    }
  });
  ctx.stroke();
  // canvas.closePath();

  // // left eyeBrow
  ctx.beginPath();
  detections.parts.leftEyeBrow.forEach((item, idx) => {
    if (idx === 0) {
      ctx.moveTo(item._x, item._y);
    } else {
      ctx.lineTo(item._x, item._y);
    }
  });
  // canvas.closePath();

  ctx.strokeStyle = "#a15ffb";
  ctx.stroke();
}

// Helper Functions
function createCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas);
  return canvas;
}
