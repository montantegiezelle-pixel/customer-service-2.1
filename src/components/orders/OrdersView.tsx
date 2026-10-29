import React, { useState, useMemo } from 'react';
import { Customer, OrderItem, OrderStatus, GarmentCategory } from '../../types/tailor';
import {
  calculateOrderTotals,
  formatCurrency,
  STATUS_LABELS,
  ORDER_STATUS_ORDER,
  getNextOrderStatus,
  getPreviousOrderStatus
} from '../../utils/tailorCalculations';
import {
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  ChevronRight,
  ChevronLeft,
  Plus,
  AlertCircle
} from 'lucide-react';

interface OrdersViewProps {
  orders: OrderItem[];
  customers: Customer[];
  onSelectOrder: (order: OrderItem) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenNewOrder: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  customers,
  onSelectOrder,
  onUpdateStatus,
  onOpenNewOrder
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');

  const customerMap = useMemo(() => {
    return new Map(customers.map(c => [c.id, c]));
  }, [customers]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customer = customerMap.get(order.customerId);
      const clientName = customer ? customer.fullName.toLowerCase() : '';
      const orderNum = order.orderNumber.toLowerCase();
      const garment = order.garmentType.toLowerCase();
      const fabric = order.fabricCode.toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      if (q && !orderNum.includes(q) && !clientName.includes(q) && !garment.includes(q) && !fabric.includes(q)) {
        return false;
      }

      if (selectedStatus !== 'all' && order.status !== selectedStatus) {
        return false;
      }

      if (selectedCategory !== 'all' && order.category !== selectedCategory) {
        return false;
      }

      if (selectedPayment !== 'all') {
        const totals = calculateOrderTotals(order.pricing);
        if (selectedPayment === 'paid' && !totals.isPaidInFull) return false;
        if (selectedPayment === 'unpaid' && totals.isPaidInFull) return false;
      }

      return true;
    });
  }, [orders, customerMap, searchQuery, selectedStatus, selectedCategory, selectedPayment]);

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Orders & Production Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tracking bespoke cutting, basting, fittings, and workshop dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented view switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenNewOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order #, client name, fabric, or garment..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 text-xs">
          <label className="text-slate-500 font-medium">Stage:</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Stages ({orders.length})</option>
            {ORDER_STATUS_ORDER.map(st => (
              <option key={st} value={st}>
                {STATUS_LABELS[st]}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 text-xs">
          <label className="text-slate-500 font-medium">Garment:</label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Garments</option>
            <option value="suit_jacket">Suit / Jacket</option>
            <option value="trousers">Trousers</option>
            <option value="shirt">Shirts</option>
            <option value="dress">Dress & Evening</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Payment Balance Filter */}
        <div className="flex items-center gap-1 text-xs">
          <label className="text-slate-500 font-medium">Balance:</label>
          <select
            value={selectedPayment}
            onChange={e => setSelectedPayment(e.target.value)}
            className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Payments</option>
            <option value="unpaid">Outstanding Due</option>
            <option value="paid">Paid in Full</option>
          </select>
        </div>

        {(searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedPayment !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedCategory('all');
              setSelectedPayment('all');
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* View Content: Kanban vs Table */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1280px]">
            {ORDER_STATUS_ORDER.map(status => {
              const columnOrders = filteredOrders.filter(o => o.status === status);

              return (
                <div
                  key={status}
                  className="w-72 shrink-0 bg-slate-100/70 border border-slate-200 rounded-xl p-3 flex flex-col max-h-[calc(100vh-280px)]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                    <span className="text-xs font-bold text-slate-800">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Cards container */}
                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {columnOrders.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-slate-400">
                        No orders in this stage
                      </div>
                    ) : (
                      columnOrders.map(order => {
                        const customer = customerMap.get(order.customerId);
                        const totals = calculateOrderTotals(order.pricing);
                        const prevStatus = getPreviousOrderStatus(order.status);
                        const nextStatus = getNextOrderStatus(order.status);

                        return (
                          <div
                            key={order.id}
                            onClick={() => onSelectOrder(order)}
                            className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-mono font-semibold text-slate-900">
                                {order.orderNumber}
                              </span>
                              {order.priority === 'urgent' && (
                                <span className="text-[10px] font-bold text-rose-600 uppercase">
                                  Urgent
                                </span>
                              )}
                              {order.priority === 'rush' && (
                                <span className="text-[10px] font-bold text-amber-600 uppercase">
                                  Rush
                                </span>
                              )}
                            </div>

                            <div className="text-xs font-bold text-slate-900 truncate">
                              {customer?.fullName || 'Client'}
                            </div>

                            <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                              {order.garmentType}
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-mono">
                                Due: {order.targetDeliveryDate}
                              </span>
                              <span className="font-mono tabular-nums font-semibold text-slate-800">
                                {totals.balanceDue > 0 ? (
                                  <span className="text-amber-700">Due {formatCurrency(totals.balanceDue)}</span>
                                ) : (
                                  <span className="text-emerald-700">Paid</span>
                                )}
                              </span>
                            </div>

                            {/* Stage shift actions */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <button
                                type="button"
                                disabled={!prevStatus}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (prevStatus) onUpdateStatus(order.id, prevStatus);
                                }}
                                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed rounded hover:bg-slate-100"
                                title={prevStatus ? `Move back to ${STATUS_LABELS[prevStatus]}` : 'Start of pipeline'}
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>

                              <span className="text-[10px] text-slate-400 font-medium">
                                {order.assignedTailor.split(' ')[0]}
                              </span>

                              <button
                                type="button"
                                disabled={!nextStatus}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (nextStatus) onUpdateStatus(order.id, nextStatus);
                                }}
                                className="p-1 text-slate-700 hover:text-slate-900 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed rounded hover:bg-slate-100 flex items-center gap-0.5 text-[10px] font-semibold"
                                title={nextStatus ? `Advance to ${STATUS_LABELS[nextStatus]}` : 'Completed'}
                              >
                                <span>Advance</span>
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
            })}
          </div>
        </div>
      ) : (
        /* High Density Table View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Garment & Specification</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Delivery Date</th>
                  <th className="py-3 px-4">Cutter / Tailor</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const customer = customerMap.get(order.customerId);
                    const totals = calculateOrderTotals(order.pricing);

                    return (
                      <tr
                        key={order.id}
                        onClick={() => onSelectOrder(order)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {customer?.fullName || 'Client'}
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <div className="font-medium text-slate-800 truncate">
                            {order.garmentType}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {order.fabricCode}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                          {STATUS_LABELS[order.status]}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {order.targetDeliveryDate}
                        </td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                          {order.assignedTailor}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-800 whitespace-nowrap">
                          {formatCurrency(totals.grandTotal)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold whitespace-nowrap">
                          {totals.balanceDue > 0 ? (
                            <span className="text-amber-700">{formatCurrency(totals.balanceDue)}</span>
                          ) : (
                            <span className="text-emerald-700">Paid in Full</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectOrder(order);
                            }}
                            className="text-xs font-semibold text-slate-900 hover:underline cursor-pointer"
                          >
                            Open Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
