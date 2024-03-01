btnContacto.addEventListener('click', (e) => {
    resetearContenido();
    formContacto.classList.remove('ocultar');
    formContacto.classList.add('contacto');

    contenido.classList.remove('display-flex');
    contenido.classList.add('ocultar');

    document.body.style.height = 100 + "vh";
});


