// Script para mostrar mensaje de confirmación tras enviar formularios de dudas o reparaciones
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Detectar si es dudas o reparaciones por el título de la página
            if (document.title.toLowerCase().includes('duda')) {
                window.location.href = 'confirmacion_duda.html';
            } else if (document.title.toLowerCase().includes('reparación') || document.title.toLowerCase().includes('reparacion')) {
                // Guardar datos de reparación y generar código
                const nombre = form.querySelector('#nombre').value;
                const email = form.querySelector('#email').value;
                const dispositivo = form.querySelector('#dispositivo').value;
                const descripcion = form.querySelector('#descripcion').value;
                const datosSinCodigo = {
                    nombre,
                    email,
                    dispositivo,
                    descripcion
                };
                if (window.reparosRufian.existeReparacionIgual(datosSinCodigo)) {
                    // Mostrar mensaje de error y no crear la orden
                    alert('Ya existe una orden de reparación con estos datos. No se puede crear una igual.');
                    return;
                }
                const codigo = window.reparosRufian.generarCodigoReparacion();
                const datos = {
                    codigo,
                    nombre,
                    email,
                    dispositivo,
                    descripcion,
                    estado: 'Pendiente'
                };
                window.reparosRufian.guardarReparacion(datos);
                // Guardar el código en sessionStorage para mostrarlo en la confirmación
                sessionStorage.setItem('codigoReparacion', codigo);
                window.location.href = 'confirmacion_reparacion.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    });
});
