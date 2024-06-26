//2
let carrito = JSON.parse(localStorage.getItem("carrito")); 
const carritoVacio = document.getElementById("carrito-vacio"); 
const carritoProductos = document.getElementById("contenedor-productos"); 
const carritoElementos = document.getElementById("carrito-elementos"); 
const comprarCarrito = document.getElementById("comprar-carrito"); 
const borrarCarrito = document.getElementById("vaciar-carrito"); 
const compraTotal = document.getElementById("total-carrito");

actualizarProductosCarrito(); 

function actualizarProductosCarrito() {
    if (carrito.length > 0) {
        mostrarCarrito();
        agregarEventoEliminarProducto();
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
    ActualizarTotalCarrito();
}

function agregarProductoAlCarrito(producto) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.classList.add("producto-carrito");
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p>Precio: $${producto.precio} USD</p>
        <div><p>Cantidad: ${producto.cantidad}</p></div>
        <div><button class="quitar-del-carrito" id="${producto.id}">Borrar</button></div>
    `;
    carritoProductos.appendChild(div);
}

function mostrarCarritoVacio() {
    carritoVacio.classList.remove("desactivado");
    carritoProductos.classList.add("desactivado");
    carritoElementos.classList.add("desactivado");
    carritoProductos.innerHTML = "";
}

function agregarEventoEliminarProducto() {
    const borrarProducto = document.querySelectorAll(".quitar-del-carrito");
    borrarProducto.forEach(boton => {
        boton.addEventListener("click", borrarProductoCarrito);
    });
}

function borrarProductoCarrito(e) {
    let IdDelProducto = e.currentTarget.id; 
    const producto = carrito.find(producto => producto.id === IdDelProducto); 
    if (producto.cantidad == 1) {
        const index = carrito.findIndex(producto => producto.id === IdDelProducto); 
        carrito.splice(index, 1);  
    }
    else {
        producto.cantidad--;
    }
    Swal.fire({
        title: `Producto ${producto.nombre} eliminado del carrito`,
        icon: "error",
        timer: 1000,
        showConfirmButton: false
    });
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    actualizarProductosCarrito(); 
    actualizarCantidadCarritoEnHeader();
}

comprarCarrito.addEventListener("click", comprarCarritoClick); 
function comprarCarritoClick() {
    Swal.fire({
        title: "¡Gracias por su compra!",
        icon: "success",
        html:`
        <div>
            <p>Valor total de la compra: ${calcularTotalCarrito()} USD</p>
        </div>
        `,
        timer: 1000,
        showConfirmButton: false
    });
    carrito = []; 
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    actualizarProductosCarrito(); 
    actualizarCantidadCarritoEnHeader(); 
}

borrarCarrito.addEventListener("click", borrarCarritoClick); 
function borrarCarritoClick() {
    Swal.fire({
        title: "Carrito eliminado completamente",
        icon: "error",
        timer: 1000,
        showConfirmButton: false 
    });
    carrito = []; 
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    actualizarProductosCarrito(); 
    actualizarCantidadCarritoEnHeader(); 
}

function ActualizarTotalCarrito() {
    compraTotal.innerText = "Total a pagar: $" + calcularTotalCarrito(); 
}

function calcularTotalCarrito() {
    return carrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad, 0); 
}