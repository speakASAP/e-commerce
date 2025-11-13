'use client';

import { useEffect, useState } from 'react';
import { cartApi, Cart } from '@/lib/api/cart';
import { addressesApi, DeliveryAddress } from '@/lib/api/addresses';
import { ordersApi } from '@/lib/api/orders';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      const [cartResponse, addressesResponse] = await Promise.all([
        cartApi.getCart(),
        addressesApi.getAddresses(),
      ]);

      if (cartResponse.success && cartResponse.data) {
        setCart(cartResponse.data);
      }

      if (addressesResponse.success && addressesResponse.data) {
        setAddresses(addressesResponse.data);
        const defaultAddress = addressesResponse.data.find((a) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (addressesResponse.data.length > 0) {
          setSelectedAddressId(addressesResponse.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load checkout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Vyberte prosím dodací adresu');
      return;
    }

    setProcessing(true);

    try {
      const response = await ordersApi.createOrder({
        deliveryAddressId: selectedAddressId,
        paymentMethod: 'payu',
      });

      if (response.success && response.data) {
        // Redirect to payment
        const paymentResponse = await ordersApi.createPayment(response.data.id);
        if (paymentResponse.success && paymentResponse.data) {
          window.location.href = paymentResponse.data.redirectUri;
        } else {
          router.push(`/orders/${response.data.id}`);
        }
      } else {
        alert('Nepodařilo se vytvořit objednávku');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Došlo k chybě při vytváření objednávky');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Načítání...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Váš košík je prázdný</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pokladna</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dodací adresa</h2>
            {addresses.length > 0 ? (
              <div className="space-y-2">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block border rounded p-4 cursor-pointer ${
                      selectedAddressId === address.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-semibold">
                        {address.firstName} {address.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{address.country}</p>
                      {address.phone && (
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      )}
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => router.push('/profile/addresses')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Přidat novou adresu
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">Nemáte žádnou dodací adresu</p>
                <button
                  onClick={() => router.push('/profile/addresses')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Přidat adresu
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Přehled objednávky</h2>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} Kč</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-gray-50 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Celkem</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Mezisoučet:</span>
                <span>{cart.total.toFixed(2)} Kč</span>
              </div>
              <div className="flex justify-between">
                <span>Doprava:</span>
                <span>99.00 Kč</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Celkem:</span>
                <span>{(cart.total + 99).toFixed(2)} Kč</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={processing || !selectedAddressId || addresses.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Zpracování...' : 'Dokončit objednávku'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
