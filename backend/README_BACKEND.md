# EauDeLuxe - Backend (Express.js)

Este es el backend para la tienda de perfumes EauDeLuxe. Proporciona una API REST para autenticación, gestión de perfumes, carrito de compras, pedidos, reseñas y administración.

## 🚀 Requisitos

- Node.js
- MySQL o MariaDB
- npm

## ⚙️ Instalación

1. Clona este repositorio y entra al directorio del backend.
2. Instala dependencias:

```
npm install
```

3. Crea una base de datos MySQL llamada `EauDeLuxe` y ejecuta el script `EauDeLuxe_schema.sql`.
4. Configura tus variables de entorno (ver `.env.example`).
5. Inicia el servidor:

```
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

## 🧾 Estructura de rutas

- `/api/users`: registro, login
- `/api/perfumes`: listado y detalle
- `/api/cart`: gestión del carrito
- `/api/orders`: creación y consulta de pedidos
- `/api/reviews`: reseñas de perfumes
- `/api/admin`: gestión de perfumes y pedidos (requiere admin)

