import { swapFace } from "./swapFace.js";

export const cropCanvas = (sourceCanvas, detection) => {
  const { x, y, width, height } = detection.alignedRect._box;
  let destCanvas = document.createElement("canvas");
  document.body.appendChild(destCanvas);
  destCanvas.width = width;
  destCanvas.height = height;
  //   ctx.fillStyle = "#000000";
  //   ctx.fillRect(0, 0, width, height);

  destCanvas.getContext("2d").drawImage(
    sourceCanvas,
    x,
    y,
    width,
    height, // source rect with content to crop
    0,
    0,
    width,
    height
  ); // newCanvas, same size as source rect
  return destCanvas;
};

const getBase64StringFromDataURL = (dataURL) =>
  dataURL.replace("data:", "").replace(/^.+,/, "");

export const toBase64 = (sourceCanvas) => {
  const dataURL = sourceCanvas.toDataURL();
  // Logs data:image/png;base64,wL2dvYWwgbW9yZ...
  // Convert to Base64 string
  const base64 = getBase64StringFromDataURL(dataURL);
  //   console.log(base64);
  return base64;
};

function toDataURL(url) {
  let xhRequest = new XMLHttpRequest();
  xhRequest.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      // console.log(reader.result);
      //   callback(reader.result);
    };
    reader.readAsDataURL(xhRequest.response);
  };
  xhRequest.open("GET", url);
  xhRequest.responseType = "blob";
  xhRequest.send();
}

let convertedImages = [
  toDataURL("./assets/frida_crop.png"),
  toDataURL("./assets/rando_face.jpeg"),
];

swapFace(convertedImages);
