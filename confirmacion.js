function generarCodigoReparacion() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'RUF-'; // Prefijo de la casa
    for (let i = 0; i < 6; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
}

function guardarReparacion(datos) {
    let reparaciones = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    reparaciones.push(datos);
    localStorage.setItem('reparaciones', JSON.stringify(reparaciones));
}

// 2. Lógica del Formulario
document.addEventListener('DOMContentLoaded', function() {
    const formReparacion = document.querySelector('form'); // Detecta el formulario

    if (formReparacion) {
        formReparacion.addEventListener('submit', function(e) {
            e.preventDefault();

            // Capturar valores
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const descripcion = document.getElementById('descripcion').value;
            
            // CAPTURA ESPECIAL PARA LAS IMÁGENES (Radio Buttons)
            const dispositivoSeleccionado = document.querySelector('input[name="dispositivo"]:checked');
            
            if (!dispositivoSeleccionado) {
                alert("Por favor, selecciona un dispositivo pinchando en una imagen.");
                return;
            }

            const dispositivo = dispositivoSeleccionado.value;

            // Generar el código único
            const nuevoCodigo = generarCodigoReparacion();

            // Crear el objeto del estropicio
            const datosOrden = {
                codigo: nuevoCodigo,
                nombre: nombre,
                email: email,
                dispositivo: dispositivo,
                descripcion: descripcion,
                fecha: new Date().toLocaleDateString(),
                estado: 'Recibido'
            };

            // Guardar en el historial (LocalStorage)
            guardarReparacion(datosOrden);

            // Guardar en la sesión para la página de éxito
            sessionStorage.setItem('codigoReparacion', nuevoCodigo);

            // Redirigir (Asegúrate de que el nombre del HTML sea este)
            window.location.href = 'reparacion_enviada.html';
        });
    }
});