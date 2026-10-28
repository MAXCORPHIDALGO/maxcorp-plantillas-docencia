"use strict";
// Datos: cada objeto tiene identificador, nombre y factor de conversión.
const conversiones = [
  { id: "m-cm", nombre: "Metros → centímetros", factor: 100, unidad: "cm" },
  { id: "cm-m", nombre: "Centímetros → metros", factor: 0.01, unidad: "m" },
  { id: "kg-g", nombre: "Kilogramos → gramos", factor: 1000, unidad: "g" },
  { id: "g-kg", nombre: "Gramos → kilogramos", factor: 0.001, unidad: "kg" }
];
function leerNumero(valor) {
  if (String(valor).trim() === "") throw new Error("Escriba un valor en cada campo.");
  const numero = Number(valor);
  if (!Number.isFinite(numero)) throw new Error("Escriba un número válido y finito.");
  return numero;
}
function comprobarResultado(resultado) {
  if (!Number.isFinite(resultado)) throw new Error("El resultado excede el rango admitido.");
  return resultado;
}
// Conserva las dos operaciones de la plantilla de semana 7.
function calcular(textoA, textoB, operacion) {
  const a = leerNumero(textoA), b = leerNumero(textoB);
  if (operacion === "sumar") return comprobarResultado(a + b);
  if (operacion !== "dividir") throw new Error("Seleccione una operación válida.");
  if (b === 0) throw new Error("No se puede dividir entre cero.");
  return comprobarResultado(a / b);
}
function convertir(valor, id) {
  const numero = leerNumero(valor);
  if (numero < 0) throw new Error("Use una cantidad mayor o igual a cero.");
  const opcion = conversiones.find(item => item.id === id);
  if (!opcion) throw new Error("Seleccione una conversión válida.");
  return comprobarResultado(numero * opcion.factor);
}
function formatear(numero) {
  // Conserva cantidades muy pequeñas mediante notación científica.
  return numero !== 0 && Math.abs(numero) < 0.00000001
    ? numero.toExponential(6)
    : numero.toLocaleString("es-PE", { maximumFractionDigits: 8 });
}
if (typeof document !== "undefined") {
  const selector = document.getElementById("conv-operacion");
  conversiones.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id; option.textContent = item.nombre; selector.append(option);
  });
  function mostrar(id, obtenerTexto) {
    const salida = document.getElementById(id);
    try { salida.textContent = obtenerTexto(); salida.classList.remove("error"); }
    catch (error) { salida.textContent = error.message; salida.classList.add("error"); }
  }
  document.getElementById("calc-form").addEventListener("submit", event => {
    event.preventDefault();
    mostrar("resultado", () => "Resultado: " + formatear(calcular(document.getElementById("a").value, document.getElementById("b").value, document.getElementById("operacion").value)));
  });
  document.getElementById("conv-form").addEventListener("submit", event => {
    event.preventDefault();
    mostrar("conv-salida", () => {
      const resultado = convertir(document.getElementById("conv-valor").value, selector.value);
      const opcion = conversiones.find(item => item.id === selector.value);
      return "Resultado: " + formatear(resultado) + " " + opcion.unidad;
    });
  });
}
if (typeof module !== "undefined") module.exports = { calcular, convertir, conversiones };
