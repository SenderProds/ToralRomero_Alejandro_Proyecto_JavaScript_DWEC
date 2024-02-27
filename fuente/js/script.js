let btnIniciarSesion = document.getElementById("btnIniciarSesion");

let formIniciarSesion = document.getElementById("inicioSesion");

formIniciarSesion.addEventListener("submit", (e) => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  e.preventDefault();
  iniciarSesion(username, password);
});

btnIniciarSesion.addEventListener("click", (e) => {
  formIniciarSesion.classList.remove("ocultar");
  formIniciarSesion.classList.add("login");
});

fetch("https://fakestoreapi.com/users")
  .then((res) => res.json())
  .then((json) => console.log(json));

  

function iniciarSesion(usr, password) {}
