cargarProductos(obtenerProductos());

/**
 * Genera una lista con los productos
 * @param {*} productos Productos
 */
async function generarListaProductos(prods) {
  let productos = await prods;
  let ul = document.createElement("ul");
  productos.forEach((producto) => {
    let li = document.createElement("li");
    li.dataset.idProd = producto.id;
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

  eventoBtnCarrito();
  eventoBtnFavorito();
  eventoBtnMeGusta();
  eventoBtnNoMeGusta();
  eventoProducto();
}

/**
 * Crea el evento para al hacer click entrar al detalle del producto
 */
function eventoProducto() {
  let productosContainer = document.getElementById("productos");
  if (productosContainer.firstChild.tagName == "UL") {
    let liProductos = productosContainer
      .querySelector("ul")
      .querySelectorAll("li");
    liProductos.forEach((li) => {
      li.addEventListener("click", (e) => {
        if (e.target.tagName != "I") {
          console.log(e.target);
          detalleProducto(li.dataset.idProd);
        }
      });
    });
  }else{
    let trProductos = productosContainer
      .querySelector("table")
      .querySelector("tbody")
      .querySelectorAll("tr");
    trProductos.forEach((tr) => {
      tr.addEventListener("click", (e) => {
        if (e.target.tagName != "I") {
          console.log(e.target);
          detalleProducto(tr.dataset.idProd);
        }
      });
    });
  }
}

/**
 * Crea la vista en detalle del producto
 * @param {*} id Id del producto
 */
async function detalleProducto(id) {
  let producto = await obtenerProductoPorId(id);
  if (document.getElementById("detalle")) {
    contenido.removeChild(document.getElementById("detalle"));
  }
  let sectionDetalle = document.createElement("section");
  sectionDetalle.id = "detalle";

  let h1Producto = document.createElement("h1");
  let img = document.createElement("img");
  let pDescripcion = document.createElement("p");
  let pPrecio = document.createElement("p");
  let btnCarrito = document.createElement("button");

  h1Producto.innerHTML = producto.title;
  img.src = producto.image;
  pDescripcion.innerHTML = producto.description;
  pPrecio.innerHTML = producto.price;
  btnCarrito.innerHTML = "Agregar a Carrito";

  btnCarrito.addEventListener("click", (e) => {
    agregarCarrito(producto.id);
  });
  agregarHijos(
    [h1Producto, img, pDescripcion, pPrecio, btnCarrito],
    sectionDetalle
  );

  contenido.appendChild(sectionDetalle);
  productosContenedor.classList.add("ocultar");
  productosFiltros.classList.add("ocultar");
  productosFiltros.classList.remove("display-flex");
}

/**
 * Devuelve un producto pasando el id
 * @param {*} id Id del producto
 * @returns Objeto Producto
 */
async function obtenerProductoPorId(id) {
  let respuesta = await fetch(`https://fakestoreapi.com/products/${id}`);
  let objeto = await respuesta.json();
  return objeto;
}

/**
 * Obtiene todos los productos
 * @returns Array Productos
 */
async function obtenerProductos() {
  let respuesta = await fetch("https://fakestoreapi.com/products");
  let productos = await respuesta.json();
  return productos;
}

/**
 * Obtiene los productos en orden Ascendente
 * @returns Array Productos
 */
async function obternerProductosAscendente() {
  let respuesta = await fetch("https://fakestoreapi.com/products?sort=asc");
  let productos = await respuesta.json();

  return productos;
}

/**
 * Obtiene los productos en orden Descendente
 * @returns Array Productos
 */
async function obtenerProductosDescendente() {
  let respuesta = await fetch("https://fakestoreapi.com/products?sort=desc");
  let productos = await respuesta.json();

  return productos;
}

/**
 * Obtiene los productos de una categoria
 * @param {*} categoria Categoria
 * @returns Array Productos
 */
async function obtenetProductosCategoria(categoria) {
  let respuesta = await fetch(
    `https://fakestoreapi.com/products/category/${categoria}`
  );
  let productos = await respuesta.json();

  return productos;
}

/**
 * Carga los productos y los muestra en tabla o lista
 * y en el orden que el usuario haya seleccionado
 */
function cargarProductos() {
  let categoria = productosContenedor.dataset.categoria;
  let ordenar = contenido.dataset.ordenar;

  if (productosContenedor.classList.contains("ocultar")) {
    productosContenedor.classList.remove("ocultar");
    productosFiltros.classList.remove("ocultar");
    productosFiltros.classList.add("display-flex");
  }

  if (document.getElementById("carrito")) {
    contenido.removeChild(carrito);
  }

  if (document.getElementById("detalle")) {
    contenido.removeChild(document.getElementById("detalle"));
  }

  if (!categoria) {
    if (btnTabla.classList.contains("seleccionado")) {
      if (ordenar == "asc") {
        crearTablaProductos(obternerProductosAscendente());
      } else if (ordenar == "desc") {
        crearTablaProductos(obtenerProductosDescendente());
      } else {
        crearTablaProductos(obtenerProductos());
      }
    } else {
      if (ordenar == "asc") {
        generarListaProductos(obternerProductosAscendente());
      } else if (ordenar == "desc") {
        generarListaProductos(obtenerProductosDescendente());
      } else {
        generarListaProductos(obtenerProductos());
      }
    }
  } else {
    generarListaProductos(obtenetProductosCategoria(categoria));
  }

  generarProductosInfinitos();
}

/**
 * Crea productos infinitos duplicando los elementos
 */
function generarProductosInfinitos() {
  window.addEventListener("scroll", (e) => {
    if (!productosContenedor.classList.contains("ocultar")) {
      if (
        window.scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 50
      ) {
        console.log("Scroll");

        if (document.getElementById("productos").firstChild.tagName == "UL") {
          console.log(document.getElementById("productos").firstChild);
          let hijos = document
            .getElementById("productos")
            .firstChild.querySelectorAll("li");
          let elementos = [];
          console.log(hijos);
          hijos.forEach((hijo) => {
            elementos.push(hijo.cloneNode(true));
          });

          elementos.forEach((elemento) => {
            document
              .getElementById("productos")
              .firstChild.appendChild(elemento);
          });
        } else {
          let tbody = document
            .getElementById("productos")
            .querySelector("tbody");

          let hijos = tbody.querySelectorAll("tr");
          let elementos = [];
          console.log(hijos);
          hijos.forEach((hijo) => {
            elementos.push(hijo.cloneNode(true));
          });

          elementos.forEach((elemento) => {
            tbody.appendChild(elemento);
          });
        }

        eventoBtnCarrito();
        eventoBtnFavorito();
        eventoBtnMeGusta();
        eventoBtnNoMeGusta();
        eventoProducto();
      }
    }
  });
}

/**
 * Crea la tabla de productos
 * @param {*} prods Array Productos
 */
async function crearTablaProductos(prods) {
  let productos = await prods;

  let tabla = document.createElement("table");
  let thead = crearCabeceraTabla(["Imagen", "Titulo", "Precio", "Opciones"]);
  let tbody = await crearCuerpoTabla(productos);

  agregarHijos([thead, tbody], tabla);

  productosContenedor.innerHTML = "";
  productosContenedor.appendChild(tabla);

  eventoBtnCarrito();
  eventoBtnFavorito();
  eventoBtnMeGusta();
  eventoBtnNoMeGusta();
  eventoProducto();
}

/**
 * Crea la cabecera de la tabla
 * @param {*} param0 Array con el nombre de los campos
 * @returns Devuelve el thead
 */
function crearCabeceraTabla([...campos]) {
  let thead = document.createElement("thead");
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
    tr.dataset.idProd = producto.id;
    let tdImagen = document.createElement("td");
    let img = document.createElement("img");
    let tdTitulo = document.createElement("td");
    let tdPrecio = document.createElement("td");
    let tdOpciones = document.createElement("td");
    let btnCarrito = crearBtnCarrito(producto);
    let btnFavorito = crearBtnFavorito(producto);
    let btnMeGusta = crearBtnMeGusta(producto);
    let btnNoMeGusta = crearBtnNoMeGusta(producto);
    let divOpciones = document.createElement("div");

    img.src = producto.image;
    tdImagen.appendChild(img);
    tdTitulo.innerHTML = producto.title;
    tdPrecio.innerHTML = producto.price;

    agregarHijos(
      [btnCarrito, btnFavorito, btnMeGusta, btnNoMeGusta],
      divOpciones
    );

    tdOpciones.appendChild(divOpciones);

    agregarHijos([tdImagen, tdTitulo, tdPrecio, tdOpciones], tr);

    tbody.appendChild(tr);
  });

  return tbody;
}
