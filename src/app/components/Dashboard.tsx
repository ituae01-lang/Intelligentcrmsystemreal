import { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Star,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Customer, Purchase, Product, Interaction } from '../data/mockData';
import { getAtRiskCustomers } from '../utils/recommendations';
import { generateBusinessInsights, isGroqConfigured } from '../services/groqAI';
import { ReportsPanel } from './ReportsPanel';

interface DashboardProps {
  customers: Customer[];
  purchases: Purchase[];
  products: Product[];
  interactions: Interaction[];
}

export function Dashboard({ customers, purchases, products, interactions }: DashboardProps) {
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    const totalSales = purchases.length;
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    return { totalCustomers, totalRevenue, totalSales, avgOrderValue };
  }, [customers, purchases]);

  useEffect(() => {
    if (isGroqConfigured) {
      loadAIInsights();
    }
  }, []);

  const loadAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const insights = await generateBusinessInsights(
        metrics.totalCustomers,
        metrics.totalRevenue,
        topProducts,
        atRiskCustomers.length
      );
      setAiInsights(insights);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Sales trend data (last 7 days)
  const salesTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySales = purchases.filter(p => p.date === date);
      const revenue = daySales.reduce((sum, p) => sum + p.amount, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue / 1000,
        sales: daySales.length
      };
    });
  }, [purchases]);

  // Top products
  const topProducts = useMemo(() => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    purchases.forEach(purchase => {
      const product = products.find(p => p.id === purchase.productId);
      if (product) {
        if (!productSales[product.id]) {
          productSales[product.id] = { name: product.name, quantity: 0, revenue: 0 };
        }
        productSales[product.id].quantity += purchase.quantity;
        productSales[product.id].revenue += purchase.amount;
      }
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [purchases, products]);

  // Customer segments
  const customerSegments = useMemo(() => {
    const segments = customers.reduce((acc, customer) => {
      acc[customer.category] = (acc[customer.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const atRiskCustomers = useMemo(() => getAtRiskCustomers(customers), [customers]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your business performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{metrics.totalCustomers}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                ₦{(metrics.totalRevenue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{metrics.totalSales}</p>
            </div>
            <div className="bg-warning/10 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                ₦{(metrics.avgOrderValue / 1000).toFixed(1)}k
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Sales Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                name="Revenue (₦k)"
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={2}
                name="Sales Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Segments */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Customer Segments</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={customerSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {customerSegments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 10 }}
                angle={-20}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#2563eb" name="Revenue (₦)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* At-Risk Customers */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">At-Risk Customers</h3>
          </div>
          <div className="space-y-3">
            {atRiskCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No at-risk customers detected</p>
            ) : (
              atRiskCustomers.slice(0, 5).map(customer => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last purchase: {new Date(customer.lastPurchase).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">
                    Follow Up
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Interactions</h3>
        <div className="space-y-3">
          {interactions.slice(0, 5).map(interaction => {
            const customer = customers.find(c => c.id === interaction.customerId);
            return (
              <div
                key={interaction.id}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border"
              >
                <div className={`p-2 rounded ${
                  interaction.type === 'Sale' ? 'bg-success/10 text-success' :
                  interaction.type === 'Complaint' ? 'bg-destructive/10 text-destructive' :
                  'bg-primary/10 text-primary'
                }`}>
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-foreground">{customer?.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(interaction.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">{interaction.type}:</span> {interaction.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Business Insights */}
      {isGroqConfigured && (
        <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-accent text-accent-foreground p-2 rounded">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Business Insights</h3>
                <p className="text-xs text-muted-foreground">Powered by Groq AI</p>
              </div>
            </div>
            {loadingInsights && (
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            )}
          </div>

          {loadingInsights ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">Analyzing your business data...</p>
            </div>
          ) : aiInsights.length > 0 ? (
            <div className="space-y-3">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
                >
                  <div className="bg-accent/10 text-accent p-1.5 rounded mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-foreground flex-1">{insight}</p>
                </div>
              ))}
              <button
                onClick={loadAIInsights}
                className="w-full text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Refresh Insights
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">Get AI-powered recommendations for your business</p>
              <button
                onClick={loadAIInsights}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                Generate Insights
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reports Panel */}
      <ReportsPanel
        customers={customers}
        purchases={purchases}
        products={products}
        interactions={interactions}
      />
    </div>
  );
}
