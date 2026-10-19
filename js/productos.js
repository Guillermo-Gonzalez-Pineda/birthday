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
    id: "ua-launch-7-shorts",
    nombre: "Under Armour Launch 7'' Shorts",
    categoria: "Pantalones",
    precio: 31.99,
    enlace: "https://www.elcorteingles.es/deportes/A55016606-negro-pr-pantalon-corto-de-hombre-ua-launch-7-shorts-under-armour/",
    imagen: "img/under-armour-launch-7-shorts-negro.jpg",
    nota: "Pantalón corto de 7'' · Negro · Talla L",
    prioridad: 2,
    reservado: false,
  },
  {
    id: "ua-launch-5-2-en-1-shorts",
    nombre: "Under Armour Launch 5'' 2-in-1 Shorts",
    categoria: "Pantalones",
    precio: 39.99,
    enlace: "https://www.elcorteingles.es/deportes/A49849609-negro-pr-pantalon-corto-de-hombre-ua-launch-5-2-in-1-shorts-under-armour/",
    imagen: "img/under-armour-launch-5-2-en-1-shorts-negro.jpg",
    nota: "Pantalón corto 2 en 1 de 5'' · Negro · Talla L",
    prioridad: 3,
    reservado: false,
  },
  {
    id: "nike-dri-fit-challenger-shorts",
    nombre: "Nike Dri-Fit Challenger",
    categoria: "Pantalones",
    precio: 26.59,
    enlace: "https://www.elcorteingles.es/deportes/A47320106-gris-pr-pantalon-corto-de-hombre-dri-fit-challenger-nike/",
    imagen: "img/nike-dri-fit-challenger-shorts-gris.jpg",
    nota: "Pantalón corto · Gris · Talla L (o XL)",
    prioridad: 2,
    reservado: false,
  },
  {
    id: "ua-vibe-woven-jogger",
    nombre: "Under Armour Vibe Woven Jogger",
    categoria: "Pantalones",
    precio: 55.99,
    enlace: "https://www.elcorteingles.es/deportes/A51150144-negro-blanco-pr-pantalon-de-hombre-ua-vibe-woven-jogger-under-armour/",
    imagen: "img/under-armour-vibe-woven-jogger-negro-blanco.jpg",
    nota: "Pantalón jogger · Negro / blanco · Talla L",
    prioridad: 2,
    reservado: false,
  },
  {
    id: "ua-matchplay-1-4-zip",
    nombre: "Under Armour Matchplay 1/4 Zip",
    categoria: "Sudaderas",
    precio: 64.99,
    enlace: "https://www.elcorteingles.es/deportes/A202106915-azul-marino-pr-sudaderas-hombre-ua-matchplay-1-4-zip-under-armour/",
    imagen: "img/under-armour-matchplay-1-4-zip-azul-marino.jpg",
    nota: "Sudadera con media cremallera · Azul marino · Talla L",
    prioridad: 3,
    reservado: false,
  },
  {
    id: "ua-tech-utility-1-4-zip",
    nombre: "Under Armour Tech Utility 1/4 Zip",
    categoria: "Sudaderas",
    precio: 38.49,
    enlace: "https://www.elcorteingles.es/deportes/A58486463-gris-granito-pr-sudadera-de-hombre-ua-tech-utility-1-4-zip-under-armour/",
    imagen: "img/under-armour-tech-utility-1-4-zip-gris-granito.jpg",
    nota: "Sudadera con media cremallera · Gris granito · Talla L",
    prioridad: 2,
    reservado: false,
  },
  {
    id: "ua-tech-sport-woven-jacket",
    nombre: "Under Armour Tech Sport Woven Jacket",
    categoria: "Sudaderas",
    precio: 52.49,
    enlace: "https://www.elcorteingles.es/deportes/A58483053-negro-pr-sudadera-de-hombre-ua-tech-sport-woven-jkt-under-armour/",
    imagen: "img/under-armour-tech-sport-woven-chaqueta-negro.jpg",
    nota: "Chaqueta tejida con capucha · Negro · Talla L",
    prioridad: 2,
    reservado: false,
  },
];
