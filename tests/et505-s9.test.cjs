"use strict";
const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const raiz = path.resolve(__dirname, "..");
const archivo = (version, nombre) => path.join(raiz, "ET505/SEMANA9", version, nombre);
const k = require(archivo("demo", "kardex.js"));
const plantilla = require(archivo("plantilla", "kardex.js"));
const dos = () => k.agregar(k.agregar(k.inicial(), "Cuaderno"), "Lápiz");
const foto = estado => JSON.stringify(estado);

test("S7: app.js idéntico en ambas versiones y archivos esperados", () => {
  for (const version of ["demo", "plantilla"]) {
    for (const nombre of ["index.html", "styles.css", "app.js", "kardex.js", "README.md"]) assert.ok(fs.statSync(archivo(version, nombre)).size);
    assert.deepEqual(fs.readFileSync(archivo(version, "app.js")), fs.readFileSync(path.join(raiz, "ET505/demo/app.js")));
  }
});

test("demo: buscar por nombre/id, sin coincidencias y vacío no muta", () => {
  const estado = dos(), antes = foto(estado);
  assert.equal(k.buscar(estado, "CUADER")[0].id, "MAT-0001");
  assert.equal(k.buscar(estado, "MAT-0002")[0].nombre, "Lápiz");
  assert.equal(k.buscar(estado, "inexistente").length, 0);
  assert.equal(k.buscar(estado, "").length, 2);
  assert.equal(foto(estado), antes);
});

test("demo: editar filtrado por id conserva segundo material y estado original", () => {
  const estado = dos(), antes = foto(estado), elegido = k.buscar(estado, "Cuaderno")[0];
  const nuevo = k.renombrar(estado, elegido.id, "Cuaderno azul");
  assert.equal(nuevo.materiales[0].nombre, "Cuaderno azul");
  assert.deepEqual(nuevo.materiales[1], estado.materiales[1]);
  assert.equal(foto(estado), antes);
  assert.throws(() => k.renombrar(estado, "", "Otro"));
});

test("demo: cancelar y eliminar sin movimientos; ids nunca reutilizados", () => {
  const estado = dos();
  assert.equal(k.retirar(estado, "MAT-0001", false), estado);
  const eliminado = k.retirar(estado, "MAT-0001", true);
  assert.deepEqual(eliminado.materiales, [estado.materiales[1]]);
  assert.equal(k.agregar(eliminado, "Tijeras").materiales[1].id, "MAT-0003");
  assert.equal(estado.materiales.length, 2);
});

test("demo: 10−3=7, salida 8 e inválidos conservan estado e historial", () => {
  const estado = k.mover(k.mover(dos(), "MAT-0001", "entrada", 10), "MAT-0001", "salida", 3);
  const antes = foto(estado);
  assert.equal(k.existencia(estado, "MAT-0001"), 7);
  assert.equal(k.existencia(estado, "MAT-0002"), 0);
  for (const n of [8, 0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => k.mover(estado, "MAT-0001", "salida", n));
  assert.throws(() => k.mover(estado, "MAT-0001", "entrada", Number.MAX_SAFE_INTEGER));
  assert.equal(foto(estado), antes);
});

test("demo: inactiva con historial aun con saldo cero; conserva nombres históricos", () => {
  let estado = k.mover(dos(), "MAT-0001", "entrada", 10);
  estado = k.renombrar(estado, "MAT-0001", "Cuaderno nuevo");
  estado = k.mover(estado, "MAT-0001", "salida", 10);
  const retirado = k.retirar(estado, "MAT-0001", true);
  assert.equal(retirado.materiales[0].activo, false);
  assert.deepEqual(retirado.movimientos, estado.movimientos);
  assert.equal(retirado.movimientos[0].nombre, "Cuaderno");
  assert.equal(retirado.movimientos[1].nombre, "Cuaderno nuevo");
  assert.throws(() => k.mover(retirado, "MAT-0001", "entrada", 1));
});

test("demo: JSON conserva ids/contadores y rechaza corrupción/referencias/saldos inválidos", () => {
  const estado = k.mover(dos(), "MAT-0001", "entrada", 10);
  assert.deepEqual(k.validar(JSON.parse(foto(estado))), estado);
  for (const cambiar of [e => e.version = 2, e => e.materiales.push({...e.materiales[0]}), e => e.movimientos[0].materialId = "inexistente", e => e.movimientos[0].tipo = "salida", e => e.siguienteMaterial = 1, e => e.movimientos[0].cantidad = 1.5, e => e.movimientos[0].fecha = "invalida"]) {
    const corrupto = JSON.parse(foto(estado)); cambiar(corrupto); assert.throws(() => k.validar(corrupto));
  }
});

function leerCSV(texto) {
  // Lector independiente: respeta delimitadores/comillas dentro de celdas.
  const filas = [], fila = []; let celda = "", comillas = false;
  texto = texto.replace(/^\uFEFF/, "");
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === '"') { if (comillas && texto[i + 1] === '"') {celda += '"'; i++;} else comillas = !comillas; }
    else if (c === ";" && !comillas) {fila.push(celda); celda = "";}
    else if (c === "\r" && texto[i + 1] === "\n" && !comillas) {fila.push(celda); filas.push([...fila]); fila.length = 0; celda = ""; i++;}
    else celda += c;
  }
  assert.equal(comillas, false); return filas;
}

test("demo: CSV con BOM, acentos/comillas, fórmulas neutralizadas y saldos por material", () => {
  let estado = k.renombrar(dos(), "MAT-0001", 'Lápiz; "azul"');
  estado = k.renombrar(estado, "MAT-0002", "=SUM(1;2)");
  estado = k.mover(estado, "MAT-0001", "entrada", 10);
  estado = k.mover(estado, "MAT-0002", "entrada", 4);
  estado = k.mover(estado, "MAT-0001", "salida", 3);
  estado = k.retirar(estado, "MAT-0001", true);
  const texto = k.csv(estado), filas = leerCSV(texto);
  assert.equal(texto.charCodeAt(0), 0xFEFF);
  assert.equal(filas.length, 4);
  assert.equal(filas[1][3], 'Lápiz; "azul"');
  assert.equal(filas[2][3], "'=SUM(1;2)");
  assert.deepEqual(filas.slice(1).map(f => [f[5], f[6]]), [["10", "10"], ["4", "4"], ["3", "7"]]);
});

test("plantilla: TODO explícitos; no acreditar operaciones pendientes como solución", () => {
  const estado = plantilla.agregar(plantilla.inicial(), "Cuaderno"), antes = foto(estado);
  assert.throws(() => plantilla.renombrar(estado, "MAT-0001", "Otro"), /TODO 1/);
  assert.equal(plantilla.retirar(estado, "MAT-0001", false), estado);
  assert.throws(() => plantilla.retirar(estado, "MAT-0001", true), /TODO 2/);
  assert.throws(() => plantilla.mover(estado, "MAT-0001", "entrada", 10), /TODO 3/);
  assert.throws(() => plantilla.csv(estado), /TODO 4/);
  assert.equal(foto(estado), antes);
  assert.notEqual(plantilla.CLAVE, k.CLAVE);
});

// Doble mínimo DOM/storage: ejecuta scripts reales y sus eventos, sin paquetes.
function interfaz(version = "demo", datos = new Map(), opciones = {}) {
  class Nodo {
    constructor(tag = "div") {this.tag = tag; this.value = ""; this.textContent = ""; this.hidden = false; this.disabled = false; this.children = []; this.listeners = new Map(); this.attrs = {};}
    addEventListener(tipo, accion) {this.listeners.set(tipo, accion);}
    evento(tipo) {this.listeners.get(tipo)?.({preventDefault() {}});}
    append(nodo) {this.children.push(nodo);}
    replaceChildren(...nodos) {this.children = nodos;}
    setAttribute(nombre, valor) {this.attrs[nombre] = valor;}
    focus() {this.enfocado = true;}
    reset() {for (const id of ["material", "cantidad", "precio"]) nodos[id].value = "";}
    click() {this.evento("click");}
    remove() {}
  }
  const html = fs.readFileSync(archivo(version, "index.html"), "utf8"), nodos = {};
  for (const match of html.matchAll(/id="([^"]+)"/g)) nodos[match[1]] = new Nodo();
  nodos.ficha.hidden = true; nodos["k-tipo"].value = "entrada";
  const eventos = {}, contexto = {
    document: {getElementById: id => {assert.ok(nodos[id], id); return nodos[id];}, createElement: tag => new Nodo(tag), body: new Nodo("body")},
    localStorage: {getItem: clave => datos.get(clave) ?? null, setItem: (clave, valor) => {if (opciones.cuota) throw Error("Cuota agotada"); datos.set(clave, valor);}},
    confirm: () => opciones.confirmar ?? false,
    addEventListener: (tipo, accion) => eventos[tipo] = accion,
    Blob, URL, setTimeout, console
  };
  contexto.window = contexto;
  vm.createContext(contexto);
  for (const script of ["app.js", "kardex.js"]) vm.runInContext(fs.readFileSync(archivo(version, script), "utf8"), contexto, {filename: script});
  return {nodos, datos, opciones, eventos, estado: () => JSON.parse(datos.get(version === "demo" ? k.CLAVE : plantilla.CLAVE)),
    alta(nombre) {nodos["k-nombre"].value = nombre; nodos["k-alta"].evento("submit");},
    elegir(id) {const fila = nodos["k-materiales"].children.find(f => f.children[0].textContent === id); assert.ok(fila); fila.children[4].children[0].click();},
    mover(tipo, cantidad) {nodos["k-tipo"].value = tipo; nodos["k-cantidad"].value = String(cantidad); nodos["k-movimiento"].evento("submit");}
  };
}

test("interfaz demo: selección por id, segundo intacto, sin coincidencias elimina selección previa", () => {
  const ui = interfaz(); ui.alta("Cuaderno"); ui.alta("Lápiz");
  const segundo = ui.estado().materiales[1];
  ui.nodos["k-busqueda"].value = "Cuaderno"; ui.nodos["k-busqueda"].evento("input"); ui.elegir("MAT-0001");
  ui.nodos["k-nuevo-nombre"].value = "Cuaderno azul"; ui.nodos["k-edicion"].evento("submit");
  assert.deepEqual(ui.estado().materiales[1], segundo);
  const antes = foto(ui.estado());
  ui.nodos["k-busqueda"].value = "No existe"; ui.nodos["k-busqueda"].evento("input");
  assert.equal(ui.nodos["k-elegido"].disabled, true);
  assert.match(ui.nodos["k-seleccion"].textContent, /Ningún/);
  ui.nodos["k-nuevo-nombre"].value = "Incorrecto"; ui.nodos["k-edicion"].evento("submit");
  assert.equal(foto(ui.estado()), antes);
  ui.nodos["k-busqueda"].value = ""; ui.nodos["k-busqueda"].evento("input");
  assert.equal(ui.nodos["k-materiales"].children.length, 2);
  assert.equal(ui.nodos["k-elegido"].disabled, true);
});

test("interfaz demo: cancelar elimina cero datos; confirmar elimina uno sin movimientos", () => {
  const ui = interfaz(); ui.alta("Cuaderno"); ui.alta("Lápiz"); ui.elegir("MAT-0001");
  const antes = foto(ui.estado()); ui.nodos["k-eliminar"].click();
  assert.equal(foto(ui.estado()), antes); assert.match(ui.nodos["k-mensaje"].textContent, /cancelada/);
  ui.opciones.confirmar = true; ui.nodos["k-eliminar"].click();
  assert.equal(ui.estado().materiales.length, 1); assert.equal(ui.estado().materiales[0].id, "MAT-0002");
});

test("interfaz demo: movimientos/rechazos/inactivación/recarga conservan historia", () => {
  const ui = interfaz("demo", new Map(), {confirmar: true});
  ui.alta("Cuaderno"); ui.alta("Lápiz"); ui.elegir("MAT-0001"); ui.mover("entrada", 10); ui.mover("salida", 3);
  const antes = foto(ui.estado());
  for (const n of [8, 0, -1, 1.5]) {ui.mover("salida", n); assert.equal(foto(ui.estado()), antes);}
  ui.nodos["k-eliminar"].click();
  assert.equal(ui.estado().materiales[0].activo, false);
  assert.equal(ui.estado().movimientos.length, 2);
  assert.equal(ui.nodos["k-registrar"].disabled, true);
  const recarga = interfaz("demo", ui.datos);
  assert.deepEqual(recarga.estado(), ui.estado());
  assert.equal(recarga.nodos["k-historial"].children.length, 2);
});

test("interfaz: JSON corrupto y cuota fallida no sobrescriben datos", () => {
  const datos = new Map([[k.CLAVE, "{JSON roto"]]);
  const roto = interfaz("demo", datos);
  assert.equal(roto.nodos["k-controles"].disabled, true);
  assert.equal(datos.get(k.CLAVE), "{JSON roto");
  const ui = interfaz(); ui.alta("Cuaderno"); const antes = datos.get(k.CLAVE), propioAntes = ui.datos.get(k.CLAVE);
  ui.opciones.cuota = true; ui.alta("Lápiz");
  assert.equal(ui.datos.get(k.CLAVE), propioAntes);
  assert.equal(ui.nodos["k-materiales"].children.length, 1);
  assert.match(ui.nodos["k-mensaje"].textContent, /Cuota agotada/);
  assert.equal(datos.get(k.CLAVE), antes);
});

test("interfaz: otra pestaña bloquea escritura desactualizada", () => {
  const ui = interfaz(); ui.alta("Cuaderno");
  const masReciente = k.agregar(ui.estado(), "Lápiz"); ui.datos.set(k.CLAVE, foto(masReciente));
  ui.alta("Tijeras"); assert.deepEqual(ui.estado(), masReciente);
  assert.match(ui.nodos["k-mensaje"].textContent, /otra pestaña/);
  ui.eventos.storage({key: k.CLAVE}); assert.equal(ui.nodos["k-controles"].disabled, true);
});

test("interfaz S7: ambos botones, límites, ficha conservada y limpiar sin borrar kardex", () => {
  const ui = interfaz(), n = ui.nodos;
  n.material.value = "Cuaderno"; n.cantidad.value = "10"; n.precio.value = "15";
  n.comprobar.click(); assert.match(n.mensaje.textContent, /Pedido válido/);
  n.formulario.evento("submit"); assert.match(n.ficha.textContent, /Total: S\/ 150.00/);
  assert.match(n.ficha.textContent, /Saldo: S\/ 0.00/); const ficha = n.ficha.textContent;
  for (const datos of [["Cuaderno", 10, 15.01], ["Ab", 10, 1], ["Cuaderno", 0, 1], ["Cuaderno", 31, 1], ["Cuaderno", 1.5, 1], ["Cuaderno", 1, 0], ["Cuaderno", 1, 50.01], ["Cuaderno", 1, 1.001]]) {
    [n.material.value, n.cantidad.value, n.precio.value] = datos.map(String);
    n.comprobar.click(); assert.equal(n.mensaje.className, "error"); assert.equal(n.ficha.textContent, ficha);
    n.formulario.evento("submit"); assert.equal(n.mensaje.className, "error"); assert.equal(n.ficha.textContent, ficha);
  }
  ui.alta("Cuaderno"); const antes = foto(ui.estado()); n.limpiar.click();
  assert.equal(n.ficha.hidden, true); assert.equal(foto(ui.estado()), antes);
});

test("interfaz plantilla: abre y muestra pendientes explícitos sin mutar datos", () => {
  const ui = interfaz("plantilla", new Map(), {confirmar: true}); ui.alta("Cuaderno"); ui.elegir("MAT-0001");
  const antes = foto(ui.estado());
  ui.nodos["k-nuevo-nombre"].value = "Nuevo nombre"; ui.nodos["k-edicion"].evento("submit");
  assert.match(ui.nodos["k-mensaje"].textContent, /TODO 1/);
  ui.nodos["k-eliminar"].click(); assert.match(ui.nodos["k-mensaje"].textContent, /TODO 2/);
  ui.mover("entrada", 10); assert.match(ui.nodos["k-mensaje"].textContent, /TODO 3/);
  ui.nodos["k-csv"].click(); assert.match(ui.nodos["k-mensaje"].textContent, /TODO 4/);
  assert.equal(foto(ui.estado()), antes);
});

test("HTML/README: referencias locales resuelven y no hay ids repetidos en páginas nuevas", () => {
  const paginas = [path.join(raiz, "index.html"), path.join(raiz, "ET505/index.html"), path.join(raiz, "ET505/SEMANA9/index.html"), archivo("demo", "index.html"), archivo("plantilla", "index.html")];
  for (const pagina of paginas) {
    const contenido = fs.readFileSync(pagina, "utf8"), ids = [...contenido.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, pagina);
    for (const [, enlace] of contenido.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|#)/.test(enlace)) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(pagina), enlace)), pagina + ": " + enlace);
    }
  }
  for (const pagina of ["README.md", "ET505/README.md", "ET505/SEMANA9/README.md", "ET505/SEMANA9/demo/README.md", "ET505/SEMANA9/plantilla/README.md"]) {
    for (const [, enlace] of fs.readFileSync(path.join(raiz, pagina), "utf8").matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(enlace)) continue;
      assert.ok(fs.existsSync(path.resolve(raiz, path.dirname(pagina), enlace)), pagina + ": " + enlace);
    }
  }
});
