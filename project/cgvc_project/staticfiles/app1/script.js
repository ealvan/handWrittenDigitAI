const canvas = document.getElementById("canvas");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");
const sizeElement = document.getElementById("size");
const colorElement = document.getElementById("color");
const clearElement = document.getElementById("clear");
const ctx = canvas.getContext("2d");

let size = 10;
let color = "black";
let x;
let y;
let isPressed = false;

const drawCircle = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};

const drawLine = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
};

const updateSizeOnScreen = () => (sizeElement.innerText = size);

canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  isPressed = false;
  x = undefined;
  y = undefined;
});

canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);
    x = x2;
    y = y2;
  }
});

increaseButton.addEventListener("click", () => {
  size += 5;
  if (size > 50) size = 50;
  updateSizeOnScreen();
});

decreaseButton.addEventListener("click", () => {
  size -= 5;
  if (size < 5) size = 5;
  updateSizeOnScreen();
});

colorElement.addEventListener("change", (e) => (color = e.target.value));

clearElement.addEventListener("click", () =>
  ctx.clearRect(0, 0, canvas.width, canvas.height)
);

//-------------------------------------------------------------------
document.getElementById('saveButton').addEventListener('click', () => {
  console.log("BUTTON SAVE");
  const imageData = getWhiteBGImage().toDataURL();//canvas.toDataURL(); // Get canvas data as base64 image
  // console.log("*****",imageData);  
  sendDataToServer(imageData);
  if(!has){
    has = addPredictButton();
  }
});

function getWhiteBGImage(){
  const whiteCanvas = document.createElement('canvas');
  whiteCanvas.width = canvas.width;
  whiteCanvas.height = canvas.height;
  const whiteContext = whiteCanvas.getContext('2d');

  // Draw a white background on the new canvas
  whiteContext.fillStyle = 'white';
  whiteContext.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);

  // Copy the content from the original canvas to the new white canvas
  whiteContext.drawImage(canvas, 0, 0);
  return whiteCanvas;
}

function sendDataToServer(imageData) {
  fetch('http://localhost:8000/save_image/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "image_data": imageData }),
  }).then(response => response.json())
  .then(data => {
    console.log(data); // You can handle the server response here
  }).catch(error => console.error('Error:', error));
}


//-------------------------------------------------------------------
var has = false;
function addPredictButton(){
  const saveButton = document.createElement('button');
  // Set the button's ID and text content
  saveButton.id = 'predict';
  saveButton.textContent = 'P';

  // Add a click event listener to the new button
  saveButton.addEventListener('click', function() {
    // Add your save logic here
    console.log('Save button clicked!');
    fetch('http://localhost:8000/predict/')
    .then(response => response.json())
    .then(data => {
      // Process the received data
      console.log("PREDICT");
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
  });

  // Get the parent element (div with class "toolbox")
  const toolbox = document.getElementById('toolbox_');

  // Append the new button to the parent element
  toolbox.appendChild(saveButton);

  return true;
}