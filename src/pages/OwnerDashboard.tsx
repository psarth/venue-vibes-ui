import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Building2, ClipboardList, BarChart3,
  LogOut, Menu, X, ChevronRight, TrendingUp, Clock, DollarSign, Ban,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type OwnerView = 'dashboard' | 'calendar' | 'bookings' | 'venue' | 'analytics';

const revenueData = [
  { day: 'Mon', revenue: 12400 },
  { day: 'Tue', revenue: 8900 },
  { day: 'Wed', revenue: 15200 },
  { day: 'Thu', revenue: 11800 },
  { day: 'Fri', revenue: 18500 },
  { day: 'Sat', revenue: 24300 },
  { day: 'Sun', revenue: 21700 },
];

const peakHoursData = [
  { hour: '6AM', bookings: 3 },
  { hour: '7AM', bookings: 8 },
  { hour: '8AM', bookings: 6 },
  { hour: '5PM', bookings: 7 },
  { hour: '6PM', bookings: 12 },
  { hour: '7PM', bookings: 15 },
  { hour: '8PM', bookings: 11 },
  { hour: '9PM', bookings: 8 },
];

const bookingsData = [
  { id: 'BK001', customer: 'Rahul Sharma', date: '2026-02-03', time: '6:00 PM - 7:00 PM', amount: 650, status: 'confirmed' },
  { id: 'BK002', customer: 'Priya Patel', date: '2026-02-03', time: '7:00 PM - 8:00 PM', amount: 650, status: 'confirmed' },
  { id: 'BK003', customer: 'Amit Kumar', date: '2026-02-03', time: '8:00 PM - 9:00 PM', amount: 700, status: 'completed' },
  { id: 'BK004', customer: 'Sneha Gupta', date: '2026-02-04', time: '6:00 AM - 7:00 AM', amount: 450, status: 'upcoming' },
  { id: 'BK005', customer: 'Vikram Singh', date: '2026-02-04', time: '7:00 AM - 8:00 AM', amount: 450, status: 'upcoming' },
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut, demoUser } = useAuth();
  const [currentView, setCurrentView] = useState<OwnerView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { id: 'dashboard' as OwnerView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar' as OwnerView, label: 'Slot Calendar', icon: Calendar },
    { id: 'bookings' as OwnerView, label: 'Bookings', icon: ClipboardList },
    { id: 'venue' as OwnerView, label: 'Venue Settings', icon: Building2 },
    { id: 'analytics' as OwnerView, label: 'Analytics', icon: BarChart3 },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-background theme-owner">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-muted rounded-md">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-bold font-display text-primary">Owner Portal</h1>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <span className="font-bold text-sidebar-foreground">Owner Portal</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-sidebar-accent rounded">
                <X className="h-5 w-5 text-sidebar-foreground" />
              </button>
            </div>
            <nav className="p-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    currentView === item.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}>
                  <item.icon className="h-5 w-5" />{item.label}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent">
                <LogOut className="h-5 w-5" />Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="font-bold text-lg text-sidebar-foreground font-display">Owner Portal</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{demoUser?.email}</p>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${
                currentView === item.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}>
              <item.icon className="h-5 w-5" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent text-sm">
            <LogOut className="h-4 w-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-56 min-h-screen">
        <div className="p-4 lg:p-6 max-w-6xl">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Dashboard</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="kpi-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2"><ClipboardList className="h-4 w-4" /><span className="text-xs font-medium">Today's Bookings</span></div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> +15% vs yesterday</p>
                </div>
                <div className="kpi-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2"><DollarSign className="h-4 w-4" /><span className="text-xs font-medium">Today's Revenue</span></div>
                  <p className="text-2xl font-bold">₹8,450</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3" /> +8% vs yesterday</p>
                </div>
                <div className="kpi-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2"><Clock className="h-4 w-4" /><span className="text-xs font-medium">Upcoming Slots</span></div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground mt-1">Next 24 hours</p>
                </div>
                <div className="kpi-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2"><Ban className="h-4 w-4" /><span className="text-xs font-medium">Blocked Slots</span></div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="control-panel">
                  <h3 className="font-semibold mb-4">Weekly Revenue</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="control-panel">
                  <h3 className="font-semibold mb-4">Peak Booking Hours</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakHoursData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="control-panel">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Bookings</h3>
                  <button onClick={() => setCurrentView('bookings')} className="text-sm text-primary hover:underline flex items-center gap-1">View All <ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Time</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground">Amount</th>
                      <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                      {bookingsData.slice(0, 3).map((booking) => (
                        <tr key={booking.id} className="border-b border-border/50">
                          <td className="py-2.5 px-3 font-mono text-xs">{booking.id}</td>
                          <td className="py-2.5 px-3">{booking.customer}</td>
                          <td className="py-2.5 px-3 text-muted-foreground">{booking.time}</td>
                          <td className="py-2.5 px-3 text-right font-medium">₹{booking.amount}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`badge-status ${booking.status === 'confirmed' ? 'badge-available' : booking.status === 'completed' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{booking.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Slot Calendar</h2>
              <div className="control-panel">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))} className="p-2 hover:bg-muted rounded-md"><ChevronLeft className="h-5 w-5" /></button>
                  <h3 className="font-semibold">{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h3>
                  <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))} className="p-2 hover:bg-muted rounded-md"><ChevronRight className="h-5 w-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>))}
                  {getDaysInMonth(calendarDate).map((day, idx) => {
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    const isSelected = day && selectedCalendarDate && day.toDateString() === selectedCalendarDate.toDateString();
                    return (
                      <button key={idx} disabled={!day} onClick={() => day && setSelectedCalendarDate(day)}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${!day ? '' : isSelected ? 'bg-primary text-primary-foreground' : isToday ? 'bg-accent text-accent-foreground font-semibold' : 'hover:bg-muted'}`}>
                        {day?.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedCalendarDate && (
                <div className="control-panel">
                  <h3 className="font-semibold mb-4">Slots for {selectedCalendarDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Time</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Price</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Action</th>
                      </tr></thead>
                      <tbody>
                        {['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map((time, idx) => {
                          const status = idx === 3 ? 'booked' : 'available';
                          const price = idx < 3 ? 450 : 650;
                          return (
                            <tr key={time} className="border-b border-border/50">
                              <td className="py-2.5 px-3">{time}</td>
                              <td className="py-2.5 px-3 text-center"><input type="number" value={price} className="w-20 h-8 text-center border border-border rounded-md bg-background text-sm" readOnly /></td>
                              <td className="py-2.5 px-3 text-center"><span className={`badge-status ${status === 'available' ? 'badge-available' : 'badge-booked'}`}>{status}</span></td>
                              <td className="py-2.5 px-3 text-center">{status === 'available' ? <Button variant="outline" size="sm" className="h-7 text-xs">Block</Button> : <span className="text-xs text-muted-foreground">Booked</span>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex gap-2"><Button variant="outline" size="sm">Block Full Day</Button><Button size="sm" className="btn-premium">Apply Peak Pricing</Button></div>
                </div>
              )}
            </div>
          )}

          {currentView === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display">Bookings</h2>
                <div className="flex gap-2">{['Today', 'Upcoming', 'Completed'].map((filter) => (<button key={filter} className="px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors">{filter}</button>))}</div>
              </div>
              <div className="control-panel overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Booking ID</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Customer Name</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground">Slot Time</th>
                    <th className="text-right py-3 px-3 font-medium text-muted-foreground">Amount</th>
                    <th className="text-center py-3 px-3 font-medium text-muted-foreground">Status</th>
                  </tr></thead>
                  <tbody>
                    {bookingsData.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-3 font-mono text-xs">{booking.id}</td>
                        <td className="py-3 px-3 font-medium">{booking.customer}</td>
                        <td className="py-3 px-3 text-muted-foreground">{booking.date}</td>
                        <td className="py-3 px-3">{booking.time}</td>
                        <td className="py-3 px-3 text-right font-semibold">₹{booking.amount}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`badge-status ${booking.status === 'confirmed' ? 'badge-available' : booking.status === 'completed' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{booking.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'venue' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Venue Settings</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="control-panel">
                  <h3 className="font-semibold mb-4">Venue Details</h3>
                  <div className="space-y-4">
                    <div><label className="text-sm font-medium text-muted-foreground">Venue Name</label><input type="text" defaultValue="PowerPlay Badminton Arena" className="w-full mt-1 h-10 px-3 border border-border rounded-md bg-background" /></div>
                    <div><label className="text-sm font-medium text-muted-foreground">Sport Type</label><select className="w-full mt-1 h-10 px-3 border border-border rounded-md bg-background"><option>Badminton</option><option>Cricket</option><option>Football</option></select></div>
                    <div><label className="text-sm font-medium text-muted-foreground">Location</label><input type="text" defaultValue="Indiranagar, Bangalore" className="w-full mt-1 h-10 px-3 border border-border rounded-md bg-background" /></div>
                    <Button className="btn-premium">Save Changes</Button>
                  </div>
                </div>
                <div className="control-panel">
                  <h3 className="font-semibold mb-4">Pricing</h3>
                  <div className="space-y-4">
                    <div><label className="text-sm font-medium text-muted-foreground">Base Price (Morning)</label><input type="number" defaultValue="450" className="w-full mt-1 h-10 px-3 border border-border rounded-md bg-background" /></div>
                    <div><label className="text-sm font-medium text-muted-foreground">Base Price (Evening)</label><input type="number" defaultValue="650" className="w-full mt-1 h-10 px-3 border border-border rounded-md bg-background" /></div>
                    <div><label className="text-sm font-medium text-muted-foreground">Peak Hour Multiplier</label><input type="number" defaultValue="1.2" step="0.1" className="w-full mt-1 h-10 px-3 border border-border rounded-md bg-background" /></div>
                    <Button className="btn-premium">Update Pricing</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display">Analytics</h2>
              <p className="text-muted-foreground">Detailed analytics coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;