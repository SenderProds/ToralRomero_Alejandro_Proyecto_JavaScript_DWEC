/**
 * Agrega varios hijos a un mismo padre
 * @param {*} param Array con cada uno de los hijos
 * @param {*} padre El padre al que se desea agregar los hijos
 */
function agregarHijos([...hijos], padre) {
    hijos.forEach((hijo) => {
        padre.appendChild(hijo);
    });
}



/**
* Genera un mensaje de error que se pone encima del formulario
* @param {*} msj Mensaje que va a salir
* @param {*} formulario El formulario
* @returns Devuelve el div con el mensaje
*/
function mensajeErrorFormulario(msj, formulario) {
    let rectFormulario = formulario.getBoundingClientRect();
    let divIncorrecto = document.createElement("div");

    if (!divIncorrecto.classList.contains("incorrecto")) {
        divIncorrecto.style.top = rectFormulario.top - 60 + "px";

        divIncorrecto.textContent += msj;
        divIncorrecto.classList.add("incorrecto");
        return divIncorrecto;
    }
}



function resetearContenido(){

    if(!productosContenedor.classList.contains('ocultar')){
        productosContenedor.classList.add('ocultar');
    }

    if(contenido.classList.contains('ocultar')){
        contenido.classList.remove('ocultar');
        contenido.classList.add('display-flex');
    }

    if(!productosFiltros.classList.contains('ocultar')){
        productosFiltros.classList.add('ocultar');
        productosFiltros.classList.remove('display-flex');
    }

    if(document.getElementById('carrito')){
        contenido.removeChild(document.getElementById('carrito'));
    }

    if(!document.getElementById('inicioSesion').classList.contains('ocultar')){
        document.getElementById('inicioSesion').classList.add('ocultar');
    }

    if(!document.getElementById('registro').classList.contains('ocultar')){
        document.getElementById('registro').classList.add('ocultar');
    }

    if(!document.getElementById('contacto').classList.contains('ocultar')){
        document.getElementById('contacto').classList.add('ocultar');
    }
}