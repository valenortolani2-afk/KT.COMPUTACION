import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/admin-auth";
import AdminPanel from "./admin-panel";

export default async function AdminPage() {
  const { userId } = await auth.protect();

  if (!(await isAdminUser(userId))) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0812] px-6 py-12 text-white">
        <section className="max-w-lg rounded-3xl border border-white/10 bg-[#120f1c] p-8 text-center">
          <h1 className="text-2xl font-bold">Acceso restringido</h1>
          <p className="mt-3 text-zinc-400">
            Tu cuenta no tiene permisos para administrar el catálogo.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Volver a la tienda
          </a>
        </section>
      </main>
    );
  }

  return <AdminPanel />;
}
