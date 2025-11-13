'use client';

import { useState } from 'react';
import { cartApi } from '@/lib/api/cart';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
}

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await cartApi.addToCart({
        productId,
        variantId,
        quantity,
      });

      if (response.success) {
        setMessage('Produkt přidán do košíku');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Nepodařilo se přidat produkt do košíku');
      }
    } catch (error) {
      setMessage('Došlo k chybě');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
      >
        {loading ? 'Přidávání...' : 'Přidat do košíku'}
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('přidán') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
