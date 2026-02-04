import { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
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
  | 'login'
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [toast, setToast] = useState<ToastType | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
  };
  
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'manager') {
      setCurrentScreen('outletSelection');
    } else {
      setCurrentScreen('vendorDashboard');
    }
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
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
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
