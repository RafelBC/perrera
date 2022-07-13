
//ACTUALIZAR PERRO ADOPTADO Y DUEÑO---------------------------------------------------------------------------------------------------------------------------------------

const actualizarAdopcionPerro = async (duenoACargar, perroAModificar) => {
    try {
        let horaAdopcion = conseguirHoraYFecha();
        const perroCargado = await axios.put(`http://localhost:3000/dogs/:id=${perroAModificar}`, {
            estadoAdopcion: true,
            fechaAdopcion: horaAdopcion,
            dueño: duenoACargar
        });
        //alert(`El perro ${perroCargado.nombre} ha sido adoptado`);
        return;
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la carga de datos.");
    }
}

//OBTENER PERROS ADOPTADOS Y ORDENADOS POR FECHA DE ADOPCIÓN MÁS RECIENTE---------------------------------------------------------------------------------------------------------------------------------------

const listaPerrosYaAdoptados = async () => {
    try {
        const perrosYaAdoptados = await axios.get("http://localhost:3000/dogs?estadoAdopcion=true");
        perrosYaAdoptados.data.sort(function (a, b) {
            if (a.fechaAdopcion < b.fechaAdopcion){
                return 1;
            }
            if (a.fechaAdopcion > b.fechaAdopcion){
                return -1;
            }
            return 0;
        })
        return perrosYaAdoptados;
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la carga de datos.");
    }
}

//OBTENER PERROS DISPONIBLES ADOPCIÓN Y ORDENADOS POR FECHA DE INGRESO MÁS ANTIGUO----------------------------------------------------------------------------------------------------------------------------

const listaPerrosDisponiblesAdopcion = async () => {
    try {
        const perrosDisponiblesAdopcion = await axios.get("http://localhost:3000/dogs?estadoAdopcion=false");
        perrosDisponiblesAdopcion.data.sort(function (a, b) {
            if (a.fechaIngreso > b.fechaIngreso){
                return 1;
            }
            if (a.fechaIngreso < b.fechaIngreso){
                return -1;
            }
            return 0;
        })
        return perrosDisponiblesAdopcion;
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la carga de datos.");
    }
}

//OBTENER LISTA RAZAS API--------------------------------------------------------------------------------------------------------------------------------------------

const obtenerRazasPerro = async (selectorDeRazas) => {
    try {
        const respuesta = await axios.get("https://dog.ceo/api/breeds/list/all");
        let listadoRazas = respuesta.data.message;
        let arrayDeRazas = [];

        for (const raza in listadoRazas) {
            listadoRazas[raza].length ? listadoRazas[raza].forEach(subRaza => arrayDeRazas.push(`${raza} ${subRaza}`)) : arrayDeRazas.push(raza)
        }
        arrayDeRazas.forEach(raza => selectorDeRazas.appendChild(new Option(raza)));
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}

//OBTENER IMAGEN PERRO--------------------------------------------------------------------------------------------------------------------------------------------

const obtenerImagenPerro = async (razaPerro) => {
    try {
        let razaRutaURL = razaPerro.value.replace(" ","/");
        const respuestaImagen = await axios.get(`https://dog.ceo/api/breed/${razaRutaURL}/images/random`);
        return respuestaImagen;
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la solicitud de datos.");
    }
}

//CARGA PERRO EN BBDD-----------------------------------------------------------------------------------------------------------------------------------------

const cargarNuevoPerro = async (nuevoPerro) => {
    console.log("He entrado en cargarNuevoPerro");
    try {
        await axios.post("http://localhost:3000/dogs", nuevoPerro);
        console.log("Ya he guardado el perro");
    } catch (error){
        console.log(error);
        alert(error.message + ". Ha habido un problema con la carga de datos.");
    }
}

export {actualizarAdopcionPerro, listaPerrosYaAdoptados, obtenerRazasPerro, listaPerrosDisponiblesAdopcion, obtenerImagenPerro, cargarNuevoPerro}