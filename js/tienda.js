const contenedorProductos = document.getElementById("contenedor-productos");
const form = document.getElementById("form-barra-busqueda");
const formInput = document.getElementById("barra-busqueda");
const botonesCategoria = document.querySelectorAll(".tipo");
const botonesMarca = document.querySelectorAll(".marca");
let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
let productos = [];

async function cargarData() {
    try {
        const response = await fetch("../data.json");
        productos = await response.json();
        cargarProductos(productos);
    } catch {
        contenedorProductos.innerHTML = `<p class="alerta"> No se encontraron los productos.</p>`;
    }
}

cargarData();
agregarBusquedaProductos();
agregarEventoFiltrado(botonesCategoria, "categoria");
agregarEventoFiltrado(botonesMarca, "marca");

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    productosElegidos.forEach(producto => agregarProducto(producto));
    agregarEventoBotonesProductos();
}

function agregarProducto(producto) {
    const productoElemento = crearProductoElemento(producto);
    contenedorProductos.appendChild(productoElemento);
}

function crearProductoElemento(producto) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p>Precio: $${producto.precio} USD</p>
        <div class="botones ${carrito.some(item => item.id === producto.id) ? "" : "desactivado"}" id="botones-${producto.id}">
            <button class="btn-incrementar" id="incrementar-${producto.id}">+</button>
            <p id="cantidad-${producto.id}">${obtenerCantidadProducto(producto.id)}</p>
            <button class="btn-decrementar" id="decrementar-${producto.id}">-</button>
        </div>
        <button class="btn-agregar-carrito ${carrito.some(item => item.id === producto.id) ? "desactivado" : ""}" id="agregar-${producto.id}">Agregar al carrito</button>
    `;
    return div;
}

function agregarEventoFiltrado(botones, filtro) {
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const valor = e.currentTarget.id;
            if (valor === "todos") {
                cargarProductos(productos);
            } else {
                const productosFiltrados = productos.filter(producto => producto[filtro] === valor);
                cargarProductos(productosFiltrados);
            }
        });
    });
}

function agregarBusquedaProductos() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valorInput = formInput.value.toLowerCase();
        let productosEncontrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valorInput));
        if (productosEncontrados.length > 0) {
            cargarProductos(productosEncontrados);
        } else {
            contenedorProductos.innerHTML = `<p class="alerta"> No se encontraron los productos.</p>`;
        }
    });
}

function agregarEventoBotonesProductos() {
    const agregarCarrito = document.querySelectorAll(".btn-agregar-carrito");
    agregarCarrito.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });

    const botonesIncrementar = document.querySelectorAll(".btn-incrementar");
    botonesIncrementar.forEach(boton => {
        boton.addEventListener("click", incrementarCantidad);
    });

    const botonesDecrementar = document.querySelectorAll(".btn-decrementar");
    botonesDecrementar.forEach(boton => {
        boton.addEventListener("click", decrementarCantidad);
    });
}

function agregarAlCarrito(e) {
    const IdDelProducto = e.currentTarget.id.replace("agregar-", "");
    const productoAgregado = productos.find(producto => producto.id === IdDelProducto);

    productoAgregado.cantidad = 1;
    carrito.push(productoAgregado);
    cambiarBotones(IdDelProducto);

    alertProductoAgregado(productoAgregado);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCantidadCarritoEnHeader();
}

function incrementarCantidad(e) {
    const IdProducto = e.currentTarget.id.replace("incrementar-", "");
    const producto = carrito.find(producto => producto.id === IdProducto);

    producto.cantidad++;
    alertProductoAgregado(producto)
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCantidadProducto(IdProducto, producto.cantidad);
    actualizarCantidadCarritoEnHeader();
}

function decrementarCantidad(e) {
    const IdProducto = e.currentTarget.id.replace("decrementar-", "");
    const producto = carrito.find(producto => producto.id === IdProducto);
    
    producto.cantidad--;
    alertProductoEliminado(producto);

    if (producto.cantidad === 0) {
        carrito = carrito.filter(producto => producto.id !== IdProducto);
        cambiarBotones(IdProducto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCantidadProducto(IdProducto, producto.cantidad);
    actualizarCantidadCarritoEnHeader();
}

function cambiarBotones(IdProducto) {
    const botonesProducto = document.getElementById(`botones-${IdProducto}`);
    botonesProducto.classList.toggle("desactivado");
    const botonAgregarProducto = document.getElementById(`agregar-${IdProducto}`);
    botonAgregarProducto.classList.toggle("desactivado");
    const cantidadProducto = document.getElementById(`cantidad-${IdProducto}`);
    cantidadProducto.innerText = obtenerCantidadProducto(IdProducto);
}

function actualizarCantidadProducto(IdProducto, cantidad) {
    const cantidadProducto = document.getElementById(`cantidad-${IdProducto}`);
    cantidadProducto.innerText = cantidad;
}

function obtenerCantidadProducto(IdProducto) {
    const productoEnCarrito = carrito.find(producto => producto.id === IdProducto);
    return productoEnCarrito ? productoEnCarrito.cantidad : 0;
}

function alertProductoAgregado(productoAgregado) {
    Swal.fire({
        title: `Producto ${productoAgregado.nombre} agregado al carrito`,
        icon: "success",
        timer: 1000,
        showConfirmButton: false
    });
}

function alertProductoEliminado(productoEliminado) {
    Swal.fire({
        title: `Producto ${productoEliminado.nombre} eliminado del carrito`,
        icon: "error",
        timer: 1000,
        showConfirmButton: false
    });
}