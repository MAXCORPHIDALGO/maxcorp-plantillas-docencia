# Plantillas de trabajo de docencia de MAXCORP

Materiales organizados por curso: **ET403 / ET505 / ET203 / ET502**.

| Curso | Material disponible |
|---|---|
| [ET403](ET403/) | [Semana 9: calculadora con conversor](ET403/SEMANA9/) y materiales anteriores |
| [ET505](ET505/) | [Semana 9: planificador con kardex](ET505/SEMANA9/), con [código completo docente](ET505/SEMANA9/demo/) y [plantilla incompleta](ET505/SEMANA9/plantilla/); S7 conservado |
| [ET203](ET203/) / [ET502](ET502/) | Espacios reservados |

## ET505 · Semana 9 vigente

Amplía S7/S8: conserva cálculo, presupuesto y validaciones; agrega búsqueda, edición por id, eliminación segura/inactivación, entradas/salidas, existencia física, localStorage/JSON y CSV. [Guía de integración, clase y pruebas](ET505/SEMANA9/README.md).

Cada versión contiene **cinco archivos**: `index.html`, `styles.css`, `app.js`, `kardex.js`, `README.md`. Abra localmente HTML con scripts y estilos juntos. Demo resuelta; plantilla con cuatro TODO explícitos que aún no acredita pruebas S9.

Prima la [tarea 24 de MAXEDRA](https://maxedra.maxcorpsystem.com/courses/3/assignments/24): individual, **sin exposición**, **31/10/2026 20:00 Perú**, cuatro criterios de 5 (total 20), niveles 5/3/2/1. Un PDF en MAXEDRA con proceso, antes/después, pruebas, enlaces y registro IA; código/README en GitHub. No se exige carpeta evidencias. Datos ficticios; PDF personal y claves fuera del repositorio público.

## Guías e histórico

La [guía general GitHub](guia-github/) y sus [PDF](guia-github/GUIA_MAXEDRA_GITHUB_TRABAJO_REMOTO.pdf) / [Word](guia-github/GUIA_MAXEDRA_GITHUB_TRABAJO_REMOTO.docx) conservan el flujo anterior. Para ET505 S9 consulte la guía vigente y sus cinco archivos. Publicar el repositorio/sitio propios del estudiante según MAXEDRA no equivale a publicar este catálogo docente.

`ET505/demo`, `ET505/plantilla`, `ET505/descargas` son S7: sin cambios, con sus fechas y evaluación originales. El plazo 17/10 y la exposición en esos documentos son historia S7, no requisitos S9. ET403 mantiene sus instrucciones y materiales.

## Revisión y entornos del catálogo docente

Rama **DEV**, PR en borrador. Flujo: **DEV → STAGING → PRODUCCIÓN**; producción requiere GO explícito. No se configura ni ejecuta despliegue o GitHub Pages con este paquete. Verificación: `node --test tests/et505-s9.test.cjs`; resultados y límites en el PR.
