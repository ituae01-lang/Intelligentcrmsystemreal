import { UserPlus, MessageCircle, ShoppingBag, TrendingUp, Heart, RefreshCw } from 'lucide-react';

export function ProcessFlow() {
  const stages = [
    {
      icon: UserPlus,
      title: 'Customer Acquisition',
      description: 'New customer walks in or contacts business',
      actions: ['Record contact details', 'Add to CRM database', 'Assign category: New'],
      color: 'primary'
    },
    {
      icon: MessageCircle,
      title: 'First Interaction',
      description: 'Initial engagement and needs assessment',
      actions: ['Log inquiry details', 'Understand requirements', 'Provide product information'],
      color: 'accent'
    },
    {
      icon: ShoppingBag,
      title: 'First Purchase',
      description: 'Customer makes their first transaction',
      actions: ['Record sale details', 'Update customer profile', 'Thank customer for purchase'],
      color: 'success'
    },
    {
      icon: TrendingUp,
      title: 'Relationship Building',
      description: 'Active engagement and repeat business',
      actions: ['AI recommendations', 'Personalized offers', 'Regular follow-ups', 'Category: Occasional'],
      color: 'warning'
    },
    {
      icon: Heart,
      title: 'Loyalty Development',
      description: 'Customer becomes frequent buyer',
      actions: ['Special discounts', 'Priority service', 'Referral requests', 'Category: Frequent'],
      color: 'primary'
    },
    {
      icon: RefreshCw,
      title: 'Retention & Growth',
      description: 'Maintain relationship and prevent churn',
      actions: ['Monitor purchase frequency', 'Detect at-risk status', 'Proactive outreach', 'Upsell opportunities'],
      color: 'accent'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      accent: 'bg-accent/10 text-accent border-accent/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Customer Relationship Process Flow</h1>
        <p className="text-muted-foreground mt-1">Active CRM workflow for Nigerian SMEs</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-border -mb-6" />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getColorClasses(stage.color)} relative z-10`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-muted/30 border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{stage.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        Stage {index + 1}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-foreground mb-2">Key Actions:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stage.actions.map((action, actionIndex) => (
                          <div
                            key={actionIndex}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">✅ Best Practices</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Log every customer interaction immediately</li>
            <li>• Use AI recommendations for personalized offers</li>
            <li>• Follow up within 24 hours of purchase</li>
            <li>• Monitor at-risk customers weekly</li>
            <li>• Send birthday/holiday greetings</li>
            <li>• Ask for feedback regularly</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">⚠️ Common Pitfalls to Avoid</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Forgetting to log interactions</li>
            <li>• Treating all customers the same</li>
            <li>• Ignoring at-risk warnings</li>
            <li>• No follow-up after complaints</li>
            <li>• Delayed response to inquiries</li>
            <li>• Not using CRM data for decisions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
