function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('contenedor-productos');
    let productosHtml = '';

    productos.forEach(producto => {
        productosHtml += `
        <div class="producto">
            <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>Precio: <b>${producto.precio}</b></p>
            <p class="desc">${producto.descripcion}</p>
            <span class="agregar-al-carrito" data-id="${producto.id}" title="">+</span>
        </div>
        `
        contenedorProductos.innerHTML = productosHtml;
    })
}

function fetchAndDisplayProducts(){
    fetch('./data/instrumentos.json')
    .then(response =>{
        if (!response.ok){
            throw new Error('Error al obtener los datos');
        }
        return response.json();
    })
    .then( data => {
        const productos = Object.values(data).flat();
        mostrarProductos(productos);

        document.querySelectorAll('.nav li').foreach(li => {
            li.addEventListener('click', function(){
              const tipo = this.getAttribute('data-tipo');
              const productosFiltrados = data[tipo];
              mostrarProductos(productosFiltrados);
            });
        });
    })

    .catch(error => console.error('Error al obtener productos', error));
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayProducts);

