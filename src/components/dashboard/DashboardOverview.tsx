import React from 'react';
import { Customer, OrderItem, CustomerMeasurementProfile } from '../../types/tailor';
import {
  calculateOrderTotals,
  formatCurrency,
  getFittingStatus,
  STATUS_LABELS,
  ORDER_STATUS_ORDER
} from '../../utils/tailorCalculations';
import { Clock, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';

interface DashboardOverviewProps {
  customers: Customer[];
  orders: OrderItem[];
  profiles: CustomerMeasurementProfile[];
  onSelectOrder: (order: OrderItem) => void;
  onNavigateTab: (tab: 'orders' | 'customers' | 'calendar' | 'studio') => void;
  onOpenNewOrder: () => void;
  onOpenNewCustomer: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  customers,
  orders,
  onSelectOrder,
  onNavigateTab,
  onOpenNewOrder,
  onOpenNewCustomer
}) => {
  // Aggregate KPIs
  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  let totalReceivableBalance = 0;
  let totalPipelineValue = 0;

  activeOrders.forEach(order => {
    const totals = calculateOrderTotals(order.pricing);
    totalReceivableBalance += totals.balanceDue;
    totalPipelineValue += totals.grandTotal;
  });

  // Calculate upcoming fittings
  const upcomingFittings = activeOrders
    .map(order => {
      const fittingInfo = getFittingStatus(order, '2026-10-28');
      const customer = customers.find(c => c.id === order.customerId);
      return {
        order,
        customer,
        fittingInfo
      };
    })
    .filter(item => item.fittingInfo.urgency === 'urgent' || item.fittingInfo.urgency === 'upcoming')
    .sort((a, b) => {
      const dateA = a.fittingInfo.date ? new Date(a.fittingInfo.date).getTime() : Infinity;
      const dateB = b.fittingInfo.date ? new Date(b.fittingInfo.date).getTime() : Infinity;
      return dateA - dateB;
    });

  // Status breakdown count
  const statusCounts = ORDER_STATUS_ORDER.reduce((acc, status) => {
    acc[status] = orders.filter(o => o.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Top Welcome / Workshop Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Atelier Workshop Control
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Production schedules, customer measurement books, and fitting pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNewCustomer}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            + Register Client
          </button>
          <button
            type="button"
            onClick={onOpenNewOrder}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            + Create Order
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Production KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Production</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {activeOrders.length}
            </span>
            <span className="text-xs text-slate-500">garments on bench</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{completedOrders.length} completed this cycle</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Upcoming Fittings</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {upcomingFittings.length}
            </span>
            <span className="text-xs text-slate-500">trials scheduled</span>
          </div>
          <div className="mt-3 text-xs text-amber-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Next fitting tomorrow</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Outstanding Balance Due</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(totalReceivableBalance)}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Pending final trial & delivery
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Pipeline Value</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(totalPipelineValue)}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Across {orders.length} total orders recorded
          </div>
        </div>
      </div>

      {/* Two-Column Middle Section: Urgent Fittings + Pipeline Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming Fitting Appointments (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Scheduled Fitting Trials & Deadlines
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Client fitting sessions requiring cutter preparation
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('calendar')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Calendar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingFittings.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No upcoming fittings scheduled at this time.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcomingFittings.slice(0, 4).map(({ order, customer, fittingInfo }) => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {customer?.fullName || 'Client'}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600 truncate">{order.garmentType}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                      <span className="font-mono text-slate-600">{order.orderNumber}</span>
                      <span>·</span>
                      <span>Tailor: {order.assignedTailor}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-700">Due: {order.targetDeliveryDate}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-semibold font-mono ${
                        fittingInfo.urgency === 'urgent' ? 'text-amber-700' : 'text-slate-800'
                      }`}
                    >
                      {fittingInfo.label}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Stage: {STATUS_LABELS[order.status]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pipeline Stage Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Pipeline Stages</h2>
                <p className="text-xs text-slate-500 mt-0.5">Garments in bench queue</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Board</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {ORDER_STATUS_ORDER.map(status => {
                const count = statusCounts[status] || 0;
                const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={status} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700">{STATUS_LABELS[status]}</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-slate-800 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Average turnaround: 3.5 weeks</span>
            <span className="font-mono tabular-nums">Savile Row Standard</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: High-Priority Orders Bench */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Active Work Order Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any order to inspect cutting ticket, update stage, or record payment
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-slate-900 hover:text-slate-700 cursor-pointer"
          >
            All Orders ({orders.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Garment Specification</th>
                <th className="py-2.5 px-3">Current Stage</th>
                <th className="py-2.5 px-3">Target Date</th>
                <th className="py-2.5 px-3 text-right">Balance Due</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                const totals = calculateOrderTotals(order.pricing);

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {customer?.fullName || 'Client'}
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                      {order.garmentType}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-medium text-slate-800">
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {order.targetDeliveryDate}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {totals.balanceDue > 0 ? (
                        <span className="text-amber-700">{formatCurrency(totals.balanceDue)}</span>
                      ) : (
                        <span className="text-emerald-700">Paid in Full</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="text-xs font-medium text-slate-900 underline hover:text-slate-600 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
