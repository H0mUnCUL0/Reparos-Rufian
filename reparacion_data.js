// --- 1. BASE DE DATOS LOCAL ---
const RufianDB = {
    generarCodigo: () => 'RUF-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    
    guardar: (datos) => {
        const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
        lista.push(datos);
        localStorage.setItem('reparaciones', JSON.stringify(lista));
    },

    buscar: (codigo) => {
        const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
        return lista.find(r => r.codigo.toUpperCase() === codigo.toUpperCase());
    }
};

// --- 2. LÓGICA DE LAS PÁGINAS ---
document.addEventListener('DOMContentLoaded', () => {
    
    // A. FORMULARIO DE SOLICITUD DE REPARACIÓN
    const formReparacion = document.getElementById('form-reparacion');
    if (formReparacion) {
        formReparacion.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dispCheck = document.querySelector('input[name="dispositivo"]:checked');
            if (!dispCheck) {
                alert("Por favor, selecciona un dispositivo.");
                return;
            }

            const nuevoCodigo = RufianDB.generarCodigo();
            const datos = {
                codigo: nuevoCodigo,
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                dispositivo: dispCheck.value,
                descripcion: document.getElementById('descripcion').value,
                estado: 'Recibido',
                fecha: new Date().toLocaleDateString()
            };

            RufianDB.guardar(datos);
            sessionStorage.setItem('codigoReparacion', nuevoCodigo);
            
            // Redirige a la página de éxito de reparación
            window.location.href = 'reparacion_enviada.html';
        });
    }

    // B. FORMULARIO DE CONSULTA / ENVIAR DUDA
    const formConsulta = document.getElementById('form-consulta');
    if (formConsulta) {
        formConsulta.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtenemos el valor del código por si el usuario está consultando un estado
            const codigoInput = document.getElementById('codigo') ? document.getElementById('codigo').value.trim() : "";
            
            if (codigoInput !== "") {
                // Si el usuario escribió un código, buscamos el estado en la misma página
                const resultadoDiv = document.getElementById('resultado-consulta');
                const encontrado = RufianDB.buscar(codigoInput);

                if (encontrado && resultadoDiv) {
                    resultadoDiv.innerHTML = `
                        <div style="background:#f0f7ff; padding:1.5rem; border-radius:10px; border-left:5px solid #232946; margin-top:1rem; text-align:left;">
                            <h3 style="margin-top:0; color:#232946;">Estado: <span style="color:#22B14C;">${encontrado.estado}</span></h3>
                            <p><strong>Código:</strong> ${encontrado.codigo}</p>
                            <p><strong>Dispositivo:</strong> ${encontrado.dispositivo}</p>
                            <p><strong>Fecha:</strong> ${encontrado.fecha}</p>
                        </div>`;
                } else if (resultadoDiv) {
                    resultadoDiv.innerHTML = `<p style="color:#d32f2f; font-weight:bold; margin-top:1rem;">⚠️ Código no encontrado.</p>`;
                }
            } else {
                // Si NO hay código y es solo una duda general, enviamos a la página de confirmación de duda
                window.location.href = 'duda_enviada.html';
            }
        });
    }
});