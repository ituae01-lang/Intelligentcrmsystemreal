import { useState } from 'react';
import { Plus, MessageSquare, Phone, AlertCircle, ShoppingBag, Eye, UserCheck } from 'lucide-react';
import { Customer, Interaction } from '../data/mockData';

interface InteractionsProps {
  customers: Customer[];
  interactions: Interaction[];
  onAddInteraction: (interaction: Omit<Interaction, 'id'>) => void;
}

export function Interactions({ customers, interactions, onAddInteraction }: InteractionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    type: 'Sale' as Interaction['type'],
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newInteraction: Omit<Interaction, 'id'> = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };

    onAddInteraction(newInteraction);
    setFormData({ customerId: '', type: 'Sale', note: '' });
    setShowForm(false);
  };

  const getInteractionIcon = (type: Interaction['type']) => {
    switch (type) {
      case 'Sale':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Inquiry':
        return <MessageSquare className="w-4 h-4" />;
      case 'Complaint':
        return <AlertCircle className="w-4 h-4" />;
      case 'Call':
        return <Phone className="w-4 h-4" />;
      case 'Visit':
        return <Eye className="w-4 h-4" />;
      case 'Follow-up':
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const getInteractionColor = (type: Interaction['type']) => {
    switch (type) {
      case 'Sale':
        return 'bg-success/10 text-success border-success/20';
      case 'Complaint':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Inquiry':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Call':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Visit':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Follow-up':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Customer Interactions</h1>
          <p className="text-muted-foreground mt-1">Track all customer touchpoints</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log Interaction
        </button>
      </div>

      {/* Add Interaction Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">New Interaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-foreground">Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">Interaction Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Interaction['type'] })}
                  className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  required
                >
                  <option value="Sale">Sale</option>
                  <option value="Inquiry">Inquiry</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Call">Call</option>
                  <option value="Visit">Visit</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">Notes</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground min-h-[100px]"
                placeholder="Enter interaction details..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Interaction
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interactions List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Interactions</h3>
        <div className="space-y-3">
          {interactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interactions logged yet</p>
          ) : (
            [...interactions].reverse().map(interaction => {
              const customer = customers.find(c => c.id === interaction.customerId);
              return (
                <div
                  key={interaction.id}
                  className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2.5 rounded-lg border ${getInteractionColor(interaction.type)}`}>
                    {getInteractionIcon(interaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-foreground">{customer?.name}</p>
                        <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          interaction.type === 'Sale' ? 'bg-success/10 text-success' :
                          interaction.type === 'Complaint' ? 'bg-destructive/10 text-destructive' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {interaction.type}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(interaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{interaction.note}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
