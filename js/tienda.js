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
        <button class="btn-agregar-carrito" id="${producto.id}">Agregar al carrito</button>
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
    form.addEventListener("click", (e) => { 
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
    })
}

function agregarAlCarrito(e) {
    let IdDelProducto = e.currentTarget.id; 
    const productoAgregado = productos.find(producto => producto.id === IdDelProducto); 
    if (carrito.some(producto => producto.id === IdDelProducto)) { 
        const index = carrito.findIndex(producto => producto.id === IdDelProducto);
        carrito[index].cantidad++; 
    } else { 
        productoAgregado.cantidad = 1;
        carrito.push(productoAgregado);
    }
    Swal.fire({
        title: `Producto ${productoAgregado.nombre} agregado al carrito`,
        icon: "success",
        timer: 1000,
        showConfirmButton: false
    });
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    actualizarCantidadCarritoEnHeader(); 
}
