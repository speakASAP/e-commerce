'use client';

import { useEffect, useState } from 'react';
import { addressesApi, DeliveryAddress, CreateAddressData } from '@/lib/api/addresses';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAddressData>({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Czech Republic',
    phone: '',
    isDefault: false,
  });
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadAddresses();
  }, [isAuthenticated, router]);

  const loadAddresses = async () => {
    try {
      const response = await addressesApi.getAddresses();
      if (response.success && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await addressesApi.updateAddress(editingId, formData);
      } else {
        await addressesApi.createAddress(formData);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Nepodařilo se uložit adresu');
    }
  };

  const handleEdit = (address: DeliveryAddress) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto adresu?')) {
      return;
    }

    try {
      await addressesApi.deleteAddress(id);
      loadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('Nepodařilo se smazat adresu');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'Czech Republic',
      phone: '',
      isDefault: false,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Načítání...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dodací adresy</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Přidat adresu
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Upravit adresu' : 'Nová adresa'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Jméno</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Příjmení</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Ulice</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Město</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">PSČ</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Země</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Nastavit jako výchozí adresu</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? 'Uložit změny' : 'Přidat adresu'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-lg shadow-md p-6">
            {address.isDefault && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                Výchozí
              </span>
            )}
            <h3 className="font-semibold mb-2">
              {address.firstName} {address.lastName}
            </h3>
            <p className="text-gray-600 mb-1">{address.street}</p>
            <p className="text-gray-600 mb-1">
              {address.city}, {address.postalCode}
            </p>
            <p className="text-gray-600 mb-2">{address.country}</p>
            {address.phone && (
              <p className="text-gray-600 mb-4">Tel: {address.phone}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(address)}
                className="text-blue-600 hover:underline text-sm"
              >
                Upravit
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Smazat
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <p className="text-center text-gray-500 py-12">
          Nemáte žádné dodací adresy
        </p>
      )}
    </div>
  );
}

