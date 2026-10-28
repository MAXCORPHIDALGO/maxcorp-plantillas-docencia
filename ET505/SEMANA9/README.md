# ET505 · Semana 9 · Del planificador al kardex

Material docente y plantilla individual. Amplían el **Planificador de materiales S7**: se conservan `calcularTotal`, `validarPedido`, presupuesto, mensajes y ficha válida. S7 permanece sin cambios en `ET505/demo`, `ET505/plantilla` y `ET505/descargas` como histórico.

## Elegir versión

| Carpeta | Destinatario | Estado |
|---|---|---|
| [demo](demo/) | Docente: explicar, contrastar y probar | Código completo |
| [plantilla](plantilla/) | Estudiante: integrar, completar y personalizar | Cuatro TODO en `kardex.js`; no es solución aprobada |

Cada versión es autónoma: conserve juntos **index.html, styles.css, app.js, kardex.js y README.md**. Abra `index.html` en Chrome o Edge. No necesita npm, API, base de datos ni dependencias externas. Si el navegador bloquea localStorage en `file:`, use un servidor local o un sitio de pruebas con origen estable. Cambiar origen/navegador/carpeta puede mostrar otro almacenamiento. Demo y plantilla usan claves distintas.

## Fuentes y coherencia

Revisión de sólo lectura el **28/10/2026** en la interfaz docente de MAXEDRA:

- [Semana 9](https://maxedra.maxcorpsystem.com/courses/3/academic-weeks/46).
- [Tarea 24: TPI/TPG 2](https://maxedra.maxcorpsystem.com/courses/3/assignments/24), autoridad para consigna, plazo y rúbrica.
- [Teoría 167](https://maxedra.maxcorpsystem.com/courses/3/materials/167/preview): 28/10, 150 minutos.
- [Taller 168](https://maxedra.maxcorpsystem.com/courses/3/materials/168/preview): 29/10, 100 minutos.

No se modificó MAXEDRA. Estaban en borrador docente al revisarlos. Si la tarea vigente cambia, prima MAXEDRA. La referencia no reemplaza el trabajo propio del alumno.

## Guía de integración sobre su proyecto

1. Conserve copia de su S7/S8. Si tiene altas/listados S8, reutilice esa colección e ids; adapte el módulo sin otro almacén paralelo. Este ejemplo parte de la demo S7 de este repositorio, que aún no tenía colección S8.
2. Mantenga formulario S7 e ids: `formulario`, `material`, `cantidad`, `precio`, `comprobar`, `mensaje`, `ficha`, `vacio`, `limpiar`. `app.js` se conserva idéntico al de la demo S7. Calcule en céntimos; mantenga límites y rechazo del exceso.
3. Agregue la sección `kardex` antes de cerrar `main`. Sus ids empiezan por `k-`. Cargue `app.js` y después `kardex.js`, al final de `body`. El recurso `kardex.html` de MAXEDRA es una sección para integrar, no otra aplicación.
4. Copie las reglas CSS S9 al final de su hoja. El recurso `personalizacion.css` amplía apariencia. Cambie texto de una etiqueta HTML, tamaño CSS y paleta RGB legible; conserve ids y `for`. La referencia usa `#kardex label` de 18px y azul `rgb(30,64,175)`.
5. Complete **TODO 1–4** de la plantilla siguiendo su README. Distinga reglas de pantalla: valide, construya una copia, persista y represente. Un fallo no debe cambiar la colección ni la ficha S7.
6. Pruebe dos materiales ficticios. Escriba el **obtenido real**, corrija y repita. Las pruebas del docente no sustituyen las de su propia adaptación.
7. Actualice su README: uso, archivos, cambios propios, pruebas, ayuda y enlaces. Para la entrega académica, siga la publicación de su propio repositorio indicada en MAXEDRA y la [guía general](../../guia-github/). Suba los cinco archivos extraídos en la raíz; el ZIP sin extraer no ejecuta la app.

## Modelo de datos y cambios seguros

`materiales`: `{id, nombre, activo}`. `movimientos`: `{id, materialId, nombre, tipo, cantidad, fecha}`. Contadores crecientes persistidos; no se reutilizan ids eliminados. El nombre del movimiento es una instantánea; renombrar no reescribe la historia.

Buscar por nombre/código filtra y **vacía la selección**; elija explícitamente un código. Buscar vacío muestra todos sin modificar datos. Sin coincidencias no queda un registro previo seleccionado. Editar busca por id, nunca por posición visual.

Sin movimientos puede eliminarse tras confirmación cancelable. Con cualquier movimiento, incluso saldo cero, se inactiva manteniendo historial y no admite movimientos nuevos. No se ofrece borrar movimientos. Use nuevos datos ficticios para repetir casos.

Existencia física = entradas menos salidas. Es distinta del saldo monetario S7; confirmar un pedido no crea una entrada. Cantidades físicas: enteros positivos seguros. Una salida excesiva se rechaza antes de mutar/persistir.

localStorage guarda JSON en ese navegador/origen; no es base compartida. JSON inválido bloquea sin sobrescribirlo: respalde la clave indicada y revise antes de reparar. Si no puede escribir por cuota/permisos, mantiene el estado anterior. Cambios desde otra pestaña obligan a recargar. Es una protección contra sobrescrituras accidentales, no control transaccional multiusuario; edite en una sola pestaña.

CSV: UTF-8 con BOM, separador `;`, filas CRLF, comillas escapadas y protección de textos interpretables como fórmulas. Incluye todos los movimientos, también de inactivos, fecha ISO y saldo acumulado por material. En Excel, si aparece una columna, use **Datos → Desde texto/CSV**, UTF-8 y `;`. Compare cantidades y acentos. Es copia, no sincroniza ni restaura datos. No se ha automatizado Excel.

## Guion de clase

**Teoría (150 min):** 20 min recuperar pedido/presupuesto; 30 min modelar material/movimiento; 30 min buscar/editar por id; 30 min trazar entrada 10, salida 3 y rechazo de 8; 25 min JSON/CSV e historial; 15 min proponer pruebas. Use la demo para contrastar.

**Taller (100 min):** 10 min copiar y reconocer S7; 30 min integrar sección/CSS/scripts y reglas; 20 min dos materiales y movimientos; 15 min recarga/CSV; 15 min archivos y enlaces propios según MAXEDRA; 10 min registrar proceso, pruebas e IA. Las consultas no son una exposición evaluada.

## Casos a contrastar

| Entrada/acción | Esperado |
|---|---|
| S7: 10 × S/15.00; ambos botones | Total S/150.00, saldo monetario S/0.00 |
| S7: 10 × S/15.01 tras pedido válido | Rechazo en ambos botones; ficha válida intacta |
| S7: nombre corto, cantidad 0/31/1.5, precio 0/50.01/1.001 | Rechazo; no sustituye ficha |
| Crear Cuaderno y Lápiz; filtrar y renombrar el código de Cuaderno | Sólo Cuaderno cambia; Lápiz íntegro |
| Buscar inexistente tras seleccionar; buscar vacío | Sin selección anterior; sin mutación |
| Eliminar sin movimientos y cancelar | Estado idéntico |
| Confirmar eliminación sin movimientos | Desaparece sólo ese código; no se reutiliza |
| Entrada 10, salida 3 | Existencia 7, dos movimientos |
| Salida 8, cero, negativo, decimal | Rechazo; existencia 7 e historial idéntico |
| Inactivar con movimientos | Historial y saldo conservados; nuevos movimientos bloqueados |
| Recargar | Mismos ids/materiales/movimientos; ficha temporal S7 reiniciada |
| CSV en Excel | Cabecera, cantidades 10/3, saldos 10/7, acentos y nombres correctos |

## Entrega y evaluación S9

Trabajo **individual**, sin exposición ni sustentación. **Sábado 31/10/2026, 20:00 Perú**. Un PDF en MAXEDRA: enlaces al repositorio/sitio propios, antes/después, fragmentos con archivo, proceso, tabla entrada/esperado/obtenido/corrección, fuentes y ayuda. Código/README en GitHub; no se exige carpeta `evidencias` ni publicar el PDF personal.

| Criterio MAXEDRA | Máximo | Evidencia de logro |
|---|---:|---|
| GitHub y publicación funcional | 5 | Archivos, README, enlaces y sitio que carga HTML/CSS/JS |
| Integración y organización del código | 5 | S7 conservado, módulo enlazado y cambios identificados |
| Funcionamiento y comprobaciones | 5 | Casos contrastados, funciones previas y correcciones probadas |
| Personalización y proceso documentado | 5 | Etiqueta, tamaño, RGB y PDF con decisiones, capturas y ayuda |

Total **20**. Niveles **5 Logrado / 3 Parcial / 2 Inicial / 1 Sin evidencia**. Priman los descriptores completos de tarea 24 sobre esta síntesis. Copiar la demo o crear una cuenta no acredita por sí solo los criterios.

IA permitida: registre herramienta/fecha, consultas relevantes, respuestas usadas, adaptación, errores corregidos y comprobaciones propias. Sin IA, indíquelo. No suma ni descuenta por sí misma. Esta referencia se preparó con asistencia de Codex el 28/10/2026; el alumno registra su uso real.

## Verificación y gates del catálogo

Desde la raíz: `node --test tests/et505-s9.test.cjs`. Distingue demo funcional y plantilla pendiente; no prueba publicación del alumno ni PDF. Resultados concretos en el PR.

Paquete en **DEV**, PR borrador. Promoción **DEV → STAGING → PRODUCCIÓN**, con GO explícito para producción. Este trabajo no publica Pages ni autoriza desplegar el catálogo. La publicación descrita en la guía corresponde a la entrega académica del alumno.
