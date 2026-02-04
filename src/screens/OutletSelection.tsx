import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Store, MapPin, Plus, Globe } from 'lucide-react';
import { Outlet } from '../types';
import { fetchExchangeRate } from '../lib/exchangeRate';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface OutletSelectionProps {
  onSelect: (outletId: string) => void;
}

const COUNTRIES = [
  { name: 'United States', code: 'US', currency: 'USD' },
  { name: 'India', code: 'IN', currency: 'INR' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
  { name: 'Eurozone', code: 'EU', currency: 'EUR' },
  { name: 'Canada', code: 'CA', currency: 'CAD' },
  { name: 'Australia', code: 'AU', currency: 'AUD' },
  { name: 'Japan', code: 'JP', currency: 'JPY' },
  { name: 'China', code: 'CN', currency: 'CNY' },
  { name: 'Switzerland', code: 'CH', currency: 'CHF' },
  { name: 'New Zealand', code: 'NZ', currency: 'NZD' },
  { name: 'Singapore', code: 'SG', currency: 'SGD' },
  { name: 'Hong Kong', code: 'HK', currency: 'HKD' },
  { name: 'South Korea', code: 'KR', currency: 'KRW' },
  { name: 'Sweden', code: 'SE', currency: 'SEK' },
  { name: 'Norway', code: 'NO', currency: 'NOK' },
  { name: 'Mexico', code: 'MX', currency: 'MXN' },
  { name: 'Brazil', code: 'BR', currency: 'BRL' },
  { name: 'Russia', code: 'RU', currency: 'RUB' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR' },
  { name: 'Turkey', code: 'TR', currency: 'TRY' },
  { name: 'Saudi Arabia', code: 'SA', currency: 'SAR' },
  { name: 'United Arab Emirates', code: 'AE', currency: 'AED' },
  { name: 'Thailand', code: 'TH', currency: 'THB' },
  { name: 'Malaysia', code: 'MY', currency: 'MYR' },
  { name: 'Indonesia', code: 'ID', currency: 'IDR' },
  { name: 'Vietnam', code: 'VN', currency: 'VND' },
  { name: 'Philippines', code: 'PH', currency: 'PHP' },
];

export function OutletSelection({ onSelect }: OutletSelectionProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newOutlet, setNewOutlet] = useState({ name: '', location: '', country: 'India' });
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Initial dummy data - in a real app, this would fetch from Firestore
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const handleCreateOutlet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedCountry = COUNTRIES.find(c => c.name === newOutlet.country);
      if (!selectedCountry) throw new Error('Invalid country selected');

      // Fetch exchange rate relative to USD (assuming USD is base for global reporting)
      let rate = 1;
      try {
        const fetchedRate = await fetchExchangeRate('USD', selectedCountry.currency);
        if (fetchedRate) {
          rate = fetchedRate;
          setExchangeRate(rate);
        } else {
          console.warn("Could not fetch exchange rate, defaulting to 1");
          // Don't throw here, just warn
        }
      } catch (err) {
        console.warn("Exchange rate API error", err);
      }

      console.log("Attempting to create outlet in Firestore...", newOutlet);

      let docId = 'offline_' + Date.now();

      try {
        // Create a timeout promise - increased to 30 seconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Firestore write timed out. Check your internet connection.")), 30000);
        });

        // Race the addDoc against the timeout
        const docRef = await Promise.race([
          addDoc(collection(db, "outlets"), {
            ...newOutlet,
            currency: selectedCountry.currency,
            baseExchangeRate: rate,
            createdAt: new Date(),
          }),
          timeoutPromise
        ]) as any;
        docId = docRef.id;
        console.log("Outlet created with ID:", docId);
      } catch (writeError: any) {
        console.error("Database write failed:", writeError);
        // Throw error directly without offline fallback
        throw new Error("Failed to save outlet to database. Please check your internet connection and Firebase configuration.");
      }

      const createdOutlet: Outlet = {
        id: docId,
        name: newOutlet.name,
        location: newOutlet.location,
        country: newOutlet.country,
        currency: selectedCountry.currency
      };

      setOutlets([...outlets, createdOutlet]);
      setShowCreate(false);
      onSelect(createdOutlet.id);
    } catch (error: any) {
      console.error("Error creating outlet: ", error);
      // Detailed error message for the user
      const message = error.code === 'permission-denied'
        ? "Permission denied. Check your Firestore rules."
        : error.message || "Unknown error occurred.";

      setError(message);
      // Also keep alert as backup
      alert("Failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Select Outlet</h1>
          <p className="text-gray-600">Choose which outlet you want to manage</p>
        </div>

        {!showCreate ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              {outlets.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <Store className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Outlets Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first outlet to get started</p>
                </div>
              ) : (
                outlets.map((outlet) => (
                  <Card
                    key={outlet.id}
                    onClick={() => onSelect(outlet.id)}
                    className="p-6 hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Store className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{outlet.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {outlet.location}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Globe className="w-3 h-3" />
                          {outlet.country} ({outlet.currency})
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="text-center">
              <Button onClick={() => setShowCreate(true)} size="lg">
                <Plus className="w-4 h-4" />
                Create New Outlet
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Register New Outlet</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleCreateOutlet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outlet Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={newOutlet.name}
                  onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  value={newOutlet.location}
                  onChange={(e) => setNewOutlet({ ...newOutlet, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newOutlet.country}
                  onChange={(e) => setNewOutlet({ ...newOutlet, country: e.target.value })}
                >
                  {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name} ({c.currency})</option>)}
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Outlet'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
