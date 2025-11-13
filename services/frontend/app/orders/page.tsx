'use client';

import { useEffect, useState } from 'react';
import { ordersApi, Order } from '@/lib/api/orders';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadOrders();
  }, [isAuthenticated, router]);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'CONFIRMED':
        return 'text-blue-600';
      case 'PROCESSING':
        return 'text-purple-600';
      case 'SHIPPED':
        return 'text-indigo-600';
      case 'DELIVERED':
        return 'text-green-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
        <p>Načítání objednávek...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Moje objednávky</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nemáte žádné objednávky</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Prohlédnout produkty
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Objednávka #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Datum: {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Položek: {order.items.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold mb-2 ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {order.total.toFixed(2)} Kč
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
