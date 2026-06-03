import { useState, useEffect } from 'react';
import { Search, Eye, Phone, Mail, MapPin, TrendingUp, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { Customer, Purchase, Product, Interaction } from '../data/mockData';
import { getRecommendationsForCustomer } from '../utils/recommendations';
import { generateAIRecommendations, isGroqConfigured } from '../services/groqAI';

interface CustomersProps {
  customers: Customer[];
  purchases: Purchase[];
  products: Product[];
  onViewDetails: (customer: Customer) => void;
}

export function Customers({ customers, purchases, products, onViewDetails }: CustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesCategory = filterCategory === 'All' || customer.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Customers</h1>
        <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Frequent', 'Occasional', 'New'].map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                filterCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <div
            key={customer.id}
            className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{customer.name}</h3>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                  customer.category === 'Frequent' ? 'bg-success/10 text-success' :
                  customer.category === 'Occasional' ? 'bg-warning/10 text-warning' :
                  'bg-primary/10 text-primary'
                }`}>
                  {customer.category}
                </span>
              </div>
              <button
                onClick={() => onViewDetails(customer)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Eye className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{customer.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="font-semibold text-foreground">₦{(customer.totalSpent / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Purchase</p>
                <p className="font-medium text-sm text-foreground">
                  {new Date(customer.lastPurchase).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No customers found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

interface CustomerDetailsProps {
  customer: Customer;
  purchases: Purchase[];
  products: Product[];
  customers: Customer[];
  interactions: Interaction[];
  onClose: () => void;
}

export function CustomerDetails({ customer, purchases, products, customers, interactions, onClose }: CustomerDetailsProps) {
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const customerPurchases = purchases.filter(p => p.customerId === customer.id);
  const customerInteractions = interactions.filter(i => i.customerId === customer.id);
  const recommendations = getRecommendationsForCustomer(customer.id, purchases, products, customers, 5);

  useEffect(() => {
    if (isGroqConfigured) {
      loadAIRecommendations();
    }
  }, [customer.id]);

  const loadAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const customerData = {
        name: customer.name,
        totalSpent: customer.totalSpent,
        lastPurchase: customer.lastPurchase,
        category: customer.category,
        purchaseHistory: customerPurchases.map(p => {
          const product = products.find(prod => prod.id === p.productId);
          return {
            product: product?.name || 'Unknown',
            amount: p.amount,
            date: p.date
          };
        }),
        interactions: customerInteractions.map(i => ({
          type: i.type,
          note: i.note,
          date: i.date
        }))
      };

      const result = await generateAIRecommendations(customerData, products);
      setAiRecommendations(result);
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{customer.name}</h1>
          <p className="text-muted-foreground mt-1">{customer.email}</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          Back to List
        </button>
      </div>

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </div>
          <p className="text-2xl font-semibold text-foreground">₦{customer.totalSpent.toLocaleString()}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">Member Since</p>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {new Date(customer.joinDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-accent" />
            <p className="text-sm text-muted-foreground">Phone</p>
          </div>
          <p className="text-sm font-medium text-foreground">{customer.phone}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-warning" />
            <p className="text-sm text-muted-foreground">Location</p>
          </div>
          <p className="text-sm font-medium text-foreground">{customer.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase History */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Purchase History</h3>
          <div className="space-y-3">
            {customerPurchases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No purchase history</p>
            ) : (
              customerPurchases.map(purchase => {
                const product = products.find(p => p.id === purchase.productId);
                return (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">{product?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(purchase.date).toLocaleDateString()} • Qty: {purchase.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">₦{purchase.amount.toLocaleString()}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Collaborative Filtering Recommendations */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary text-primary-foreground p-2 rounded">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-foreground">ML Product Recommendations</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Based on collaborative filtering algorithm</p>
          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recommendations available</p>
            ) : (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-foreground">{rec.product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    </div>
                    <p className="font-semibold text-primary">₦{rec.product.price.toLocaleString()}</p>
                  </div>
                  <button className="w-full mt-2 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90">
                    Suggest to Customer
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI-Powered Insights */}
      {isGroqConfigured && (
        <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-accent text-accent-foreground p-2 rounded">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-foreground">AI-Powered Customer Insights</h3>
            </div>
            {loadingAI && (
              <Loader2 className="w-4 h-4 text-accent animate-spin" />
            )}
          </div>

          {loadingAI ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Analyzing customer data with Groq AI...</p>
            </div>
          ) : aiRecommendations ? (
            <div className="space-y-6">
              {/* AI Product Recommendations */}
              {aiRecommendations.products && aiRecommendations.products.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Smart Product Suggestions</h4>
                  <div className="space-y-2">
                    {aiRecommendations.products.map((product: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 bg-card border rounded-lg ${
                          product.priority === 'high' ? 'border-success' :
                          product.priority === 'medium' ? 'border-warning' :
                          'border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{product.reason}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            product.priority === 'high' ? 'bg-success/10 text-success' :
                            product.priority === 'medium' ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {product.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Insights */}
              {aiRecommendations.insights && aiRecommendations.insights.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Customer Analysis</h4>
                  <div className="space-y-1">
                    {aiRecommendations.insights.map((insight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-accent mt-1">•</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Actions */}
              {aiRecommendations.followUpActions && aiRecommendations.followUpActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Recommended Actions</h4>
                  <div className="space-y-1">
                    {aiRecommendations.followUpActions.map((action: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-1">✓</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Level */}
              {aiRecommendations.riskLevel && (
                <div className={`p-3 rounded-lg border ${
                  aiRecommendations.riskLevel === 'high' ? 'bg-destructive/10 border-destructive/20' :
                  aiRecommendations.riskLevel === 'medium' ? 'bg-warning/10 border-warning/20' :
                  'bg-success/10 border-success/20'
                }`}>
                  <p className="text-sm font-medium">
                    Churn Risk: <span className={
                      aiRecommendations.riskLevel === 'high' ? 'text-destructive' :
                      aiRecommendations.riskLevel === 'medium' ? 'text-warning' :
                      'text-success'
                    }>
                      {aiRecommendations.riskLevel.toUpperCase()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Click to generate AI insights</p>
              <button
                onClick={loadAIRecommendations}
                className="mt-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                Generate AI Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
