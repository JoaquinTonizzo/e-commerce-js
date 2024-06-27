let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const carritoVacio = document.getElementById("carrito-vacio");
const carritoProductos = document.getElementById("contenedor-productos-carrito");
const carritoElementos = document.getElementById("carrito-elementos");
const comprarCarrito = document.getElementById("comprar-carrito");
const borrarCarrito = document.getElementById("vaciar-carrito");
const compraTotal = document.getElementById("total-carrito");

actualizarProductosCarrito();

function actualizarProductosCarrito() {
    if (carrito.length > 0) {
        mostrarCarrito();
        agregarEventos();
    } else {
        mostrarCarritoVacio();
    }
}

function mostrarCarrito() {
    carritoVacio.classList.add("desactivado");
    carritoProductos.classList.remove("desactivado");
    carritoElementos.classList.remove("desactivado");
    carritoProductos.innerHTML = "";
    carrito.forEach(agregarProductoAlCarrito);
    actualizarTotalCarrito();
}

function agregarProductoAlCarrito(producto) {
    const div = document.createElement("div");
    div.classList.add("producto-carrito");
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="info">
            <h2>${producto.nombre}</h2>
            <p>Precio: $${producto.precio} USD</p>
            <div class="botones">
                <button class="btn-incrementar" id="incrementar-${producto.id}">+</button>
                <p id="cantidad-${producto.id}">${producto.cantidad}</p>
                <button class="btn-decrementar" id="decrementar-${producto.id}">-</button>
            </div>
        </div>
    `;
    carritoProductos.appendChild(div);
}

function mostrarCarritoVacio() {
    carritoVacio.classList.remove("desactivado");
    carritoProductos.classList.add("desactivado");
    carritoElementos.classList.add("desactivado");
    carritoProductos.innerHTML = "";
}

comprarCarrito.addEventListener("click", comprarCarritoClick);
function comprarCarritoClick() {
    alertComprarCarrito();
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarProductosCarrito();
    actualizarCantidadCarritoEnHeader();
}

borrarCarrito.addEventListener("click", borrarCarritoClick);
function borrarCarritoClick() {
    alertBorrarCarrito();
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarProductosCarrito();
    actualizarCantidadCarritoEnHeader();
}

function agregarEventos() {
    const botonesIncrementarCarrito = document.querySelectorAll(".btn-incrementar");
    botonesIncrementarCarrito.forEach(boton => {
        boton.addEventListener("click", incrementarCantidadCarrito);
    });

    const botonesDecrementarCarrito = document.querySelectorAll(".btn-decrementar");
    botonesDecrementarCarrito.forEach(boton => {
        boton.addEventListener("click", decrementarCantidadCarrito);
    });
}

function incrementarCantidadCarrito(e) {
    const id = e.currentTarget.id.replace('incrementar-', '');
    const producto = carrito.find(producto => producto.id === id);

    producto.cantidad++;
    alertProductoAgregado()
    actualizarCantidadProductoEnCarrito(id, producto.cantidad);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarTotalCarrito();
    actualizarCantidadCarritoEnHeader();
}

function decrementarCantidadCarrito(e) {
    const id = e.currentTarget.id.replace('decrementar-', '');
    const producto = carrito.find(producto => producto.id === id);

    if (producto.cantidad > 0) {
        producto.cantidad--;
        alertProductoEliminado();
        if (producto.cantidad === 0) {
            carrito = carrito.filter(item => item.id !== producto.id);
        } else {
            actualizarCantidadProductoEnCarrito(id, producto.cantidad);
        }
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarProductosCarrito();
    actualizarCantidadCarritoEnHeader();
}

function actualizarCantidadProductoEnCarrito(id, cantidad) {
    const cantidadElemento = document.getElementById(`cantidad-${id}`);
    cantidadElemento.innerText = cantidad;
}

function actualizarTotalCarrito() {
    compraTotal.innerText = "Total a pagar: $" + calcularTotalCarrito();
}

function calcularTotalCarrito() {
    return carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0);
}

function alertComprarCarrito() {
    Swal.fire({
        title: "¡Gracias por su compra!",
        icon: "success",
        html: `
        <div>
            <p>Valor total de la compra: ${calcularTotalCarrito()} USD</p>
        </div>
        `,
        timer: 1000,
        showConfirmButton: false
    });
}

function alertBorrarCarrito() {
    Swal.fire({
        title: "Carrito eliminado completamente",
        icon: "error",
        timer: 1000,
        showConfirmButton: false
    });
}

function alertProductoAgregado() {
    Swal.fire({
        title: `Producto agregado al carrito`,
        icon: "success",
        timer: 1000,
        showConfirmButton: false
    });
}

function alertProductoEliminado() {
    Swal.fire({
        title: `Producto eliminado del carrito`,
        icon: "error",
        timer: 1000,
        showConfirmButton: false
    });
}