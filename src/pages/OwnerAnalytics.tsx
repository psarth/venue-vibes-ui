
import { useState, useEffect } from 'react';
import OwnerLayout from '@/layouts/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatIndianNumber } from '@/utils/indianNumberFormat';
import { Loader2, TrendingUp, Calendar, DollarSign, Activity, Trophy, Clock, Zap, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OwnerAnalytics() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [viewType, setViewType] = useState<'weekday' | 'weekend' | 'all'>('all');
  const [data, setData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // Simulate fetching analytical data
    setTimeout(() => {
      setData({
        // Hour-wise analytics
        hourlyBookings: [
          { hour: '6 AM', bookings: 2, revenue: 2400 },
          { hour: '7 AM', bookings: 5, revenue: 6000 },
          { hour: '8 AM', bookings: 8, revenue: 9600 },
          { hour: '9 AM', bookings: 6, revenue: 7200 },
          { hour: '10 AM', bookings: 4, revenue: 4800 },
          { hour: '5 PM', bookings: 12, revenue: 14400 },
          { hour: '6 PM', bookings: 18, revenue: 21600 },
          { hour: '7 PM', bookings: 22, revenue: 26400 },
          { hour: '8 PM', bookings: 20, revenue: 24000 },
          { hour: '9 PM', bookings: 15, revenue: 18000 },
          { hour: '10 PM', bookings: 8, revenue: 9600 },
        ],

        // Sport-wise detailed analytics
        sportWise: [
          {
            sport: 'Badminton',
            icon: '🏸',
            bookings: 85,
            revenue: 102000,
            utilization: 82,
            avgPrice: 1200,
            peakHour: '7-8 PM',
            trend: '+15%'
          },
          {
            sport: 'Cricket',
            icon: '🏏',
            bookings: 45,
            revenue: 67500,
            utilization: 65,
            avgPrice: 1500,
            peakHour: '6-7 PM',
            trend: '+8%'
          },
          {
            sport: 'Football',
            icon: '⚽',
            bookings: 26,
            revenue: 36400,
            utilization: 48,
            avgPrice: 1400,
            peakHour: '8-9 PM',
            trend: '-3%'
          },
        ],

        // Sport-wise revenue pie chart
        sportRevenue: [
          { name: 'Badminton', value: 102000, color: '#2979FF' },
          { name: 'Cricket', value: 67500, color: '#A7C7E7' },
          { name: 'Football', value: 36400, color: '#4FC3F7' },
        ],

        // Weekly trend
        weeklyTrend: [
          { day: 'Mon', bookings: 12, revenue: 14400, utilization: 55 },
          { day: 'Tue', bookings: 15, revenue: 18000, utilization: 62 },
          { day: 'Wed', bookings: 18, revenue: 21600, utilization: 68 },
          { day: 'Thu', bookings: 22, revenue: 26400, utilization: 75 },
          { day: 'Fri', bookings: 28, revenue: 33600, utilization: 82 },
          { day: 'Sat', bookings: 42, revenue: 50400, utilization: 95 },
          { day: 'Sun', bookings: 38, revenue: 45600, utilization: 88 },
        ],

        // Weekday vs Weekend comparison
        comparison: {
          weekday: { bookings: 95, revenue: 114000, utilization: 68 },
          weekend: { bookings: 80, revenue: 96000, utilization: 92 }
        },

        // Key insights
        insights: [
          { title: 'Peak Hour', value: '7-8 PM', change: '+22 bookings', icon: Clock, color: 'text-primary', trend: 'up' },
          { title: 'Top Sport', value: 'Badminton', change: '82% util', icon: Trophy, color: 'text-success', trend: 'up' },
          { title: 'Best Day', value: 'Saturday', change: '95% occ', icon: Calendar, color: 'text-warning', trend: 'up' },
          { title: 'Avg Revenue/Day', value: '₹7,200', change: '+12%', icon: DollarSign, color: 'text-secondary', trend: 'up' },
        ],

        // Low utilization alerts
        lowUtilization: [
          { time: '10-11 AM', sport: 'Football', utilization: 25 },
          { time: '2-3 PM', sport: 'Cricket', utilization: 30 },
          { time: '11 AM-12 PM', sport: 'Badminton', utilization: 35 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange, viewType]);

  if (loading) {
    return (
      <OwnerLayout title="Analytics">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </OwnerLayout>
    )
  }

  const COLORS = ['#2979FF', '#A7C7E7', '#4FC3F7', '#81C784'];

  return (
    <OwnerLayout title="Analytics" subtitle="Performance & Insights">
      <div className="space-y-6">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
              className={timeRange === 'week' ? 'bg-primary text-primary-foreground' : 'bg-background border-border/50 text-foreground'}
            >
              This Week
            </Button>
            <Button
              size="sm"
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
              className={timeRange === 'month' ? 'bg-primary text-primary-foreground' : 'bg-background border-border/50 text-foreground'}
            >
              This Month
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewType === 'all' ? 'default' : 'outline'}
              onClick={() => setViewType('all')}
              className={viewType === 'all' ? 'bg-primary text-primary-foreground text-xs' : 'bg-background border-border/50 text-foreground text-xs'}
            >
              All Days
            </Button>
            <Button
              size="sm"
              variant={viewType === 'weekday' ? 'default' : 'outline'}
              onClick={() => setViewType('weekday')}
              className={viewType === 'weekday' ? 'bg-primary text-primary-foreground text-xs' : 'bg-background border-border/50 text-foreground text-xs'}
            >
              Weekdays
            </Button>
            <Button
              size="sm"
              variant={viewType === 'weekend' ? 'default' : 'outline'}
              onClick={() => setViewType('weekend')}
              className={viewType === 'weekend' ? 'bg-primary text-primary-foreground text-xs' : 'bg-background border-border/50 text-foreground text-xs'}
            >
              Weekends
            </Button>
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.insights.map((insight: any, idx: number) => {
            const Icon = insight.icon;
            return (
              <div key={idx} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{insight.title}</p>
                  <Icon className={`w-4 h-4 ${insight.color} group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{insight.value}</h3>
                <p className={`text-xs font-medium flex items-center gap-1 ${insight.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {insight.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {insight.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Weekday vs Weekend Comparison */}
        {viewType === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Weekday Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="font-bold text-foreground">{data.comparison.weekday.bookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-bold text-foreground">₹{formatIndianNumber(data.comparison.weekday.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Utilization</span>
                  <span className="font-bold text-foreground">{data.comparison.weekday.utilization}%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-success" />
                <h3 className="font-bold text-foreground">Weekend Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Bookings</span>
                  <span className="font-bold text-foreground">{data.comparison.weekend.bookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-bold text-foreground">₹{formatIndianNumber(data.comparison.weekend.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg Utilization</span>
                  <span className="font-bold text-foreground">{data.comparison.weekend.utilization}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Hourly Bookings Chart */}
          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Hourly Bookings
              </CardTitle>
              <CardDescription className="text-muted-foreground">Peak hours and booking distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.hourlyBookings}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C303B" />
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0A4B8', fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0A4B8', fontSize: 11 }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#121419',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        color: '#FFFFFF'
                      }}
                      cursor={{ fill: '#2C303B' }}
                    />
                    <Bar dataKey="bookings" fill="#2979FF" radius={[8, 8, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Revenue Trend */}
          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Weekly Revenue
              </CardTitle>
              <CardDescription className="text-muted-foreground">Revenue trend over the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C303B" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0A4B8', fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0A4B8', fontSize: 11 }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#121419',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        color: '#FFFFFF'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#A7C7E7"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#A7C7E7', strokeWidth: 2, stroke: '#121419' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sport-wise Performance - Detailed */}
        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Sport-wise Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">Detailed breakdown by sport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {data.sportWise.map((sport: any, idx: number) => (
                <div key={idx} className="bg-background/50 border border-border/30 rounded-xl p-5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {sport.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{sport.sport}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className={sport.trend.startsWith('+') ? 'text-success' : 'text-destructive'}>{sport.trend}</span>
                        vs last week
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Bookings</span>
                      <span className="font-bold text-foreground">{sport.bookings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-bold text-foreground">₹{formatIndianNumber(sport.revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Price</span>
                      <span className="font-bold text-foreground">₹{sport.avgPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Peak Hour</span>
                      <span className="font-bold text-foreground">{sport.peakHour}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground font-semibold">Utilization</span>
                      <span className="text-xs font-bold text-foreground">{sport.utilization}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${sport.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Utilization Alerts */}
        <Card className="bg-card border border-warning/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Low Utilization Alerts
            </CardTitle>
            <CardDescription className="text-muted-foreground">Time slots that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.lowUtilization.map((alert: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20 hover:border-warning/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{alert.sport} • {alert.time}</p>
                      <p className="text-xs text-muted-foreground">Consider promotional pricing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-warning">{alert.utilization}%</p>
                    <p className="text-xs text-muted-foreground">utilization</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </OwnerLayout>
  );
}