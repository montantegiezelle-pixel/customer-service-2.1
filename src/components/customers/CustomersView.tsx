import React, { useState, useMemo } from 'react';
import { Customer, CustomerMeasurementProfile, OrderItem } from '../../types/tailor';
import { Search, Plus, User, Ruler, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  profiles: CustomerMeasurementProfile[];
  orders: OrderItem[];
  onSelectCustomerMeasurements: (customer: Customer, profile: CustomerMeasurementProfile) => void;
  onOpenNewCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onCreateOrderForCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  profiles,
  orders,
  onSelectCustomerMeasurements,
  onOpenNewCustomer,
  onEditCustomer,
  onCreateOrderForCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const profileMap = useMemo(() => {
    return new Map(profiles.map(p => [p.customerId, p]));
  }, [profiles]);

  const ordersCountMap = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach(o => {
      map.set(o.customerId, (map.get(o.customerId) || 0) + 1);
    });
    return map;
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q));

      const matchesTier = selectedTier === 'all' || c.clientTier === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [customers, searchQuery, selectedTier]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Clients & Measurement Profiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bespoke anatomical records, posture assessments, and order histories.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewCustomer}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Client</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, telephone, email or posture note..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <label className="text-slate-500 font-medium">Patron Tier:</label>
          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Tiers ({customers.length})</option>
            <option value="couture_patron">Couture Patron</option>
            <option value="vip">VIP Patron</option>
            <option value="standard">Standard Bespoke</option>
          </select>
        </div>

        {(searchQuery || selectedTier !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTier('all');
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400 bg-white border border-slate-200 rounded-xl">
            No clients match the specified search criteria.
          </div>
        ) : (
          filteredCustomers.map(customer => {
            const profile = profileMap.get(customer.id) || {
              id: `prof-${customer.id}`,
              customerId: customer.id,
              profileName: 'Standard Profile',
              unit: 'inches',
              updatedAt: customer.createdAt,
              garments: {}
            };
            const orderCount = ordersCountMap.get(customer.id) || 0;

            const recordedGarmentCount = Object.keys(profile.garments || {}).length;

            return (
              <div
                key={customer.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Top Bar of card: Name & Tier (unboxed metadata, zero pill) */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        {customer.fullName}
                      </h2>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="capitalize font-medium text-slate-700">
                          {customer.clientTier.replace('_', ' ')}
                        </span>
                        <span>·</span>
                        <span className="font-mono">{orderCount} {orderCount === 1 ? 'order' : 'orders'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEditCustomer(customer)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Edit Info
                    </button>
                  </div>

                  {/* Contact details */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.address && (
                      <div className="flex items-start gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{customer.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Body & Posture Notes */}
                  {customer.notes && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Tailor Posture Memo
                      </div>
                      <p className="mt-0.5 line-clamp-2 italic text-slate-700">
                        "{customer.notes}"
                      </p>
                    </div>
                  )}

                  {/* Measurement Profile Snapshot */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Ruler className="w-3.5 h-3.5 text-slate-500" />
                      <span>{recordedGarmentCount > 0 ? `${recordedGarmentCount} Garment Patterns` : 'No measurements'}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {profile.unit.toUpperCase()} · Updated {profile.updatedAt}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onCreateOrderForCustomer(customer)}
                    className="text-xs font-semibold text-slate-900 hover:text-slate-700 cursor-pointer"
                  >
                    + New Order
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectCustomerMeasurements(customer, profile)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Measurements</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
