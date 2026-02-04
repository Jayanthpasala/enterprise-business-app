import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { OutletSelection } from './screens/OutletSelection';
import { ManagerDashboard } from './screens/ManagerDashboard';
import { CalendarView } from './screens/CalendarView';
import { DailyDetails } from './screens/DailyDetails';
import { SalesEntry } from './screens/SalesEntry';
import { VendorDashboard } from './screens/VendorDashboard';
import { VendorBillUpload } from './screens/VendorBillUpload';
import { BillReview } from './screens/BillReview';
import { Toast } from './components/Toast';

type Screen =
  | 'outletSelection'
  | 'dashboard'
  | 'calendar'
  | 'dailyDetails'
  | 'salesEntry'
  | 'vendorDashboard'
  | 'vendorUpload'
  | 'billReview';

type UserRole = 'manager' | 'vendor' | null;

interface ToastType {
  message: string;
  type: 'success' | 'error' | 'warning';
}

function AuthenticatedApp() {
  const { currentUser } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('outletSelection');
  const [userRole, setUserRole] = useState<UserRole>('manager'); // Default to manager for now
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
  };

  const handleOutletSelect = (outletId: string) => {
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleSalesEntrySuccess = () => {
    showToast('Sales entry saved successfully!', 'success');
    setCurrentScreen('dashboard');
  };

  const handleBillUploadSuccess = () => {
    showToast('Bill submitted for approval!', 'success');
    setCurrentScreen('vendorDashboard');
  };

  const handleBillApprove = () => {
    showToast('Bill approved successfully!', 'success');
    setCurrentScreen('dashboard');
  };

  const handleBillReject = () => {
    showToast('Bill rejected. Vendor will be notified.', 'warning');
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'outletSelection' && (
        <OutletSelection onSelect={handleOutletSelect} />
      )}

      {currentScreen === 'dashboard' && (
        <ManagerDashboard onNavigate={handleNavigate} />
      )}

      {currentScreen === 'calendar' && (
        <CalendarView onNavigate={handleNavigate} />
      )}

      {currentScreen === 'dailyDetails' && (
        <DailyDetails onNavigate={handleNavigate} />
      )}

      {currentScreen === 'salesEntry' && (
        <SalesEntry onNavigate={handleNavigate} onSuccess={handleSalesEntrySuccess} />
      )}

      {currentScreen === 'vendorDashboard' && (
        <VendorDashboard onNavigate={handleNavigate} />
      )}

      {currentScreen === 'vendorUpload' && (
        <VendorBillUpload onNavigate={handleNavigate} onSuccess={handleBillUploadSuccess} />
      )}

      {currentScreen === 'billReview' && (
        <BillReview
          onNavigate={handleNavigate}
          onApprove={handleBillApprove}
          onReject={handleBillReject}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function UnauthenticatedApp() {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return <Signup onSwitchToLogin={() => setShowSignup(false)} />;
  }

  return <Login onSwitchToSignup={() => setShowSignup(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
