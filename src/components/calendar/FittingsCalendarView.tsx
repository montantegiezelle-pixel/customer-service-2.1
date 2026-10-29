import React, { useState } from 'react';
import { Customer, OrderItem } from '../../types/tailor';
import { getFittingStatus, STATUS_LABELS } from '../../utils/tailorCalculations';
import { Calendar, Clock, User, Scissors, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FittingsCalendarViewProps {
  orders: OrderItem[];
  customers: Customer[];
  onSelectOrder: (order: OrderItem) => void;
}

export const FittingsCalendarView: React.FC<FittingsCalendarViewProps> = ({
  orders,
  customers,
  onSelectOrder
}) => {
  const [tailorFilter, setTailorFilter] = useState<string>('all');

  const customerMap = new Map(customers.map(c => [c.id, c]));

  // Extract all fittings from active orders
  interface FittingEvent {
    order: OrderItem;
    customer?: Customer;
    stageName: '1st Fitting' | '2nd Fitting' | 'Final Trial' | 'Target Delivery';
    date: string;
    completed: boolean;
    urgency: 'urgent' | 'upcoming' | 'completed' | 'none';
    daysRemaining: number;
  }

  const currentDate = new Date('2026-10-28');
  const events: FittingEvent[] = [];

  orders.forEach(order => {
    const customer = customerMap.get(order.customerId);

    if (order.fittings.firstFittingDate) {
      const target = new Date(order.fittings.firstFittingDate);
      const diffDays = Math.ceil((target.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      events.push({
        order,
        customer,
        stageName: '1st Fitting',
        date: order.fittings.firstFittingDate,
        completed: !!order.fittings.firstFittingCompleted,
        urgency: diffDays <= 2 ? 'urgent' : diffDays <= 7 ? 'upcoming' : 'none',
        daysRemaining: diffDays
      });
    }

    if (order.fittings.secondFittingDate) {
      const target = new Date(order.fittings.secondFittingDate);
      const diffDays = Math.ceil((target.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      events.push({
        order,
        customer,
        stageName: '2nd Fitting',
        date: order.fittings.secondFittingDate,
        completed: !!order.fittings.secondFittingCompleted,
        urgency: diffDays <= 2 ? 'urgent' : diffDays <= 7 ? 'upcoming' : 'none',
        daysRemaining: diffDays
      });
    }

    if (order.fittings.finalFittingDate) {
      const target = new Date(order.fittings.finalFittingDate);
      const diffDays = Math.ceil((target.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      events.push({
        order,
        customer,
        stageName: 'Final Trial',
        date: order.fittings.finalFittingDate,
        completed: !!order.fittings.finalFittingCompleted,
        urgency: diffDays <= 2 ? 'urgent' : diffDays <= 7 ? 'upcoming' : 'none',
        daysRemaining: diffDays
      });
    }
  });

  // Filter events by tailor
  const filteredEvents = events.filter(e => {
    if (tailorFilter === 'all') return true;
    return e.order.assignedTailor === tailorFilter;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingTrials = filteredEvents.filter(e => !e.completed);
  const completedTrials = filteredEvents.filter(e => e.completed);

  const tailorsList = Array.from(new Set(orders.map(o => o.assignedTailor)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fittings & Trial Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Basted trials, canvas adjustments, and final bespoke hand-off appointments.
          </p>
        </div>

        {/* Tailor Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Tailor:</label>
          <select
            value={tailorFilter}
            onChange={e => setTailorFilter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-xs focus:outline-none"
          >
            <option value="all">All Tailors ({tailorsList.length})</option>
            {tailorsList.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upcoming Fittings List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Scheduled Client Appointments ({upcomingTrials.length})
            </h2>
            <span className="text-xs text-slate-500">
              Sorted chronologically by appointment date
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Current Date: 2026-10-28</span>
        </div>

        {upcomingTrials.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No upcoming fitting trials scheduled.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {upcomingTrials.map((evt, idx) => {
              const isUrgent = evt.daysRemaining <= 2;

              return (
                <div
                  key={`${evt.order.id}-${evt.stageName}-${idx}`}
                  onClick={() => onSelectOrder(evt.order)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 border ${
                        isUrgent
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(evt.date).toLocaleString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm font-mono font-bold leading-none">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {evt.customer?.fullName || 'Client'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {evt.stageName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {evt.order.garmentType}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                        <span className="font-mono">{evt.order.orderNumber}</span>
                        <span>·</span>
                        <span>Tailor: {evt.order.assignedTailor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right shrink-0">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isUrgent ? 'text-amber-700' : 'text-slate-700'
                      }`}
                    >
                      {evt.daysRemaining === 0
                        ? 'Today'
                        : evt.daysRemaining === 1
                        ? 'Tomorrow'
                        : evt.daysRemaining > 0
                        ? `in ${evt.daysRemaining} days`
                        : `${Math.abs(evt.daysRemaining)} days overdue`}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Stage: {STATUS_LABELS[evt.order.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Completed Trials */}
      {completedTrials.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Concluded Fitting Sessions ({completedTrials.length})</span>
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {completedTrials.map((evt, idx) => (
              <div
                key={`completed-${evt.order.id}-${idx}`}
                onClick={() => onSelectOrder(evt.order)}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg cursor-pointer text-slate-600"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">{evt.date}</span>
                  <span className="font-semibold text-slate-800">
                    {evt.customer?.fullName}
                  </span>
                  <span>·</span>
                  <span>{evt.stageName}</span>
                  <span className="text-slate-400">({evt.order.orderNumber})</span>
                </div>
                <span className="text-emerald-700 font-medium">Completed & Adjusted</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
