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

export default Perro;