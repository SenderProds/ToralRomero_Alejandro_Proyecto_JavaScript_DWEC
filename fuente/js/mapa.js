btnMapa.addEventListener('click', (e) => {
    resetearContenido();
    document.getElementById('map').classList.remove('ocultar');
    console.log('Cargando Mapa');



    const opciones = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      };
    
     
    
      
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            muestraPosicion,
            muestra_error,
            opciones
          );
          //id = navigator.geolocation.watchPosition(muestraPosicion, muestra_error, opciones);
        } else {
          //caja_mensajes.innerHTML = "Su navegador no lo soporta";
        }
    
    
      function muestraPosicion(position) {
        /*caja_mensajes.innerHTML = `Longitud ${position.coords.longitude}, latitud ${position.coords.latitude}, direccion ${position.coords.heading}, ${position.coords.speed}`;*/
    
        inicializar_mapa();
        print_map(position);
      }
    
      function inicializar_mapa(){
       
        const map = document.getElementById('map');
    
        const newMap = document.createElement('div');
        newMap.setAttribute("id", "map");
        contenido.removeChild(map);
        contenido.append(newMap);
    
      }
    
      function print_map(position) {
        /*var map = L.map("map", {
          center: [position.coords.latitude, position.coords.longitude],
          zoom: 13,
        });*/
    
        var map = L.map('map').setView([37.1922201, -3.6169587], 13);
    
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
    
    
        var marker = L.marker([37.1922201, -3.6169587]).addTo(map).bindPopup("Tienda").openPopup();
      }
    
      function muestra_error(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            caja_mensajes.innerHTML =
              "El usuario denegó la petición de localización";
            break;
          case error.POSITION_UNAVAILABLE:
            caja_mensajes.innerHTML =
              "La información sobre localización no está disponible";
            break;
          case error.TIMEOUT:
            caja_mensajes.innerHTML = "Se agotó el tiempo de la petición";
            break;
          default:
            caja_mensajes.innerHTML = "Ocurrió un error desconocido";
        }
      }
    
    
});







