# RevoluMathh

Laboratorio web para explorar cómo curvas y regiones del plano generan superficies y sólidos de revolución, y cómo se calcula su volumen con integrales. No usa base de datos ni servicios de pago.

## Qué incluye

- Catálogo de 15 curvas con buscador. Cada una indica si admite **sólido**, **superficie** o ambos.
- Gráfica 2D con región generatriz y eje de rotación; modelo 3D construido con las fórmulas de revolución (no hay modelos prediseñados).
- Eje X o Y, animación progresiva, cortes transversales, malla, opacidad y generatriz.
- Volumen por discos, arandelas o capas cilíndricas, con desarrollo paso a paso y verificación contra el volumen de la malla 3D.
- Módulo «Aprende y experimenta» con explicaciones, ejemplos y ejercicios.
- Control gestual (MediaPipe) y modo AR de superposición visual. Ambos son opcionales.
- Modo día y modo noche (recuerda tu elección).

## Estructura

```
RevoluMathh/
├── index.html
├── css/        styles.css, responsive.css
├── js/         app.js (curvas, cálculo, 2D, 3D, interfaz), augmented-reality.js, gestures.js
└── assets/     images/, icons/
```

## Ejecutar en XAMPP

1. Copia la carpeta `RevoluMathh` dentro de `htdocs`.
2. Inicia Apache desde el panel de XAMPP.
3. Abre `http://localhost/RevoluMathh/`.

No abras `index.html` con doble clic (`file://`): el navegador bloquea la cámara y MediaPipe.

## Publicar en GitHub Pages

1. Sube el contenido de la carpeta a un repositorio.
2. En **Settings → Pages**, elige la rama principal y la carpeta raíz.
3. Usa la URL `https://` que te entrega GitHub; la cámara solo funciona con HTTPS o `localhost`.

## Permisos de cámara

Al pulsar **Control gestual** o **Modo AR** el navegador pedirá permiso. El video se procesa en tu equipo y no se envía a ningún servidor. Si lo niegas, la app sigue funcionando con mouse y teclado.

## Gestos (mano erguida frente a la cámara)

| Gesto | Acción |
|---|---|
| Palma abierta en movimiento | Rotar el modelo (ajusta la sensibilidad con el control de la ventana de cámara) |
| Índice levantado | Mover el cursor verde; mantenerlo ~1 s sobre un botón lo pulsa |
| Pinza pulgar-índice | Controlar el ángulo de revolución moviendo la mano a izquierda/derecha |
| Dos manos separándose o juntándose | Acercar o alejar la cámara |
| Puño cerrado | Restablecer la vista |

MediaPipe solo reconoce la mano; la geometría, el cálculo y el render 3D los hace la aplicación.

## Modo AR

Muestra el modelo 3D sobre la imagen de tu cámara. Es una **superposición visual educativa**, sin anclaje espacial.

## Notas matemáticas

- Una curva sola genera una **superficie**; el **sólido** exige una región cerrada. Cuando la curva no es una gráfica con x creciente, queda sobre la base y = c y (x ≥ 0 si giras sobre Y), la app avisa y muestra solo la superficie.
- Los volúmenes son **aproximaciones numéricas** (Simpson para funciones y = f(x); trapecio para curvas paramétricas). No se muestran primitivas exactas.
- El método lo fija el eje: sobre X, discos o arandelas (si c > 0); sobre Y, capas cilíndricas.

- Se retiraron las espirales y la hélice circular: no son gráficas de funciones ni delimitan una región cerrada.

## Dependencias (por CDN, fijadas a versión)

Three.js r128, OrbitControls 0.128.0 y `@mediapipe/tasks-vision` 0.10.14. Las gráficas 2D y las fórmulas están hechas sin bibliotecas adicionales. Si una biblioteca no carga, la app muestra un aviso y lo demás sigue funcionando.

## Limitaciones conocidas

- El cambio manual entre métodos de integración no está implementado: solo es válido para funciones monótonas e invertibles.
- Los gestos suponen la mano erguida y buena iluminación.
