import React, { useState, useEffect } from 'react';
import { useAtelierStorage } from './hooks/useAtelierStorage';
import { Header, ActiveNavTab } from './components/layout/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { OrdersView } from './components/orders/OrdersView';
import { CustomersView } from './components/customers/CustomersView';
import { MeasurementProfileEditor } from './components/measurements/MeasurementProfileEditor';
import { VisualMeasurementStudio } from './components/measurements/VisualMeasurementStudio';
import { FittingsCalendarView } from './components/calendar/FittingsCalendarView';
import { OrderDetailsModal } from './components/orders/OrderDetailsModal';
import { NewOrderModal } from './components/orders/NewOrderModal';
import { CustomerModal } from './components/customers/CustomerModal';
import { WorkOrderPrintModal } from './components/print/WorkOrderPrintModal';
import { Customer, CustomerMeasurementProfile, OrderItem } from './types/tailor';

export default function App() {
  const {
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
    resetToDemoData,
    exportBackupJSON,
    importBackupJSON
  } = useAtelierStorage();

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');

  // Check URL params for testing/autostart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveNavTab;
    if (tabParam && ['dashboard', 'orders', 'customers', 'studio', 'calendar'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Modal & Selection States
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [newOrderCustomerId, setNewOrderCustomerId] = useState<string | undefined>(undefined);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeMeasurementView, setActiveMeasurementView] = useState<{
    customer: Customer;
    profile: CustomerMeasurementProfile;
  } | null>(null);
  const [printModalData, setPrintModalData] = useState<{
    order: OrderItem;
    type: 'work_order' | 'invoice';
  } | null>(null);

  // Sync selectedOrder if it was updated in state
  const liveSelectedOrder = selectedOrder
    ? orders.find(o => o.id === selectedOrder.id) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 3-Zone Header Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          setActiveMeasurementView(null);
        }}
        onOpenNewOrder={() => {
          setNewOrderCustomerId(undefined);
          setIsNewOrderOpen(true);
        }}
        onOpenNewCustomer={() => {
          setEditingCustomer(null);
          setIsNewCustomerOpen(true);
        }}
        onResetData={resetToDemoData}
        onExportBackup={exportBackupJSON}
        onImportBackup={importBackupJSON}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If user is inspecting a specific customer's measurement spec sheet */}
        {activeMeasurementView ? (
          <MeasurementProfileEditor
            customer={activeMeasurementView.customer}
            profile={
              profiles.find(p => p.customerId === activeMeasurementView.customer.id) ||
              activeMeasurementView.profile
            }
            onSaveProfile={(profId, updates, revisionNote) => {
              updateMeasurementProfile(profId, updates, revisionNote);
            }}
            onBack={() => setActiveMeasurementView(null)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardOverview
                customers={customers}
                orders={orders}
                profiles={profiles}
                onSelectOrder={order => setSelectedOrder(order)}
                onNavigateTab={tab => setActiveTab(tab)}
                onOpenNewOrder={() => {
                  setNewOrderCustomerId(undefined);
                  setIsNewOrderOpen(true);
                }}
                onOpenNewCustomer={() => {
                  setEditingCustomer(null);
                  setIsNewCustomerOpen(true);
                }}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                orders={orders}
                customers={customers}
                onSelectOrder={order => setSelectedOrder(order)}
                onUpdateStatus={(orderId, status) => updateOrderStatus(orderId, status)}
                onOpenNewOrder={() => {
                  setNewOrderCustomerId(undefined);
                  setIsNewOrderOpen(true);
                }}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                profiles={profiles}
                orders={orders}
                onSelectCustomerMeasurements={(customer, profile) => {
                  setActiveMeasurementView({ customer, profile });
                }}
                onOpenNewCustomer={() => {
                  setEditingCustomer(null);
                  setIsNewCustomerOpen(true);
                }}
                onEditCustomer={customer => {
                  setEditingCustomer(customer);
                  setIsNewCustomerOpen(true);
                }}
                onCreateOrderForCustomer={customer => {
                  setNewOrderCustomerId(customer.id);
                  setIsNewOrderOpen(true);
                }}
              />
            )}

            {activeTab === 'studio' && (
              <VisualMeasurementStudio
                customers={customers}
                profiles={profiles}
                onOpenCustomerProfile={(customer, profile) => {
                  setActiveMeasurementView({ customer, profile });
                }}
              />
            )}

            {activeTab === 'calendar' && (
              <FittingsCalendarView
                orders={orders}
                customers={customers}
                onSelectOrder={order => setSelectedOrder(order)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">AtelierTrack</span>
            <span>·</span>
            <span>Customer Order & Measurement Management System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Savile Row Guild Standard</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{orders.length} Active Orders</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{customers.length} Patrons</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Order Details & Production Control Modal */}
      {liveSelectedOrder && (
        <OrderDetailsModal
          order={liveSelectedOrder}
          customer={customers.find(c => c.id === liveSelectedOrder.customerId)}
          profile={profiles.find(p => p.customerId === liveSelectedOrder.customerId)}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(id, status) => updateOrderStatus(id, status)}
          onRecordPayment={(id, amount) => recordOrderPayment(id, amount)}
          onUpdateOrder={(id, updates) => updateOrder(id, updates)}
          onDeleteOrder={id => deleteOrder(id)}
          onOpenMeasurements={(c, p) => setActiveMeasurementView({ customer: c, profile: p })}
          onOpenPrintTicket={(order, type) => setPrintModalData({ order, type })}
        />
      )}

      {/* 2. New Order Creation Modal */}
      {isNewOrderOpen && (
        <NewOrderModal
          customers={customers}
          initialCustomerId={newOrderCustomerId}
          onClose={() => {
            setIsNewOrderOpen(false);
            setNewOrderCustomerId(undefined);
          }}
          onCreateOrder={newOrderData => {
            const created = addOrder(newOrderData);
            setSelectedOrder(created);
          }}
          onOpenNewCustomer={() => {
            setIsNewCustomerOpen(true);
          }}
        />
      )}

      {/* 3. Customer Registration / Edit Modal */}
      {isNewCustomerOpen && (
        <CustomerModal
          customer={editingCustomer || undefined}
          onClose={() => {
            setIsNewCustomerOpen(false);
            setEditingCustomer(null);
          }}
          onSave={data => {
            if (editingCustomer) {
              updateCustomer(editingCustomer.id, data);
            } else {
              const created = addCustomer(data);
              // if an order was being created, set the new customer id
              if (isNewOrderOpen) {
                setNewOrderCustomerId(created.id);
              }
            }
          }}
        />
      )}

      {/* 4. Printable Work Order / Bespoke Receipt Modal */}
      {printModalData && (
        <WorkOrderPrintModal
          order={printModalData.order}
          customer={customers.find(c => c.id === printModalData.order.customerId)}
          profile={profiles.find(p => p.customerId === printModalData.order.customerId)}
          type={printModalData.type}
          onClose={() => setPrintModalData(null)}
        />
      )}
    </div>
  );
}
