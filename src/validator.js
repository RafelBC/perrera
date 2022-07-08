import {borrarModal, rellenarFicha, formularioIngresoPerro, pintarModal, crearNuevoPerro} from './main.js'
//CONTROLADOR CAMPOS FORMULARIO INGRESO PERRO---------------------------------------------------------------------------------------------------------------------------------------

const camposFormularioIngresoPerro = {
    nombre: false,
    edad: false,
    raza: false,
    peso: false
}

//CONTROLADOR CAMPOS FORMULARIO ADOPCIÓN DUEÑO---------------------------------------------------------------------------------------------------------------------------------------

const camposFormularioAdopcionDueno = {
    nombre: false,
    apellidos: false,
    telefono: false,
    email: false,
    direccion: false,
    codigoPostal: false,
    ciudad: false
}

//COMPROBAR CONTROLADORES CAMPOS FORMULARIOS---------------------------------------------------------------------------------------------------------------------------------------

const estadoCamposFormularios = (formularioAComprobar) => {
    for (let i in formularioAComprobar){
        if(formularioAComprobar[i] == false){
            return false;
        }
    }return true;
}

//DISTRIBUIDOR DE ELEMENTO DEL FORMULARIO A VALIDAR---------------------------------------------------------------------------------------------------------------------------------------

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

//PATRONES PARA COMPROBAR CONTENIDO CAMPOS FORMULARIOS---------------------------------------------------------------------------------------------------------------------------------------

const patternText = new RegExp(/^[A-ZÀÈÒÁÉÍÓÚa-zàèòñáéíóú\s\/]+$/);
const patternNumber = new RegExp('^[0-9]+');
const patternEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const patternPhone = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3}$/im);
const patternCodigoPostal = new RegExp('[0-9]{5}');
const patternAddress = new RegExp(/^[A-ZÀÈÒÁÉÍÓÚa-zàèòñáéíóú0-9,\s\d\/]+$/);

//COMPROBAR CAMPOS FORMULARIOS SEGÚN PATRÓN---------------------------------------------------------------------------------------------------------------------------------------
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

//TRANSICIÓN DE LOS ELEMENTOS A VALIDAR HACIA LA FUNCIÓN QUE LOS COMPRUEBA SEGÚN LOS PARÁMETROS QUE LES PASAMOS EN CADA CASO---------------------------------------------------------------------------------------------------------------------------------------

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


//VALIDAR SI EL PERRO A INGRESAR YA EXISTE EN LA BBDD-------------------------------------------------------------------

const validateNewDogExists = async (nuevoPerroNombre, nuevoPerroEdad, nuevoPerroRaza, nuevoPerroPeso) => {
    try {
        const listadoPerrosExistentes = await axios.get("http://localhost:3000/dogs?estadoAdopcion=false");
        let totalPerros = listadoPerrosExistentes.data;
        let nuevoPerro = {
            nombre: nuevoPerroNombre,
            edad: nuevoPerroEdad,
            raza: nuevoPerroRaza,
            peso: nuevoPerroPeso
        };
        for (let perroIndice of totalPerros){
            if (objectsCompare(nuevoPerro, perroIndice)){
                return false;//Los dos perros son iguales
            }
        }
        return true;
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}

//COMPARAR OBJETOS (PERROS)-------------------------------------------------------------------

const objectsCompare = (object1, object2) => {
    let object1_keys = Object.keys(object1);
    let counterEquals = 0;
    for (let k of object1_keys){
        if (object1[k] === object2[k]){
            counterEquals += 1;
        }
    }
    if(counterEquals==object1_keys.length){
        return true;//Los dos perros son iguales
      }else{
        return false;//Los dos perros son diferentes
      }
}

export {validarFormulario,  validateDogAge, validateDogWeight, validateDogName, validarSelectorRazas, camposFormularioIngresoPerro, camposFormularioAdopcionDueno, validateNewDogExists, estadoCamposFormularios}