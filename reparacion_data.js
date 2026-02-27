// --- 1. BASE DE DATOS Y UTILIDADES ---
const RufianDB = {
    // Genera códigos tipo RUF-XXXXXX o DUD-XXXXXX
    generarCodigo: (prefijo) => {
        return prefijo + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    },
    
    // Guarda el ticket en el almacenamiento local
    guardar: (datos) => {
        const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
        datos.respuesta = datos.respuesta || ""; 
        lista.push(datos);
        localStorage.setItem('reparaciones', JSON.stringify(lista));
    },

    // Busca un ticket específico por su código
    buscar: (codigo) => {
        const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
        return lista.find(r => r.codigo.toUpperCase() === codigo.toUpperCase());
    },

    // Sobreescribe la lista completa (útil para actualizar estados o borrar)
    actualizarLista: (nuevaLista) => {
        localStorage.setItem('reparaciones', JSON.stringify(nuevaLista));
    }
};

// Exponer la función de búsqueda para que otros archivos (como consulta.html) la usen
window.reparosRufian = {
    buscarReparacionPorCodigo: (codigo) => RufianDB.buscar(codigo)
};

// --- 2. LÓGICA DE INTERFAZ (Eventos de Formulario) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // A. FORMULARIO DE SOLICITUD DE REPARACIÓN (Para Rufián)
    const formReparacion = document.getElementById('form-reparacion');
    if (formReparacion) {
        formReparacion.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dispCheck = document.querySelector('input[name="dispositivo"]:checked');
            if (!dispCheck) {
                alert("Por favor, selecciona un dispositivo.");
                return;
            }

            const nuevoCodigo = RufianDB.generarCodigo('RUF');
            const datos = {
                codigo: nuevoCodigo,
                tipo: 'reparacion', // Diferencia entre Rufián y Pepe
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                dispositivo: dispCheck.value,
                descripcion: document.getElementById('descripcion').value,
                estado: 'Recibido',
                respuesta: '', 
                fecha: new Date().toLocaleDateString()
            };

            RufianDB.guardar(datos);
            sessionStorage.setItem('codigoReciente', nuevoCodigo);
            window.location.href = 'exito.html';
        });
    }

    // B. FORMULARIO DE DUDAS (Para Pepe)
    const formDudas = document.getElementById('form-dudas');
    if (formDudas) {
        formDudas.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nuevoCodigo = RufianDB.generarCodigo('DUD');
            const datosDuda = {
                codigo: nuevoCodigo,
                tipo: 'duda', // Diferencia entre Rufián y Pepe
                nombre: document.getElementById('nombre-duda').value,
                email: document.getElementById('email-duda').value,
                dispositivo: 'Consulta General',
                descripcion: document.getElementById('mensaje-duda').value,
                estado: 'Pendiente de respuesta',
                respuesta: '',
                fecha: new Date().toLocaleDateString()
            };

            RufianDB.guardar(datosDuda);
            sessionStorage.setItem('codigoReciente', nuevoCodigo);
            window.location.href = 'exito.html';
        });
    }

    // C. ACCESO AL PANEL (LOGIN CON ROLES)
    const formPrivado = document.getElementById('form-privado');
    if (formPrivado) {
        formPrivado.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('usuario-op').value.trim();
            const pass = document.getElementById('pass-op').value.trim();

            // Credenciales para Rufián
            if (user === "operador_rep" && pass === "rufián") {
                sessionStorage.setItem('sesionOperador', 'activa');
                sessionStorage.setItem('rolEmpleado', 'reparaciones');
                window.location.href = 'panel_operador.html';
            } 
            // Credenciales para Pepe
            else if (user === "operador_dud" && pass === "pepe") {
                sessionStorage.setItem('sesionOperador', 'activa');
                sessionStorage.setItem('rolEmpleado', 'dudas');
                window.location.href = 'panel_operador.html';
            } 
            else {
                alert("Usuario o contraseña incorrectos. Inténtalo de nuevo.");
            }
        });
    }
});

// --- 3. FUNCIONES GLOBALES PARA EL PANEL DE OPERADOR ---
// Estas funciones se definen fuera para que los botones con 'onclick' funcionen

function enviarRespuesta(index) {
    const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    const textoRespuesta = document.getElementById(`resp-${index}`).value;

    if (textoRespuesta.trim() === "") {
        alert("Por favor, escribe una respuesta antes de enviar.");
        return;
    }

    lista[index].respuesta = textoRespuesta;
    lista[index].estado = "Respondido";

    RufianDB.actualizarLista(lista);
    alert("Respuesta guardada con éxito.");
    location.reload(); 
}

function cambiarEstado(index) {
    const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    const nuevoEstado = prompt("Introduce el nuevo estado:", lista[index].estado);
    
    if (nuevoEstado !== null && nuevoEstado.trim() !== "") {
        lista[index].estado = nuevoEstado;
        RufianDB.actualizarLista(lista);
        location.reload();
    }
}

function eliminarTicket(index) {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
        const lista = JSON.parse(localStorage.getItem('reparaciones') || '[]');
        lista.splice(index, 1);
        RufianDB.actualizarLista(lista);
        location.reload();
    }
}