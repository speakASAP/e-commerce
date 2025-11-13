'use client';

import { useEffect, useState } from 'react';
import { ordersApi, Order } from '@/lib/api/orders';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.id) {
      loadOrder(params.id as string);
    }
  }, [isAuthenticated, params.id, router]);

  const loadOrder = async (id: string) => {
    try {
      const response = await ordersApi.getOrder(id);
      if (response.success && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Čeká na potvrzení',
      CONFIRMED: 'Potvrzeno',
      PROCESSING: 'Zpracovává se',
      SHIPPED: 'Odesláno',
      DELIVERED: 'Doručeno',
      CANCELLED: 'Zrušeno',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Načítání objednávky...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Objednávka nenalezena</p>
        <Link href="/orders" className="text-blue-600 hover:underline">
          Zpět na objednávky
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/orders" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Zpět na objednávky
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Objednávka #{order.orderNumber}
            </h1>
            <p className="text-gray-600">
              Datum: {new Date(order.createdAt).toLocaleDateString('cs-CZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Položky objednávky</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">SKU: {item.productSku}</p>
                  <p className="text-sm text-gray-600">Množství: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.totalPrice.toFixed(2)} Kč</p>
                  <p className="text-sm text-gray-600">
                    {item.unitPrice.toFixed(2)} Kč / ks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Dodací adresa</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold">
              {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
            </p>
            <p>{order.deliveryAddress.street}</p>
            <p>
              {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
            </p>
            <p>{order.deliveryAddress.country}</p>
            {order.deliveryAddress.phone && (
              <p className="mt-2">Tel: {order.deliveryAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Souhrn</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Mezisoučet:</span>
              <span>{order.subtotal.toFixed(2)} Kč</span>
            </div>
            <div className="flex justify-between">
              <span>DPH (21%):</span>
              <span>{order.tax.toFixed(2)} Kč</span>
            </div>
            <div className="flex justify-between">
              <span>Doprava:</span>
              <span>{order.shippingCost.toFixed(2)} Kč</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Sleva:</span>
                <span>-{order.discount.toFixed(2)} Kč</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold border-t pt-2 mt-2">
              <span>Celkem:</span>
              <span>{order.total.toFixed(2)} Kč</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-2">Poznámka:</h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
