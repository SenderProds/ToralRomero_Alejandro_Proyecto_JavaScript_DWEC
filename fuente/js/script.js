let btnIniciarSesion = document.getElementById("btnIniciarSesion");
let formIniciarSesion = document.getElementById("inicioSesion");

let btnRegistro = document.getElementById("btnRegistro");
let formRegistro = document.getElementById("registro");

let desplegarCategorias = document.getElementById("desplegar");
let btnCategorias = document.getElementById("btnCategorias");

let btnCarritoHeader = document.getElementById("btnCarrito");

let contenido = document.getElementById("contenido");
let productosContenedor = document.getElementById("productos");

let btnTabla = document.getElementById("tabla");
let btnLista = document.getElementById("lista");

//Comprueba si los usuarios de la api estan en el almacenamiento
if (!localStorage.getItem("users")) {
  fetch("https://fakestoreapi.com/users")
    .then((res) => res.text())
    .then((json) => {
      localStorage.setItem("users", json);
    });
}

//Desplegable Categorias
fetch("https://fakestoreapi.com/products/categories")
  .then((res) => res.json())
  .then((json) => {
    json.forEach((categoria) => {
      let boton = document.createElement("button");
      boton.innerHTML = categoria;

      desplegarCategorias.appendChild(boton);
    });
  });

generarListaProductos(obtenerProductos());

async function obtenerProductos() {
  let respuesta = await fetch("https://fakestoreapi.com/products");
  let productos = await respuesta.json();
  return productos;
}

async function obternerProductosAscendente() {
  let respuesta = await fetch("https://fakestoreapi.com/products?sort=asc");
  let productos = await respuesta.json();
  console.log(productos);
  return productos;
}

async function obtenerProductosDescendente() {
  let respuesta = await fetch("https://fakestoreapi.com/products?sort=desc");
  let productos = await respuesta.json();
  console.log(productos);
  return productos;
}

async function obtenetProductosCategoria(categoria) {
  let respuesta = await fetch(
    `https://fakestoreapi.com/products/category/${categoria}`
  );
  let productos = await respuesta.json();
  console.log(productos);
  return productos;
}

/**
 * Genera una lista con los productos
 * @param {*} productos Productos
 */
async function generarListaProductos(prods) {
  let productos = await prods;
  let ul = document.createElement("ul");
  productos.forEach((producto) => {
    let li = document.createElement("li");
    let img = document.createElement("img");
    let pNombre = document.createElement("p");
    let pPrecio = document.createElement("p");
    let btnCarrito = crearBtnCarrito(producto);
    let btnFavorito = crearBtnFavorito(producto);
    let btnMeGusta = crearBtnMeGusta(producto);
    let btnNoMeGusta = crearBtnNoMeGusta(producto);

    img.src = producto.image;
    pNombre.textContent = producto.title;
    pNombre.className = "nombreProducto";

    pPrecio.textContent = producto.price;
    pPrecio.className = "precioProducto";

    agregarHijos(
      [
        img,
        pNombre,
        pPrecio,
        btnCarrito,
        btnFavorito,
        btnMeGusta,
        btnNoMeGusta,
      ],
      li
    );
    ul.appendChild(li);
  });

  productosContenedor.innerHTML = "";
  productosContenedor.appendChild(ul);

  let botonesCarrito = document.querySelectorAll(".carritoProducto");

  botonesCarrito.forEach((btnCarrito) => {
    btnCarrito.addEventListener("click", (e) => {
      btnCarritoHeader.classList.add("agregarCarrito");
      agregarCarrito(e.target.parentNode.dataset.id);
      console.log(e.target.parentNode.dataset.id);
    });
  });

  let botonesFavorito = document.querySelectorAll(".favoritoProducto");

  botonesFavorito.forEach((btnFav) => {
    btnFav.addEventListener("click", (e) => {
      e.target.classList.toggle("bi-star");
      e.target.classList.toggle("bi-star-fill");
      agregarFavorito(e.target.parentNode.dataset.id);
      console.log(e.target);
    });
  });

  let botonesMeGusta = document.querySelectorAll(".meGustaProducto");
  botonesMeGusta.forEach((btnMG) => {
    btnMG.addEventListener("click", (e) => {
      if (!e.target.classList.contains("bi-heart-fill")) {
        e.target.classList.add("bi-heart-fill");
        e.target.classList.remove("bi-heart");
      }

      console.log(e.target.parentNode);
      let numeroMeGusta = guardarMeGusta(e.target.parentNode.dataset.id);
      e.target.parentNode.querySelector("span").innerHTML = numeroMeGusta;
    });
  });

  let botonesNoMeGusta = document.querySelectorAll(".noMeGustaProducto");
  botonesNoMeGusta.forEach((btnNmG) => {
    btnNmG.addEventListener("click", (e) => {
      if (!e.target.classList.contains("bi-hand-thumbs-down-fill")) {
        e.target.classList.add("bi-hand-thumbs-down-fill");
        e.target.classList.remove("bi-hand-thumbs-down");
      }

      console.log(e.target.parentNode);
      let numeroNoMeGusta = guardarNoMeGusta(e.target.parentNode.dataset.id);
      e.target.parentNode.querySelector("span").innerHTML = numeroNoMeGusta;
    });
  });
}

/**
 * Crear el boton de carrito del producto
 * @param {*} producto Objeto Producto
 * @returns Devuelve el boton
 */
function crearBtnCarrito(producto) {
  let btn = document.createElement("button");

  btn.innerHTML = '<i class="bi bi-cart4"></i>';
  btn.dataset.id = producto.id;
  btn.className = "carritoProducto";

  return btn;
}

/**
 * Crea el boton de Favorito
 * @param {*} producto Objeto Producto
 * @returns Devuelve el boton
 */
function crearBtnFavorito(producto) {
  let btn = document.createElement("button");

  comprobarFavoritos(producto.id)
    ? (btn.innerHTML = '<i class="bi bi-star-fill"></i>')
    : (btn.innerHTML = '<i class="bi bi-star"></i>');
  btn.dataset.id = producto.id;
  btn.className = "favoritoProducto";
  return btn;
}

/**
 * Crea el boton de Me Gusta
 * @param {*} producto Objeto Producto
 * @returns Boton
 */
function crearBtnMeGusta(producto) {
  let btn = document.createElement("button");
  let numMeGusta = obtenerMeGustaPorId(producto.id);
  if (numMeGusta) {
    btn.innerHTML = `<i class="bi bi-heart"></i> <span>${numMeGusta}</span>`;
  } else {
    btn.innerHTML = `<i class="bi bi-heart"></i> <span>0</span>`;
  }
  btn.className = "meGustaProducto";
  btn.dataset.id = producto.id;

  return btn;
}

/**
 * Crea el boton de No Me Gusta
 * @param {*} producto Objeto Producto
 * @returns Boton
 */
function crearBtnNoMeGusta(producto) {
  let btn = document.createElement("button");
  let numNoMeGusta = obtenerNoMeGustaPorId(producto.id);
  if (numNoMeGusta) {
    btn.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> <span>${numNoMeGusta}</span>`;
  } else {
    btn.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> <span>0</span>`;
  }
  btn.className = "noMeGustaProducto";
  btn.dataset.id = producto.id;
  return btn;
}

btnLista.addEventListener('click', (e) => {
  generarListaProductos(obtenerProductos());
  btnLista.classList.add('seleccionado');
  btnTabla.classList.remove('seleccionado');


});

btnTabla.addEventListener("click", (e) => {
  crearTablaProductos(obtenerProductos());
  btnLista.classList.remove('seleccionado');
  btnTabla.classList.add('seleccionado');
  console.log(e.target);
});

async function crearTablaProductos(prods) {
  let productos = await prods;

  let tabla = document.createElement("table");
  //let thead = crearCabeceraTabla(["Imagen", "Titulo", "Precio", "Opciones"]);
  let tbody = await crearCuerpoTabla(productos);

  console.log(tbody);
  agregarHijos([tbody], tabla);

  productosContenedor.innerHTML = "";
  productosContenedor.appendChild(tabla);
}

/**
 * Crea la cabecera de la tabla
 * @param {*} param0 Array con el nombre de los campos
 * @returns Devuelve el thead
 */
function crearCabeceraTabla([...campos]) {
  let thead = document.createElement('thead');
  let tr = document.createElement("tr");
  campos.forEach((campo) => {
    let th = document.createElement("th");
    th.innerHTML = campo;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
 

  return thead;
}


/**
 * Crea el cuerpo de la tabla
 * @param {*} prods Array Productos
 * @returns Devuelve el tbody
 */
async function crearCuerpoTabla(prods) {
  let tbody = document.createElement("tbody");
  let productos = await prods;

  productos.forEach((producto) => {
    let tr = document.createElement("tr");
    let tdImagen = document.createElement("td");
    let img = document.createElement('img');
    let tdTitulo = document.createElement("td");
    let tdPrecio = document.createElement("td");
    let tdOpciones = document.createElement("td");
    let btnCarrito = crearBtnCarrito(producto);
    let btnFavorito = crearBtnFavorito(producto);
    let btnMeGusta = crearBtnMeGusta(producto);
    let btnNoMeGusta = crearBtnNoMeGusta(producto);

    img.src = producto.image;
    tdImagen.appendChild(img);
    tdTitulo.innerHTML = producto.title;
    tdPrecio.innerHTML = producto.price;

    agregarHijos(
      [btnCarrito, btnFavorito, btnMeGusta, btnNoMeGusta],
      tdOpciones
    );

    agregarHijos([tdImagen, tdTitulo, tdPrecio, tdOpciones], tr);

    tbody.appendChild(tr);
  });

  
  return tbody;
}

/**
 * Guarda el me gusta en el almacenamiento local
 * @param {*} id Id del producto
 */
function guardarMeGusta(id) {
  let objMeGusta = obtenerMeGusta();

  if (objMeGusta) {
    if (objMeGusta[id]) {
      objMeGusta[id]++;
    } else {
      objMeGusta[id] = 1;
    }
  } else {
    objMeGusta = {};
    objMeGusta[id] = 1;
  }

  localStorage.setItem("meGusta", JSON.stringify(objMeGusta));

  return objMeGusta[id];
}

/**
 * Obtiene los likes de un producto
 * @param {*} id Id del producto
 * @returns Null si no hay o el numero de likes
 */
function obtenerMeGustaPorId(id) {
  let objMeGusta = obtenerMeGusta();
  return objMeGusta?.[id] ?? null;
}

/**
 * Obtener todos los me gusta
 * @returns
 */
function obtenerMeGusta() {
  if (localStorage.getItem("meGusta")) {
    return JSON.parse(localStorage.getItem("meGusta"));
  }

  return false;
}

//No me gusta

/**
 * Guarda el me gusta en el almacenamiento local
 * @param {*} id Id del producto
 */
function guardarNoMeGusta(id) {
  let objNoMeGusta = obtenerNoMeGusta();

  if (objNoMeGusta) {
    if (objNoMeGusta[id]) {
      objNoMeGusta[id]++;
    } else {
      objNoMeGusta[id] = 1;
    }
  } else {
    objNoMeGusta = {};
    objNoMeGusta[id] = 1;
  }

  localStorage.setItem("noMeGusta", JSON.stringify(objNoMeGusta));

  return objNoMeGusta[id];
}

/**
 * Obtiene los likes de un producto
 * @param {*} id Id del producto
 * @returns Null si no hay o el numero de likes
 */
function obtenerNoMeGustaPorId(id) {
  let objNoMeGusta = obtenerNoMeGusta();
  return objNoMeGusta?.[id] ?? null;
}

/**
 * Obtener todos los me gusta
 * @returns
 */
function obtenerNoMeGusta() {
  if (localStorage.getItem("noMeGusta")) {
    return JSON.parse(localStorage.getItem("noMeGusta"));
  }

  return false;
}

/**
 * Agrega un producto a favoritos
 * @param {*} id Id del producto
 */
function agregarFavorito(id) {
  if (obtenerFavoritos()) {
    let arrayFavoritos = obtenerFavoritos();

    if (comprobarFavoritos(id)) {
      arrayFavoritos.splice(arrayFavoritos.indexOf(id), 1);
    } else {
      arrayFavoritos.push(id);
    }
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
 */
function obtenerFavoritos() {
  if (localStorage.getItem("favoritos")) {
    return JSON.parse(localStorage.getItem("favoritos"));
  } else {
    return false;
  }
}

/**
 * Comprueba si el id del producto esta en favoritos
 * @param {*} id Id del producto
 * @returns Booleano
 */
function comprobarFavoritos(id) {
  if (obtenerFavoritos()) {
    let favoritos = obtenerFavoritos();
    return favoritos.some((idFav) => {
      return idFav == id;
    });
  } else {
    return false;
  }
}
//Carrito

/**
 * Agrega un producto al carrito
 * @param {*} id Id del producto
 */
function agregarCarrito(id) {
  if (obtenerCarrito()) {
    let carrito = obtenerCarrito();
    let unidades = 1;

    if (carrito[id]) {
      unidades = carrito[id] + 1;
    }
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
 */
function obtenerCarrito() {
  if (localStorage.getItem("carrito")) {
    return JSON.parse(localStorage.getItem("carrito"));
  } else {
    return false;
  }
}

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

//Categorias
btnCategorias.addEventListener("click", (e) => {
  btnCategorias.querySelector("i").classList.toggle("bi-caret-down-fill");
  btnCategorias.querySelector("i").classList.toggle("bi-caret-down");

  desplegarCategorias.classList.toggle("ocultar");
  desplegarCategorias.classList.toggle("desplegar");
});

//Registro

btnRegistro.addEventListener("click", (e) => {
  ocultarContenido([formIniciarSesion, contenido]);

  document.body.style.height = "100vh"; ////
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
    document.body.style.height = "auto";
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
