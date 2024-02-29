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
