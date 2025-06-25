import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { he } from 'date-fns/locale';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, Sector
} from 'recharts';
import { Download, RefreshCw, Loader } from 'lucide-react';
import Papa from 'papaparse';

interface PageVisit {
  id: string;
  page_id: string;
  visit_time: string;
  source: string;
  user_agent: string;
}

interface DailyVisits {
  date: string;
  visits: number;
}

interface SourceStats {
  source: string;
  count: number;
  percentage: number;
  fullSource?: string;
}

// Enhanced color palette with better contrast
const COLORS = [
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#f59e0b', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#c1ff00', // Lime
  '#f43f5e', // Red
  '#14b8a6', // Teal
  '#a855f7', // Violet
  '#84cc16', // Light Green
  '#eab308'  // Yellow
];

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill="#fff"
        className="text-lg font-bold"
      >
        {payload.fullSource || payload.source}
      </text>
      <text
        x={cx}
        y={cy + 15}
        dy={8}
        textAnchor="middle"
        fill="#fff"
        className="text-base"
      >
        {`${value} ביקורים (${(percent * 100).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary-light p-4 rounded-lg border border-gray-700 shadow-lg">
        <p className="font-bold mb-1">{payload[0].payload.fullSource || payload[0].payload.source}</p>
        <p className="text-sm text-gray-300">
          ביקורים: {payload[0].value}
        </p>
        <p className="text-sm text-gray-300">
          אחוז: {(payload[0].percent * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-right mt-4">
      {payload.map((entry: any, index: number) => (
        <div 
          key={`legend-${index}`}
          className="flex items-center gap-2 bg-secondary/30 p-2 rounded-lg"
          title={entry.payload.fullSource}
        >
          <div 
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm truncate">
            {entry.value} ({(entry.payload.percentage).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [dailyVisits, setDailyVisits] = useState<DailyVisits[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const calculatePercentages = (data: { source: string; count: number }[]) => {
    const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
    
    if (total === 0) {
      return data.map(item => ({
        ...item,
        percentage: 0
      }));
    }

    return data.map(item => ({
      ...item,
      percentage: ((item.count || 0) / total) * 100
    }));
  };

  const normalizeSourceName = (source: string): string => {
    if (!source) return 'ישיר';
    
    // Common sources mapping
    const sourceMap: { [key: string]: string } = {
      'google': 'Google',
      'facebook.com': 'Facebook',
      'instagram.com': 'Instagram',
      'linkedin.com': 'LinkedIn',
      'twitter.com': 'Twitter',
      'bing': 'Bing',
      't.co': 'Twitter',
      'fb.com': 'Facebook',
      'direct': 'ישיר'
    };

    // Check if we have a direct mapping
    for (const [key, value] of Object.entries(sourceMap)) {
      if (source.toLowerCase().includes(key)) {
        return value;
      }
    }

    // If it's a URL, try to clean it up
    if (source.includes('.')) {
      try {
        const url = new URL(source.startsWith('http') ? source : `http://${source}`);
        return url.hostname.replace('www.', '');
      } catch {
        return source;
      }
    }

    return source;
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const { data: visits, error: visitsError } = await supabase
        .from('page_visits')
        .select('*')
        .gte('visit_time', thirtyDaysAgo.toISOString());

      if (visitsError) throw visitsError;

      const dailyStats = new Map<string, number>();
      const sourceCount = new Map<string, number>();

      const visitsArray = Array.isArray(visits) ? visits : [];

      visitsArray.forEach((visit: PageVisit) => {
        const date = format(new Date(visit.visit_time), 'yyyy-MM-dd');
        dailyStats.set(date, (dailyStats.get(date) || 0) + 1);
        
        const normalizedSource = normalizeSourceName(visit.source || 'ישיר');
        sourceCount.set(normalizedSource, (sourceCount.get(normalizedSource) || 0) + 1);
      });

      const dailyData = Array.from(dailyStats.entries())
        .map(([date, visits]) => ({
          date: format(new Date(date), 'dd/MM', { locale: he }),
          visits: visits || 0
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const sourceData = Array.from(sourceCount.entries())
        .map(([source, count]) => ({
          source: source.length > 15 ? `${source.substring(0, 12)}...` : source,
          fullSource: source,
          count: count || 0
        }))
        .sort((a, b) => b.count - a.count);

      const sourceDataWithPercentages = calculatePercentages(sourceData);

      setDailyVisits(dailyData);
      setSourceStats(sourceDataWithPercentages);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('אירעה שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setIsExporting(true);

      const { data: visits, error: visitsError } = await supabase
        .from('page_visits')
        .select('*')
        .order('visit_time', { ascending: false });

      if (visitsError) throw visitsError;

      const exportData = (visits || []).map(visit => ({
        'תאריך': format(new Date(visit.visit_time), 'dd/MM/yyyy', { locale: he }),
        'שעה': format(new Date(visit.visit_time), 'HH:mm', { locale: he }),
        'דף': visit.page_id || '',
        'מקור': normalizeSourceName(visit.source || 'ישיר'),
        'דפדפן': visit.user_agent || ''
      }));

      const csv = Papa.unparse(exportData, {
        header: true
      });
      
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm', { locale: he });
      
      link.href = url;
      link.download = `analytics-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('אירעה שגיאה בייצוא הנתונים');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_visits'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin\" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (sourceStats.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">אין נתונים זמינים להצגה</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניתוח תנועה</h2>
        <div className="flex gap-4">
          <button
            onClick={exportToCSV}
            disabled={isExporting}
            className="bg-green-500/20 hover:bg-green-500/30 text-green-500 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isExporting ? (
              <Loader className="animate-spin\" size={20} />
            ) : (
              <Download size={20} />
            )}
            <span>ייצא נתונים</span>
          </button>
          <button
            onClick={fetchAnalytics}
            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>רענן</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Daily Visits Chart */}
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-6">כניסות יומיות</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="date" 
                  stroke="#fff"
                  tick={{ fill: '#fff' }}
                />
                <YAxis 
                  stroke="#fff"
                  tick={{ fill: '#fff' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#c1ff00" 
                  name="כניסות"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Chart */}
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-6">מקורות תנועה</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceStats}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {sourceStats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#141414"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  content={<CustomLegend />}
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
          <h4 className="text-sm text-gray-400 mb-2">סה"כ כניסות</h4>
          <p className="text-2xl font-bold">
            {dailyVisits.reduce((sum, day) => sum + (day.visits || 0), 0)}
          </p>
        </div>
        
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
          <h4 className="text-sm text-gray-400 mb-2">ממוצע יומי</h4>
          <p className="text-2xl font-bold">
            {Math.round(
              dailyVisits.reduce((sum, day) => sum + (day.visits || 0), 0) / 
              (dailyVisits.length || 1)
            )}
          </p>
        </div>
        
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
          <h4 className="text-sm text-gray-400 mb-2">מקור מוביל</h4>
          <p className="text-2xl font-bold">
            {sourceStats[0]?.fullSource || sourceStats[0]?.source || 'אין נתונים'}
          </p>
        </div>
        
        <div className="bg-secondary-light p-6 rounded-xl border border-gray-800">
          <h4 className="text-sm text-gray-400 mb-2">כניסות היום</h4>
          <p className="text-2xl font-bold">
            {dailyVisits[dailyVisits.length - 1]?.visits || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;