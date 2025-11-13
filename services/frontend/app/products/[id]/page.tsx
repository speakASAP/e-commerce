import { productsApi } from '@/lib/api/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const response = await productsApi.getProduct(params.id);

  if (!response.success || !response.data) {
    notFound();
  }

  const product = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded"></div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          {product.brand && (
            <p className="text-gray-600 mb-4">Značka: {product.brand}</p>
          )}
          <p className="text-4xl font-bold text-blue-600 mb-6">
            {product.price.toFixed(2)} Kč
          </p>

          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Popis</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Varianty</h2>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="border rounded p-2">
                    <p className="font-semibold">{variant.name}</p>
                    <p className="text-sm text-gray-600">
                      {variant.price.toFixed(2)} Kč - Skladem: {variant.stockQuantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            {product.stockQuantity > 0 ? (
              <p className="text-green-600 font-semibold">Skladem ({product.stockQuantity} ks)</p>
            ) : (
              <p className="text-red-600 font-semibold">Není skladem</p>
            )}
          </div>

          <AddToCartButton productId={product.id} />
        </div>
      </div>

      {product.categories && product.categories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Kategorie</h2>
          <div className="flex gap-2">
            {product.categories.map((category) => (
              <span
                key={category.id}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
