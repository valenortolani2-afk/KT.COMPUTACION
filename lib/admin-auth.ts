import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function isAdminUser(userId: string) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return user.privateMetadata.role === "admin";
}

export async function requireAdminApi() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return NextResponse.json(
      { message: "Iniciá sesión para realizar esta acción." },
      { status: 401 },
    );
  }

  if (!(await isAdminUser(userId))) {
    return NextResponse.json(
      { message: "Tu cuenta no tiene permisos de administrador." },
      { status: 403 },
    );
  }

  return null;
}
