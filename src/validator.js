import {borrarModal, /*cerrarModal,*/ archivarFicha, rellenarFicha, obtenerImagenPerro, formularioIngresoPerro, pintarModal, crearNuevoPerro} from './main.js'

const camposFormularioIngresoPerro = {
    nombre: false,
    edad: false,
    raza: false,
    peso: false
}

const camposFormularioAdopcionDueno = {
    nombre: false,
    apellidos: false,
    telefono: false,
    email: false,
    direccion: false,
    codigoPostal: false,
    ciudad: false
}

const validarFormulario = (e) => {
    console.log("Esto es " + e.target.name)
    switch (e.target.name) {
        case "name-dog":
            validateDogName()
        break;
        case "age-dog":
            validateDogAge()
        break;
        case "weight-dog":
            validateDogWeight()
        break;
        case "name-owner":
            validateNameOwner()
        break;
        case "last-name-owner":
            validateLastNameOwner()
        break;
        case "telephone-owner":
            validateTelephoneOwner()
        break;
        case "email-owner":
            validateEmailOwner()
        break;
        case "address-owner":
            validateAddressOwner()
        break;
        case "c-p-owner":
            validateCPOwner()
        break;
        case "city-owner":
            validateCityOwner()
        break;
    }
}

const patternText = new RegExp(/^[A-ZÀÈÒÁÉÍÓÚa-zàèòñáéíóú\s\/]+$/);
const patternNumber = new RegExp('^[0-9]+');
const patternEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const patternPhone = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3}$/im);
const patternCodigoPostal = new RegExp('[0-9]{5}');
const patternAddress = new RegExp(/^[A-ZÀÈÒÁÉÍÓÚa-zàèòñáéíóú0-9\s\d\/]+$/);//No permite comas, guiones...

const inputBaseValidator = (element, selector) => {

    const patternToValidate = ['peso', 'edad'].includes(selector) ? patternNumber 
        : ['telefono-dueno'].includes(selector) ? patternPhone
        : ['email-dueno'].includes(selector) ? patternEmail
        : ['direccion-dueno'].includes(selector) ? patternAddress
        : ['codigo-postal-dueno'].includes(selector) ? patternCodigoPostal
        : patternText;
    let input = document.getElementById(element);
    const elementToBeModify = document.querySelector(`#grupo__${selector} .form__text-error`)
    if (input.value.trim() == "" || input.value.trim() == 0 || !patternToValidate.test(input.value)){
        input.style.borderColor = "#E22E11";
        elementToBeModify.classList.add("form__text-error--activo");
        if (['peso', 'edad', 'nombre'].includes(selector)) {
            camposFormularioIngresoPerro[selector] = false;
        }else {
            camposFormularioAdopcionDueno[selector] = false;
        }
    } else {
        input.style.borderColor = "#D1D5DB";
        elementToBeModify.classList.remove("form__text-error--activo");
        if (['peso', 'edad', 'nombre'].includes(selector)) {
            camposFormularioIngresoPerro[selector] = true;
        }else {
            camposFormularioAdopcionDueno[selector] = true;
        }
    }
}

/* const inputBaseValidator = (element, selector) => {

    const patternToValidate = ['peso', 'edad'].includes(selector) ? patternNumber : patternText;
    let input = document.getElementById(element);
    const elementToBeModify = document.querySelector(`#grupo__${selector} .form__text-error`)
    if (input.value.trim() == "" || input.value.trim() == 0 || !patternToValidate.test(input.value)){
        input.style.borderColor = "#E22E11";
        elementToBeModify.classList.add("form__text-error--activo");
        camposFormularioIngresoPerro[selector] = false;
    } else {
        input.style.borderColor = "#D1D5DB";
        elementToBeModify.classList.remove("form__text-error--activo");
        camposFormularioIngresoPerro[selector] = true;
    }
} */

const validateDogName = () => inputBaseValidator('name-dog', 'nombre');
const validateDogWeight = () => inputBaseValidator('weight-dog', 'peso');
const validateDogAge = () => inputBaseValidator('age-dog', 'edad');
const validarSelectorRazas = () => {
    let razaPerro = document.getElementById("breed-selection");
    if (razaPerro.value == "default-option"){
        razaPerro.style.borderColor = "#E22E11";
        document.querySelector("#grupo__raza .form__text-error").classList.add("form__text-error--activo");
        camposFormularioIngresoPerro.raza = false;
    } else {
        razaPerro.style.borderColor = "#D1D5DB";
        document.querySelector("#grupo__raza .form__text-error").classList.remove("form__text-error--activo");
        camposFormularioIngresoPerro.raza = true;
    }
}
const validateNameOwner = () => inputBaseValidator('name-owner', 'nombre-dueno');
const validateLastNameOwner = () => inputBaseValidator('last-name-owner', 'apellidos-dueno');
const validateTelephoneOwner = () => inputBaseValidator('telephone-owner', 'telefono-dueno');
const validateEmailOwner = () => inputBaseValidator('email-owner', 'email-dueno');
const validateAddressOwner = () => inputBaseValidator('address-owner', 'direccion-dueno');
const validateCPOwner = () => inputBaseValidator('c-p-owner', 'codigo-postal-dueno');
const validateCityOwner = () => inputBaseValidator('city-owner', 'ciudad-dueno');


//Validar si el perro a ingresar ya existe en la BBDD-------------------------------------------------------------------

const validateNewDogExists = async (nuevoPerroNombre, nuevoPerroEdad, nuevoPerroRaza, nuevoPerroPeso) => {
    try {
        const listadoPerrosExistentes = await axios.get("http://localhost:3000/dogs");
        let totalPerros = listadoPerrosExistentes.data;
        for (let perroIndice of totalPerros){
            if (perroIndice.nombre == nuevoPerroNombre && perroIndice.edad == nuevoPerroEdad && perroIndice.raza == nuevoPerroRaza && perroIndice.peso == nuevoPerroPeso){
                document.getElementById("popup-modal-fail").classList.remove("hidden");
                document.getElementById("popup-modal-fail").classList.add("block");
                const botonHeaderModalFail = document.getElementById("modal-fail-header-button");
                const botonBodyModalFail = document.getElementById("modal-fail-body-button");
                botonHeaderModalFail.addEventListener("click", borrarModal);
                botonBodyModalFail.addEventListener("click", borrarModal);
                formularioIngresoPerro.reset();
                return;
            }
        }
        rellenarFicha();
        await obtenerImagenPerro(nuevoPerroNombre, nuevoPerroEdad, nuevoPerroRaza, nuevoPerroPeso);
        formularioIngresoPerro.reset();
        pintarModal();
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}

export {validarFormulario,  validateDogAge, validateDogWeight, validateDogName, validarSelectorRazas, camposFormularioIngresoPerro, camposFormularioAdopcionDueno, validateNewDogExists}