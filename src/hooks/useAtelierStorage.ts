import { useState, useEffect, useCallback } from 'react';
import { Customer, CustomerMeasurementProfile, OrderItem, OrderStatus, GarmentMeasurements } from '../types/tailor';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_PROFILES } from '../data/mockData';

const STORAGE_KEY_CUSTOMERS = 'ateliertrack_customers_v1';
const STORAGE_KEY_ORDERS = 'ateliertrack_orders_v1';
const STORAGE_KEY_PROFILES = 'ateliertrack_profiles_v1';

export function useAtelierStorage() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      return stored ? JSON.parse(stored) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [profiles, setProfiles] = useState<CustomerMeasurementProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILES);
      return stored ? JSON.parse(stored) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  // Persist whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to persist customers to localStorage', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to persist profiles to localStorage', e);
    }
  }, [profiles]);

  // Customer Actions
  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newId = `cust-${Date.now()}`;
    const newProfileId = `prof-${Date.now()}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      measurementProfileId: newProfileId
    };

    // Also auto-create a blank measurement profile for this new customer
    const newProfile: CustomerMeasurementProfile = {
      id: newProfileId,
      customerId: newId,
      profileName: `${customerData.fullName} - Bespoke Profile`,
      unit: 'inches',
      updatedAt: new Date().toISOString().split('T')[0],
      garments: {},
      revisionHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          note: 'Profile created',
          recordedBy: 'Atelier Intake Desk'
        }
      ]
    };

    setCustomers(prev => [newCustomer, ...prev]);
    setProfiles(prev => [newProfile, ...prev]);
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setOrders(prev => prev.filter(o => o.customerId !== id));
    setProfiles(prev => prev.filter(p => p.customerId !== id));
  }, []);

  // Order Actions
  const addOrder = useCallback((orderData: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt'>) => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderItem = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${randNum}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrder = useCallback((id: string, updates: Partial<OrderItem>) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...updates } : o)));
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
  }, []);

  const recordOrderPayment = useCallback((orderId: string, additionalAmount: number) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        const currentDeposit = o.pricing.depositPaid || 0;
        return {
          ...o,
          pricing: {
            ...o.pricing,
            depositPaid: Number((currentDeposit + additionalAmount).toFixed(2))
          }
        };
      })
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  // Measurement Profile Actions
  const updateMeasurementProfile = useCallback(
    (
      profileId: string,
      updates: Partial<CustomerMeasurementProfile>,
      revisionNote?: string,
      recordedBy: string = 'Master Cutter'
    ) => {
      setProfiles(prev =>
        prev.map(p => {
          if (p.id !== profileId) return p;
          const currentRevisions = p.revisionHistory || [];
          const newRevisionHistory = revisionNote
            ? [
                {
                  date: new Date().toISOString().split('T')[0],
                  note: revisionNote,
                  recordedBy
                },
                ...currentRevisions
              ]
            : currentRevisions;

          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString().split('T')[0],
            revisionHistory: newRevisionHistory
          };
        })
      );
    },
    []
  );

  const saveGarmentMeasurements = useCallback(
    (
      profileId: string,
      garmentKey: keyof CustomerMeasurementProfile['garments'],
      measurements: GarmentMeasurements,
      revisionNote?: string
    ) => {
      setProfiles(prev =>
        prev.map(p => {
          if (p.id !== profileId) return p;
          const updatedGarments = {
            ...p.garments,
            [garmentKey]: measurements
          };
          const currentRevisions = p.revisionHistory || [];
          const newRevisionHistory = revisionNote
            ? [
                {
                  date: new Date().toISOString().split('T')[0],
                  note: revisionNote,
                  recordedBy: 'Master Tailor'
                },
                ...currentRevisions
              ]
            : currentRevisions;

          return {
            ...p,
            garments: updatedGarments,
            updatedAt: new Date().toISOString().split('T')[0],
            revisionHistory: newRevisionHistory
          };
        })
      );
    },
    []
  );

  // Backup & Reset Actions
  const resetToDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_CUSTOMERS);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setProfiles(INITIAL_PROFILES);
  }, []);

  const exportBackupJSON = useCallback(() => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      customers,
      orders,
      profiles
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [customers, orders, profiles]);

  const importBackupJSON = useCallback((jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.customers) && Array.isArray(parsed.orders) && Array.isArray(parsed.profiles)) {
        setCustomers(parsed.customers);
        setOrders(parsed.orders);
        setProfiles(parsed.profiles);
        return { success: true, message: 'Data imported successfully' };
      }
      return { success: false, message: 'Invalid backup structure. Required keys missing.' };
    } catch {
      return { success: false, message: 'Failed to parse JSON file.' };
    }
  }, []);

  return {
    customers,
    orders,
    profiles,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addOrder,
    updateOrder,
    updateOrderStatus,
    recordOrderPayment,
    deleteOrder,
    updateMeasurementProfile,
    saveGarmentMeasurements,
    resetToDemoData,
    exportBackupJSON,
    importBackupJSON
  };
}
