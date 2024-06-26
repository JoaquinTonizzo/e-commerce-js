function actualizarCantidadCarritoEnHeader() {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]"); 
    const carritoCantidadElemento = document.querySelector('.contador-carrito');
    if (carritoCantidadElemento) {
        const cantidadEnCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        carritoCantidadElemento.textContent = cantidadEnCarrito;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarCantidadCarritoEnHeader();
});
