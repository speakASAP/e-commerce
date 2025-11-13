import { productsApi, Product } from '@/lib/api/products';
import Link from 'next/link';

interface ProductsPageProps {
  searchParams: {
    search?: string;
    page?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1');
  const filters = {
    page,
    limit: 20,
    search: searchParams.search,
    categoryId: searchParams.categoryId,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
  };

  const response = await productsApi.getProducts(filters);
  const products = response.success ? response.data?.items || [] : [];
  const pagination = response.success ? response.data?.pagination : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Produkty</h1>

      {/* Search and Filters */}
      <div className="mb-8">
        <form className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder="Hledat produkty..."
            defaultValue={searchParams.search}
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Hledat
          </button>
        </form>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="aspect-square bg-gray-200 rounded mb-4"></div>
            <h3 className="font-semibold mb-2">{product.name}</h3>
            {product.brand && (
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            )}
            <p className="text-2xl font-bold text-blue-600">
              {product.price.toFixed(2)} Kč
            </p>
            {product.stockQuantity > 0 ? (
              <p className="text-sm text-green-600 mt-2">Skladem</p>
            ) : (
              <p className="text-sm text-red-600 mt-2">Není skladem</p>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {pagination.hasPrev && (
            <Link
              href={`/products?page=${pagination.page - 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Předchozí
            </Link>
          )}
          <span className="px-4 py-2">
            Stránka {pagination.page} z {pagination.totalPages}
          </span>
          {pagination.hasNext && (
            <Link
              href={`/products?page=${pagination.page + 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Další
            </Link>
          )}
        </div>
      )}

      {products.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          Žádné produkty nenalezeny
        </p>
      )}
    </div>
  );
}

