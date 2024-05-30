
document.addEventListener('DOMContentLoaded', function () {
    const btnAbrirModal = document.querySelector(".floating-button");
    const modal = document.getElementById("modal-cart");

    // Obtener el botón de cierre
    const spanCerrar = document.getElementsByClassName("close")[0];

    // Cuando el usuario haga clic en el botón, abrir el modal
    btnAbrirModal.onclick = function () {
        modal.style.display = "block";
    }

    // Cuando el usuario haga clic en el botón de cierre, cerrar el modal
    spanCerrar.onclick = function () {
        modal.style.display = "none";
    }

    // Cuando el usuario haga clic fuera del modal, cerrar el modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});