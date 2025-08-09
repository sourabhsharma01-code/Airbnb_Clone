// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();



//////////////flash message disaapear

setTimeout(()=>{
let flash = document.getElementById("flashMessage");
if(flash){
  flash.style.transition = "opacity 0.5s";
  flash.style.opacity = "0";
  setTimeout(()=>{
    flash.remove()
  },500 )
}

}, 3000)



function addFiled() {
  let container = document.querySelector("#file_container");
  let newInput = document.createElement("input"); // Create a new file input

  newInput.type = "file";
  newInput.name = "image";
  container.appendChild(newInput) 
}