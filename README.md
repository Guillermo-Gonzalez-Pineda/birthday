# Lista de deseos de cumpleaños

Web sencilla para compartir lo que te gustaría que te regalaran. Quien la visita ve los productos, elige uno y te avisa por WhatsApp o por email. Tú lo marcas como regalado y así nadie lo repite.

Es HTML, CSS y JavaScript sin frameworks ni paso de build. Funciona abriendo `index.html` directamente en el navegador y se publica en GitHub Pages tal cual.

## Estructura

```
index.html          Página principal
css/styles.css      Estilos (los colores están como variables en :root)
js/config.js        Tus datos: nombre, cumpleaños, WhatsApp y email
js/productos.js     La lista de productos
js/app.js           Renderizado y lógica
img/                Fotos de los productos
```

## Probarlo en local

**Opción rápida:** haz doble clic en `index.html`. Se abre en el navegador y funciona sin nada más.

**Opción con servidor** (más parecida a la web publicada). Desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y abre <http://localhost:8000>. Para pararlo, pulsa `Ctrl + C`.

> Las fuentes se cargan de Google Fonts. Sin conexión a internet la web funciona igual, pero con las fuentes del sistema.

## Cambiar tus datos (`js/config.js`)

```js
window.CONFIG = {
  nombre: "Guille",           // Se muestra como «El cumple de Guille»
  cumpleanos: "03-07",        // "MM-DD", sin año → 7 de marzo
  whatsapp: "34600111222",    // Formato internacional SIN + ni espacios
  email: "yo@ejemplo.com",
};
```

- **cumpleanos**: el mes y el día, sin año. La cuenta atrás calcula sola el próximo cumpleaños, así que no hay que tocarla cada año.
- **whatsapp**: el prefijo del país seguido del número, todo junto: `34` para España + `600111222`. Si lo dejas vacío (`""`), desaparece la opción de WhatsApp.
- **email**: si lo dejas vacío (`""`), desaparece la opción de email.

> ⚠️ **Lo que pongas aquí será público.** Mira el aviso de privacidad más abajo, en la sección de GitHub Pages.

## Añadir o editar un producto (`js/productos.js`)

Cada producto es un bloque `{ … }` dentro de `window.PRODUCTOS = [ … ]`. Para añadir uno, copia un bloque existente, pégalo detrás de otro (sin olvidar la coma que los separa) y cambia los valores:

```js
{
  id: "casco-moto",                  // Único, sin espacios. No lo repitas.
  nombre: "Casco de moto integral",
  categoria: "Motor",                // Los filtros se crean solos con esto
  precio: 250,                       // Número aproximado en euros, o null
  enlace: "https://www.tienda.com/casco",  // URL completa, o ""
  imagen: "img/casco-moto.jpg",      // Ruta a la foto, o "" (sale la inicial)
  nota: "Talla M, negro mate",       // Talla, color, modelo… o ""
  prioridad: 3,                      // 3 = lo que más quiero · 2 = me haría ilusión · 1 = si sobra idea
  reservado: false,                  // true cuando alguien te avise de que lo regala
},
```

- **Orden.** Primero aparece lo que está libre, de prioridad 3 a 1, y lo ya regalado va al final. No importa en qué orden lo escribas en el archivo.
- **Categorías.** Escríbelas siempre igual: «Motor» y «motor» se tratan como dos categorías distintas.
- **Borrar un producto.** Elimina su bloque completo, desde `{` hasta `},`.
- **Errores.** Si después de editar la web aparece vacía, casi siempre es una coma o unas comillas que faltan. Abre la consola del navegador (F12 → Console) y verás la línea del error.

### Fotos

1. Copia la foto en la carpeta `img/`. Mejor en horizontal (4:3) y de menos de 300 KB.
2. Pon su ruta en el campo `imagen`: `"img/casco-moto.jpg"`.

Si un producto no tiene foto, o la foto no carga, se muestra la inicial del nombre en grande.

## Marcar un producto como regalado

Cuando alguien te avise, abre `js/productos.js`, busca el producto y cambia:

```js
reservado: true,
```

Guarda y publica el cambio (ver «Actualizar la web»). El producto se verá atenuado, con el sello «Ya regalado» y el botón desactivado.

## Publicar en GitHub Pages paso a paso

> ⚠️ **Aviso de privacidad: todo será público.**
> En el plan gratuito de GitHub, Pages solo funciona con repositorios **públicos**. Además, la web publicada es pública siempre, aunque el repositorio sea privado. Eso significa que **tu teléfono y tu email de `config.js` los podrá ver cualquiera**, en el repositorio y en el código fuente de la página, y también bots que recopilan datos de contacto.
>
> - Plantéate usar un email secundario o un alias.
> - Si no quieres publicar el teléfono, deja `whatsapp: ""`.
> - El historial de git guarda los valores antiguos: borrar el teléfono más tarde no lo elimina de los commits anteriores. Decide qué datos poner **antes** de subir nada.
> - No pongas tu dirección ni nada que no quieras que vea un desconocido.

### Primera publicación

1. Crea una cuenta en <https://github.com> si no tienes.
2. Arriba a la derecha, pulsa **+ → New repository**.
   - **Repository name**: por ejemplo `lista-deseos`.
   - Márcalo como **Public**.
   - **No** marques «Add a README» (ya tienes uno).
   - Pulsa **Create repository**.
3. En la terminal, dentro de la carpeta del proyecto (cambia `TU_USUARIO`):

   ```bash
   git remote add origin https://github.com/TU_USUARIO/lista-deseos.git
   git push -u origin main
   ```

   Si te pide contraseña, GitHub no acepta la de tu cuenta. Inicia sesión con [GitHub CLI](https://cli.github.com/) (`gh auth login`) o crea un *personal access token*.
4. En GitHub, entra en el repositorio y ve a **Settings → Pages**.
5. En **Build and deployment**:
   - **Source**: *Deploy from a branch*.
   - **Branch**: `main` y carpeta `/ (root)`.
   - Pulsa **Save**.
6. Espera uno o dos minutos. Puedes ver el progreso en la pestaña **Actions**. La web estará en:

   ```
   https://TU_USUARIO.github.io/lista-deseos/
   ```

   La misma dirección aparece arriba en **Settings → Pages**.
7. Comparte ese enlace.

> Truco: si llamas al repositorio `TU_USUARIO.github.io`, la web queda en `https://TU_USUARIO.github.io/`, sin nada detrás.

### Actualizar la web

Cada vez que cambies algo (un producto nuevo, un `reservado: true`…):

```bash
git add .
git commit -m "Marca la maqueta como regalada"
git push
```

En un minuto más o menos se actualiza. Si no ves el cambio, recarga forzando (`Ctrl + Shift + R`, o `Cmd + Shift + R` en Mac).

## Personalizar el diseño

Los colores y las fuentes están como variables al principio de `css/styles.css`, en `:root`. Cambia, por ejemplo, `--rojo` para usar otro color de acento.

## Futuro: reservas desde la web

Ahora mismo, el botón «Lo regalo yo» solo abre el diálogo para avisarte, y el `reservado: true` lo pones tú a mano. Es intencionado: sin un backend, una reserva hecha desde la web solo existiría en el navegador de quien la hace y los demás no la verían.

Para que la gente pueda reservar directamente hace falta guardar el estado en algún servicio. `js/app.js` ya está preparado para ello. Basta con sustituir dos funciones de la capa de datos:

- `cargarProductos()`: debe devolver una promesa con el array de productos (ahora lee `window.PRODUCTOS`).
- `marcarReservado(id, reservado)`: debe guardar el cambio y devolver el producto actualizado (ahora es un esqueleto que lanza un error y nadie la llama).

Después, en el diálogo, se añade un botón «Marcar como reservado» que llama a `marcarReservado()` y vuelve a pintar la lista.

| Opción | Pros | Contras |
| --- | --- | --- |
| **Supabase** (Postgres) | Plan gratuito generoso. Cliente JS que se carga desde un CDN, sin build. Base de datos SQL de verdad y tiempo real si lo quieres. Panel web cómodo para editar productos. | Hay que configurar bien las políticas RLS (*Row Level Security*) para que nadie pueda borrar ni «desreservar». Los proyectos gratuitos se pausan tras una semana sin actividad. |
| **Firebase** (Firestore) | Tiempo real muy sencillo (la lista se actualiza sola al reservar). Plan gratuito amplio. Muy documentado. | Las reglas de seguridad tienen su propio lenguaje y es fácil dejarlas demasiado abiertas. La consola de Google Cloud es más liosa. El SDK pesa más. |
| **Google Sheets + Apps Script** | Gratis, sin servicios nuevos. Editas los productos en una hoja de cálculo, incluso desde el móvil. Es la más fácil de entender. | Lenta (1–3 s por petición) y con cuotas diarias. CORS tiene sus trucos (hay que enviar los POST como `text/plain`). Hay que usar `LockService` para evitar dos reservas simultáneas. La URL del script es pública. |

**Recomendación.** Si lo que más valoras es editar la lista cómodamente, **Google Sheets + Apps Script**. Si prefieres algo más robusto y rápido, **Supabase**.

Elijas lo que elijas, recuerda que las claves que van en el frontend son públicas. La seguridad tiene que estar en el servicio: que solo se pueda pasar `reservado` de `false` a `true`, y nunca borrar ni modificar otros campos.
