let btnIniciarSesion = document.getElementById("btnIniciarSesion");
let formIniciarSesion = document.getElementById("inicioSesion");
let btnRegistro = document.getElementById("btnRegistro");
let formRegistro = document.getElementById("registro");
let desplegarCategorias = document.getElementById("desplegar");
let btnCategorias = document.getElementById("btnCategorias");
let contenido = document.getElementById("contenido");
let productosContenedor = document.getElementById("productos");
//Comprueba si los usuarios de la api estan en el almacenamiento
if (!localStorage.getItem("users")) fetch("https://fakestoreapi.com/users").then((res)=>res.text()).then((json)=>{
    localStorage.setItem("users", json);
});
//Desplegable Categorias
fetch("https://fakestoreapi.com/products/categories").then((res)=>res.json()).then((json)=>{
    json.forEach((categoria)=>{
        let boton = document.createElement("button");
        boton.innerHTML = categoria;
        desplegarCategorias.appendChild(boton);
    });
});
fetch("https://fakestoreapi.com/products").then((res)=>res.json()).then((json)=>{
    generarListaProductos(json);
});
function generarListaProductos(productos) {
    let ul = document.createElement("ul");
    productos.forEach((producto)=>{
        let li = document.createElement("li");
        let img = document.createElement("img");
        let pNombre = document.createElement("p");
        let pPrecio = document.createElement("p");
        img.src = producto.image;
        pNombre.textContent = producto.title;
        pPrecio.textContent = producto.price;
        agregarHijos([
            img,
            pNombre,
            pPrecio
        ], li);
        ul.appendChild(li);
    });
    let liCarrito = document.createElement("li");
    liCarrito.innerHTML = '<i class="bi bi-cart4"></i>';
    productosContenedor.appendChild(ul);
}
/**
 * Agrega varios hijos a un mismo padre
 * @param {*} param Array con cada uno de los hijos
 * @param {*} padre El padre al que se desea agregar los hijos
 */ function agregarHijos([...hijos], padre) {
    hijos.forEach((hijo)=>{
        padre.appendChild(hijo);
    });
}
//Categorias
btnCategorias.addEventListener("click", (e)=>{
    btnCategorias.querySelector("i").classList.toggle("bi-caret-down-fill");
    btnCategorias.querySelector("i").classList.toggle("bi-caret-down");
    desplegarCategorias.classList.toggle("ocultar");
    desplegarCategorias.classList.toggle("desplegar");
});
//Registro
btnRegistro.addEventListener("click", (e)=>{
    ocultarContenido([
        formIniciarSesion,
        contenido
    ]);
    document.body.style.height = "100vh"; ////
    formRegistro.classList.remove("ocultar");
    formRegistro.classList.add("registro");
});
formRegistro.addEventListener("keydown", (e)=>{
    if (!e.target.previousElementSibling.previousElementSibling.value != " " && e.target.previousElementSibling.previousElementSibling != null) {
        e.preventDefault();
        formRegistro.appendChild(mensajeErrorFormulario("Los campos anteriores tienen que ser validos", formRegistro));
    }
});
formRegistro.addEventListener("submit", (e)=>{
    e.preventDefault();
    let inputsRegistro = document.querySelectorAll('#registro input:not([type="submit"])');
    console.log(inputsRegistro);
    let camposRellenos = Array.from(inputsRegistro).every((campo)=>{
        return campo.value != "";
    });
    if (camposRellenos) {
        console.log("Agregando");
        agregarUsuario(inputsRegistro);
    }
});
//Iniciar Sesion 
btnIniciarSesion.addEventListener("click", (e)=>{
    document.body.style.height = "100vh"; ////
    ocultarContenido([
        formRegistro
    ]);
    formIniciarSesion.classList.remove("ocultar");
    formIniciarSesion.classList.add("login");
});
//Formulario de inicio de sesion
formIniciarSesion.addEventListener("submit", (e)=>{
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    iniciarSesion(username, password);
});
/**
 * Lo elementos que esten visibles se ocultan
 * @param {*} param0 Elementos 
 */ function ocultarContenido([...elementos]) {
    elementos.forEach((elemento)=>{
        if (!elemento.classList.contains("ocultar")) elemento.classList.add("ocultar");
    });
}
/**
 * Si las credenciales son correctas iniciar sesion
 * @param {*} usr Nombre de usuario
 * @param {*} password Clave del usuario
 */ function iniciarSesion(usr, password) {
    let resultado = comprobarUsuario(usr, password);
    console.log(resultado);
    resultado ? console.log("Sesion Iniciada") : formIniciarSesion.appendChild(mensajeErrorFormulario("El nombre de usuario o clave no es correcto", formIniciarSesion));
}
/**
 * Genera un mensaje de error que se pone encima del formulario
 * @param {*} msj Mensaje que va a salir
 * @param {*} formulario El formulario
 * @returns Devuelve el div con el mensaje
 */ function mensajeErrorFormulario(msj, formulario) {
    let rectFormulario = formulario.getBoundingClientRect();
    let divIncorrecto = document.createElement("div");
    if (!divIncorrecto.classList.contains("incorrecto")) {
        divIncorrecto.style.top = rectFormulario.top - 60 + "px";
        divIncorrecto.textContent += msj;
        divIncorrecto.classList.add("incorrecto");
        return divIncorrecto;
    }
}
/**
 * Devuelve si alguno de los usuarios en el almacenamiento coincide con las credenciales
 * @param {*} username Nombre de usuario
 * @param {*} password Clave del usuario
 * @returns Booleano
 */ function comprobarUsuario(username, password) {
    let usuarios = getUsuarios();
    return usuarios.some((objeto)=>{
        return objeto.username == username && objeto.password == password;
    });
}
/**
 * Retorna un array con todos los usuarios de la api
 * @returns Array usuarios
 */ function getUsuarios() {
    return JSON.parse(localStorage.getItem("users"));
}
/**
 * Agrega el usuario al almacenamiento local
 * @param {*} campos Todos los campos del formulario
 */ function agregarUsuario(campos) {
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
            lastname: apellidos
        },
        password: password,
        phone: telefono,
        username: username,
        dni: dni,
        edad: edad
    };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("users", JSON.stringify(usuarios));
}

//# sourceMappingURL=index.43a6bf37.js.map