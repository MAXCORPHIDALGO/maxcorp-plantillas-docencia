"use strict";
// DATOS Y REGLAS: operaciones puras. Cada cambio devuelve un estado nuevo.
// Los ids relacionan materiales y movimientos; nunca son índices de la tabla.
(function (raiz) {
  const CLAVE = "et505.s9.plantilla.v1";
  const entero = n => Number.isSafeInteger(n) && n > 0;
  const nombreValido = n => typeof n === "string" && n.trim().length >= 3 && n.trim().length <= 60;
  const copia = estado => JSON.parse(JSON.stringify(estado));
  const inicial = () => ({version: 1, siguienteMaterial: 1, siguienteMovimiento: 1, materiales: [], movimientos: []});
  function exigir(condicion, mensaje) { if (!condicion) throw new Error(mensaje); }
  function material(estado, id) {
    const encontrado = estado.materiales.find(m => m.id === id);
    exigir(encontrado, "Seleccione un código de material existente.");
    return encontrado;
  }
  function existencia(estado, id) {
    return estado.movimientos.filter(m => m.materialId === id)
      .reduce((saldo, m) => saldo + (m.tipo === "entrada" ? m.cantidad : -m.cantidad), 0);
  }
  function buscar(estado, texto) {
    const consulta = texto.trim().toLocaleLowerCase("es");
    return estado.materiales.filter(m => (m.id + " " + m.nombre).toLocaleLowerCase("es").includes(consulta));
  }
  function agregar(estado, nombre) {
    exigir(nombreValido(nombre), "Nombre: entre 3 y 60 caracteres.");
    exigir(entero(estado.siguienteMaterial + 1), "Se alcanzó el límite de identificadores.");
    const nuevo = copia(estado);
    const id = "MAT-" + String(nuevo.siguienteMaterial++).padStart(4, "0");
    nuevo.materiales.push({id, nombre: nombre.trim(), activo: true});
    return nuevo;
  }
  function renombrar(estado, id, nombre) {
    material(estado, id);
    exigir(nombreValido(nombre), "Nombre: entre 3 y 60 caracteres.");
    // TODO 1: copiar el estado, localizar por id y cambiar sólo ese nombre.
    // No use el índice de la fila filtrada. Devuelva la copia.
    throw new Error("PENDIENTE TODO 1: implementar edición por id. Datos conservados.");
  }
  function retirar(estado, id, confirmado) {
    material(estado, id);
    if (!confirmado) return estado;
    // TODO 2: copiar; si hay movimientos, inactivar sin borrar historial.
    // Si no hay movimientos, eliminar sólo el id elegido. Devuelva la copia.
    throw new Error("PENDIENTE TODO 2: implementar eliminación/inactivación. Datos conservados.");
  }
  function mover(estado, id, tipo, cantidad, fecha = new Date().toISOString()) {
    const elegido = material(estado, id);
    exigir(elegido.activo, "El material está inactivo; su historial se conserva y no admite movimientos.");
    exigir(tipo === "entrada" || tipo === "salida", "Tipo de movimiento inválido.");
    exigir(entero(cantidad), "La cantidad debe ser un entero positivo seguro; no admite cero, negativos ni decimales.");
    exigir(typeof fecha === "string" && Number.isFinite(Date.parse(fecha)), "Fecha inválida.");
    // TODO 3: calcular saldo físico tentativo y rechazar negativos/desbordes.
    // Validar contador, copiar y añadir un movimiento con id estable,
    // materialId, nombre, tipo, cantidad y fecha. Incrementar contador.
    // Use elegido.nombre para conservar el nombre al momento del movimiento.
    throw new Error("PENDIENTE TODO 3: implementar entradas/salidas seguras. Datos conservados.");
  }
  // Validar antes de usar JSON persistido. Un archivo corrupto no se reemplaza.
  function validar(estado) {
    exigir(estado && estado.version === 1 && Array.isArray(estado.materiales) && Array.isArray(estado.movimientos), "Estructura o versión JSON inválida.");
    exigir(entero(estado.siguienteMaterial) && entero(estado.siguienteMovimiento), "Contadores inválidos.");
    const ids = new Set();
    for (const m of estado.materiales) {
      exigir(m && typeof m.id === "string" && /^MAT-\d+$/.test(m.id) && !ids.has(m.id), "Código duplicado o inválido.");
      const numero = Number(m.id.slice(4));
      exigir(entero(numero) && numero < estado.siguienteMaterial && m.id === "MAT-" + String(numero).padStart(4, "0"), "Contador de materiales inválido.");
      exigir(nombreValido(m.nombre) && typeof m.activo === "boolean", "Material inválido.");
      ids.add(m.id);
    }
    const movimientos = new Set(), saldos = new Map();
    let ultimo = 0;
    for (const m of estado.movimientos) {
      exigir(m && typeof m.id === "string" && /^MOV-\d+$/.test(m.id) && !movimientos.has(m.id) && ids.has(m.materialId), "Movimiento sin material o código inválido.");
      const numero = Number(m.id.slice(4));
      exigir(entero(numero) && numero > ultimo && numero < estado.siguienteMovimiento && m.id === "MOV-" + numero, "Orden o contador de movimientos inválido.");
      exigir(nombreValido(m.nombre) && (m.tipo === "entrada" || m.tipo === "salida") && entero(m.cantidad) && typeof m.fecha === "string" && Number.isFinite(Date.parse(m.fecha)), "Datos del movimiento inválidos.");
      const saldo = (saldos.get(m.materialId) || 0) + (m.tipo === "entrada" ? m.cantidad : -m.cantidad);
      exigir(Number.isSafeInteger(saldo) && saldo >= 0, "Historial con existencia inválida.");
      movimientos.add(m.id); saldos.set(m.materialId, saldo); ultimo = numero;
    }
    return estado;
  }
  function celdaCSV(valor) {
    let texto = String(valor);
    // Excel: impedir que nombres/códigos se interpreten como fórmulas.
    if (/^[\s]*[=+\-@]/.test(texto) || /^[\t\r\n]/.test(texto)) texto = "'" + texto;
    return '"' + texto.replace(/"/g, '""') + '"';
  }
  function csv(estado) {
    // TODO 4: encabezados y filas de movimientos, con saldo por material.
    // Use celdaCSV en cada campo; separador ;, filas CRLF y BOM UTF-8.
    // Conserve nombres con acentos/comillas y la protección de fórmulas.
    throw new Error("PENDIENTE TODO 4: implementar exportación CSV. No se generó archivo.");
  }
  const reglas = {CLAVE, inicial, existencia, buscar, agregar, renombrar, retirar, mover, validar, csv};
  if (typeof module !== "undefined" && module.exports) module.exports = reglas;
  if (typeof document === "undefined") return;

  // PANTALLA: estado único del kardex y selección por id, separada del filtro.
  const elemento = id => document.getElementById(id);
  let estado, seleccionado = null, ultimaCopia;
  function aviso(texto, error = false) {
    const nodo = elemento("k-mensaje");
    nodo.textContent = texto; nodo.className = error ? "error" : "exito";
    if (error) nodo.focus();
  }
  function bloquear(texto) {
    elemento("k-controles").disabled = true;
    aviso(texto + " El kardex queda bloqueado para proteger los datos. No se sobrescribió el JSON guardado. Conserve una copia de la clave " + CLAVE + " y solicite revisión; no borre el almacenamiento sin respaldo.", true);
  }
  try {
    ultimaCopia = localStorage.getItem(CLAVE);
    estado = ultimaCopia === null ? inicial() : validar(JSON.parse(ultimaCopia));
  } catch (error) { bloquear("No se pudo leer el almacenamiento: " + error.message); return; }

  function guardar(nuevo) {
    // Detectar otra pestaña antes de sobrescribir un estado más reciente.
    const actual = localStorage.getItem(CLAVE);
    exigir(actual === ultimaCopia, "Los datos cambiaron en otra pestaña. Recargue para continuar.");
    const json = JSON.stringify(validar(nuevo));
    localStorage.setItem(CLAVE, json); // Si falla, el estado en pantalla tampoco cambia.
    ultimaCopia = json; estado = nuevo;
  }
  function intentar(operacion, mensaje) {
    try { guardar(operacion()); pintar(); aviso(mensaje); return true; }
    catch (error) { aviso(error.message + " No se aplicó el cambio.", true); return false; }
  }
  function celda(fila, texto) {
    const td = document.createElement("td"); td.textContent = texto; fila.append(td); return td;
  }
  function vacio(tabla, columnas, texto) {
    const fila = document.createElement("tr"), td = celda(fila, texto); td.colSpan = columnas; tabla.append(fila);
  }
  function pintar() {
    const tabla = elemento("k-materiales"); tabla.replaceChildren();
    const encontrados = buscar(estado, elemento("k-busqueda").value);
    if (!encontrados.some(m => m.id === seleccionado)) seleccionado = null;
    for (const m of encontrados) {
      const fila = document.createElement("tr");
      if (m.id === seleccionado) fila.className = "seleccionado";
      celda(fila, m.id); celda(fila, m.nombre); celda(fila, m.activo ? "Activo" : "Inactivo"); celda(fila, existencia(estado, m.id));
      const boton = document.createElement("button"); boton.type = "button"; boton.textContent = "Elegir " + m.id;
      boton.setAttribute("aria-pressed", String(m.id === seleccionado));
      boton.addEventListener("click", () => { seleccionado = m.id; pintar(); aviso("Seleccionado " + m.id + "."); });
      celda(fila, "").append(boton); tabla.append(fila);
    }
    if (!encontrados.length) vacio(tabla, 5, "Sin coincidencias. No hay material seleccionado.");
    const elegido = estado.materiales.find(m => m.id === seleccionado);
    elemento("k-elegido").disabled = !elegido;
    elemento("k-seleccion").textContent = elegido ? elegido.id + " · " + elegido.nombre + " · Existencia: " + existencia(estado, elegido.id) + " unidades · " + (elegido.activo ? "Activo" : "Inactivo") : "Ningún material seleccionado.";
    elemento("k-nuevo-nombre").value = elegido ? elegido.nombre : "";
    elemento("k-registrar").disabled = !elegido || !elegido.activo;
    elemento("k-eliminar").disabled = !elegido || !elegido.activo;
    const historial = elemento("k-historial"); historial.replaceChildren();
    const saldos = new Map();
    for (const m of estado.movimientos) {
      const saldo = (saldos.get(m.materialId) || 0) + (m.tipo === "entrada" ? m.cantidad : -m.cantidad);
      saldos.set(m.materialId, saldo);
      const fila = document.createElement("tr");
      [m.id, new Date(m.fecha).toLocaleString("es-PE"), m.materialId, m.nombre, m.tipo, m.cantidad, saldo].forEach(t => celda(fila, t)); historial.append(fila);
    }
    if (!estado.movimientos.length) vacio(historial, 7, "Todavía no hay movimientos.");
  }
  elemento("k-alta").addEventListener("submit", evento => {
    evento.preventDefault();
    if (intentar(() => agregar(estado, elemento("k-nombre").value), "Material añadido. Búsquelo y elija su código.")) elemento("k-nombre").value = "";
  });
  elemento("k-busqueda").addEventListener("input", () => { seleccionado = null; pintar(); });
  elemento("k-edicion").addEventListener("submit", evento => {
    evento.preventDefault(); intentar(() => renombrar(estado, seleccionado, elemento("k-nuevo-nombre").value), "Nombre actualizado únicamente para el código elegido.");
  });
  elemento("k-eliminar").addEventListener("click", () => {
    try {
      const elegido = material(estado, seleccionado);
      const tieneHistorial = estado.movimientos.some(m => m.materialId === elegido.id);
      const confirmado = raiz.confirm((tieneHistorial ? "Inactivar " : "Eliminar definitivamente del kardex ") + elegido.id + " · " + elegido.nombre + (tieneHistorial ? " y conservar todos sus movimientos. ¿Confirmar?" : " sin movimientos. ¿Confirmar?"));
      if (!confirmado) { aviso("Operación cancelada. Materiales y movimientos intactos."); return; }
      intentar(() => retirar(estado, elegido.id, true), tieneHistorial ? "Material inactivo. Historial conservado." : "Material sin movimientos eliminado.");
    } catch (error) { aviso(error.message, true); }
  });
  elemento("k-movimiento").addEventListener("submit", evento => {
    evento.preventDefault();
    if (intentar(() => mover(estado, seleccionado, elemento("k-tipo").value, Number(elemento("k-cantidad").value)), "Movimiento registrado; existencia física actualizada.")) elemento("k-cantidad").value = "";
  });
  elemento("k-csv").addEventListener("click", () => {
    try {
      const url = URL.createObjectURL(new Blob([csv(estado)], {type: "text/csv;charset=utf-8"}));
      const enlace = document.createElement("a"); enlace.href = url; enlace.download = "et505-movimientos.csv"; document.body.append(enlace); enlace.click(); enlace.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      aviso("CSV generado en UTF-8, separado por punto y coma. Es una copia de los movimientos de esta pestaña; compruebe cantidades en Excel.");
    } catch (error) { aviso("No se pudo generar el CSV: " + error.message, true); }
  });
  raiz.addEventListener("storage", evento => {
    if (evento.key === CLAVE || evento.key === null) bloquear("El almacenamiento cambió en otra pestaña. Recargue para leer la versión actual.");
  });
  pintar();
})(typeof window !== "undefined" ? window : globalThis);
