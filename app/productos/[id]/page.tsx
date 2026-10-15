import { ProductDetail } from "@/app/components/product-detail";

export default async function ProductPage({ params }: PageProps<"/productos/[id]">) {
  const { id } = await params;

  return <ProductDetail productId={id} />;
}
