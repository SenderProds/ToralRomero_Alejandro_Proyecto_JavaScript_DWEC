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

}



async function obtenerProductoPorId(id) {
    let respuesta = await fetch(`https://fakestoreapi.com/products/${id}`);
    let objeto = await respuesta.json();
    return objeto;
}

async function obtenerProductos() {
    let respuesta = await fetch("https://fakestoreapi.com/products");
    let productos = await respuesta.json();
    return productos;
}

async function obternerProductosAscendente() {
    let respuesta = await fetch("https://fakestoreapi.com/products?sort=asc");
    let productos = await respuesta.json();

    return productos;
}

async function obtenerProductosDescendente() {
    let respuesta = await fetch("https://fakestoreapi.com/products?sort=desc");
    let productos = await respuesta.json();

    return productos;
}

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
    let ordenar = contenido.dataset.ordenar;

    if (btnTabla.classList.contains('seleccionado')) {

        if (ordenar == 'asc') {
            crearTablaProductos(obternerProductosAscendente());
        } else if (ordenar == 'desc') {
            crearTablaProductos(obtenerProductosDescendente());
        } else {
            crearTablaProductos(obtenerProductos());
        }


    } else {

        if (ordenar == 'asc') {
            generarListaProductos(obternerProductosAscendente());
        } else if (ordenar == 'desc') {
            generarListaProductos(obtenerProductosDescendente());
        } else {
            generarListaProductos(obtenerProductos());
        }


    }


    generarProductosInfinitos();

}

function generarProductosInfinitos() {


    window.addEventListener('scroll', (e) => {
        if (!productosContenedor.classList.contains('ocultar')) {

            if ((window.scrollY + window.innerHeight) > (document.documentElement.scrollHeight - 50)) {
                console.log('Scroll');

                if (document.getElementById('productos').firstChild.tagName == 'UL') {
                    console.log(document.getElementById('productos').firstChild);
                    let hijos = document.getElementById('productos').firstChild.querySelectorAll('li');
                    let elementos = [];
                    console.log(hijos);
                    hijos.forEach((hijo) => {
                        elementos.push(hijo.cloneNode(true));

                    })

                    elementos.forEach((elemento) => {
                        document.getElementById('productos').firstChild.appendChild(elemento);
                    });

                } else {

                    let tbody = document.getElementById('productos').querySelector('tbody');

                    let hijos = tbody.querySelectorAll('tr');
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

            }
        }
    });





}



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
        let divOpciones = document.createElement('div');

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
