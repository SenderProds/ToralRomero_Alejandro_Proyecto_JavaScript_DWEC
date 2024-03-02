btnCarritoHeader.addEventListener("click", (e) => {
    
  if (localStorage.getItem("sesion") == 'true') {
    resetearContenido();
    

    if(document.getElementById('detalle')){
        contenido.removeChild(document.getElementById('detalle'));
    }

    document.body.style.height = "100%";
    crearCarrito();
  }else{
    cargarProductos();
  }
});


/**
 * Crea el evento de los botones de carrito
 */
function eventoBtnCarrito() {
  let botonesCarrito = document.querySelectorAll(".carritoProducto");

  botonesCarrito.forEach((btnCarrito) => {
    btnCarrito.addEventListener("click", (e) => {
      if (e.target.tagName == "I") {
        btnCarritoHeader.classList.add("agregarCarrito");
        agregarCarrito(e.target.parentNode.dataset.id);
      }
    });
  });
}

/**
 * Crea la vista del carrito
 */
async function crearCarrito() {
  let sectionCarrito = document.createElement("section");
  sectionCarrito.id = "carrito";
  let h1Carrito = document.createElement("h1");
  let listaCarrito = document.createElement("ul");
  let btnRealizarPedido = document.createElement("button");
  if (document.getElementById("carrito")) {
    contenido.removeChild(document.getElementById("carrito"));
  }

  let pPrecio = document.createElement("p");
  let precioTotal = 0;
  let carrito = obtenerCarrito();

  for (const key in carrito) {
    let producto = await obtenerProductoPorId(key);
    console.log(producto);
    let li = document.createElement("li");
    let img = document.createElement("img");
    let titulo = document.createElement("p");
    let precio = document.createElement("p");
    let unidades = document.createElement("p");
    let btnAgregar = document.createElement("button");
    let btnQuitarUnidades = document.createElement("button");
    let btnEliminarProducto = document.createElement("button");

    precioTotal += producto.price * carrito[key];

    img.src = producto.image;
    titulo.innerHTML = producto.title;
    precio.innerHTML = producto.price;
    unidades.innerHTML = carrito[key];

    unidades.className = "unidadesCarrito";
    btnAgregar.innerHTML =
      '<i class="bi bi-plus-circle"> </i> <span>Agregar</span>';
    btnQuitarUnidades.innerHTML =
      '<i class="bi bi-x-circle"></i> <span>Quitar</span>';
    btnEliminarProducto.innerHTML =
      '<i class="bi bi-trash"></i> <span>Eliminar del Carrito</span>';

    btnAgregar.addEventListener("click", (e) => {
      if (e.target.tagName == "I") {
        agregarCarrito(producto.id);
        actualizarUnidadesCarrito(
          e.target.parentNode.parentNode.querySelector(".unidadesCarrito"),
          producto.id
        );
        actualizarPrecioTotalCarrito();
      }
    });

    btnQuitarUnidades.addEventListener("click", (e) => {
      if (e.target.tagName == "I") {
        let unid = eliminarUnidadesCarrito(producto.id);
        actualizarUnidadesCarrito(
          e.target.parentNode.parentNode.querySelector(".unidadesCarrito"),
          producto.id
        );
        actualizarPrecioTotalCarrito();
        console.log(unid);
        if (unid < 1 || unid == undefined) {
          crearCarrito();
        }
      }
    });

    btnEliminarProducto.addEventListener("click", (e) => {
      if (e.target.tagName == "I") {
        eliminarProductoCarrito(producto.id);
        crearCarrito();
      }
    });

    agregarHijos(
      [
        img,
        titulo,
        precio,
        unidades,
        btnAgregar,
        btnQuitarUnidades,
        btnEliminarProducto,
      ],
      li
    );
    listaCarrito.appendChild(li);
  }

  btnRealizarPedido.innerHTML = "Realizar Pedido";
  pPrecio.innerHTML = "Precio Total: " + precioTotal;
  pPrecio.innerHTML = `Precio Total: <span id="precioTotal">${precioTotal}</span>`;


  h1Carrito.textContent = "Carrito";
  agregarHijos(
    [h1Carrito, listaCarrito, pPrecio, btnRealizarPedido],
    sectionCarrito
  );
  contenido.appendChild(sectionCarrito);
}


/**
 * Actualiza el precio total del carrito al quitar o agregar unidades
 */
async function actualizarPrecioTotalCarrito(){
    let contenedorPrecioTotal = document.getElementById('precioTotal');
    let carrito = obtenerCarrito();
    let precioTotal = 0;
    console.log(carrito);

    for (const id in carrito) {
       console.log(id);
       let producto = await obtenerProductoPorId(id);
       precioTotal += producto.price * carrito[id];
    }
    

    contenedorPrecioTotal.innerHTML = precioTotal;
}

/**
 * Actualiza las unidades de los productos del carrito
 * @param {*} elemento Elemento que muestra las unidades
 * @param {*} id 
 */
function actualizarUnidadesCarrito(elemento, id) {
  console.log(obtenerUnidadesProductoCarrito(id));

  elemento.innerHTML = obtenerUnidadesProductoCarrito(id);
}

/**
 * Elimina unidades del carrito
 * @param {*} id Id del producto
 * @returns Devuelve las unidades
 */
function eliminarUnidadesCarrito(id) {
  let carrito = obtenerCarrito();
  if (carrito[id] - 1 < 1) {
    delete carrito[id];
  } else {
    carrito[id]--;
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  return carrito[id];
}

/**
 * Elimina un producto del carrito
 * @param {*} id Id del producto
 */
function eliminarProductoCarrito(id) {
  let carrito = obtenerCarrito();
  delete carrito[id];
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/**
 * Obtiene las unidades que hay de un producto en el carrito
 * @param {*} id Id del producto
 * @returns Numero de unidades
 */
function obtenerUnidadesProductoCarrito(id) {
  let carrito = obtenerCarrito();
  return carrito[id];
}

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
 * @returns Objeto Carrito
 */
function obtenerCarrito() {
  if (localStorage.getItem("carrito")) {
    return JSON.parse(localStorage.getItem("carrito"));
  } else {
    return false;
  }
}
