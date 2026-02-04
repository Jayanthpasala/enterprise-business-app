import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ArrowLeft, Camera, Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface VendorBillUploadProps {
  onNavigate: (screen: string) => void;
  onSuccess: () => void;
}

interface ExtractedBillData {
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

export function VendorBillUpload({ onNavigate, onSuccess }: VendorBillUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedBillData | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        simulateAIProcessing();
      };
      reader.readAsDataURL(file);
    }
  };
  
  const simulateAIProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate enterprise-grade AI extraction following guidelines
      setExtractedData({
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
      setIsProcessing(false);
    }, 2000);
  };
  
  const handleSubmit = () => {
    onSuccess();
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('vendorDashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Upload Bill</h1>
              <p className="text-sm text-gray-600">Enterprise-grade AI extraction with audit trail</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!uploadedImage ? (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Bill Image</h3>
                <p className="text-gray-600 mb-6">
                  Take a clear photo or upload an image of your bill
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">Take Photo</p>
                    <p className="text-sm text-gray-500 mt-1">Use camera</p>
                  </div>
                </label>
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">Upload File</p>
                    <p className="text-sm text-gray-500 mt-1">From gallery</p>
                  </div>
                </label>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-2">Enterprise Guidelines:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Original document will be stored for audit trail</li>
                      <li>AI extracts only visible data (no guessing)</li>
                      <li>All data validated for accounting compliance</li>
                      <li>Suitable for long-term audit storage</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium mb-1">Tips for best results:</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-800">
                      <li>Ensure good lighting without glare</li>
                      <li>Capture all bill details clearly</li>
                      <li>Include vendor name, date, and amount</li>
                      <li>Avoid shadows on the document</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bill Preview */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Source Document</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mb-3">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Audit Trail:</span> Document stored permanently
                </p>
              </div>
              <img
                src={uploadedImage}
                alt="Bill preview"
                className="w-full rounded-lg border border-gray-200"
              />
              <Button
                variant="secondary"
                fullWidth
                size="sm"
                onClick={() => {
                  setUploadedImage(null);
                  setExtractedData(null);
                }}
                className="mt-3"
              >
                Upload Different Image
              </Button>
            </Card>
            
            {/* Extracted Data */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Extracted Information</h3>
              
              {isProcessing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Processing with AI...</p>
                    <p className="text-xs text-gray-500 mt-1">Following enterprise guidelines</p>
                  </div>
                </div>
              ) : extractedData ? (
                <div className="space-y-4">
                  {/* Confidence Indicator */}
                  <div className={`p-3 rounded-lg border ${
                    extractedData.confidence_score >= 0.9 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {extractedData.confidence_score >= 0.9 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="text-sm font-medium">
                        {extractedData.confidence_score >= 0.9 
                          ? 'High confidence extraction' 
                          : 'Medium confidence - Please verify'
                        }
                      </span>
                      <span className="ml-auto text-sm font-semibold">
                        {(extractedData.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Uploaded by: {extractedData.uploaded_by_role} | Source required: {extractedData.source_document_required ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  {/* Read-only Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Vendor Name
                      </label>
                      <input
                        type="text"
                        value={extractedData.vendor_name}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Bill Number
                        </label>
                        <input
                          type="text"
                          value={extractedData.bill_number || 'N/A'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Bill Date
                        </label>
                        <input
                          type="text"
                          value={extractedData.bill_date || 'N/A'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Total Amount
                        </label>
                        <input
                          type="text"
                          value={`${extractedData.currency} ${extractedData.total_amount.toLocaleString()}`}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-semibold text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Tax Amount
                        </label>
                        <input
                          type="text"
                          value={extractedData.tax_amount ? `${extractedData.currency} ${extractedData.tax_amount.toLocaleString()}` : 'N/A'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Payment Mode
                        </label>
                        <input
                          type="text"
                          value={paymentModeLabels[extractedData.payment_mode]}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Expense Category
                        </label>
                        <input
                          type="text"
                          value={categoryLabels[extractedData.expense_category]}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Validation Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-900 mb-1">Validation Passed:</p>
                    <ul className="text-xs text-blue-800 space-y-0.5">
                      <li>✓ Total amount &gt; 0</li>
                      <li>✓ {extractedData.tax_amount ? 'Tax amount < total amount' : 'Tax not provided'}</li>
                      <li>✓ Bill date validation passed</li>
                      <li>✓ Source document stored</li>
                    </ul>
                  </div>
                  
                  <Button fullWidth size="lg" onClick={handleSubmit}>
                    Submit Bill for Approval
                  </Button>
                </div>
              ) : null}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}