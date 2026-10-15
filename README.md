This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Administración y catálogo

Los clientes pueden crear una cuenta e iniciar sesión desde la barra superior con email y contraseña. La autenticación usa Clerk; antes de ponerla en producción, verificá que email y contraseña estén habilitados en la configuración de autenticación de Clerk.

La ruta [`/admin`](http://localhost:3000/admin) permite publicar y eliminar productos con foto, precio, descripción y una sección: **PC Gamer**, **Placas de video** o **Combos de actualización**. La página y las operaciones de publicación y borrado requieren una sesión de Clerk con `role: "admin"` en la metadata privada del usuario. Para habilitar la cuenta administradora, registrá o elegí un usuario en Clerk Dashboard y asignale en **Private metadata**:

```json
{ "role": "admin" }
```

Los clientes registrados no reciben ese permiso automáticamente. La API pública de lectura del catálogo sigue disponible; las rutas para crear y borrar publicaciones rechazan solicitudes sin sesión (401) o sin rol de administrador (403).

Al eliminar una publicación desde el panel se borran también su imagen y sus datos de Vercel Blob; la acción requiere confirmación y no se puede deshacer. En la tienda, al seleccionar la foto de un producto se abre la descripción y una lista de otros artículos.

El catálogo usa Vercel Blob. Antes de publicar, conectá un Blob Store al proyecto o agregá `BLOB_READ_WRITE_TOKEN` a `.env.local` y a los entornos de Vercel. La aplicación mostrará un mensaje explícito mientras la variable no esté configurada.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
