



btnCarritoHeader.addEventListener('click', (e) => {
    if (contenido.classList.contains('ocultar')) {
        contenido.classList.remove('ocultar');
    }

    if (!productosContenedor.classList.contains('ocultar')) {
        productosContenedor.classList.add('ocultar');
        productosFiltros.classList.add('ocultar');
        productosFiltros.classList.remove('display-flex');


    }

    crearCarrito();
});



function eventoBtnCarrito() {
    let botonesCarrito = document.querySelectorAll(".carritoProducto");

    botonesCarrito.forEach((btnCarrito) => {
        btnCarrito.addEventListener("click", (e) => {
            if (e.target.tagName == 'I') {
                btnCarritoHeader.classList.add("agregarCarrito");
                agregarCarrito(e.target.parentNode.dataset.id);


            }
        });
    });
}


async function crearCarrito() {
    let sectionCarrito = document.createElement('section');
    sectionCarrito.id = 'carrito';
    let h1Carrito = document.createElement('h1');
    let listaCarrito = document.createElement('ul');

    let carrito = obtenerCarrito();
    for (const key in carrito) {
        let producto = await obtenerProductoPorId(key);
        console.log(producto);
        let li = document.createElement('li');
        let img = document.createElement('img');
        let titulo = document.createElement('p');
        let precio = document.createElement('p');
        let unidades = document.createElement('p');
        let btnAgregar = document.createElement('button');
        let btnQuitarUnidades = document.createElement('button');
        let btnEliminarProducto = document.createElement('button');


        img.src = producto.image;
        titulo.innerHTML = producto.title;
        precio.innerHTML = producto.price;
        unidades.innerHTML = carrito[key];
        btnAgregar.innerHTML = '<i class="bi bi-plus-circle"> </i> <span>Agregar</span>';
        btnQuitarUnidades.innerHTML = '<i class="bi bi-x-circle"></i> <span>Quitar</span>';
        btnEliminarProducto.innerHTML = '<i class="bi bi-trash"></i> <span>Eliminar del Carrito</span>';


        agregarHijos([img, titulo, precio, unidades, btnAgregar, btnQuitarUnidades, btnEliminarProducto], li);
        listaCarrito.appendChild(li);

    }


    h1Carrito.textContent = "Carrito";
    agregarHijos([h1Carrito, listaCarrito], sectionCarrito);
    contenido.appendChild(sectionCarrito);
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
  


