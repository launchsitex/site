import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  LogOut,
  Save,
  X,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Package,
  CreditCard,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Home
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Papa from 'papaparse';

interface Deal {
  id: string;
  client_name: string;
  phone: string;
  email: string;
  source: string;
  package_type: string;
  amount_paid: number;
  payment_method: string;
  status: string;
  closing_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface DealFormData {
  client_name: string;
  phone: string;
  email: string;
  source: string;
  package_type: string;
  amount_paid: string;
  payment_method: string;
  status: string;
  closing_date: string;
  notes: string;
}

const DealsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<DealFormData>({
    client_name: '',
    phone: '',
    email: '',
    source: '',
    package_type: '',
    amount_paid: '',
    payment_method: '',
    status: 'פתוחה',
    closing_date: '',
    notes: ''
  });

  const sources = ['פייסבוק', 'אינסטגרם', 'אתר', 'המלצה', 'אחר'];
  const packageTypes = ['בסיסית', 'פרימיום', 'מותאמת אישית'];
  const paymentMethods = ['מזומן', 'אשראי', 'ביט', 'העברה בנקאית'];
  const statuses = ['פתוחה', 'הושלמה', 'לא נסגרה'];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setDeals(data || []);
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(`אירעה שגיאה בטעינת העסקאות: ${err.message || 'שגיאה לא ידועה'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      phone: '',
      email: '',
      source: '',
      package_type: '',
      amount_paid: '',
      payment_method: '',
      status: 'פתוחה',
      closing_date: '',
      notes: ''
    });
    setEditingDeal(null);
    setShowForm(false);
    setError(null);
  };

  const validateForm = () => {
    if (!formData.client_name.trim()) {
      setError('שם הלקוח הוא שדה חובה');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('טלפון הוא שדה חובה');
      return false;
    }
    if (!formData.email.trim()) {
      setError('אימייל הוא שדה חובה');
      return false;
    }
    if (!formData.source) {
      setError('מקור הגעה הוא שדה חובה');
      return false;
    }
    if (!formData.package_type) {
      setError('חבילה היא שדה חובה');
      return false;
    }
    if (!formData.status) {
      setError('סטטוס הוא שדה חובה');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('כתובת אימייל לא תקינה');
      return false;
    }
    
    // Validate phone format (Israeli phone number)
    const phoneRegex = /^0\d{8,9}$/;
    if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
      setError('מספר טלפון לא תקין');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const dealData = {
        client_name: formData.client_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        source: formData.source,
        package_type: formData.package_type,
        amount_paid: formData.amount_paid ? parseFloat(formData.amount_paid) : null,
        payment_method: formData.payment_method || null,
        status: formData.status,
        closing_date: formData.closing_date || null,
        notes: formData.notes.trim() || null
      };

      console.log('Saving deal data:', dealData);

      if (editingDeal) {
        const { error } = await supabase
          .from('deals')
          .update(dealData)
          .eq('id', editingDeal.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from('deals')
          .insert([dealData])
          .select();
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Deal saved successfully:', data);
      }

      await fetchDeals();
      resetForm();
    } catch (err: any) {
      console.error('Error saving deal:', err);
      setError(`אירעה שגיאה בשמירת העסקה: ${err.message || 'שגיאה לא ידועה'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (deal: Deal) => {
    setFormData({
      client_name: deal.client_name,
      phone: deal.phone,
      email: deal.email,
      source: deal.source,
      package_type: deal.package_type,
      amount_paid: deal.amount_paid?.toString() || '',
      payment_method: deal.payment_method || '',
      status: deal.status,
      closing_date: deal.closing_date || '',
      notes: deal.notes || ''
    });
    setEditingDeal(deal);
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק עסקה זו?')) return;

    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDeals();
    } catch (err: any) {
      console.error('Error deleting deal:', err);
      setError(`אירעה שגיאה במחיקת העסקה: ${err.message || 'שגיאה לא ידועה'}`);
    }
  };

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      const exportData = filteredDeals.map(deal => ({
        'תאריך יצירה': format(new Date(deal.created_at), 'dd/MM/yyyy', { locale: he }),
        'שם הלקוח': deal.client_name,
        'טלפון': deal.phone,
        'אימייל': deal.email,
        'מקור הגעה': deal.source,
        'חבילה': deal.package_type,
        'סכום ששולם': deal.amount_paid || '',
        'אמצעי תשלום': deal.payment_method || '',
        'סטטוס': deal.status,
        'תאריך סגירה': deal.closing_date ? format(new Date(deal.closing_date), 'dd/MM/yyyy', { locale: he }) : '',
        'הערות': deal.notes || ''
      }));

      const csv = Papa.unparse(exportData, { header: true });
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm', { locale: he });
      
      link.href = url;
      link.download = `עסקאות-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Error exporting data:', err);
      setError(`אירעה שגיאה בייצוא הנתונים: ${err.message || 'שגיאה לא ידועה'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.phone.includes(searchTerm);
    
    const matchesStatus = !statusFilter || deal.status === statusFilter;
    const matchesPackage = !packageFilter || deal.package_type === packageFilter;
    const matchesSource = !sourceFilter || deal.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesPackage && matchesSource;
  });

  const totalRevenue = deals
    .filter(deal => deal.status === 'הושלמה')
    .reduce((sum, deal) => sum + (deal.amount_paid || 0), 0);

  const completedDeals = deals.filter(deal => deal.status === 'הושלמה').length;
  const openDeals = deals.filter(deal => deal.status === 'פתוחה').length;
  const failedDeals = deals.filter(deal => deal.status === 'לא נסגרה').length;

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchDeals();
    }
  }, [isAuthenticated, authLoading]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-xl">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="bg-secondary-light hover:bg-gray-700 text-white p-2 rounded-lg transition-colors flex items-center gap-2"
              title="חזרה לפאנל הראשי"
            >
              <ArrowRight size={20} />
            </Link>
            <h1 className="text-3xl font-bold">ניהול עסקאות LaunchSite</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary-dark text-secondary font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span>עסקה חדשה</span>
            </button>
            <button
              onClick={exportToCSV}
              disabled={isExporting || filteredDeals.length === 0}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
              <span>ייצא</span>
            </button>
            <button
              onClick={fetchDeals}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw size={20} />
              <span>רענן</span>
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={20} />
              <span>התנתק</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className="text-lg font-semibold">סה"כ הכנסות</h3>
            </div>
            <p className="text-3xl font-bold text-green-500">₪{totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-primary" size={24} />
              <h3 className="text-lg font-semibold">עסקאות שהושלמו</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{completedDeals}</p>
          </div>
          
          <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-yellow-500" size={24} />
              <h3 className="text-lg font-semibold">עסקאות פתוחות</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{openDeals}</p>
          </div>

          <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold">עסקאות שלא נסגרו</h3>
            </div>
            <p className="text-3xl font-bold text-red-500">{failedDeals}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="חיפוש לפי שם, אימייל או טלפון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">כל הסטטוסים</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">כל החבילות</option>
              {packageTypes.map(pkg => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">כל המקורות</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Deals Table */}
        <div className="bg-secondary-light rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="p-4 text-right">תאריך יצירה</th>
                  <th className="p-4 text-right">שם הלקוח</th>
                  <th className="p-4 text-right">טלפון</th>
                  <th className="p-4 text-right">אימייל</th>
                  <th className="p-4 text-right">מקור</th>
                  <th className="p-4 text-right">חבילה</th>
                  <th className="p-4 text-right">סכום</th>
                  <th className="p-4 text-right">תשלום</th>
                  <th className="p-4 text-right">סטטוס</th>
                  <th className="p-4 text-right">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center">
                      <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                      <p>טוען עסקאות...</p>
                    </td>
                  </tr>
                ) : filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-400">
                      לא נמצאו עסקאות
                    </td>
                  </tr>
                ) : (
                  filteredDeals.map((deal) => (
                    <tr key={deal.id} className="border-t border-gray-800 hover:bg-secondary/20">
                      <td className="p-4">
                        {format(new Date(deal.created_at), 'dd/MM/yyyy', { locale: he })}
                      </td>
                      <td className="p-4 font-medium">{deal.client_name}</td>
                      <td className="p-4">
                        <a href={`tel:${deal.phone}`} className="text-primary hover:underline">
                          {deal.phone}
                        </a>
                      </td>
                      <td className="p-4">
                        <a href={`mailto:${deal.email}`} className="text-primary hover:underline">
                          {deal.email}
                        </a>
                      </td>
                      <td className="p-4">{deal.source}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          deal.package_type === 'פרימיום' 
                            ? 'bg-primary/20 text-primary' 
                            : deal.package_type === 'מותאמת אישית'
                            ? 'bg-purple-500/20 text-purple-500'
                            : 'bg-green-500/20 text-green-500'
                        }`}>
                          {deal.package_type}
                        </span>
                      </td>
                      <td className="p-4">
                        {deal.amount_paid ? `₪${deal.amount_paid.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-4">{deal.payment_method || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          deal.status === 'הושלמה'
                            ? 'bg-green-500/20 text-green-500'
                            : deal.status === 'פתוחה'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {deal.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(deal)}
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                            title="ערוך"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                            title="מחק"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Deal Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-secondary-light rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingDeal ? 'עריכת עסקה' : 'עסקה חדשה'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium">
                      <User size={16} className="inline ml-2" />
                      שם הלקוח *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="הכנס שם מלא"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      <Phone size={16} className="inline ml-2" />
                      טלפון *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="050-1234567"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      <Mail size={16} className="inline ml-2" />
                      אימייל *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">מקור הגעה *</label>
                    <select
                      required
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    >
                      <option value="">בחר מקור</option>
                      {sources.map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      <Package size={16} className="inline ml-2" />
                      חבילה *
                    </label>
                    <select
                      required
                      value={formData.package_type}
                      onChange={(e) => setFormData({...formData, package_type: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    >
                      <option value="">בחר חבילה</option>
                      {packageTypes.map(pkg => (
                        <option key={pkg} value={pkg}>{pkg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      <DollarSign size={16} className="inline ml-2" />
                      סכום ששולם
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount_paid}
                      onChange={(e) => setFormData({...formData, amount_paid: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      <CreditCard size={16} className="inline ml-2" />
                      אמצעי תשלום
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    >
                      <option value="">בחר אמצעי תשלום</option>
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">סטטוס העסקה *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      <Calendar size={16} className="inline ml-2" />
                      תאריך סגירה
                    </label>
                    <input
                      type="date"
                      value={formData.closing_date}
                      onChange={(e) => setFormData({...formData, closing_date: e.target.value})}
                      className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    <FileText size={16} className="inline ml-2" />
                    הערות
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-secondary border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="הערות נוספות..."
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary hover:bg-primary-dark text-secondary font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="animate-spin" size={18} />
                        <span>שומר...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>{editingDeal ? 'עדכן' : 'שמור'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Copyright Footer */}
      <footer className="mt-8 py-4 text-center text-gray-400 border-t border-gray-800">
        <p>© {new Date().getFullYear()} LaunchSite. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
};

export default DealsManagement;