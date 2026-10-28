# ET403 · Semana 9 · Calculadora con conversor

Ejemplo docente completo y resuelto. Amplía la calculadora de semana 7; no es una entrega de estudiantes.

[Probar la aplicación](https://maxcorphidalgo.github.io/maxcorp-plantillas-docencia/ET403/SEMANA9/)

## Archivos y uso
- `index.html`: estructura, formularios y enlace al CSS y al JavaScript.
- `styles.css`: apariencia adaptable, tamaño del label y color RGB.
- `app.js`: suma y división originales, validaciones y lista de objetos para convertir m↔cm y kg↔g.

Guarda los tres archivos juntos y abre index.html. No necesita instalación, servidor, API ni conexión para calcular. El arreglo JavaScript contiene los datos de conversión; no se necesita un archivo JSON externo.

## Pruebas esperadas
| Prueba | Resultado |
|---|---|
| Suma 12 + 3 | 15 |
| División 12 / 3 | 4 |
| División entre cero | Mensaje de error |
| 1 m a cm | 100 cm |
| 100 cm a m | 1 m |
| 1 kg a g | 1000 g |
| 1000 g a kg | 1 kg |
| 1.5 m a cm | 150 cm |
| 0 en conversor | 0 |
| Vacío, texto o negativo en conversor | Mensaje de error |

## Personalización y documentación
Cambia la etiqueta en HTML y su tamaño en CSS. Puedes elegir azul RGB(30,64,175), verde RGB(22,101,52) o violeta RGB(107,33,168), manteniendo contraste. Conserva los identificadores que utiliza app.js.

Para publicar tu copia, sube index.html, styles.css y app.js a la raíz de tu repositorio y activa Settings → Pages → main → /(root). Comprueba el enlace publicado y todas las pruebas. Los informes, capturas, aportes del grupo y registro del uso de IA van en el PDF entregado en MAXEDRA, sin datos personales en el repositorio público. Este ejemplo no cambia la consigna, la rúbrica ni la fecha de entrega.
