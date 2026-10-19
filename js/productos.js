/*
 * productos.js — la lista de deseos.
 *
 * Campos de cada producto:
 *   id         Texto único (no lo repitas). Ej.: "maqueta-f1".
 *   nombre     Nombre del producto.
 *   categoria  Texto libre. Los filtros se generan solos a partir de aquí.
 *   precio     Precio aproximado en euros, solo el número (ej.: 45). Puede ser null.
 *   enlace     URL completa de la tienda (https://…). Puede ser "".
 *   imagen     Ruta a la foto, ej.: "img/maqueta-f1.jpg". Puede ser "" (se
 *              mostrará la inicial del nombre en grande).
 *   nota       Detalle corto: talla, color, modelo… Puede ser "".
 *   prioridad  3 = lo que más quiero, 2 = me haría ilusión, 1 = si sobra idea.
 *   reservado  true cuando alguien te avise de que lo regala; false si no.
 */
window.PRODUCTOS = [
  {
    id: "maqueta-f1",
    nombre: "Maqueta coche de F1 escala 1:18",
    categoria: "Motor",
    precio: 110,
    enlace: "https://www.example.com/maqueta-f1",
    imagen: "",
    nota: "Escala 1:18, versión de la temporada actual",
    prioridad: 3,
    reservado: false,
  },
  {
    id: "karting",
    nombre: "Tanda de karting para dos",
    categoria: "Experiencias",
    precio: 60,
    enlace: "https://www.example.com/karting",
    imagen: "",
    nota: "Cualquier circuito cerca de casa, 2 × 15 minutos",
    prioridad: 3,
    reservado: false,
  },
  {
    id: "auriculares",
    nombre: "Auriculares inalámbricos con cancelación de ruido",
    categoria: "Tecnología",
    precio: 180,
    enlace: "https://www.example.com/auriculares",
    imagen: "",
    nota: "Color negro",
    prioridad: 2,
    reservado: true,
  },
  {
    id: "zapatillas-running",
    nombre: "Zapatillas de running",
    categoria: "Deporte",
    precio: 120,
    enlace: "https://www.example.com/zapatillas",
    imagen: "",
    nota: "Talla 43, pisada neutra",
    prioridad: 2,
    reservado: false,
  },
  {
    id: "libro-f1",
    nombre: "Libro sobre la historia de la Fórmula 1",
    categoria: "Libros",
    precio: 35,
    enlace: "https://www.example.com/libro-f1",
    imagen: "",
    nota: "Tapa dura, en castellano",
    prioridad: 1,
    reservado: false,
  },
  {
    id: "sudadera",
    nombre: "Sudadera con capucha",
    categoria: "Ropa",
    precio: 55,
    enlace: "https://www.example.com/sudadera",
    imagen: "",
    nota: "Talla L, gris oscuro o negro",
    prioridad: 1,
    reservado: false,
  },
  {
    id: "cafetera",
    nombre: "Cafetera espresso manual",
    categoria: "Casa",
    precio: 85,
    enlace: "https://www.example.com/cafetera",
    imagen: "",
    nota: "Compatible con café molido",
    prioridad: 2,
    reservado: false,
  },
];
