//Registro

recargarSesion();


function recargarSesion() {
    if (localStorage.getItem('sesion') == 'true') {
        let liBtnIniciarSesion = document.getElementById("btnIniciarSesion").parentElement;
        let liBtnRegistro = document.getElementById("btnRegistro").parentElement;

        let li = document.createElement('li');
        let btnPrincipal = document.createElement('button');
        btnPrincipal.innerHTML = "Principal";
        
        li.appendChild(btnPrincipal);
        document.getElementById('menu')
        
        //insertBefore(li, document.getElementById('menu'));
        liBtnIniciarSesion.classList.add('ocultar');
        liBtnRegistro.classList.add('ocultar');

        
    }
}

btnRegistro.addEventListener("click", (e) => {
    ocultarContenido([formIniciarSesion, contenido]);
    contenido.classList.remove('display-flex');

    document.body.style.height = "100vh";
    formRegistro.classList.remove("ocultar");
    formRegistro.classList.add("registro");
});

formRegistro.addEventListener("keydown", (e) => {
    if (
        !e.target.previousElementSibling.previousElementSibling.value != " " &&
        e.target.previousElementSibling.previousElementSibling != null
    ) {
        e.preventDefault();
        formRegistro.appendChild(
            mensajeErrorFormulario(
                "Los campos anteriores tienen que ser validos",
                formRegistro
            )
        );
    }
});

formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputsRegistro = document.querySelectorAll(
        '#registro input:not([type="submit"])'
    );

    console.log(inputsRegistro);
    let camposRellenos = Array.from(inputsRegistro).every((campo) => {
        return campo.value != "";
    });

    if (camposRellenos) {
        console.log("Agregando");
        agregarUsuario(inputsRegistro);
    }
});

//Iniciar Sesion

btnIniciarSesion.addEventListener("click", (e) => {
    document.body.style.height = "100vh"; ////
    ocultarContenido([formRegistro, contenido]);
    contenido.classList.remove('display-flex');
    formIniciarSesion.classList.remove("ocultar");
    formIniciarSesion.classList.add("login");
});

//Formulario de inicio de sesion
formIniciarSesion.addEventListener("submit", (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    iniciarSesion(username, password);
});

/**
 * Lo elementos que esten visibles se ocultan
 * @param {*} param0 Elementos
 */
function ocultarContenido([...elementos]) {
    elementos.forEach((elemento) => {
        if (!elemento.classList.contains("ocultar")) {
            elemento.classList.add("ocultar");

        }
    });
}

/**
 * Si las credenciales son correctas iniciar sesion
 * @param {*} usr Nombre de usuario
 * @param {*} password Clave del usuario
 */
function iniciarSesion(usr, password) {
    let resultado = comprobarUsuario(usr, password);
    console.log(resultado);

    if (resultado) {
        localStorage.setItem("sesion", true);
        formIniciarSesion.classList.add("ocultar");
        contenido.classList.remove("ocultar");
        contenido.classList.add("display-flex");
        productosFiltros.classList.add("display-flex");
        productosFiltros.classList.remove("ocultar");
        productosContenedor.classList.remove("ocultar");

        document.body.style.height = "auto";
        recargarSesion();
    } else {
        formIniciarSesion.appendChild(
            mensajeErrorFormulario(
                "El nombre de usuario o clave no es correcto",
                formIniciarSesion
            )
        );
    }
}



/**
* Devuelve si alguno de los usuarios en el almacenamiento coincide con las credenciales
* @param {*} username Nombre de usuario
* @param {*} password Clave del usuario
* @returns Booleano
*/
function comprobarUsuario(username, password) {
    let usuarios = getUsuarios();

    return usuarios.some((objeto) => {
        return objeto.username == username && objeto.password == password;
    });
}

/**
 * Retorna un array con todos los usuarios de la api
 * @returns Array usuarios
 */
function getUsuarios() {
    return JSON.parse(localStorage.getItem("users"));
}

/**
 * Agrega el usuario al almacenamiento local
 * @param {*} campos Todos los campos del formulario
 */
function agregarUsuario(campos) {
    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let telefono = document.getElementById("telefono").value;
    let dni = document.getElementById("dni").value;
    let edad = document.getElementById("edad").value;
    let username = document.getElementById("usernameReg").value;
    let password = document.getElementById("passwordReg").value;

    let usuarios = getUsuarios();

    let nuevoUsuario = {
        name: {
            firstname: nombre,
            lastname: apellidos,
        },
        password: password,
        phone: telefono,
        username: username,
        dni: dni,
        edad: edad,
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("users", JSON.stringify(usuarios));
}
