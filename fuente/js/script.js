let btnIniciarSesion = document.getElementById("btnIniciarSesion");
let btnCarritoHeader = document.getElementById("btnCarrito");
let btnPrincipal = document.getElementById("btnPrincipal");
let btnCerrarSesion = document.getElementById("btnCerrarSesion");
let btnRegistro = document.getElementById("btnRegistro");
let btnCategorias = document.getElementById("btnCategorias");
let btnContacto = document.getElementById("btnContacto");
let btnMapa = document.getElementById("btnMapa");


let formIniciarSesion = document.getElementById("inicioSesion");
let formRegistro = document.getElementById("registro");
let formContacto = document.getElementById("contacto");

let desplegarCategorias = document.getElementById("desplegar");

let contenido = document.getElementById("contenido");
let productosContenedor = document.getElementById("productos");
let productosFiltros = document.getElementById("filtros");

let btnTabla = document.getElementById("tabla");
let btnLista = document.getElementById("lista");
let btnAscendente = document.getElementById("ascendente");
let btnDescendente = document.getElementById("descendente");





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
    console.log(json);
    json.forEach((categoria) => {
      let boton = document.createElement("button");
      boton.innerHTML = categoria;
      desplegarCategorias.appendChild(boton);

      boton.addEventListener('click', (e) => {
        resetearContenido();
        document.body.style.height = "100%";
        productosContenedor.dataset.categoria = categoria;
        cargarProductos();
      });
    });
  });


btnPrincipal.addEventListener('click', (e) => {
  
  productosContenedor.dataset.categoria = "";
  document.body.style.height = 100+"%";
  resetearContenido();
  cargarProductos();
});


/**
 * Crea el Evento de los Botones de No Me Gusta
 */
function eventoBtnNoMeGusta() {
  let botonesNoMeGusta = document.querySelectorAll(".noMeGustaProducto");
  botonesNoMeGusta.forEach((btnNmG) => {
    btnNmG.addEventListener("click", (e) => {
      if (e.target.tagName == 'I') { //Se comprueba que el click se ha hecho en el icono y no en otro elemento
        if (!e.target.classList.contains("bi-hand-thumbs-down-fill")) {
          e.target.classList.add("bi-hand-thumbs-down-fill");
          e.target.classList.remove("bi-hand-thumbs-down");
        }


        let numeroNoMeGusta = guardarNoMeGusta(e.target.parentNode.dataset.id);
        e.target.parentNode.querySelector("span").innerHTML = numeroNoMeGusta;
      }
    });
  });
}


/**
 * Crea el evento de los botones de Favorito
 */
function eventoBtnFavorito() {
  let botonesFavorito = document.querySelectorAll(".favoritoProducto");

  botonesFavorito.forEach((btnFav) => {
    btnFav.addEventListener("click", (e) => {
      if (e.target.tagName == 'I') {
        e.target.classList.toggle("bi-star");
        e.target.classList.toggle("bi-star-fill");
        agregarFavorito(e.target.parentNode.dataset.id);

      }
    });
  });
}


/**
 * Crea el evento de los botones de Me Gusta
 */
function eventoBtnMeGusta() {
  let botonesMeGusta = document.querySelectorAll(".meGustaProducto");
  botonesMeGusta.forEach((btnMG) => {
    btnMG.addEventListener("click", (e) => {
      if (e.target.tagName == 'I') {

        if (!e.target.classList.contains("bi-heart-fill")) {
          e.target.classList.add("bi-heart-fill");
          e.target.classList.remove("bi-heart");
        }


        let numeroMeGusta = guardarMeGusta(e.target.parentNode.dataset.id);
        e.target.parentNode.querySelector("span").innerHTML = numeroMeGusta;
      }

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


btnAscendente.addEventListener("click", (e) => {
  if (contenido.dataset.ordenar == 'desc') {
    btnDescendente.classList.remove('seleccionado');


  }
  contenido.dataset.ordenar = 'asc';
  btnAscendente.classList.toggle('seleccionado');
  cargarProductos();

});

btnDescendente.addEventListener("click", (e) => {
  if (contenido.dataset.ordenar == 'asc') {
    btnAscendente.classList.remove('seleccionado');

  }

  contenido.dataset.ordenar = 'desc';
  btnDescendente.classList.toggle('seleccionado');
  cargarProductos();


});




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




//Categorias
btnCategorias.addEventListener("click", (e) => {
  btnCategorias.querySelector("i").classList.toggle("bi-caret-down-fill");
  btnCategorias.querySelector("i").classList.toggle("bi-caret-down");

  desplegarCategorias.classList.toggle("ocultar");
  desplegarCategorias.classList.toggle("desplegar");
});



