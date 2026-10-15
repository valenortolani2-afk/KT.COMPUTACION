import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0812] px-4 py-12">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-violet-300 hover:text-violet-200"
        >
          ← Volver a la tienda
        </a>
        <SignIn />
      </div>
    </main>
  );
}
