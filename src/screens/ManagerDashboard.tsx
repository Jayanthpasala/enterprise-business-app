import { useState } from 'react';
import { KPICard } from '../components/KPICard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Calendar, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ManagerDashboardProps {
  onNavigate: (screen: string) => void;
}

export function ManagerDashboard({ onNavigate }: ManagerDashboardProps) {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  const chartData: any[] = [];

  const alerts: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onNavigate('outletSelection')} size="md">
                Switch Outlet
              </Button>
              <Button onClick={() => onNavigate('salesEntry')} size="md">
                <Plus className="w-5 h-5" />
                Add Sales
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Period Toggle */}
        <div className="flex gap-2">
          <Button
            variant={period === 'daily' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPeriod('daily')}
          >
            Daily
          </Button>
          <Button
            variant={period === 'weekly' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Total Sales"
            value="₹3,86,000"
            change="+12% from last week"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-green-100 text-green-600"
          />
          <KPICard
            title="Total Expenses"
            value="₹2,60,000"
            change="+8% from last week"
            changeType="neutral"
            icon={TrendingDown}
            iconColor="bg-red-100 text-red-600"
          />
          <KPICard
            title="Net Profit"
            value="₹1,26,000"
            change="+18% from last week"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sales vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#10b981" name="Sales" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Alerts */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">AI Insights & Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : alert.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
                  }`}
              >
                <p className="text-sm text-gray-900">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card onClick={() => onNavigate('calendar')} className="p-6">
            <Calendar className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Calendar View</h3>
            <p className="text-sm text-gray-600">View daily sales and expenses</p>
          </Card>
          <Card onClick={() => onNavigate('billReview')} className="p-6">
            <AlertCircle className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Pending Approvals</h3>
            <p className="text-sm text-gray-600">5 bills awaiting review</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
