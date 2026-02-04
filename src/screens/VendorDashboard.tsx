import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Plus, Upload, FileText, Calendar } from 'lucide-react';

interface VendorDashboardProps {
  onNavigate: (screen: string) => void;
}

interface Bill {
  id: string;
  date: string;
  outlet: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export function VendorDashboard({ onNavigate }: VendorDashboardProps) {
  const bills: Bill[] = [
    {
      id: '1',
      date: '2026-02-04',
      outlet: 'Downtown Branch',
      amount: 12500,
      status: 'pending',
      submittedAt: '2 hours ago',
    },
    {
      id: '2',
      date: '2026-02-03',
      outlet: 'Airport Road',
      amount: 8900,
      status: 'approved',
      submittedAt: '1 day ago',
    },
    {
      id: '3',
      date: '2026-02-02',
      outlet: 'Downtown Branch',
      amount: 15600,
      status: 'approved',
      submittedAt: '2 days ago',
    },
    {
      id: '4',
      date: '2026-02-01',
      outlet: 'Whitefield',
      amount: 7200,
      status: 'rejected',
      submittedAt: '3 days ago',
    },
  ];
  
  const stats = {
    pending: bills.filter(b => b.status === 'pending').length,
    approved: bills.filter(b => b.status === 'approved').length,
    totalAmount: bills.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.amount, 0),
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Vendor Dashboard</h1>
              <p className="text-sm text-gray-600">Fresh Vegetables Co.</p>
            </div>
            <Button onClick={() => onNavigate('vendorUpload')} size="md">
              <Plus className="w-5 h-5" />
              Upload Bill
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Bills</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved Bills</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Approved</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Upload CTA */}
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload a New Bill</h3>
          <p className="text-gray-600 mb-6">
            Take a photo or upload an image of your bill for quick processing
          </p>
          <Button onClick={() => onNavigate('vendorUpload')} size="lg">
            <Plus className="w-5 h-5" />
            Upload Bill
          </Button>
        </Card>
        
        {/* Bills List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bills</h2>
          <div className="space-y-3">
            {bills.map((bill) => (
              <Card key={bill.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">₹{bill.amount.toLocaleString()}</h3>
                      <StatusBadge status={bill.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(bill.date).toLocaleDateString()}
                      </div>
                      <div>{bill.outlet}</div>
                      <div className="text-gray-400">{bill.submittedAt}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
