import { useState } from 'react';
import { CalendarComponent } from '../components/CalendarComponent';
import { Modal } from '../components/Modal';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, TrendingUp, TrendingDown, FileText } from 'lucide-react';

interface CalendarViewProps {
  onNavigate: (screen: string) => void;
}

interface DayData {
  date: number;
  sales: number;
  expenses: number;
  profit: number;
  isCurrentMonth: boolean;
  bills?: { vendor: string; amount: number }[];
}

export function CalendarView({ onNavigate }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<DayData | null>(null);
  const [currentMonth, setCurrentMonth] = useState(1); // February (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  
  // Generate mock calendar data
  const generateCalendarData = (): DayData[] => {
    const data: DayData[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      data.push({
        date: new Date(currentYear, currentMonth, -i).getDate(),
        sales: 0,
        expenses: 0,
        profit: 0,
        isCurrentMonth: false,
      });
    }
    data.reverse();
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const sales = Math.floor(Math.random() * 40000) + 30000;
      const expenses = Math.floor(Math.random() * 30000) + 20000;
      data.push({
        date: i,
        sales,
        expenses,
        profit: sales - expenses,
        isCurrentMonth: true,
        bills: [
          { vendor: 'Fresh Vegetables Co.', amount: Math.floor(expenses * 0.4) },
          { vendor: 'Dairy Products Ltd.', amount: Math.floor(expenses * 0.3) },
          { vendor: 'Cleaning Supplies Inc.', amount: Math.floor(expenses * 0.3) },
        ],
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - data.length;
    for (let i = 1; i <= remainingDays; i++) {
      data.push({
        date: i,
        sales: 0,
        expenses: 0,
        profit: 0,
        isCurrentMonth: false,
      });
    }
    
    return data;
  };
  
  const [calendarData, setCalendarData] = useState(generateCalendarData());
  
  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
    setCalendarData(generateCalendarData());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Calendar View</h1>
              <p className="text-sm text-gray-600">Track daily performance</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <CalendarComponent
          month={currentMonth}
          year={currentYear}
          data={calendarData}
          onDateClick={setSelectedDate}
          onMonthChange={handleMonthChange}
        />
      </div>
      
      {/* Daily Details Modal */}
      <Modal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        title={`Details for ${selectedDate?.date} ${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}`}
        size="md"
      >
        {selectedDate && (
          <div className="p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-gray-600">Sales</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{selectedDate.sales.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <p className="text-xs text-gray-600">Expenses</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{selectedDate.expenses.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-gray-600">Profit</p>
                </div>
                <p className={`text-lg font-semibold ${selectedDate.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{selectedDate.profit.toLocaleString()}
                </p>
              </Card>
            </div>
            
            {/* Bills Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Bills by Vendor</h3>
              <div className="space-y-2">
                {selectedDate.bills?.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{bill.vendor}</span>
                    <span className="text-sm font-medium text-gray-900">₹{bill.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-medium text-gray-900 mb-2">AI Summary</h4>
              <p className="text-sm text-gray-700">
                Sales performance was {selectedDate.sales > 50000 ? 'above' : 'below'} average. 
                Expense ratio at {((selectedDate.expenses / selectedDate.sales) * 100).toFixed(1)}% 
                is {selectedDate.expenses / selectedDate.sales < 0.7 ? 'healthy' : 'high'}. 
                Consider reviewing vendor bills for optimization opportunities.
              </p>
            </Card>
            
            <Button fullWidth onClick={() => onNavigate('dailyDetails')}>
              View Full Details
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
