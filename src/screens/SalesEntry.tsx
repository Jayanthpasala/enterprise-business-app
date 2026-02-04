import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ArrowLeft, Calendar, Store, DollarSign, CreditCard, Smartphone, Banknote, Upload, Camera, CheckCircle, AlertCircle, FileText, Receipt } from 'lucide-react';
import { extractSalesDataFromImage } from '../lib/gemini';

interface SalesEntryProps {
    onNavigate: (screen: string) => void;
    onSuccess: () => void;
}

export function SalesEntry({ onNavigate, onSuccess }: SalesEntryProps) {
    const [entryMode, setEntryMode] = useState<'manual' | 'ai'>('manual');

    // Separate states for two mandatory documents
    const [itemsDocument, setItemsDocument] = useState<{
        file: File | null;
        preview: string | null;
    }>({ file: null, preview: null });

    const [paymentDocument, setPaymentDocument] = useState<{
        file: File | null;
        preview: string | null;
    }>({ file: null, preview: null });

    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        outlet: '',
        date: new Date().toISOString().split('T')[0],
        totalSales: '',
        cash: '',
        upi: '',
        card: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [aiConfidence, setAiConfidence] = useState<number | null>(null);

    const handleItemsDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setItemsDocument({ file, preview: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaymentDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentDocument({ file, preview: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const processDocuments = async () => {
        if (!itemsDocument.file || !paymentDocument.file) {
            alert('⚠️ Both documents are required!\\n\\n1. Item-wise sales document\\n2. Payment breakdown document');
            return;
        }

        setIsProcessing(true);
        setAiConfidence(null);

        try {
            console.log('Processing items document...');
            const itemsData = await extractSalesDataFromImage(itemsDocument.file);

            console.log('Processing payment document...');
            const paymentData = await extractSalesDataFromImage(paymentDocument.file);

            if (itemsData && paymentData) {
                const calculatedTotal = itemsData.items?.reduce((sum: number, item: any) =>
                    sum + (item.price * item.quantity), 0) || itemsData.totalAmount;

                const cashAmount = paymentData.paymentMethod === 'Cash' ? paymentData.totalAmount : 0;
                const upiAmount = paymentData.paymentMethod === 'UPI' ? paymentData.totalAmount : 0;
                const cardAmount = paymentData.paymentMethod === 'Card' ? paymentData.totalAmount : 0;

                setFormData({
                    ...formData,
                    date: itemsData.date || paymentData.date || formData.date,
                    totalSales: calculatedTotal.toString(),
                    cash: cashAmount.toString(),
                    upi: upiAmount.toString(),
                    card: cardAmount.toString(),
                });

                const confidence = (itemsData.totalAmount > 0 && paymentData.totalAmount > 0) ? 0.92 : 0.75;
                setAiConfidence(confidence);
            } else {
                alert('❌ Could not extract data from one or both documents.\\n\\nPlease:\\n- Ensure images are clear\\n- Try again or use manual entry');
                setAiConfidence(0.5);
            }
        } catch (error) {
            console.error('Gemini extraction error:', error);
            alert('❌ AI extraction failed. Please use manual entry.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: any = {};
        const total = parseFloat(formData.totalSales) || 0;
        const cash = parseFloat(formData.cash) || 0;
        const upi = parseFloat(formData.upi) || 0;
        const card = parseFloat(formData.card) || 0;
        const paymentTotal = cash + upi + card;

        if (!formData.totalSales) {
            newErrors.totalSales = 'Total sales is required';
        }

        if (Math.abs(total - paymentTotal) > 0.01) {
            newErrors.payment = `Payment breakdown (₹${paymentTotal.toLocaleString()}) must equal total sales (₹${total.toLocaleString()})`;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSuccess();
        }
    };

    const totalPayments = (parseFloat(formData.cash) || 0) +
        (parseFloat(formData.upi) || 0) +
        (parseFloat(formData.card) || 0);

    const bothDocumentsUploaded = itemsDocument.file && paymentDocument.file;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Add Sales Entry</h1>
                            <p className="text-sm text-gray-600">Record daily sales data</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="mb-6 flex gap-3">
                    <Button
                        variant={entryMode === 'manual' ? 'primary' : 'secondary'}
                        onClick={() => {
                            setEntryMode('manual');
                            setItemsDocument({ file: null, preview: null });
                            setPaymentDocument({ file: null, preview: null });
                            setAiConfidence(null);
                        }}
                        fullWidth
                    >
                        Manual Entry
                    </Button>
                    <Button
                        variant={entryMode === 'ai' ? 'primary' : 'secondary'}
                        onClick={() => setEntryMode('ai')}
                        fullWidth
                    >
                        <Upload className="w-5 h-5" />
                        AI Upload (2 Documents)
                    </Button>
                </div>

                {entryMode === 'ai' && !aiConfidence ? (
                    <div className="space-y-6">
                        <Card className="p-6 bg-blue-50 border-blue-200">
                            <div className="flex gap-3">
                                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">Two Documents Required</h3>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                        <li><strong>Item-wise Sales Document</strong> - Detailed product breakdown</li>
                                        <li><strong>Payment Breakdown Document</strong> - Cash/Card/UPI segmentation</li>
                                    </ol>
                                    <p className="text-xs text-blue-700 mt-2">📎 Accepts: Images, PDF, Excel (.xlsx, .xls, .csv)</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">1. Item-wise Sales Document</h3>
                                    <p className="text-sm text-gray-600">Upload detailed sales breakdown by product</p>
                                </div>
                            </div>

                            {!itemsDocument.file ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleItemsDocumentUpload}
                                            className="hidden"
                                        />
                                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-center">
                                            <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="font-medium text-gray-900">Take Photo</p>
                                            <p className="text-sm text-gray-500 mt-1">Use camera</p>
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf,.xlsx,.xls,.csv"
                                            onChange={handleItemsDocumentUpload}
                                            className="hidden"
                                        />
                                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-center">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="font-medium text-gray-900">Upload File</p>
                                            <p className="text-sm text-gray-500 mt-1">From gallery</p>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <img src={itemsDocument.preview!} alt="Items document" className="w-full rounded-lg border mb-3 max-h-48 object-cover" />
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">Document 1 uploaded</span>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Receipt className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">2. Payment Breakdown Document</h3>
                                    <p className="text-sm text-gray-600">Upload Cash/Card/UPI breakdown</p>
                                </div>
                            </div>

                            {!paymentDocument.file ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf,.xlsx,.xls,.csv"
                                            capture="environment"
                                            onChange={handlePaymentDocumentUpload}
                                            className="hidden"
                                        />
                                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
                                            <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="font-medium text-gray-900">Take Photo</p>
                                            <p className="text-sm text-gray-500 mt-1">Use camera</p>
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf,.xlsx,.xls,.csv"
                                            onChange={handlePaymentDocumentUpload}
                                            className="hidden"
                                        />
                                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="font-medium text-gray-900">Upload File</p>
                                            <p className="text-sm text-gray-500 mt-1">From gallery</p>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <img src={paymentDocument.preview!} alt="Payment document" className="w-full rounded-lg border mb-3 max-h-48 object-cover" />
                                    <div className="flex items-center gap-2 text-purple-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">Document 2 uploaded</span>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {bothDocumentsUploaded && (
                            <Button
                                onClick={processDocuments}
                                disabled={isProcessing}
                                fullWidth
                                size="lg"
                            >
                                {isProcessing ? 'Processing Documents...' : '✨ Extract Data with AI'}
                            </Button>
                        )}
                    </div>
                ) : entryMode === 'ai' && aiConfidence ? (
                    <div className="space-y-6">
                        <div className={`p-4 rounded-lg border ${aiConfidence >= 0.9
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'
                            }`}>
                            <div className="flex items-center gap-2">
                                {aiConfidence >= 0.9 ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                )}
                                <span className="text-sm font-medium">
                                    {aiConfidence >= 0.9
                                        ? 'High confidence extraction'
                                        : 'Medium confidence - Please verify data'}
                                </span>
                                <span className="ml-auto text-sm font-semibold">
                                    {(aiConfidence * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>

                        <Card className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Store className="inline w-4 h-4 mr-1" />
                                        Outlet
                                    </label>
                                    <select
                                        value={formData.outlet}
                                        onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option>Downtown Branch</option>
                                        <option>Airport Road</option>
                                        <option>Whitefield</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DollarSign className="inline w-4 h-4 mr-1" />
                                        Total Sales *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={formData.totalSales}
                                            onChange={(e) => setFormData({ ...formData, totalSales: e.target.value })}
                                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg ${errors.totalSales ? 'border-red-300' : 'border-blue-300 bg-blue-50'
                                                }`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.totalSales && <p className="mt-1 text-sm text-red-600">{errors.totalSales}</p>}
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-medium text-gray-900 mb-4">Payment Breakdown</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Banknote className="inline w-4 h-4 mr-1" />
                                                Cash
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    value={formData.cash}
                                                    onChange={(e) => setFormData({ ...formData, cash: e.target.value })}
                                                    className="w-full pl-8 pr-4 py-2.5 border border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Smartphone className="inline w-4 h-4 mr-1" />
                                                UPI
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    value={formData.upi}
                                                    onChange={(e) => setFormData({ ...formData, upi: e.target.value })}
                                                    className="w-full pl-8 pr-4 py-2.5 border border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <CreditCard className="inline w-4 h-4 mr-1" />
                                                Card
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    value={formData.card}
                                                    onChange={(e) => setFormData({ ...formData, card: e.target.value })}
                                                    className="w-full pl-8 pr-4 py-2.5 border border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Payments:</span>
                                            <span className="font-semibold text-gray-900">₹{totalPayments.toLocaleString()}</span>
                                        </div>
                                        {formData.totalSales && Math.abs(parseFloat(formData.totalSales) - totalPayments) > 0.01 && (
                                            <p className="text-sm text-yellow-600 mt-2">
                                                Difference: ₹{Math.abs(parseFloat(formData.totalSales) - totalPayments).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    {errors.payment && <p className="mt-2 text-sm text-red-600">{errors.payment}</p>}
                                </div>

                                <Button type="submit" fullWidth size="lg">
                                    Save Sales Entry
                                </Button>
                            </form>
                        </Card>
                    </div>
                ) : (
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Store className="inline w-4 h-4 mr-1" />
                                    Outlet
                                </label>
                                <select
                                    value={formData.outlet}
                                    onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Outlet</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <DollarSign className="inline w-4 h-4 mr-1" />
                                    Total Sales *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        value={formData.totalSales}
                                        onChange={(e) => setFormData({ ...formData, totalSales: e.target.value })}
                                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg ${errors.totalSales ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.totalSales && <p className="mt-1 text-sm text-red-600">{errors.totalSales}</p>}
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-medium text-gray-900 mb-4">Payment Breakdown</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Banknote className="inline w-4 h-4 mr-1" />
                                            Cash
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                value={formData.cash}
                                                onChange={(e) => setFormData({ ...formData, cash: e.target.value })}
                                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Smartphone className="inline w-4 h-4 mr-1" />
                                            UPI
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                value={formData.upi}
                                                onChange={(e) => setFormData({ ...formData, upi: e.target.value })}
                                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard className="inline w-4 h-4 mr-1" />
                                            Card
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                            <input
                                                type="number"
                                                value={formData.card}
                                                onChange={(e) => setFormData({ ...formData, card: e.target.value })}
                                                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Payments:</span>
                                        <span className="font-semibold text-gray-900">₹{totalPayments.toLocaleString()}</span>
                                    </div>
                                    {formData.totalSales && Math.abs(parseFloat(formData.totalSales) - totalPayments) > 0.01 && (
                                        <p className="text-sm text-yellow-600 mt-2">
                                            Difference: ₹{Math.abs(parseFloat(formData.totalSales) - totalPayments).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {errors.payment && <p className="mt-2 text-sm text-red-600">{errors.payment}</p>}
                            </div>

                            <Button type="submit" fullWidth size="lg">
                                Save Sales Entry
                            </Button>
                        </form>
                    </Card>
                )}
            </div>
        </div>
    );
}
