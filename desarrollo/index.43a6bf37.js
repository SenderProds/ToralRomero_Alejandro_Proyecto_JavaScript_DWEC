let btnIniciarSesion = document.getElementById("btnIniciarSesion");
let formIniciarSesion = document.getElementById("inicioSesion");
let btnRegistro = document.getElementById("btnRegistro");
let formRegistro = document.getElementById("registro");
let desplegarCategorias = document.getElementById("desplegar");
let btnCategorias = document.getElementById("btnCategorias");
let btnCarritoHeader = document.getElementById("btnCarrito");
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
        let btnCarrito = document.createElement("button");
        let btnFavorito = document.createElement("button");
        let btnMeGusta = document.createElement("button");
        img.src = producto.image;
        pNombre.textContent = producto.title;
        pNombre.className = "nombreProducto";
        pPrecio.textContent = producto.price;
        pPrecio.className = "precioProducto";
        btnCarrito.innerHTML = '<i class="bi bi-cart4"></i>';
        btnCarrito.dataset.id = producto.id;
        btnCarrito.className = "carritoProducto";
        comprobarFavoritos(producto.id) ? btnFavorito.innerHTML = '<i class="bi bi-star-fill"></i>' : btnFavorito.innerHTML = '<i class="bi bi-star"></i>';
        btnFavorito.dataset.id = producto.id;
        btnFavorito.className = "favoritoProducto";
        btnMeGusta.innerHTML = '<i class="bi bi-heart"></i> <span>2</span>';
        btnMeGusta.className = "meGustaProducto";
        agregarHijos([
            img,
            pNombre,
            pPrecio,
            btnCarrito,
            btnFavorito,
            btnMeGusta
        ], li);
        ul.appendChild(li);
    });
    productosContenedor.appendChild(ul);
    let botonesCarrito = document.querySelectorAll(".carritoProducto");
    botonesCarrito.forEach((btnCarrito)=>{
        btnCarrito.addEventListener("click", (e)=>{
            btnCarritoHeader.classList.add("agregarCarrito");
            agregarCarrito(e.target.parentNode.dataset.id);
            console.log(e.target.parentNode.dataset.id);
        });
    });
    let botonesFavorito = document.querySelectorAll(".favoritoProducto");
    botonesFavorito.forEach((btnFav)=>{
        btnFav.addEventListener("click", (e)=>{
            e.target.classList.toggle("bi-star");
            e.target.classList.toggle("bi-star-fill");
            agregarFavorito(e.target.parentNode.dataset.id);
            console.log(e.target);
        });
    });
}
/**
 * Agrega un producto a favoritos
 * @param {*} id Id del producto
 */ function agregarFavorito(id) {
    if (obtenerFavoritos()) {
        let arrayFavoritos = obtenerFavoritos();
        if (comprobarFavoritos(id)) arrayFavoritos.splice(arrayFavoritos.indexOf(id), 1);
        else arrayFavoritos.push(id);
        localStorage.setItem("favoritos", JSON.stringify(arrayFavoritos));
    } else {
        let arrayFavoritos = [];
        arrayFavoritos.push(id);
        localStorage.setItem("favoritos", JSON.stringify(arrayFavoritos));
    }
}
/**
 * Si favoritos esta en el almacenamiento devuelve un array con los favoritos
 * @returns Array Favoritos
 */ function obtenerFavoritos() {
    if (localStorage.getItem("favoritos")) return JSON.parse(localStorage.getItem("favoritos"));
    else return false;
}
/**
 * Comprueba si el id del producto esta en favoritos
 * @param {*} id Id del producto
 * @returns Booleano
 */ function comprobarFavoritos(id) {
    if (obtenerFavoritos()) {
        let favoritos = obtenerFavoritos();
        return favoritos.some((idFav)=>{
            return idFav == id;
        });
    } else return false;
}
//Carrito
/**
 * Agrega un producto al carrito
 * @param {*} id Id del producto
 */ function agregarCarrito(id) {
    if (obtenerCarrito()) {
        let carrito = obtenerCarrito();
        let unidades = 1;
        if (carrito[id]) unidades = carrito[id] + 1;
        carrito[id] = unidades;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
        let objCarrito = {};
        objCarrito[id] = 1;
        localStorage.setItem("carrito", JSON.stringify(objCarrito));
    }
}
/**
 * Obtiene el carrito
 * @returns Array Carrito
 */ function obtenerCarrito() {
    if (localStorage.getItem("carrito")) return JSON.parse(localStorage.getItem("carrito"));
    else return false;
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
        formRegistro,
        productosContenedor
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
