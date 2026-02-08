
import { useState, useEffect } from 'react';
import OwnerLayout from '@/layouts/OwnerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { formatIndianNumber } from '@/utils/indianNumberFormat';
import { Loader2, TrendingUp, Calendar, DollarSign, Activity, Trophy, Clock, Zap, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground font-medium"
          >
            Crunching your venue data...
          </motion.p>
        </div>
      </OwnerLayout>
    )
  }

  const COLORS = ['#2979FF', '#A7C7E7', '#4FC3F7', '#81C784'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <OwnerLayout title="Analytics" subtitle="Performance & Insights">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

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
            {[
              { id: 'all', label: 'All Days' },
              { id: 'weekday', label: 'Weekdays' },
              { id: 'weekend', label: 'Weekends' }
            ].map(type => (
              <Button
                key={type.id}
                size="sm"
                variant={viewType === type.id ? 'default' : 'outline'}
                onClick={() => setViewType(type.id as any)}
                className={viewType === type.id ? 'bg-primary text-primary-foreground text-xs shadow-sm shadow-primary/20' : 'bg-background border-border/50 text-foreground text-xs'}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.insights.map((insight: any, idx: number) => {
            const Icon = insight.icon;
            return (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className="w-16 h-16 -mr-4 -mt-4" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{insight.title}</p>
                  <Icon className={`w-4 h-4 ${insight.color} group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{insight.value}</h3>
                <p className={`text-xs font-medium flex items-center gap-1 ${insight.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {insight.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {insight.change}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Weekday vs Weekend Comparison */}
        {viewType === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="bg-card border border-border/50 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Weekday Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span className="font-bold text-foreground">{data.comparison.weekday.bookings}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-bold text-foreground">₹{formatIndianNumber(data.comparison.weekday.revenue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg Utilization</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.comparison.weekday.utilization}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <span className="font-bold text-foreground">{data.comparison.weekday.utilization}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="bg-card border border-border/50 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-success" />
                <h3 className="font-bold text-foreground">Weekend Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span className="font-bold text-foreground">{data.comparison.weekend.bookings}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-bold text-foreground">₹{formatIndianNumber(data.comparison.weekend.revenue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg Utilization</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.comparison.weekend.utilization}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-success"
                      />
                    </div>
                    <span className="font-bold text-foreground">{data.comparison.weekend.utilization}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Hourly Bookings Chart */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Hourly Distribution
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs">Peak hours and booking volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.hourlyBookings}>
                      <defs>
                        <linearGradient id="ownerColorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2979FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2979FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C303B" />
                      <XAxis
                        dataKey="hour"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#A0A4B8', fontSize: 10 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#A0A4B8', fontSize: 10 }}
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
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#2979FF" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#ownerColorBookings)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Revenue Trend */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Weekly Revenue Trend
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs">Financial performance over 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C303B" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#A0A4B8', fontSize: 10 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#A0A4B8', fontSize: 10 }}
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
                      <Bar dataKey="revenue" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </OwnerLayout>
  );
}
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