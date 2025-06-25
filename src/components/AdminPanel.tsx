import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Loader, CheckCircle, XCircle, RefreshCw, PieChart, Users, Clock, Package, Boxes, RotateCcw, Search, ChevronDown, ChevronUp, Download, FileSpreadsheet, Database, Trash2, ChevronLeft, ChevronRight, DollarSign, TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import NotificationBell from './NotificationBell';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AnalyticsDashboard from './AnalyticsDashboard';
import CMSManager from './CMSManager';
import Papa from 'papaparse';

interface ContactForm {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  package_choice: string;
  status: string;
}

interface Statistics {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  basicPackages: number;
  premiumPackages: number;
}

interface SortConfig {
  key: keyof ContactForm;
  direction: 'asc' | 'desc';
}

const ITEMS_PER_PAGE = 10;

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cms'>('dashboard');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'created_at', 
    direction: 'desc' 
  });
  const [stats, setStats] = useState<Statistics>({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    basicPackages: 0,
    premiumPackages: 0
  });

  const calculateStatistics = (forms: ContactForm[]) => {
    const newStats = {
      total: forms.length,
      completed: forms.filter(f => f.status === 'completed').length,
      pending: forms.filter(f => f.status === 'pending').length,
      cancelled: forms.filter(f => f.status === 'cancelled').length,
      basicPackages: forms.filter(f => f.package_choice === 'basic').length,
      premiumPackages: forms.filter(f => f.package_choice === 'premium').length
    };
    setStats(newStats);
  };

  const fetchForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
      calculateStatistics(data || []);
    } catch (err) {
      setError('אירעה שגיאה בטעינת הנתונים');
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      setError(null);

      const { data: contactForms, error: formsError } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (formsError) throw formsError;

      const backup = {
        timestamp: new Date().toISOString(),
        data: {
          contact_forms: contactForms
        }
      };

      const backupBlob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json'
      });

      const url = window.URL.createObjectURL(backupBlob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm', { locale: he });
      
      link.href = url;
      link.download = `launchsite-backup-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error creating backup:', err);
      setError('אירעה שגיאה ביצירת הגיבוי');
    } finally {
      setIsBackingUp(false);
    }
  };

  const updateStatus = async (id: number, status: string | null) => {
    try {
      const { error } = await supabase
        .from('contact_forms')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchForms();
    } catch (err) {
      setError('אירעה שגיאה בעדכון הסטטוס');
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async () => {
    if (!formToDelete) return;

    try {
      const { error } = await supabase
        .from('contact_forms')
        .delete()
        .eq('id', formToDelete);

      if (error) throw error;
      await fetchForms();
      setShowDeleteModal(false);
      setFormToDelete(null);
    } catch (err) {
      setError('אירעה שגיאה במחיקת הפנייה');
      console.error('Error deleting form:', err);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, 'dd/MM/yyyy', { locale: he }),
      time: format(date, 'HH:mm', { locale: he })
    };
  };

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      const exportData = filteredForms.map(form => {
        const { date, time } = formatDateTime(form.created_at);
        return {
          'תאריך': date,
          'שעה': time,
          'שם מלא': form.full_name,
          'טלפון': form.phone,
          'אימייל': form.email,
          'חבילה': form.package_choice === 'premium' ? 'פרימיום' : 'בסיסית',
          'סטטוס': form.status === 'completed' ? 'טופל' :
                   form.status === 'pending' ? 'בטיפול' :
                   form.status === 'cancelled' ? 'בוטל' : 'חדש'
        };
      });

      const csv = Papa.unparse(exportData, {
        header: true,
      });
      
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm', { locale: he });
      
      link.href = url;
      link.download = `פניות-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      setError('אירעה שגיאה בייצוא הנתונים');
      console.error('Error exporting data:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSort = (key: keyof ContactForm) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedForms = [...forms].sort((a, b) => {
    if (sortConfig.key === 'created_at') {
      return sortConfig.direction === 'asc'
        ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
        : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime();
    }
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredForms = sortedForms.filter(form => 
    form.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSortIcon = (key: keyof ContactForm) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const tabs = [
    { key: 'dashboard', label: 'דשבורד', icon: <PieChart size={20} /> },
    { key: 'cms', label: 'ניהול תוכן', icon: <SettingsIcon size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">פאנל ניהול LaunchSite</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <Link
              to="/admin/deals"
              className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <DollarSign size={20} />
              <span>ניהול עסקאות</span>
            </Link>
            <NotificationBell />
            <button
              onClick={handleSignOut}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-500 p-2 rounded-lg transition-colors"
              title="התנתק"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-secondary font-bold'
                  : 'bg-secondary-light hover:bg-gray-700 text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-secondary-light p-6 rounded-xl border border-gray-800 hover:border-primary transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-primary" size={24} />
                  <h3 className="text-lg font-semibold">סה"כ פניות</h3>
                </div>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              
              <div className="bg-secondary-light p-6 rounded-xl border border-gray-800 hover:border-green-500 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="text-green-500" size={24} />
                  <h3 className="text-lg font-semibold">טופלו</h3>
                </div>
                <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
              </div>
              
              <div className="bg-secondary-light p-6 rounded-xl border border-gray-800 hover:border-yellow-500 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="text-yellow-500" size={24} />
                  <h3 className="text-lg font-semibold">בטיפול</h3>
                </div>
                <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
              </div>

              <div className="bg-secondary-light p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="text-blue-500" size={24} />
                  <h3 className="text-lg font-semibold">סה"כ חבילות</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Basic</p>
                    <p className="text-xl font-bold text-green-500">{stats.basicPackages}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Premium</p>
                    <p className="text-xl font-bold text-primary">{stats.premiumPackages}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="חיפוש..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 bg-secondary-light border border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  disabled={isExporting || filteredForms.length === 0}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-500 p-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="ייצא לאקסל"
                >
                  {isExporting ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <FileSpreadsheet size={20} />
                  )}
                </button>
                <button
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 p-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="גיבוי מערכת"
                >
                  {isBackingUp ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Database size={20} />
                  )}
                </button>
                <button
                  onClick={fetchForms}
                  className="bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-lg transition-colors"
                  title="רענן נתונים"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin" size={32} />
              </div>
            ) : (
              <div className="bg-secondary-light rounded-xl border border-gray-800 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th 
                          className="p-4 text-right cursor-pointer hover:bg-secondary/70"
                          onClick={() => handleSort('created_at')}
                        >
                          <div className="flex items-center gap-2">
                            תאריך ושעה
                            {getSortIcon('created_at')}
                          </div>
                        </th>
                        <th 
                          className="p-4 text-right cursor-pointer hover:bg-secondary/70"
                          onClick={() => handleSort('full_name')}
                        >
                          <div className="flex items-center gap-2">
                            שם מלא
                            {getSortIcon('full_name')}
                          </div>
                        </th>
                        <th className="p-4 text-right">טלפון</th>
                        <th className="p-4 text-right">אימייל</th>
                        <th 
                          className="p-4 text-right cursor-pointer hover:bg-secondary/70"
                          onClick={() => handleSort('package_choice')}
                        >
                          <div className="flex items-center gap-2">
                            חבילה
                            {getSortIcon('package_choice')}
                          </div>
                        </th>
                        <th 
                          className="p-4 text-right cursor-pointer hover:bg-secondary/70"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            סטטוס
                            {getSortIcon('status')}
                          </div>
                        </th>
                        <th className="p-4 text-right">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedForms.map((form) => {
                        const { date, time } = formatDateTime(form.created_at);
                        return (
                          <tr 
                            key={form.id}
                            id={`form-${form.id}`}
                            className="border-t border-gray-800 hover:bg-secondary/20"
                          >
                            <td className="p-4">
                              <div>{date}</div>
                              <div className="text-sm text-gray-400">{time}</div>
                            </td>
                            <td className="p-4">{form.full_name}</td>
                            <td className="p-4">
                              <a
                                href={`tel:${form.phone}`}
                                className="text-primary hover:underline"
                              >
                                {form.phone}
                              </a>
                            </td>
                            <td className="p-4">
                              <a
                                href={`mailto:${form.email}`}
                                className="text-primary hover:underline"
                              >
                                {form.email}
                              </a>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                form.package_choice === 'premium' 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-green-500/20 text-green-500'
                              }`}>
                                {form.package_choice}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                form.status === 'completed'
                                  ? 'bg-green-500/20 text-green-500'
                                  : form.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-500'
                                  : form.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-500'
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                {form.status === 'completed' ? 'טופל' :
                                 form.status === 'pending' ? 'בטיפול' :
                                 form.status === 'cancelled' ? 'בוטל' : 'חדש'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateStatus(form.id, 'completed')}
                                  className="text-green-500 hover:text-green-400 transition-colors"
                                  title="סמן כטופל"
                                >
                                  <CheckCircle size={20} />
                                </button>
                                <button
                                  onClick={() => updateStatus(form.id, 'pending')}
                                  className="text-yellow-500 hover:text-yellow-400 transition-colors"
                                  title="סמן כבטיפול"
                                >
                                  <RefreshCw size={20} />
                                </button>
                                <button
                                  onClick={() => updateStatus(form.id, 'cancelled')}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                  title="סמן כבוטל"
                                >
                                  <XCircle size={20} />
                                </button>
                                <button
                                  onClick={() => updateStatus(form.id, null)}
                                  className="text-blue-500 hover:text-blue-400 transition-colors"
                                  title="החזר לסטטוס חדש"
                                >
                                  <RotateCcw size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    setFormToDelete(form.id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-red-500 hover:text-red-400 transition-colors"
                                  title="מחק פנייה"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-gray-800">
                    <div className="text-sm text-gray-400">
                      עמוד {currentPage} מתוך {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-secondary/50 hover:bg-secondary text-white px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <ChevronRight size={16} />
                        הקודם
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-secondary/50 hover:bg-secondary text-white px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        הבא
                        <ChevronLeft size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Dashboard */}
            <AnalyticsDashboard />
          </>
        )}

        {activeTab === 'cms' && <CMSManager />}
      </div>

      {/* Copyright Footer */}
      <footer className="mt-8 py-4 text-center text-gray-400 border-t border-gray-800">
        <p>© {new Date().getFullYear()} LaunchSite. כל הזכויות שמורות.</p>
      </footer>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFormToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminPanel;