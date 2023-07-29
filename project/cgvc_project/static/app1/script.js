
const canvas = document.getElementById("canvas");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");
const sizeElement = document.getElementById("size");
const colorElement = document.getElementById("color");
const clearElement = document.getElementById("clear");
const ctx = canvas.getContext("2d");
var numeroAleatorio = -1;
const testWriting = document.getElementById("test-writing");
const sortearButton = document.getElementById("sortear");

// const paragraph = document.querySelector("#prediction p");

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
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // let content = paragraph.textContent;
    // let last_character = content[content.length-1];
    // if(isNumber(last_character)){
    //   content = content.slice(0,-1);
    // }
    // paragraph.textContent = content;
  }
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
    showSwal("success-message","Guardado!","Se ha enviado tu test a la IA");
    console.log(data); // You can handle the server response here
  }).catch(error => console.error('Error:', error));
}


//-------------------------------------------------------------------
var has = false;
function isNumber(input) {
  // Use parseInt or parseFloat to convert the input to a number
  const numberValue = parseFloat(input);

  // Check if the converted number is NaN (Not a Number)
  // If it is NaN, then the input is not a valid number
  return !isNaN(numberValue);
}


function getRandom(){

}
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
      // Append a number to the content
      const number = data["predictions"]; // Replace this with your desired number
      if(numeroAleatorio != -1 && number === numeroAleatorio){
        console.log("ESTAS BIEN!!!");
        showSwal("success-message","Correcto!","Has ingresado el número correcto");
      }else{
        showSwal("error-message","Error",`La IA dice que el número correcto era: ${number}`);
        console.log("ESTAS MAL!!!");
      }
      // paragraph.textContent += " " + number;
      // console.log("AHHHH");
      console.log(data["predictions"]);
    })
    .catch(error => {
      console.error('Error:', error);
      showSwal("error-type","Hubo Error tecnico", "Puedes intentar de nuevo o notificarnos a servicioTecnico@gmail.com");
    });
  });

  // Get the parent element (div with class "toolbox")
  const toolbox = document.getElementById('toolbox_');

  // Append the new button to the parent element
  toolbox.appendChild(saveButton);

  return true;
}
//-----------------------------------------------------

function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 10);
}

function deleteAllChildren(element){
  while (element.firstChild) {
    if(element.firstChild.tagName !== "BUTTON")
      element.removeChild(element.firstChild);
  }
}

function getTest(){
    // deleteAllChildren(testWriting);
    numeroAleatorio = generarNumeroAleatorio();
    const mensaje = document.createElement("p");
    mensaje.textContent = `El número es ${numeroAleatorio}`;
    mensaje.classList.add("lead");
    mensaje.classList.add("text-center", "fw-bold");

    mensaje.style.color = "black";
    mensaje.style.fontSize='40px';
    testWriting.appendChild(mensaje);
}
getTest();

function showSwal(type,title,text) {
  // 'use strict';
   if (type === 'success-message') {
    swal({
      title: title,
      text: text,
      type: 'success',
      button: {
        text: "Continue",
        value: true,
        visible: true,
        className: "btn btn-primary"
      }
    })

  }else if(type=="error-message"){
    swal({
      title: title,
      text: text,
      type: 'error',
      button: {
        text: "Continue",
        value: true,
        visible: true,
        className: "btn btn-danger"
      }
    })
  }
  else if(type=='info-message'){
    swal({
      title: '¿De qué trata el juego?',
      text: 'El juego consiste en escribir el número',
      type: 'info',
      button: {
        text: "OK",
        value: true,
        visible: true,
        className: "btn btn-danger"
      }
    })
  }
  else{
      swal("Error occured !");
  } 
}
