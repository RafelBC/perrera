
import {validarFormulario, validateDogAge, validateDogName, validarSelectorRazas, validateDogWeight, camposFormularioIngresoPerro, camposFormularioAdopcionDueno, validateNewDogExists, estadoCamposFormularios} from './validator.js'
import {actualizarAdopcionPerro, listaPerrosYaAdoptados, obtenerRazasPerro, listaPerrosDisponiblesAdopcion, obtenerImagenPerro, cargarNuevoPerro} from './api.js'
import Perro from './modules/perro.js'
import Dueno from './modules/dueno.js'

//FUNCIÓN PARA CONSEGUIR HORA Y FECHA------------------------------------------------------------------------------------------------------

const conseguirHoraYFecha = () => {
    let hoy = new Date();
    return hoy;
}

//FUNCIÓN PARA TRANSFORMAR FECHA EN FORMATO MÁS LEIBLE------------------------------------------------------------------------------------------------------

const transformarFecha = (horaYFechaATransformar) => {
    let horaYFechaFormatoDate = new Date (horaYFechaATransformar);
    let fechaFormatoLeible = horaYFechaFormatoDate.getDate() + "-" + (horaYFechaFormatoDate.getMonth()+1) + "-" + horaYFechaFormatoDate.getFullYear();
    return fechaFormatoLeible
}


//RECUPERAR 3 ÚLTIMOS PERROS ADOPTADOS--------------------------------------------------------------------------------------------------------------------------

const obtenerPerrosAdoptados = async () => {
        //Obtenemos la lista de perros adoptados y los ordenamos por fecha de adopción más reciente a menos reciente
        const perrosAdoptados = await listaPerrosYaAdoptados();
        const numeroDePerrosAdoptadosAPintar = perrosAdoptados.data.length > 3 ? 3 : perrosAdoptados.data.length;
        const elementoAClonar = document.getElementById("ficha-perro-adoptado");
        const seccionPerrosAdoptados = document.getElementById("seccion-perros-adoptados");
        rellenarFichasPerros(numeroDePerrosAdoptadosAPintar, perrosAdoptados, elementoAClonar, seccionPerrosAdoptados);
}

obtenerPerrosAdoptados();

//RECUPERAR PERROS NO ADOPTADOS-------------------------------------------------------------------------------------------------------------------------------------

const obtenerPerrosDisponiblesAdopcion = async () => {
        //Obtenemos la lista de perros no adoptados y los ordenamos por fecha de admisión más antigua a más actual
        const perrosDisponiblesAdopcion = await listaPerrosDisponiblesAdopcion();
        const numeroDePerrosDisponiblesAPintar = perrosDisponiblesAdopcion.data.length;
        const perroNoAdoptadoAClonar = document.getElementById("ficha-perro-disponible");
        const seccionPerrosAdoptados = document.getElementById("seccion-perros-disponibles");
        rellenarFichasPerros(numeroDePerrosDisponiblesAPintar, perrosDisponiblesAdopcion, perroNoAdoptadoAClonar, seccionPerrosAdoptados);
}
obtenerPerrosDisponiblesAdopcion();

//RELLENAR LAS FICHAS DE PERROS ADOPTADOS Y DE DISPONIBLES PARA LA ADOPCIÓN--------------------------------------------------------------------------------------------------------------------------

const rellenarFichasPerros = (numeroDePerros, listadoDePerros, origenFichaClonar, seccionDondeClonar) => {
    for (let i=0; i<numeroDePerros; i++){
        if(origenFichaClonar){
            const clon = origenFichaClonar.cloneNode(true);//Clonamos la ficha de muestra para rellenarla luego con la info de los perros
            clon.id = `${origenFichaClonar.id}-0${i}`;//Modificamos el ID de la ficha clonada para poder ir numerando cada copia
            seccionDondeClonar.appendChild(clon);//Colocamos la ficha clonada en su sitio
            const imagenPerro = document.createElement("img");//Creamos el elemento imagen
            imagenPerro.classList.add("card__image-content__image");//Añadimos la classe que deseada a la imagen
            imagenPerro.src = listadoDePerros.data[i].imagen;//Añadimos la source a la imagen
            //Añadimos la info extraída de la BBDD en cada parte de la ficha
            document.querySelector(`#${origenFichaClonar.id}-0${i} #foto-${origenFichaClonar.id}-00`).appendChild(imagenPerro);
            document.querySelector(`#${origenFichaClonar.id}-0${i} #nombre-${origenFichaClonar.id}-00`).innerHTML = listadoDePerros.data[i].nombre;
            document.querySelector(`#${origenFichaClonar.id}-0${i} #edad-${origenFichaClonar.id}-00`).innerHTML = listadoDePerros.data[i].edad;
            document.querySelector(`#${origenFichaClonar.id}-0${i} #raza-${origenFichaClonar.id}-00`).innerHTML = listadoDePerros.data[i].raza;
            document.querySelector(`#${origenFichaClonar.id}-0${i} #peso-${origenFichaClonar.id}-00`).innerHTML = listadoDePerros.data[i].peso;       
            if(seccionDondeClonar.id == "seccion-perros-disponibles"){
                let fechaIngresoFormatoSimple = transformarFecha(listadoDePerros.data[i].fechaIngreso);
                document.querySelector(`#${origenFichaClonar.id}-0${i} #fecha-ingreso-${origenFichaClonar.id}-00`).innerHTML = fechaIngresoFormatoSimple;
            } else {
                let fechaAdopcionFormatoSimple = transformarFecha(listadoDePerros.data[i].fechaAdopcion);
                document.querySelector(`#${origenFichaClonar.id}-0${i} #fecha-adopcion-${origenFichaClonar.id}-00`).innerHTML = fechaAdopcionFormatoSimple;
            }
            if (document.querySelector(`#${origenFichaClonar.id}-0${i} #identificador`)){
                document.querySelector(`#${origenFichaClonar.id}-0${i} #identificador`).innerHTML = listadoDePerros.data[i].id;//Esto solo está para perros para adoptar
            }
        }
    }
    if(origenFichaClonar){
        origenFichaClonar.classList.add("hidden");//Ocultamos la ficha que usamos de ejemplo para la clonación
    }
}

//IDENTIFICACIÓN Y CONTROL DE LOS ELEMENTOS DE LOS FORMULARIOS--------------------------------------------------------------------------------------------------------------------------------


const todosInputsFormularios = (formularioAComprobar) => {
    for (let cadaInput of formularioAComprobar){
        cadaInput.addEventListener("keyup", validarFormulario);
        cadaInput.addEventListener("blur", validarFormulario);
    }
}

const inputsFormularioDueno = document.querySelectorAll("#formulario-adopcion-dueno input");
todosInputsFormularios(inputsFormularioDueno);

/* const inputsFormularioPerro = document.querySelectorAll("#formulario-ingreso-perro input"); */

//Comprobación de los inputs de los formularios al levantar una tecla o al quitar el foco de un elemento
/* const todosInputsFormularios = [inputsFormularioDueno, inputsFormularioPerro];
for (let cadaInput of todosInputsFormularios){
    cadaInput.forEach((input) => {
        input.addEventListener("keyup", validarFormulario);
        input.addEventListener("blur", validarFormulario);
    })
} */


//FUNCIÓN QUE PINTA LOS MODALES------------------------------------------------------------------------------------------------------

const pintarModal = (popupType) => {
    document.getElementById(popupType).classList.remove("hidden");
    document.getElementById(popupType).classList.add("block");
    const botonHeaderModal = document.getElementById(`${popupType}-header-button`);
    const botonBodyModal = document.getElementById(`${popupType}-body-button`);
    botonHeaderModal.addEventListener("click", borrarModal);
    botonBodyModal.addEventListener("click", borrarModal);
    setTimeout (borrarModal, 2000);
}

//FUNCIÓN QUE BORRA LOS MODALES------------------------------------------------------------------------------------------------------

const borrarModal = () => {
    const popupTypeToDelete = ['popup-modal-succes', 'popup-modal-fail', 'popup-modal-adoption'];
    for (let i of popupTypeToDelete){
        if (document.getElementById(i)){
            document.getElementById(i).classList.add("hidden");
            document.getElementById(i).classList.remove("block");
        }
    }
}



//ADOPTAR PERRO------------------------------------------------------------------------------------------------------------------------

document.addEventListener("click", function(e){//Click en cualquiera de los botones de adoptar
    if (e.target.className == "ficha__button-section__button"){
        let perroAAdoptar = e.target.parentElement.parentElement.parentElement.getAttribute("id");
        let identificadorPerroAdoptar = document.getElementById(`${perroAAdoptar}`).getElementsByTagName("span")[0].innerHTML;
        comprobacionDuenoYAdopcion(identificadorPerroAdoptar);//AWAIT?
    }
})

//COMPROBACIÓN Y SUBMIT ADOPCIÓN PERRO----------------------------------------------------------------------------------------------

const comprobacionDuenoYAdopcion = (identificadorPerro) => {
    document.getElementById("popup-modal-adoption").classList.remove("hidden");//Muestra el modal al quitar la clase hidden
    const botonHeaderModalAdopcion = document.getElementById("popup-modal-adoption-header-button");//Identificamos el botón del header del modal
    botonHeaderModalAdopcion.addEventListener("click", borrarModal);//Añadimos un listener al botón antes identificado para cuando se haga click en él, se active la función que "borra" el modal
    const formularioAdopcionPerro = document.getElementById("popup-modal-adoption-body-button");//Identificamos el botón que activa el envío
    console.log("Antes de entrar en el IF");
    if (formularioAdopcionPerro){//Si el botón de enviar el formulario existe, entonces podemos seguir con el proceso, ya que estamos en la página correcta
        console.log("Después del IF");
        formularioAdopcionPerro.addEventListener("submit", async(e) => {//ANTES ESTABA ASÍ:"async(e) =>"
            e.preventDefault();
            alert("Estamos aquí");//NO LLEGAMOS AQUÍ, ¿POR QUÉ?
            console.log("He llegado aquí 3");
            if (estadoCamposFormularios(camposFormularioAdopcionDueno)){
                alert("Ojo");
                let nombreDueno = document.getElementById("name-owner");
                let apellidoDueno = document.getElementById("last-name-owner");
                let telefonoDueno = document.getElementById("telephone-owner");
                let emailDueno = document.getElementById("email-owner");
                let direccionDueno = document.getElementById("address-owner");
                let codigoPostalDueno = document.getElementById("c-p-owner");
                let ciudadDueno = document.getElementById("city-owner");
                const perrosYaAdoptados = await listaPerrosYaAdoptados();//AWAIT?
                for(let perroIndice of perrosYaAdoptados.data){
                    if(perroIndice.dueño.nombre == nombreDueno && perroIndice.dueño.apellidos == apellidoDueno && perroIndice.dueño.telefono == telefonoDueno && perroIndice.dueño.email == emailDueno && perroIndice.dueño.direccion == direccionDueno && perroIndice.dueño.codigoPostal == codigoPostalDueno && perroIndice.dueño.ciudad == ciudadDueno){
                        alert("Ya tienes almenos un perro adoptado");
                    }else{
                        let nuevoDueno = new Dueno (nombreDueno, apellidoDueno, telefonoDueno, emailDueno, direccionDueno, codigoPostalDueno, ciudadDueno);
                        await actualizarAdopcionPerro(nuevoDueno, identificadorPerro);//AWAIT?
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


export {borrarModal, pintarModal, conseguirHoraYFecha, transformarFecha, todosInputsFormularios, Perro}