'use client';

import { useEffect, useState } from 'react';
import { cartApi, CartItem } from '@/lib/api/cart';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number; itemCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      await cartApi.updateCartItem(itemId, quantity);
      loadCart();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartApi.removeFromCart(itemId);
      loadCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Načítání košíku...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Košík</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Váš košík je prázdný</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Prohlédnout produkty
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Košík</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500">{item.variant.name}</p>
                  )}
                  <p className="text-lg font-bold text-blue-600">
                    {item.price.toFixed(2)} Kč
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border rounded"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Odstranit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Souhrn objednávky</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Položek:</span>
                <span>{cart.itemCount}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Celkem:</span>
                <span>{cart.total.toFixed(2)} Kč</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 text-center block"
            >
              Pokračovat k pokladně
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

