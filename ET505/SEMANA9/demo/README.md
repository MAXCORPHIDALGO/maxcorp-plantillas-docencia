# ET505 S9 · Referencia docente completa

Amplía la demo S7 para explicar y contrastar. No es la entrega personal del alumno. [Guía de integración, consigna, rúbrica y casos](../README.md).

Conserve los cinco archivos juntos y abra `index.html` en Chrome/Edge:

- `index.html`: formulario S7 y sección kardex con ids `k-`.
- `styles.css`: estilos S7 más etiqueta de 18px y azul RGB 30,64,175.
- `app.js`: copia exacta de la demo S7; céntimos y presupuesto.
- `kardex.js`: reglas completas, interfaz, JSON/localStorage y CSV.
- `README.md`: uso de esta versión; guía común en el nivel superior.

Si copia sólo esta carpeta a un repositorio propio, sustituya enlaces `../` del HTML/README por sus enlaces propios.

## Demostración

1. Confirme 10 unidades a S/15.00; intente S/15.01 y observe ficha conservada.
2. Añada Cuaderno/Lápiz; elija código de Cuaderno. Renómbrelo y compruebe Lápiz intacto. Busque por código/nombre; sin coincidencias limpia selección.
3. Entrada 10 y salida 3 dejan 7 unidades. Salida 8, cero, negativo y decimal rechazan sin mutación. El saldo monetario es independiente.
4. Cancele retiro; confirme después: con movimientos inactiva y conserva historial; sin movimientos elimina sólo el elegido.
5. Recargue y compare ids/movimientos. CSV en Excel: UTF-8, `;`, cantidades, acentos y saldo iguales. No sincroniza.

Clave: `et505.s9.kardex.v1`. Datos ficticios; una pestaña de edición. JSON corrupto o lectura fallida bloquean sin reemplazar datos; escritura fallida no aplica el cambio. Respalde JSON antes de reparar. No hay base compartida. Pedido S7 temporal; no genera movimientos automáticamente.

## Entrega del estudiante

Adapte y pruebe su proyecto. Individual; un PDF en MAXEDRA con proceso, capturas, pruebas, enlaces y registro IA. **31/10/2026 20:00 Perú**. Cuatro criterios × 5, niveles 5/3/2/1, sin exposición. Prima [tarea 24](https://maxedra.maxcorpsystem.com/courses/3/assignments/24). Código/README en GitHub; no se exige carpeta evidencias.

Catálogo docente: sólo DEV y PR borrador; no implica despliegue ni GO de producción.
