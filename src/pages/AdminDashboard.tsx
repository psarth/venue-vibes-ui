import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, Receipt, Settings, LogOut, Menu, X,
  TrendingUp, DollarSign, CalendarCheck, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

type AdminView = 'dashboard' | 'users' | 'venues' | 'transactions' | 'settings';

const revenueData = [
  { date: 'Jan 28', revenue: 45000 },
  { date: 'Jan 29', revenue: 52000 },
  { date: 'Jan 30', revenue: 48000 },
  { date: 'Jan 31', revenue: 61000 },
  { date: 'Feb 1', revenue: 55000 },
  { date: 'Feb 2', revenue: 73000 },
  { date: 'Feb 3', revenue: 68000 },
];

const sportDistribution = [
  { name: 'Badminton', value: 35, color: 'hsl(250, 50%, 45%)' },
  { name: 'Football', value: 25, color: 'hsl(250, 50%, 55%)' },
  { name: 'Cricket', value: 20, color: 'hsl(250, 50%, 65%)' },
  { name: 'Tennis', value: 12, color: 'hsl(250, 50%, 75%)' },
  { name: 'Others', value: 8, color: 'hsl(250, 50%, 85%)' },
];

const usersData = [
  { id: 'USR001', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'customer', status: 'active', joined: '2025-12-15' },
  { id: 'USR002', name: 'Priya Patel', email: 'priya@example.com', role: 'customer', status: 'active', joined: '2026-01-02' },
  { id: 'USR003', name: 'Venue Masters', email: 'venue@masters.com', role: 'owner', status: 'pending', joined: '2026-01-28' },
  { id: 'USR004', name: 'Sport Zone', email: 'contact@sportzone.in', role: 'owner', status: 'active', joined: '2025-11-10' },
];

const venuesData = [
  { id: 'VN001', name: 'PowerPlay Badminton Arena', owner: 'Sport Zone', sport: 'Badminton', status: 'active', bookings: 248 },
  { id: 'VN002', name: 'Goal Rush Football Turf', owner: 'Venue Masters', sport: 'Football', status: 'pending', bookings: 0 },
  { id: 'VN003', name: 'Ace Tennis Academy', owner: 'Sport Zone', sport: 'Tennis', status: 'active', bookings: 156 },
];

const transactionsData = [
  { id: 'TXN001', booking: 'BK001', user: 'Rahul Sharma', amount: 650, commission: 20, date: '2026-02-03', status: 'success' },
  { id: 'TXN002', booking: 'BK002', user: 'Priya Patel', amount: 650, commission: 20, date: '2026-02-03', status: 'success' },
  { id: 'TXN003', booking: 'BK003', user: 'Amit Kumar', amount: 700, commission: 21, date: '2026-02-03', status: 'success' },
  { id: 'TXN004', booking: 'BK004', user: 'Sneha Gupta', amount: 450, commission: 14, date: '2026-02-04', status: 'pending' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut, demoUser } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceFee, setServiceFee] = useState('3');

  const handleLogout = async () => { await signOut(); navigate('/auth'); };

  const navItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users' as AdminView, label: 'Users', icon: Users },
    { id: 'venues' as AdminView, label: 'Venues', icon: Building2 },
    { id: 'transactions' as AdminView, label: 'Transactions', icon: Receipt },
    { id: 'settings' as AdminView, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background theme-admin">
      <header className="lg:hidden sticky top-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-muted rounded-md"><Menu className="h-5 w-5" /></button>
        <h1 className="font-bold font-display text-primary">Admin Panel</h1>
        <div className="w-10" />
      </header>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <span className="font-bold text-sidebar-foreground">Admin Panel</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-sidebar-accent rounded"><X className="h-5 w-5 text-sidebar-foreground" /></button>
            </div>
            <nav className="p-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${currentView === item.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
                  <item.icon className="h-5 w-5" />{item.label}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"><LogOut className="h-5 w-5" />Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="font-bold text-lg text-sidebar-foreground font-display">Admin Panel</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{demoUser?.email}</p>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${currentView === item.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}>
              <item.icon className="h-5 w-5" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent text-sm"><LogOut className="h-4 w-4" />Sign Out</button>
        </div>
      </aside>

      <main className="lg:ml-56 min-h-screen">
        <div className="p-4 lg:p-6 max-w-6xl">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Dashboard</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="kpi-card"><div className="flex items-center gap-2 text-muted-foreground mb-2"><CalendarCheck className="h-4 w-4" /><span className="text-xs font-medium">Total Bookings</span></div><p className="text-2xl font-bold">1,247</p><p className="text-xs text-success flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> +12% this week</p></div>
                <div className="kpi-card"><div className="flex items-center gap-2 text-muted-foreground mb-2"><DollarSign className="h-4 w-4" /><span className="text-xs font-medium">Platform Revenue</span></div><p className="text-2xl font-bold">₹38,420</p><p className="text-xs text-success flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> +8% this week</p></div>
                <div className="kpi-card"><div className="flex items-center gap-2 text-muted-foreground mb-2"><Building2 className="h-4 w-4" /><span className="text-xs font-medium">Active Venues</span></div><p className="text-2xl font-bold">24</p><p className="text-xs text-muted-foreground mt-1">3 pending approval</p></div>
                <div className="kpi-card"><div className="flex items-center gap-2 text-muted-foreground mb-2"><Users className="h-4 w-4" /><span className="text-xs font-medium">Total Users</span></div><p className="text-2xl font-bold">892</p><p className="text-xs text-success flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> +24 this week</p></div>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 control-panel">
                  <h3 className="font-semibold mb-4">Revenue Trend (7 Days)</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="control-panel">
                  <h3 className="font-semibold mb-4">Sport Distribution</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={sportDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">{sportDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {sportDistribution.map((item) => (<div key={item.name} className="flex items-center gap-2 text-xs"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-muted-foreground">{item.name}</span><span className="font-medium">{item.value}%</span></div>))}
                  </div>
                </div>
              </div>
              <div className="control-panel">
                <h3 className="font-semibold mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">User</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground">Amount</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground">Commission</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                      {transactionsData.slice(0, 3).map((txn) => (
                        <tr key={txn.id} className="border-b border-border/50">
                          <td className="py-2.5 px-3 font-mono text-xs">{txn.id}</td>
                          <td className="py-2.5 px-3">{txn.user}</td>
                          <td className="py-2.5 px-3 text-right">₹{txn.amount}</td>
                          <td className="py-2.5 px-3 text-right text-success">₹{txn.commission}</td>
                          <td className="py-2.5 px-3 text-center"><span className={`badge-status ${txn.status === 'success' ? 'badge-available' : 'bg-warning/10 text-warning'}`}>{txn.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentView === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">User Management</h2>
              <div className="control-panel overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border"><th className="text-left py-3 px-3 font-medium text-muted-foreground">ID</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">Name</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">Email</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Role</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Actions</th></tr></thead>
                  <tbody>{usersData.map((user) => (<tr key={user.id} className="border-b border-border/50 hover:bg-muted/30"><td className="py-3 px-3 font-mono text-xs">{user.id}</td><td className="py-3 px-3 font-medium">{user.name}</td><td className="py-3 px-3 text-muted-foreground">{user.email}</td><td className="py-3 px-3 text-center"><span className="badge-sport capitalize">{user.role}</span></td><td className="py-3 px-3 text-center"><span className={`badge-status ${user.status === 'active' ? 'badge-available' : 'bg-warning/10 text-warning'}`}>{user.status}</span></td><td className="py-3 px-3 text-center">{user.status === 'pending' ? <Button size="sm" className="h-7 text-xs btn-premium">Approve</Button> : <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'venues' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Venue Management</h2>
              <div className="control-panel overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border"><th className="text-left py-3 px-3 font-medium text-muted-foreground">ID</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">Venue Name</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">Owner</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Sport</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Bookings</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Actions</th></tr></thead>
                  <tbody>{venuesData.map((venue) => (<tr key={venue.id} className="border-b border-border/50 hover:bg-muted/30"><td className="py-3 px-3 font-mono text-xs">{venue.id}</td><td className="py-3 px-3 font-medium">{venue.name}</td><td className="py-3 px-3 text-muted-foreground">{venue.owner}</td><td className="py-3 px-3 text-center"><span className="badge-sport">{venue.sport}</span></td><td className="py-3 px-3 text-center font-medium">{venue.bookings}</td><td className="py-3 px-3 text-center"><span className={`badge-status ${venue.status === 'active' ? 'badge-available' : 'bg-warning/10 text-warning'}`}>{venue.status}</span></td><td className="py-3 px-3 text-center">{venue.status === 'pending' ? <Button size="sm" className="h-7 text-xs btn-premium">Approve</Button> : <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between"><h2 className="text-xl font-bold font-display">Transactions</h2><Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export CSV</Button></div>
              <div className="control-panel overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border"><th className="text-left py-3 px-3 font-medium text-muted-foreground">Transaction ID</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">Booking</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">User</th><th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th><th className="text-right py-3 px-3 font-medium text-muted-foreground">Amount</th><th className="text-right py-3 px-3 font-medium text-muted-foreground">Commission</th><th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th></tr></thead>
                  <tbody>{transactionsData.map((txn) => (<tr key={txn.id} className="border-b border-border/50 hover:bg-muted/30"><td className="py-3 px-3 font-mono text-xs">{txn.id}</td><td className="py-3 px-3 font-mono text-xs">{txn.booking}</td><td className="py-3 px-3">{txn.user}</td><td className="py-3 px-3 text-muted-foreground">{txn.date}</td><td className="py-3 px-3 text-right font-medium">₹{txn.amount}</td><td className="py-3 px-3 text-right text-success font-medium">₹{txn.commission}</td><td className="py-3 px-3 text-center"><span className={`badge-status ${txn.status === 'success' ? 'badge-available' : 'bg-warning/10 text-warning'}`}>{txn.status}</span></td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Platform Settings</h2>
              <div className="control-panel max-w-md">
                <h3 className="font-semibold mb-4">Service Charge Configuration</h3>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-muted-foreground">Service Charge (%)</label><p className="text-xs text-muted-foreground mb-2">Applied to all bookings as platform fee</p><input type="number" value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} min="0" max="10" step="0.5" className="w-full h-10 px-3 border border-border rounded-md bg-background" /></div>
                  <Button className="btn-premium">Update Settings</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;