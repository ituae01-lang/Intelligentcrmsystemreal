import { FileDown, FileSpreadsheet, Users, ShoppingCart, MessageSquare } from 'lucide-react';
import { Customer, Purchase, Product, Interaction } from '../data/mockData';
import {
  generateSalesReportPDF,
  generateCustomerReportPDF,
  exportCustomersToExcel,
  exportPurchasesToExcel,
  exportInteractionsToExcel
} from '../utils/reportGenerator';

interface ReportsPanelProps {
  customers: Customer[];
  purchases: Purchase[];
  products: Product[];
  interactions: Interaction[];
}

export function ReportsPanel({ customers, purchases, products, interactions }: ReportsPanelProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-foreground mb-4">Download Reports</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* PDF Reports */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-2">PDF Reports</p>

          <button
            onClick={() => generateSalesReportPDF(purchases, products, customers)}
            className="w-full flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors text-left"
          >
            <div className="bg-primary text-primary-foreground p-2 rounded">
              <FileDown className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">Sales Report</p>
              <p className="text-xs text-muted-foreground">Complete sales summary with charts</p>
            </div>
          </button>

          <button
            onClick={() => generateCustomerReportPDF(customers, purchases, interactions)}
            className="w-full flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg hover:bg-accent/10 transition-colors text-left"
          >
            <div className="bg-accent text-accent-foreground p-2 rounded">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">Customer Report</p>
              <p className="text-xs text-muted-foreground">Customer activity analysis</p>
            </div>
          </button>
        </div>

        {/* Excel Exports */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-2">Excel Exports</p>

          <button
            onClick={() => exportCustomersToExcel(customers, purchases)}
            className="w-full flex items-center gap-3 p-3 bg-success/5 border border-success/20 rounded-lg hover:bg-success/10 transition-colors text-left"
          >
            <div className="bg-success text-success-foreground p-2 rounded">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">Customers Excel</p>
              <p className="text-xs text-muted-foreground">Export all customer data</p>
            </div>
          </button>

          <button
            onClick={() => exportPurchasesToExcel(purchases, customers, products)}
            className="w-full flex items-center gap-3 p-3 bg-warning/5 border border-warning/20 rounded-lg hover:bg-warning/10 transition-colors text-left"
          >
            <div className="bg-warning text-warning-foreground p-2 rounded">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">Purchases Excel</p>
              <p className="text-xs text-muted-foreground">Export all purchase records</p>
            </div>
          </button>

          <button
            onClick={() => exportInteractionsToExcel(interactions, customers)}
            className="w-full flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors text-left"
          >
            <div className="bg-primary text-primary-foreground p-2 rounded">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-foreground">Interactions Excel</p>
              <p className="text-xs text-muted-foreground">Export interaction history</p>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <span className="font-medium">Tip:</span> Reports are generated instantly and downloaded to your device.
          PDF reports include professional formatting suitable for business presentations.
        </p>
      </div>
    </div>
  );
}
