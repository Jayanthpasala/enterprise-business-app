import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';

interface DailyDetailsProps {
  onNavigate: (screen: string) => void;
}

export function DailyDetails({ onNavigate }: DailyDetailsProps) {
  const dayData = {
    date: '2026-02-04',
    sales: 52000,
    expenses: 28000,
    profit: 24000,
    bills: [
      { 
        id: '1', 
        vendor: 'Fresh Vegetables Co.', 
        amount: 12500, 
        status: 'pending' as const,
        items: 4 
      },
      { 
        id: '2', 
        vendor: 'Dairy Products Ltd.', 
        amount: 8900, 
        status: 'approved' as const,
        items: 3 
      },
      { 
        id: '3', 
        vendor: 'Cleaning Supplies Inc.', 
        amount: 6600, 
        status: 'approved' as const,
        items: 5 
      },
    ],
    paymentBreakdown: {
      cash: 18000,
      upi: 24000,
      card: 10000,
    },
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('calendar')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {new Date(dayData.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h1>
              <p className="text-sm text-gray-600">Downtown Branch</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Total Sales</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              ₹{dayData.sales.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-600">Total Expenses</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              ₹{dayData.expenses.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Net Profit</span>
            </div>
            <p className="text-2xl font-semibold text-green-600">
              ₹{dayData.profit.toLocaleString()}
            </p>
          </Card>
        </div>
        
        {/* Sales Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sales Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Cash</span>
              <span className="font-medium text-gray-900">₹{dayData.paymentBreakdown.cash.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">UPI</span>
              <span className="font-medium text-gray-900">₹{dayData.paymentBreakdown.upi.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Card</span>
              <span className="font-medium text-gray-900">₹{dayData.paymentBreakdown.card.toLocaleString()}</span>
            </div>
          </div>
        </Card>
        
        {/* Bills Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Bills ({dayData.bills.length})</h3>
            <span className="text-sm text-gray-600">
              {dayData.bills.filter(b => b.status === 'pending').length} pending approval
            </span>
          </div>
          
          <div className="space-y-3">
            {dayData.bills.map((bill) => (
              <div
                key={bill.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h4 className="font-medium text-gray-900">{bill.vendor}</h4>
                      <StatusBadge status={bill.status} size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 ml-8">{bill.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{bill.amount.toLocaleString()}</p>
                    {bill.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('billReview')}
                        className="mt-2"
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* AI Summary */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">AI Daily Summary</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              • Sales performance was <strong>above average</strong> for a Wednesday.
            </p>
            <p>
              • Expense ratio at <strong>53.8%</strong> is within healthy range.
            </p>
            <p>
              • UPI payments dominated at <strong>46%</strong> of total sales.
            </p>
            <p>
              • <strong>1 pending bill</strong> requires immediate review (Fresh Vegetables Co.).
            </p>
            <p className="text-blue-700 font-medium mt-3">
              Overall: Strong performance. Continue monitoring vegetable supplier costs.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
