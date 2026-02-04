import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ArrowLeft, Check, X, AlertTriangle, Info, Shield } from 'lucide-react';

interface BillReviewProps {
  onNavigate: (screen: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

interface BillData {
  vendor_name: string;
  bill_number: string | null;
  bill_date: string | null;
  total_amount: number;
  tax_amount: number | null;
  currency: string;
  payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'unknown';
  expense_category: 'raw_material' | 'utility' | 'rent' | 'maintenance' | 'packaging' | 'others';
  source_document_required: boolean;
  uploaded_by_role: string;
  confidence_score: number;
}

export function BillReview({ onNavigate, onApprove, onReject }: BillReviewProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [billData, setBillData] = useState<BillData>({
    vendor_name: 'Fresh Vegetables Co.',
    bill_number: 'INV-2026-001234',
    bill_date: '2026-02-04',
    total_amount: 12500,
    tax_amount: 1500,
    currency: 'INR',
    payment_mode: 'bank_transfer',
    expense_category: 'raw_material',
    source_document_required: true,
    uploaded_by_role: 'vendor',
    confidence_score: 0.95,
  });
  
  const handleConfirm = () => {
    if (confirmAction === 'approve') {
      onApprove();
    } else if (confirmAction === 'reject') {
      onReject();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setRejectReason('');
  };
  
  const categoryLabels = {
    raw_material: 'Raw Material',
    utility: 'Utility',
    rent: 'Rent',
    maintenance: 'Maintenance',
    packaging: 'Packaging',
    others: 'Others',
  };
  
  const paymentModeLabels = {
    cash: 'Cash',
    card: 'Card',
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
    unknown: 'Unknown',
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
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Bill Review & Approval</h1>
              <p className="text-sm text-gray-600">Invoice #{billData.bill_number}</p>
            </div>
            <StatusBadge status="pending" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enterprise Guidelines Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">Enterprise Audit Trail Active</p>
              <p className="text-xs text-blue-800">
                This bill follows enterprise guidelines. Source document is permanently stored. 
                All validations passed. Suitable for accounting and compliance.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bill Image */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Source Document</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Stored Permanently
              </span>
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
              <div className="text-center text-gray-500">
                <p className="text-sm">Bill image would appear here</p>
                <p className="text-xs mt-1">Invoice: {billData.bill_number}</p>
              </div>
            </div>
            
            {/* Confidence & Validation */}
            <div className="mt-4 space-y-3">
              <div className={`p-3 rounded-lg border ${
                billData.confidence_score >= 0.9 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    AI Confidence: {(billData.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Uploaded by: {billData.uploaded_by_role}
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900 mb-2">Validation Status:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>✓ Total amount validation passed</li>
                  <li>✓ {billData.tax_amount ? 'Tax amount validated' : 'No tax provided'}</li>
                  <li>✓ Bill date within valid range</li>
                  <li>✓ Source document required: Yes</li>
                  <li>✓ Enterprise guidelines followed</li>
                </ul>
              </div>
            </div>
          </Card>
          
          {/* Bill Details */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Extracted Details</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel Edit' : 'Edit Details'}
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  value={billData.vendor_name}
                  onChange={(e) => setBillData({ ...billData, vendor_name: e.target.value })}
                  readOnly={!editMode}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    editMode 
                      ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bill Number
                  </label>
                  <input
                    type="text"
                    value={billData.bill_number || ''}
                    onChange={(e) => setBillData({ ...billData, bill_number: e.target.value })}
                    readOnly={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      editMode 
                        ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={billData.bill_date || ''}
                    onChange={(e) => setBillData({ ...billData, bill_date: e.target.value })}
                    readOnly={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      editMode 
                        ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount ({billData.currency})
                  </label>
                  <input
                    type="number"
                    value={billData.total_amount}
                    onChange={(e) => setBillData({ ...billData, total_amount: parseFloat(e.target.value) })}
                    readOnly={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg font-semibold ${
                      editMode 
                        ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Amount ({billData.currency})
                  </label>
                  <input
                    type="number"
                    value={billData.tax_amount || ''}
                    onChange={(e) => setBillData({ ...billData, tax_amount: parseFloat(e.target.value) || null })}
                    readOnly={!editMode}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      editMode 
                        ? 'border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="N/A"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode
                  </label>
                  {editMode ? (
                    <select
                      value={billData.payment_mode}
                      onChange={(e) => setBillData({ ...billData, payment_mode: e.target.value as any })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={paymentModeLabels[billData.payment_mode]}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Category
                  </label>
                  {editMode ? (
                    <select
                      value={billData.expense_category}
                      onChange={(e) => setBillData({ ...billData, expense_category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="raw_material">Raw Material</option>
                      <option value="utility">Utility</option>
                      <option value="rent">Rent</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="packaging">Packaging</option>
                      <option value="others">Others</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={categoryLabels[billData.expense_category]}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  )}
                </div>
              </div>
              
              {/* Summary */}
              <div className="pt-4 border-t">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {billData.currency} {billData.tax_amount 
                        ? (billData.total_amount - billData.tax_amount).toLocaleString() 
                        : billData.total_amount.toLocaleString()
                      }
                    </span>
                  </div>
                  {billData.tax_amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">{billData.currency} {billData.tax_amount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-semibold text-gray-900">
                      {billData.currency} {billData.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Action Buttons */}
        <div className="sticky bottom-0 mt-6 bg-white border-t border-gray-200 p-4 -mx-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4">
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => {
                setConfirmAction('reject');
                setShowConfirmModal(true);
              }}
            >
              <X className="w-5 h-5" />
              Reject Bill
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setConfirmAction('approve');
                setShowConfirmModal(true);
              }}
            >
              <Check className="w-5 h-5" />
              Approve Bill
            </Button>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setRejectReason('');
        }}
        title={confirmAction === 'approve' ? 'Approve Bill' : 'Reject Bill'}
        size="sm"
      >
        <div className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                This action will be recorded in the audit trail with timestamp and user details.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            {confirmAction === 'approve' 
              ? 'Are you sure you want to approve this bill? This will add the expense to your accounting records and notify the vendor.'
              : 'Are you sure you want to reject this bill? The vendor will be notified with your reason.'
            }
          </p>
          
          {confirmAction === 'reject' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Explain why this bill is being rejected..."
              />
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowConfirmModal(false);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === 'approve' ? 'primary' : 'danger'}
              fullWidth
              onClick={handleConfirm}
              disabled={confirmAction === 'reject' && !rejectReason}
            >
              {confirmAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}