import {obtenerRazasPerro, obtenerImagenPerro, cargarNuevoPerro} from './api.js'
import {conseguirHoraYFecha, transformarFecha, pintarModal, todosInputsFormularios, Perro} from './main.js'
import {estadoCamposFormularios, validateNewDogExists, camposFormularioIngresoPerro, validarSelectorRazas} from './validator.js'

//IDENTIFICACIÓN Y CONTROL DE LOS ELEMENTOS DE LOS FORMULARIOS--------------------------------------------------------------------------------------------------------------------------------

let razaPerro = document.getElementById("breed-selection");
let nombrePerro = document.getElementById("name-dog");
let edadPerro = document.getElementById("age-dog");
let pesoPerro = document.getElementById("weight-dog");

const inputsFormularioPerro = document.querySelectorAll("#formulario-ingreso-perro input");
todosInputsFormularios(inputsFormularioPerro);

//Comprobación del selector de raza al aplicarle un cambio o quitar el foco; funciona diferente al resto de inputs
razaPerro.addEventListener("change", validarSelectorRazas);
razaPerro.addEventListener("blur", validarSelectorRazas);

//OBTENER LISTA RAZAS API--------------------------------------------------------------------------------------------------------------------------------------------

let breedSelector = document.getElementById("breed-selection");
if (breedSelector){
    await obtenerRazasPerro(breedSelector);
}

//FICHA PERRO RECIEN ADOPTADO----------------------------------------------------------------------------------------------------------------

const rellenarFicha = (respuestaImagen) => {

    const divSeccionFicha = document.createElement("div");
    //divSeccionFicha.className = "ficha-section";

    const divFicha = document.createElement("div");
    divFicha.className = "ficha";
    divFicha.id = "ficha-perro";

    //Imagen del perro
    const divFichaImagen = document.createElement("div");
    divFichaImagen.className = "ficha__image";

    const divImagen = document.createElement("div");
    const imagen = document.createElement("img");
    imagen.classList.add("ficha__image__content");
    imagen.src = respuestaImagen.data.message;
    divImagen.appendChild(imagen);

    divFichaImagen.appendChild(divImagen);

    //Nombre del perro
    const nombrePerro = document.createElement("h1");
    nombrePerro.id = "nombre-perro-ficha"
    nombrePerro.className = "ficha__title";
    nombrePerro.innerHTML = nombrePerro.value;


    //Edad y peso del perro
    const divEdadPeso =  document.createElement("div");
    divEdadPeso.className = "flex";

    const divEdad = document.createElement("div");
    divEdad.className = "ficha__secciones";

    const labelEdad01 = document.createElement("p");
    labelEdad01.className = "ficha__text ficha__text--static";
    labelEdad01.innerHTML = "Edad: ";

    const valorEdad = document.createElement("p");
    valorEdad.className = "ficha__text";
    valorEdad.innerHTML = edadPerro.value;

    const labelEdad02 = document.createElement("p");
    labelEdad02.className = "ficha__text ficha__text--static";
    labelEdad02.innerHTML = " año/s";

    divEdad.appendChild(labelEdad01);
    divEdad.appendChild(valorEdad);
    divEdad.appendChild(labelEdad02);

    const divPeso = document.createElement("div");
    divPeso.className = "ficha__secciones";

    const labelPeso01 = document.createElement("p");
    labelPeso01.className = "ficha__text ficha__text--static";
    labelPeso01.innerHTML = "Peso: ";
    
    const valorPeso = document.createElement("p");
    valorPeso.className = "ficha__text";
    valorPeso.innerHTML = pesoPerro.value;

    const labelPeso02 = document.createElement("p");
    labelPeso02.className = "ficha__text ficha__text--static";
    labelPeso02.innerHTML = " kilo/s";

    divPeso.appendChild(labelPeso01);
    divPeso.appendChild(valorPeso);
    divPeso.appendChild(labelPeso02);

    divEdadPeso.appendChild(divEdad);
    divEdadPeso.appendChild(divPeso);

    //Raza del perro
    const divRaza = document.createElement("div");
    divRaza.className = "ficha__secciones";

    const labelRaza = document.createElement("p");
    labelRaza.className = "ficha__text ficha__text--static";
    labelRaza.innerHTML = "Raza: ";

    const valorRaza = document.createElement("p");
    valorRaza.className = "ficha__text";
    valorRaza.innerHTML = razaPerro.value;

    divRaza.appendChild(labelRaza);
    divRaza.appendChild(valorRaza);

    //Fecha ingreso del perro
    const divFechaIngreso = document.createElement("div");
    divFechaIngreso.className = "ficha__secciones";

    const labelFechaIngreso = document.createElement("p");
    labelFechaIngreso.className = "ficha__text ficha__text--static";
    labelFechaIngreso.innerHTML = "Fecha de ingreso: ";

    const valorFechaIngreso = document.createElement("p");
    valorFechaIngreso.className = "ficha__text";
    let fechaYHoraActual = conseguirHoraYFecha();
    let fechaTransformada = transformarFecha(fechaYHoraActual);
    valorFechaIngreso.innerHTML = fechaTransformada;

    divFechaIngreso.appendChild(labelFechaIngreso);
    divFechaIngreso.appendChild(valorFechaIngreso);

    //Botón de la ficha
    const divBoton = document.createElement("div");
    divBoton.className = "ficha__button-section";

    const botonFicha = document.createElement("button");
    botonFicha.className = "ficha__button-section__button";
    botonFicha.innerHTML = "Archivar ficha";

    divBoton.appendChild(botonFicha);

    divSeccionFicha.appendChild(divFicha);
    divFicha.appendChild(divFichaImagen);    
    divFicha.appendChild(nombrePerro);
    divFicha.appendChild(divEdadPeso);
    divFicha.appendChild(divRaza);
    divFicha.appendChild(divFechaIngreso);
    divFicha.appendChild(divBoton);

    const anclaEnHTML = document.getElementById("ancla-ficha-js");
    anclaEnHTML.appendChild(divSeccionFicha);

}


const archivarFicha = () => {
    if (document.querySelector("#foto-random-perro").firstChild){
        document.getElementById("ficha-perro").classList.add("hidden");
        document.querySelector("#foto-random-perro").firstChild.remove();
    }
}

if (document.getElementById("archivar-ficha")) {
    const botonArchivarFicha = document.getElementById("archivar-ficha");
    botonArchivarFicha.addEventListener("click", archivarFicha);
}

//CREAR UN NUEVO PERRO----------------------------------------------------------------------------------------------

const crearNuevoPerro = (nuevoNombre, nuevoEdad, nuevoRaza, nuevoPeso, nuevoImagen) => {
    let nuevoFechaIngreso = conseguirHoraYFecha();
    let nuevoEstadoAdopcion = false;
    let nuevoFechaAdopcion = "";
    let nuevoDueño = {};
    let nuevoPerro = new Perro (nuevoNombre, nuevoEdad, nuevoRaza, nuevoPeso, nuevoImagen, nuevoFechaIngreso, nuevoEstadoAdopcion, nuevoFechaAdopcion, nuevoDueño);
    return nuevoPerro;
}

//CREACIÓN DE MODALES----------------------------------------------------------------------------------------------
const crearModalHTML = (tipoDeModal) => {
    const divModalExterior = document.createElement("div");
    divModalExterior.className = "modal-wrapper";
    divModalExterior.id="popup-modal-fail";
    
    const divModal = document.createElement("div");
    divModal.className = "modal";

    const divModalContent = document.createElement("div");
    divModalContent.className = "modal__01";

    const divModalHeader = document.createElement("div");
    divModalHeader.className = "modal__header";

    const buttonHeader = document.createElement("button");
    buttonHeader.type = "button";
    buttonHeader.className = "modal__header__button";
    buttonHeader.innerHTML = "X"

    buttonHeader.addEventListener("click", function(e){
        e.preventDefault();
        divModalExterior.className = "hidden";
        divModalExterior.innerHTML = " ";
    })

    const divModalBody = document.createElement("div");
    divModalBody.className = "modal__body";

    const messageBody = document.createElement("h3");
    messageBody.className = "modal__body__title";
    if(tipoDeModal == "succes"){
        messageBody.innerHTML = "El perro ha sido dado de alta en la perrera correctamente";
    } else if (tipoDeModal == "fail"){
        messageBody.innerHTML = "Este perro ya existe";
    }
    

    const buttonBody = document.createElement("button");
    buttonBody.type = "button";
    buttonBody.className = "modal__body__button";
    buttonBody.id = "popup-modal-succes-body-button";
    buttonBody.innerHTML = "Aceptar"

    buttonBody.addEventListener("click", function(e){
        e.preventDefault();
        divModalExterior.className = "hidden";
        divModalExterior.innerHTML = " ";
    })

    divModalExterior.appendChild(divModal);
    divModal.appendChild(divModalContent);
    divModalContent.appendChild(divModalHeader);
    divModalHeader.appendChild(buttonHeader);
    divModalContent.appendChild(divModalBody);
    divModalBody.appendChild(messageBody);
    divModalBody.appendChild(buttonBody);
    document.body.appendChild(divModalExterior);
}

//COMPROBACIÓN Y SUBMIT INGRESO PERRO----------------------------------------------------------------------------------------------
const pruebaPerro = async (e) => {
    e.preventDefault();
    try {
        //e.preventDefault();
        if (estadoCamposFormularios(camposFormularioIngresoPerro)) {//True = Los campos del fromulario son correctos
            if (await validateNewDogExists(nombrePerro.value, edadPerro.value, razaPerro.value, pesoPerro.value)) {//True = El nuevo perro no existe en la BBDD
                let imagenParaElNuevoPerro = await obtenerImagenPerro(razaPerro);//Obtenemos la imagen para el nuevo perro a partir de la raza introducida en el formulario
                let nuevoPerroCreado = crearNuevoPerro(nombrePerro.value, edadPerro.value, razaPerro.value, pesoPerro.value, imagenParaElNuevoPerro.data.message);//Creamos el nuevo perro con toda la información que tenemos
                await cargarNuevoPerro(nuevoPerroCreado);//Cargamos el perro que hemos creado en la BBDD
                rellenarFicha(imagenParaElNuevoPerro);//Rellenamos la ficha pasandole la imagen obtenida y la pintamos
                crearModalHTML("succes");
            } else {//El perro sí existe en la BBDD y por lo tanto, no lo podemos crear
                crearModalHTML("fail");
                //formularioIngresoPerro.reset();//Reseteamos los campos del formulario de ingreso para que vuelva a empezar el proceso de alta del perro
            }
            //setTimeout(archivarFicha, 5000);//Hacemos que se borre automáticamente la ficha al cabo de 5 segundos
            //formularioIngresoPerro.reset();//Reseteamos los campos del formulario de ingreso
        } else {
            console.log("Error aquí" + camposFormularioIngresoPerro.nombre + camposFormularioIngresoPerro.edad + camposFormularioIngresoPerro.raza + camposFormularioIngresoPerro.peso);
        }
    } catch (error) {
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }

}

const formularioIngresoPerro = document.getElementById("formulario-ingreso-perro");
if (formularioIngresoPerro) {
    formularioIngresoPerro.addEventListener("submit", pruebaPerro);
}


export {rellenarFicha}