// Guardar y consultar reparaciones en localStorage
// Genera código, guarda datos y permite consultar por código

function generarCodigoReparacion() {
    // Código aleatorio de 8 caracteres alfanuméricos
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
}


function existeReparacionIgual(datos) {
    let reparaciones = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    return reparaciones.some(r =>
        r.nombre === datos.nombre &&
        r.email === datos.email &&
        r.dispositivo === datos.dispositivo &&
        r.descripcion === datos.descripcion
    );
}

function guardarReparacion(datos) {
    let reparaciones = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    reparaciones.push(datos);
    localStorage.setItem('reparaciones', JSON.stringify(reparaciones));
}

function buscarReparacionPorCodigo(codigo) {
    let reparaciones = JSON.parse(localStorage.getItem('reparaciones') || '[]');
    return reparaciones.find(r => r.codigo === codigo);
}

// Exportar funciones para uso en otros scripts
window.reparosRufian = {
    generarCodigoReparacion,
    guardarReparacion,
    buscarReparacionPorCodigo,
    existeReparacionIgual
};
