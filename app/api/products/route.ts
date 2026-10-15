import { del, get, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { isProductCategory, type Product } from "@/lib/products";

const PRODUCT_PREFIX = "catalog/products/";
const IMAGE_PREFIX = "catalog/images/";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    typeof product.price === "string" &&
    typeof product.imageUrl === "string" &&
    typeof product.createdAt === "string" &&
    typeof product.category === "string" &&
    isProductCategory(product.category)
  );
}

async function readProducts() {
  const products: Product[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({ cursor, prefix: PRODUCT_PREFIX });

    const pageProducts = await Promise.all(result.blobs.map(async (blob) => {
      const response = await get(blob.pathname, { access: "public", useCache: false });

      if (!response || response.statusCode !== 200) {
        throw new Error(`No se pudo leer la publicación ${blob.pathname}.`);
      }

      const product: unknown = await new Response(response.stream).json();
      if (!isProduct(product)) {
        throw new Error(`La publicación ${blob.pathname} no tiene un formato válido.`);
      }

      return product;
    }));

    products.push(...pageProducts);

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function GET() {
  if (!isBlobConfigured()) {
    return NextResponse.json({
      products: [],
      configured: false,
      message: "Configurá BLOB_READ_WRITE_TOKEN para cargar el catálogo desde Vercel Blob.",
    });
  }

  try {
    return NextResponse.json({ products: await readProducts(), configured: true });
  } catch (error) {
    console.error("No se pudo cargar el catálogo desde Vercel Blob.", error);
    return NextResponse.json(
      { message: "No se pudo cargar el catálogo desde Vercel Blob." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await requireAdminApi();
  if (authorization) {
    return authorization;
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { message: "Configurá BLOB_READ_WRITE_TOKEN antes de cargar productos." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const category = formData.get("category");
  const photo = formData.get("photo");

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof price !== "string" ||
    typeof category !== "string" ||
    !(photo instanceof File)
  ) {
    return NextResponse.json({ message: "Completá todos los campos del producto." }, { status: 400 });
  }

  const normalizedName = name.trim();
  const normalizedDescription = description.trim();
  const normalizedPrice = price.trim();

  if (!normalizedName || !normalizedDescription || !normalizedPrice || !isProductCategory(category)) {
    return NextResponse.json({ message: "Los datos del producto no son válidos." }, { status: 400 });
  }

  if (!photo.type.startsWith("image/") || photo.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { message: "La foto debe ser una imagen de hasta 5 MB." },
      { status: 400 },
    );
  }

  const productId = crypto.randomUUID();
  const extension = photo.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "image";

  try {
    const image = await put(`${IMAGE_PREFIX}${productId}.${extension}`, photo, {
      access: "public",
      addRandomSuffix: false,
      contentType: photo.type,
    });

    const product: Product = {
      id: productId,
      name: normalizedName,
      description: normalizedDescription,
      price: normalizedPrice,
      imageUrl: image.url,
      category,
      createdAt: new Date().toISOString(),
    };

    await put(`${PRODUCT_PREFIX}${productId}.json`, JSON.stringify(product), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("No se pudo guardar el producto en Vercel Blob.", error);
    return NextResponse.json(
      { message: "No se pudo guardar el producto. Intentá nuevamente." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const authorization = await requireAdminApi();
  if (authorization) {
    return authorization;
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { message: "Configurá Vercel Blob antes de eliminar productos." },
      { status: 503 },
    );
  }

  const productId = new URL(request.url).searchParams.get("id");
  if (!productId || !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(productId)) {
    return NextResponse.json({ message: "El identificador del producto no es válido." }, { status: 400 });
  }

  const productPath = `${PRODUCT_PREFIX}${productId}.json`;

  try {
    const response = await get(productPath, { access: "public", useCache: false });
    if (!response) {
      return NextResponse.json({ message: "No se encontró el producto." }, { status: 404 });
    }
    if (response.statusCode !== 200) {
      throw new Error(`No se pudo leer la publicación ${productPath}.`);
    }

    const productValue: unknown = await new Response(response.stream).json();
    if (!isProduct(productValue) || productValue.id !== productId) {
      throw new Error(`La publicación ${productPath} no tiene un formato válido.`);
    }

    const imageUrl = new URL(productValue.imageUrl);
    const imagePath = imageUrl.pathname.slice(1);
    const validImagePath = new RegExp(`^${IMAGE_PREFIX}${productId}\\.[a-zA-Z0-9]+$`, "i");
    if (
      imageUrl.protocol !== "https:" ||
      !imageUrl.hostname.endsWith(".public.blob.vercel-storage.com") ||
      !validImagePath.test(imagePath)
    ) {
      throw new Error(`La imagen de la publicación ${productPath} no tiene una ruta válida.`);
    }

    await del([productPath, imagePath]);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("No se pudo eliminar el producto de Vercel Blob.", error);
    return NextResponse.json(
      { message: "No se pudo eliminar el producto. Intentá nuevamente." },
      { status: 500 },
    );
  }
}
