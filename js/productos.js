

document.addEventListener('DOMContentLoaded', function () {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const navItems = document.querySelectorAll('.nav li');
    const modalCart = document.getElementById('modal-cart');
    const cartCounter = document.getElementById('cart-counter');
    const productosC = document.querySelector('.productosC');
    const totalElement = document.getElementById('total');
    const btnRealizarPedido = document.getElementById('realizar-pedido');
    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    const floatingButton = document.querySelector('.floating-button');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    async function cargarProductos(categoria) {
        try {
            const response = await fetch('./data/instrumentos.json');
            const productos = await response.json();

            contenedorProductos.innerHTML = ''; // Limpiar el contenedor de productos antes de cargar nuevos productos

            productos[categoria].forEach(producto => {
                const productoHTML = `
                    <div class="producto">
                        <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">
                        <h2>${producto.nombre}</h2>
                        <p>Precio: <b>${producto.precio}</b></p>
                        <p class="desc">${producto.descripcion}</p>
                        <span class="agregar-al-carrito" data-id="${producto.id}" data-categoria="${categoria}" title="">+</span>
                    </div>
                `;
                contenedorProductos.innerHTML += productoHTML;
            });

            inicializarPantallaCompleta();
            inicializarAgregarAlCarrito();

        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    function inicializarPantallaCompleta() {
        const productImages = document.querySelectorAll('.imagen-producto');
        const fullscreenContainer = document.getElementById('fullscreen-container');
        const fullscreenImage = document.getElementById('fullscreen-image');

        productImages.forEach(img => {
            img.addEventListener('click', function () {
                fullscreenImage.src = this.src;
                fullscreenContainer.style.display = 'flex';
            });
        });

        fullscreenContainer.addEventListener('click', function () {
            this.style.display = 'none';
        });
    }

    function inicializarAgregarAlCarrito() {
        const botonesAgregar = document.querySelectorAll('.agregar-al-carrito');
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', function () {
                const productoId = this.getAttribute('data-id');
                const categoria = this.getAttribute('data-categoria');

                agregarProductoAlCarrito(productoId, categoria);

                Swal.fire({
                    icon: 'success',
                    title: 'Producto añadido',
                    text: `El producto ha sido añadido al carrito.`,
                    showConfirmButton: false,
                    timer: 1300,
                });
            });
        });
    }
   

    function agregarProductoAlCarrito(id, categoria) {
        fetch('./data/instrumentos.json')
            .then(response => response.json())
            .then(data => {
                const producto = data[categoria].find(item => item.id == id);
                const productoKey = `${id}-${categoria}`;
                const productoEnCarrito = carrito.find(item => item.key === productoKey);

                if (productoEnCarrito) {
                    productoEnCarrito.cantidad++;
                } else {
                    carrito.push({
                        ...producto,
                        cantidad: 1,
                        key: productoKey, // Agregar una propiedad única para el carrito
                        categoria: categoria
                    });
                }

                actualizarCarrito();
                Swal.fire({
                    icon: 'success',
                    title: 'Producto añadido',
                    text: `El producto ha sido añadido al carrito.`,
                    showConfirmButton: false,
                    timer: 1300,
                });
            })
            .catch(error => console.error('Error al agregar producto al carrito:', error));
    }

   

    function actualizarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        const totalCantidad = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        cartCounter.textContent = totalCantidad;

        // Mostrar u ocultar el contador del carrito
        cartCounter.style.display = totalCantidad > 0 ? 'block' : 'none';

        renderizarCarrito();
    }

    function renderizarCarrito() {
        productosC.innerHTML = '';
        let total = 0;

        carrito.forEach(producto => {
            const productoHTML = `
                <div class="producto-en-carrito">
                    <p><span>${producto.cantidad}</span></p>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p><b>$${producto.precio}</b></p>
                       
                </div>
            `;
            productosC.innerHTML += productoHTML;
            total += producto.precio * producto.cantidad;
        });

        totalElement.textContent = `$${total.toFixed(2)}`;

        // Añadir event listener a los botones de eliminar
        document.querySelectorAll('.eliminar-producto').forEach(button => {
            button.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const categoria = this.getAttribute('data-categoria');
                eliminarProductoDelCarrito(id, categoria);
            });
        });
    }

    function vaciarCarrito() {
        carrito = [];
        actualizarCarrito();
    }

    function realizarPedido() {
        Swal.fire({
            icon: 'success',
            title: 'Pedido realizado',
            text: '¡Tu pedido ha sido realizado con éxito!',
            showConfirmButton: true,
            confirmButtonColor: '#666867',
            customClass: {
                popup: 'my-swal-font',
                title: 'my-swal-font',
                content: 'my-swal-font',
                confirmButton: 'my-swal-font'
            }
        });
        vaciarCarrito();
    }

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const categoria = this.id; // Obtener el ID del elemento de navegación
            cargarProductos(categoria); // Cargar productos de la categoría seleccionada
        });
    });

    floatingButton.addEventListener('click', function () {
        modalCart.style.display = 'block';
        renderizarCarrito();
    });

    document.querySelector('.close').addEventListener('click', function () {
        modalCart.style.display = 'none';
    });

    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    btnRealizarPedido.addEventListener('click', realizarPedido);

    window.addEventListener('click', function (event) {
        if (event.target == modalCart) {
            modalCart.style.display = 'none';
        }
    });

    cargarProductos('cuerdas'); // Cargar productos de la categoría 'cuerdas' por defecto
    actualizarCarrito(); // Actualizar el contador del carrito al cargar la página
});





