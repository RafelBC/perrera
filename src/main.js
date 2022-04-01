
import {validarFormulario, validateDogAge, validateDogName, validarSelectorRazas, validateDogWeight, camposFormularioIngresoPerro, camposFormularioAdopcionDueno, validateNewDogExists} from './validator.js'
import {actualizarAdopcionPerro, listaPerrosYaAdoptados, obtenerRazasPerro, listaPerrosDisponiblesAdopcion} from './api.js'
//OBTENER LISTA RAZAS API--------------------------------------------------------------------------------------------------------------------------------------------

let breedSelector = document.getElementById("breed-selection");
if (breedSelector){
    await obtenerRazasPerro(breedSelector);
}

//CARGA PERRO EN BBDD-----------------------------------------------------------------------------------------------------------------------------------------

const cargarNuevoPerro = async (nuevoPerro) => {
    try {
        const perroCargado = await axios.post("http://localhost:3000/dogs", nuevoPerro);
        alert(`El perro ${perroCargado.nombre} ha sido cargado`);
        return;
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la carga de datos.");
    }
}

//RECUPERAR 3 ÚLTIMOS PERROS ADOPTADOS--------------------------------------------------------------------------------------------------------------------------

const obtenerPerrosAdoptados = async () => {
    try {
        //Obtenemos la lista de perros adoptados y los ordenamos por fecha de adopción más reciente a menos reciente
        const perrosAdoptados = await listaPerrosYaAdoptados();
        const variablePerrosAPintar = perrosAdoptados.data.length > 3 ? 3 : perrosAdoptados.data.length;
        for (let i=0; i<variablePerrosAPintar; i++){
            //Clonamos la ficha de muestra para rellenarla luego con la info de los 3 últimos perros y la colocamos en su sitio
            const elementoAClonar = document.getElementById("ficha-perro-adoptado");
            if(elementoAClonar){
                const clon = elementoAClonar.cloneNode(true);
                clon.id = `ficha-perro-adoptado-0${i}`;
                const seccionPerrosAdoptados = document.getElementById("seccion-perros-adoptados");
                seccionPerrosAdoptados.appendChild(clon);
                //Creamos el elemento imagen, con su clase y su src
                const imagenPerroAdoptado = document.createElement("img");
                imagenPerroAdoptado.classList.add("card__image-content__image");
                imagenPerroAdoptado.src = perrosAdoptados.data[i].imagen;
                //Añadimos la info en cada parte de la ficha
                document.querySelector(`#ficha-perro-adoptado-0${i} #foto-perro-adoptado-00`).appendChild(imagenPerroAdoptado);
                document.querySelector(`#ficha-perro-adoptado-0${i} #nombre-perro-ficha-adoptado-00`).innerHTML = perrosAdoptados.data[i].nombre;
                document.querySelector(`#ficha-perro-adoptado-0${i} #edad-perro-ficha-adoptado-00`).innerHTML = perrosAdoptados.data[i].edad;
                document.querySelector(`#ficha-perro-adoptado-0${i} #raza-perro-ficha-adoptado-00`).innerHTML = perrosAdoptados.data[i].raza;
                document.querySelector(`#ficha-perro-adoptado-0${i} #peso-perro-ficha-adoptado-00`).innerHTML = perrosAdoptados.data[i].peso;
                document.querySelector(`#ficha-perro-adoptado-0${i} #fecha-ingreso-perro-ficha-adoptado-00`).innerHTML = perrosAdoptados.data[i].fechaAdopcion;
            }
        }
        if (document.getElementById("ficha-perro-adoptado")) {
            document.getElementById("ficha-perro-adoptado").classList.add("hidden");//Ocultamos la ficha que usamos de ejemplo para la clonación
        }
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}

obtenerPerrosAdoptados();

//RECUPERAR PERROS NO ADOPTADOS-------------------------------------------------------------------------------------------------------------------------------------

const obtenerPerrosDisponiblesAdopcion = async () => {
    try {
        //Obtenemos la lista de perros no adoptados y los ordenamos por fecha de admisión más antigua a más actual
        const perrosDisponiblesAdopcion = await listaPerrosDisponiblesAdopcion();
        for (let i=0; i<perrosDisponiblesAdopcion.data.length; i++){
            //Clonamos la ficha de muestra para rellenarla luego con la info de los perros disponibles para adopción y la colocamos en su sitio
            if (document.getElementById("ficha-perro-disponible-adopcion")) {
                const perroNoAdoptadoAClonar = document.getElementById("ficha-perro-disponible-adopcion");
                const perroNoAdoptadoClon = perroNoAdoptadoAClonar.cloneNode(true);
                perroNoAdoptadoClon.id = `ficha-perro-disponible-adopcion-0${i}`;
                //perroNoAdoptadoClon.button.id = `adoptar-perro`
                const seccionPerrosAdoptados = document.getElementById("seccion-perros-disponibles-adopcion");
                seccionPerrosAdoptados.appendChild(perroNoAdoptadoClon);
                //Creamos el elemento imagen, con su clase y su src
                const imagenPerroAdoptado = document.createElement("img");
                imagenPerroAdoptado.classList.add("card__image-content__image");
                imagenPerroAdoptado.src = perrosDisponiblesAdopcion.data[i].imagen;
                //Añadimos la info en cada parte de la ficha
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #foto-perro-disponible-adopcion-00`).appendChild(imagenPerroAdoptado);
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #nombre-perro-ficha-disponible-adopcion-00`).innerHTML = perrosDisponiblesAdopcion.data[i].nombre;
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #edad-perro-ficha-disponible-adopcion-00`).innerHTML = perrosDisponiblesAdopcion.data[i].edad;
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #raza-perro-ficha-disponible-adopcion-00`).innerHTML = perrosDisponiblesAdopcion.data[i].raza;
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #peso-perro-ficha-disponible-adopcion-00`).innerHTML = perrosDisponiblesAdopcion.data[i].peso;
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #fecha-ingreso-perro-ficha-disponible-adopcion-00`).innerHTML = perrosDisponiblesAdopcion.data[i].fechaIngreso;
                document.querySelector(`#ficha-perro-disponible-adopcion-0${i} #identificador`).innerHTML = perrosDisponiblesAdopcion.data[i].id;
            }
        }
        if (document.getElementById("ficha-perro-disponible-adopcion")) {
            document.getElementById("ficha-perro-disponible-adopcion").classList.add("hidden");//Ocultamos la ficha que usamos de ejemplo para la clonación
        }
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}
obtenerPerrosDisponiblesAdopcion();

//FORMULARIO DUEÑO-----------------------------------------------------------------------------------------------------------

let botonAdoptarPerro = document.querySelector("#modal-adoption-body-button");

const inputsFormularioDueno = document.querySelectorAll("#formulario-adopcion-dueno input");

inputsFormularioDueno.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
})

//Comprobación de los campos al hacer click al botón de enviar
if (botonAdoptarPerro){
    botonAdoptarPerro.addEventListener("click", validarFormulario);
}


//FORMULARIO INGRESO-----------------------------------------------------------------------------------------------------------

let razaPerro = document.getElementById("breed-selection");
let nombrePerro = document.getElementById("name-dog");
let edadPerro = document.getElementById("age-dog");
let pesoPerro = document.getElementById("weight-dog");

let botonIngresarPerro = document.querySelector("#boton-ingresar-perro");

const inputsFormulario = document.querySelectorAll("#formulario-ingreso-perro input");

//Comprobación de los campos al levantar una tecla o al quitar el foco de un elemento
inputsFormulario.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
})
if (razaPerro) {
    razaPerro.addEventListener("change", validarSelectorRazas);
    razaPerro.addEventListener("blur", validarSelectorRazas);
}


//Comprobación de los campos al hacer click al botón de enviar
if (botonIngresarPerro) {
    botonIngresarPerro.addEventListener("click", validarFormulario);
    botonIngresarPerro.addEventListener("click", validarSelectorRazas);
}


const pintarModal = () => { //SE POT OPTIMITZAR (amb es pintar modal-fail)
    document.getElementById("popup-modal-succes").classList.remove("hidden");
    document.getElementById("popup-modal-succes").classList.add("block");
    const botonHeaderModal = document.getElementById("modal-succes-header-button");
    const botonBodyModal = document.getElementById("modal-succes-body-button");
    botonHeaderModal.addEventListener("click", borrarModal);
    botonBodyModal.addEventListener("click", borrarModal);
    setTimeout (borrarModal, 2000);
}

const borrarModal = () => { //SE POT OPTIMITZAR
    if(document.getElementById("popup-modal-succes")){
        document.getElementById("popup-modal-succes").classList.add("hidden");
        document.getElementById("popup-modal-succes").classList.remove("block");
    }
    if(document.getElementById("popup-modal-fail")){
        document.getElementById("popup-modal-fail").classList.add("hidden");
        document.getElementById("popup-modal-fail").classList.remove("block");
    }
    if(document.getElementById("popup-modal-adoption")){
        document.getElementById("popup-modal-adoption").classList.add("hidden");
    }
    
}

//FICHA PERRO----------------------------------------------------------------------------------------------------------------

const obtenerImagenPerro = async (nuevoPerroNombre, nuevoPerroEdad, nuevoPerroRaza, nuevoPerroPeso) => {
    try {
        let razaRutaURL = razaPerro.value.replace(" ","/");
        const respuestaImagen = await axios.get(`https://dog.ceo/api/breed/${razaRutaURL}/images/random`);
        const imagen = document.createElement("img");
        imagen.classList.add("ficha__image__content");
        imagen.src = respuestaImagen.data.message;

        crearNuevoPerro(nuevoPerroNombre, nuevoPerroEdad, nuevoPerroRaza, nuevoPerroPeso, respuestaImagen.data.message);
        
        document.querySelector("#foto-random-perro").appendChild(imagen);
        document.getElementById("ficha-perro").classList.remove("hidden");
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}

const rellenarFicha = () => {
    document.getElementById("nombre-perro-ficha").innerHTML = nombrePerro.value;
    document.getElementById("edad-perro-ficha").innerHTML = edadPerro.value;
    document.getElementById("raza-perro-ficha").innerHTML = razaPerro.value;
    document.getElementById("peso-perro-ficha").innerHTML = pesoPerro.value;
    document.getElementById("fecha-ingreso-perro-ficha").innerHTML = conseguirHoraYFecha();
}

const archivarFicha = () => {
    if (document.querySelector("#foto-random-perro").firstChild){
        document.getElementById("ficha-perro").classList.add("hidden");
        document.querySelector("#foto-random-perro").firstChild.remove();
    }
}

if (document.getElementById("archivar-ficha")) {
    const botonArchivarFicha = document.getElementById("archivar-ficha").addEventListener("click", archivarFicha);
}

//CLASES PERRO Y DUENO----------------------------------------------------------------------------------------------
/* class Perro {
    #nombre;
    #edad;
    #raza;
    #peso;
    constructor(nombre, edad, raza, peso){
        this.#nombre = nombre;
        this.#edad = edad;
        this.#raza = raza;
        this.#peso = peso;
    }
    nombre(){
        return this.#nombre;
    }
    edad(){
        return this.#edad;
    }
    raza(){
        return this.#raza;
    }
    peso(){
        return this.#peso;
    }
} */
class Perro {
    constructor(nombre, edad, raza, peso, imagen, fechaIngreso, estadoAdopcion, fechaAdopcion, dueño){
        this.nombre = nombre;
        this.edad = edad;
        this.raza = raza;
        this.peso = peso;
        this.imagen = imagen;
        this.fechaIngreso = fechaIngreso;
        this.estadoAdopcion = estadoAdopcion;//False == No adoptado
        this.fechaAdopcion = fechaAdopcion;
        this.dueño = dueño;
    }
}

class Dueno {
    constructor(nombre, apellidos, telefono, email, direccion, codigoPostal, ciudad){
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.email = email;
        this.direccion = direccion; 
        this.codigoPostal = codigoPostal;
        this.ciudad = ciudad;
    }
}

const conseguirHoraYFecha = () => {
    let hoy = new Date();
    let fecha = hoy.getDate() + "-" + (hoy.getMonth()+1) + "-" + hoy.getFullYear();
    let hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
    let fechaYhora = fecha + " " + hora;
    return fechaYhora;
}

const crearNuevoPerro = (nuevoNombre, nuevoEdad, nuevoRaza, nuevoPeso, nuevoImagen) => {
    let nuevoFechaIngreso = conseguirHoraYFecha();
    let nuevoEstadoAdopcion = false;
    let nuevoFechaAdopcion = "";
    let nuevoDueño = {};
    let nuevoPerro = new Perro (nuevoNombre, nuevoEdad, nuevoRaza, nuevoPeso, nuevoImagen, nuevoFechaIngreso, nuevoEstadoAdopcion, nuevoFechaAdopcion, nuevoDueño);
    cargarNuevoPerro(nuevoPerro);
}

//COMPROBACIÓN Y SUBMIT INGRESO PERRO----------------------------------------------------------------------------------------------

const formularioIngresoPerro = document.getElementById("formulario-ingreso-perro");
if (formularioIngresoPerro){
    formularioIngresoPerro.addEventListener("submit", async(e) => {
        e.preventDefault();
        if (camposFormularioIngresoPerro.nombre && camposFormularioIngresoPerro.edad && camposFormularioIngresoPerro.raza && camposFormularioIngresoPerro.peso){
            await validateNewDogExists(nombrePerro.value, edadPerro.value, razaPerro.value, pesoPerro.value);
            archivarFicha();
        } else {
            console.log("Error aquí" + camposFormularioIngresoPerro.nombre + camposFormularioIngresoPerro.edad + camposFormularioIngresoPerro.raza + camposFormularioIngresoPerro.peso);
        }
    })
}

//ADOPTAR PERRO------------------------------------------------------------------------------------------------------------------------

document.addEventListener("click", function(e){//Click en cualquiera de los botones de adoptar
    if (e.target.className == "ficha__button-section__button"){
        let perroAAdoptar = e.target.parentElement.parentElement.parentElement.getAttribute("id");
        let identificadorPerroAdoptar = document.getElementById(`${perroAAdoptar}`).getElementsByTagName("span")[0].innerHTML;
        //document.getElementById("popup-modal-adoption").classList.remove("hidden");
        comprobacionDuenoYAdopcion(identificadorPerroAdoptar);//AWAIT?
    }
})

//COMPROBACIÓN Y SUBMIT ADOPCIÓN PERRO----------------------------------------------------------------------------------------------

const comprobacionDuenoYAdopcion = (identificadorPerro) => {
    document.getElementById("popup-modal-adoption").classList.remove("hidden");
    const botonHeaderModalAdopcion = document.getElementById("modal-adoption-header-button");
    botonHeaderModalAdopcion.addEventListener("click", borrarModal);
    const formularioAdopcionPerro = document.getElementById("modal-adoption-body-button");
    if (formularioAdopcionPerro){
        formularioAdopcionPerro.addEventListener("submit", (e)=> {
            e.preventDefault();
            console.log("He llegado aquí 3");
            //validarFormulario(e);
            if (camposFormularioAdopcionDueno.nombre && camposFormularioAdopcionDueno.apellidos && camposFormularioAdopcionDueno.telefono && camposFormularioAdopcionDueno.email && camposFormularioAdopcionDueno.direccion && camposFormularioAdopcionDueno.codigoPostal && camposFormularioAdopcionDueno.ciudad){
                alert("Ojo");
                let nombreDueno = document.getElementById("name-owner");
                let apellidoDueno = document.getElementById("last-name-owner");
                let telefonoDueno = document.getElementById("telephone-owner");
                let emailDueno = document.getElementById("email-owner");
                let direccionDueno = document.getElementById("address-owner");
                let codigoPostalDueno = document.getElementById("c-p-owner");
                let ciudadDueno = document.getElementById("city-owner");
                const perrosYaAdoptados = listaPerrosYaAdoptados();//AWAIT?
                for(let perroIndice of perrosYaAdoptados.data){
                    if(perroIndice.dueño.nombre == nombreDueno && perroIndice.dueño.apellidos == apellidoDueno && perroIndice.dueño.telefono == telefonoDueno && perroIndice.dueño.email == emailDueno && perroIndice.dueño.direccion == direccionDueno && perroIndice.dueño.codigoPostal == codigoPostalDueno && perroIndice.dueño.ciudad == ciudadDueno){
                        alert("Ya tienes almenos un perro adoptado")
                    }else{
                        let nuevoDueno = new Dueno (nombreDueno, apellidoDueno, telefonoDueno, emailDueno, direccionDueno, codigoPostalDueno, ciudadDueno);
                        actualizarAdopcionPerro(nuevoDueno, identificadorPerro);//AWAIT?
                    }
            }
            //Hay que validar que no exista ya un perro con un dueño que coincida con estos datos para así pintar modal de recapacitación
                //Si existe, se pinta modal S/N
                    //Si contesta que está seguro, el proceso sigue
                        //Se hace update al perro en cuestión, se le cambia el estatus de "no adoptado", se rellena el campo de dueño con la info del form y se carga la fecha del momento de la adopción
                    //Si contesta que no, el proceso se detiene
        }else{console.log("WTF")}
    })
}
}

/* const formularioAdopcionPerro000 = document.getElementById("modal-adoption-body-button");
console.log(formularioAdopcionPerro000);
if (formularioAdopcionPerro000){
    console.log("He llegado aquí 002");
    formularioAdopcionPerro000.addEventListener("click", () => console.log("He llegado aquí 003"));
}  */

//ACTUALIZAR PERRO ADOPTADO EN BBDD-----------------------------------------------------------------------------------------------------------------------------------------

// const actualizarAdopcionPerro = async (duenoACargar, perroAModificar) => {
//     try {
//         let horaAdopcion = conseguirHoraYFecha();
//         const perroCargado = await axios.put(`http://localhost:3000/dogs/:id=${perroAModificar}`, {
//             estadoAdopcion: true,
//             fechaAdopcion: horaAdopcion,
//             dueño: duenoACargar
//         });
//         alert(`El perro ${perroCargado.nombre} ha sido adoptado`);
//         return;
//     } catch (error){
//         console.log(error);
//         alert(error.message + ". Ha habido un problema con la carga de datos.");
//     }
// }


export {borrarModal, /*cerrarModal,*/ archivarFicha, rellenarFicha, obtenerImagenPerro, formularioIngresoPerro, pintarModal, crearNuevoPerro}