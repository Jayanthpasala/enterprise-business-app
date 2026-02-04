import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './Card';

interface DayData {
  date: number;
  sales: number;
  expenses: number;
  profit: number;
  isCurrentMonth: boolean;
}

interface CalendarComponentProps {
  month: number;
  year: number;
  data: DayData[];
  onDateClick: (date: DayData) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

export function CalendarComponent({ month, year, data, onDateClick, onMonthChange }: CalendarComponentProps) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onMonthChange('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onMonthChange('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        
        {data.map((day, index) => (
          <div
            key={index}
            onClick={() => day.isCurrentMonth && onDateClick(day)}
            className={`
              relative p-2 md:p-3 rounded-lg border transition-all
              ${day.isCurrentMonth 
                ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer' 
                : 'bg-gray-50 border-gray-100 text-gray-400'
              }
            `}
          >
            <div className="text-sm font-medium mb-1">{day.date}</div>
            {day.isCurrentMonth && day.sales > 0 && (
              <div className="text-xs space-y-0.5">
                <div className="text-green-600">₹{day.sales.toLocaleString()}</div>
                <div className="text-red-600">₹{day.expenses.toLocaleString()}</div>
                <div className="flex justify-center mt-1">
                  <div className={`w-2 h-2 rounded-full ${day.profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
