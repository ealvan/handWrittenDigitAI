
const getImgButton = document.getElementById("proceso");
const frontCards = document.getElementsByClassName("flip-card-front");
const classNameImgR = 'data_received';
const rimages = document.querySelector(`img.${classNameImgR}`)
const frontCardsArray = Array.from(frontCards);


function deleteAllImgs(){
    if(!rimages){
        return;
    }
    rimages.forEach(img => {
        if(img.parentNode){
            img.parentNode.removeChild(img);
        }
    });
}

getImgButton.addEventListener('click', function() {
    // Add your save logic here
    console.log('Save button clicked!');
    deleteAllImgs();
    
    fetch('http://localhost:8000/request_img/')
    .then(response => response.json())
    .then(data => {
      // Process the received data
      imgs = [];
      console.log("Receiving image data");
      let keys = Object.keys(data);
      
      keys.sort((a, b) => a.length - b.length);

      keys.forEach(key => {
        const base64EncodedString  = data[key];
        console.log('Key:', key);

        const imgElement = document.createElement('img');
        imgElement.src = 'data:image/jpeg;base64,' + base64EncodedString;
        imgElement.alt = `Image : ${key}`;
        imgElement.setAttribute('class','data_received');
        imgElement.setAttribute('width', '100%');
        imgElement.setAttribute('height', '100%');

        imgs.push(imgElement);
        // document.body.appendChild(imgElement);
      });
      let i = 0;

      frontCardsArray.forEach(
        item => {
            item.appendChild(imgs[i]);
            i+=1;
        }
      );
    })
    .catch(error => {
      console.error('Error:', error);
      showSwal("error-message","Hubo Error tecnico", "Puedes intentar de nuevo o notificarnos a servicioTecnico@gmail.com");
    });
  });
