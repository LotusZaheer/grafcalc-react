# GrafCalc React

GrafCalc React es una calculadora gráfica interactiva moderna construida con React, Vite y TailwindCSS, que permite visualizar funciones matemáticas en tiempo real.

## Características

- 🎨 Interfaz moderna y minimalista con tema oscuro
- 📊 Visualización de múltiples funciones simultáneamente
- 🎯 Control interactivo del zoom y desplazamiento (drag & zoom con la rueda del mouse)
- 🖱️ Coordenadas y valores de funciones en tiempo real al pasar el mouse
- 🎨 Personalización de colores para cada función
- 📱 Diseño responsivo
- 🔍 Zoom con la rueda del mouse
- 🖼️ Cuadrícula adaptativa según el nivel de zoom
- 👁️ Mostrar/ocultar funciones y eliminar funciones fácilmente

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o pnpm (incluido con Node.js)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/LotusZaheer/grafcalc-react.git
cd grafcalc-react
```

2. Instala las dependencias:

```bash
npm install
# o
pnpm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
# o
pnpm dev
```

4. Abre tu navegador en `http://localhost:5173` (o el puerto que indique la terminal)

## Uso

1. Haz clic en "Agregar Función" para introducir una nueva función matemática usando la sintaxis de JavaScript (ej: `x^2`, `sin(x)`, `2*x + 1`)
2. Personaliza el color de cada función usando los selectores de color
3. Usa el botón de visibilidad para mostrar/ocultar funciones y el ícono de papelera para eliminarlas
4. Controla el zoom con la rueda del mouse
5. Arrastra el gráfico para desplazarte
6. Pasa el mouse sobre la gráfica para ver las coordenadas y valores exactos de las funciones

## Tecnologías Utilizadas

- React
- TypeScript
- Vite
- TailwindCSS
- Canvas API
- Math.js
- Radix UI (componentes de interfaz)

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

[MIT](https://choosealicense.com/licenses/mit/)

---

Repositorio oficial: https://github.com/LotusZaheer/grafcalc-react.git
