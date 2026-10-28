# Mi planificador y kardex · ET505 S9 · PLANTILLA INCOMPLETA

Alta, listado, búsqueda y planificador S7 resueltos. **Cuatro TODO** en `kardex.js`: las operaciones pendientes avisan y conservan datos. **No presente esta versión como solución aprobada.**

## Abrir e integrar

Conserve `index.html`, `styles.css`, `app.js`, `kardex.js`, `README.md` juntos. Abra HTML en Chrome/Edge; sin paquetes. Respalde S7/S8; reutilice colección e ids S8 si existen, sin duplicar inicialización. [Guía completa](../README.md).

`app.js` conserva cálculo/presupuesto/validación S7. HTML agrega kardex y ambos scripts; CSS amplía apariencia; `kardex.js` separa reglas de pantalla. Mantenga ids `k-` y asociaciones `for`. Si su S7 tenía otro presupuesto, conserve coherencia entre textos y `limites`.

## Ejercicios

| Marca | Función | Qué completar | Comprobación |
|---|---|---|---|
| TODO 1 | `renombrar` | Copiar y cambiar sólo nombre por id | Cuaderno cambia; Lápiz intacto, también al filtrar |
| TODO 2 | `retirar` | Cancelar no cambia; con historial inactiva; sin historial elimina | Cancelación, eliminación real y conservación de historial |
| TODO 3 | `mover` | Validar saldo/contador; añadir movimiento a copia | 10−3=7; rechazo de 8, cero, negativo y decimal |
| TODO 4 | `csv` | Cabecera/filas, saldo por material, escape, BOM UTF-8 y `;` | Cantidades/saldos, comillas y acentos en Excel |

Busque `TODO 1`, etc. Lea comentarios y ayudas `copia`, `material`, `existencia`, `exigir`, `celdaCSV`. Sustituya el `throw` pendiente por su implementación; no quite validaciones para ocultar errores. Mantenga el formato esperado por `validar`.

Movimiento: `{id: "MOV-1", materialId: "MAT-0001", nombre: "Cuaderno", tipo: "entrada", cantidad: 10, fecha: "2026-10-28T15:00:00.000Z"}`. Contadores crecen y persisten; id no es posición visual. Guarde nombre al mover para conservar historia al renombrar.

La pantalla ya confirma, limpia selección al buscar, valida JSON y persiste antes de cambiar estado visible. Clave: `et505.s9.plantilla.v1`, separada de demo. JSON inválido bloquea sin sobrescribir: respalde antes de reparar. No hay base compartida ni sincronización Excel. Edite una pestaña.

## Mi personalización y aporte

- Sistema y contexto ficticio: [completar].
- Texto HTML, selector/tamaño CSS y paleta RGB justificada: [completar].
- Cambios por archivo y decisiones de integración S7/S8: [completar].
- Fuentes/ayuda; IA: herramienta/fecha/consulta/respuesta usada/adaptación/error/corrección/prueba, o no uso: [completar].
- Repositorio: [completar]. Sitio publicado: [completar].

## Mis pruebas reales

Use tabla de guía común: entrada, esperado, **obtenido real**, corrección y repetición. Antes de completar TODO, sus avisos son comportamiento esperado de la plantilla, **no pruebas funcionales aprobadas**.

Pruebe ambos botones S7, exacto/exceso, inválidos/ficha conservada; dos materiales y segundo intacto; búsqueda vacía/sin coincidencias; cancelar y eliminar; inactivar/historial; recarga; CSV en Excel. Distinga saldo físico/monetario.

Al copiar a su repo, actualice enlaces `../` del HTML/README. Suba los cinco archivos extraídos en raíz. Siga [tarea 24](https://maxedra.maxcorpsystem.com/courses/3/assignments/24) para publicación de su aplicación y comprobación de enlaces.

## Entrega

**Individual. Un PDF en MAXEDRA**, antes/después, cambios por archivo, pruebas, proceso, enlaces, fuentes y registro IA. Código/README en GitHub. Sin carpeta evidencias obligatoria ni PDF personal en repo.

**31/10/2026, 20:00 Perú**. Rúbrica: GitHub/publicación; integración/organización; funcionamiento/comprobaciones; personalización/proceso. 5 cada criterio (20), niveles 5/3/2/1. **Sin exposición**. Prima MAXEDRA.
