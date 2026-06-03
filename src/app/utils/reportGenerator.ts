import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Customer, Purchase, Product, Interaction } from '../data/mockData';

/**
 * Generate PDF report for sales summary
 */
export function generateSalesReportPDF(
  purchases: Purchase[],
  products: Product[],
  customers: Customer[]
) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('Sales Summary Report', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text('SME CRM System - Southern Delta University', 14, 34);

  // Summary statistics
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalSales = purchases.length;
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  doc.setFontSize(12);
  doc.text('Summary Statistics', 14, 45);

  doc.setFontSize(10);
  doc.text(`Total Revenue: ₦${totalRevenue.toLocaleString()}`, 14, 52);
  doc.text(`Total Sales: ${totalSales}`, 14, 58);
  doc.text(`Average Order Value: ₦${avgOrderValue.toLocaleString()}`, 14, 64);

  // Sales table
  const tableData = purchases.map(purchase => {
    const product = products.find(p => p.id === purchase.productId);
    const customer = customers.find(c => c.id === purchase.customerId);
    return [
      purchase.date,
      customer?.name || 'Unknown',
      product?.name || 'Unknown',
      purchase.quantity.toString(),
      `₦${purchase.amount.toLocaleString()}`
    ];
  });

  autoTable(doc, {
    head: [['Date', 'Customer', 'Product', 'Qty', 'Amount']],
    body: tableData,
    startY: 75,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] }
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`sales_report_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Generate PDF report for customer activity
 */
export function generateCustomerReportPDF(
  customers: Customer[],
  purchases: Purchase[],
  interactions: Interaction[]
) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Customer Activity Report', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text('SME CRM System', 14, 34);

  // Customer table
  const tableData = customers.map(customer => {
    const customerPurchases = purchases.filter(p => p.customerId === customer.id).length;
    const customerInteractions = interactions.filter(i => i.customerId === customer.id).length;

    return [
      customer.name,
      customer.phone,
      customer.category,
      `₦${customer.totalSpent.toLocaleString()}`,
      customerPurchases.toString(),
      customerInteractions.toString(),
      customer.lastPurchase
    ];
  });

  autoTable(doc, {
    head: [['Name', 'Phone', 'Category', 'Total Spent', 'Purchases', 'Interactions', 'Last Purchase']],
    body: tableData,
    startY: 45,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 25 },
      2: { cellWidth: 20 }
    }
  });

  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`customer_report_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Export customers to Excel
 */
export function exportCustomersToExcel(customers: Customer[], purchases: Purchase[]) {
  const data = customers.map(customer => {
    const customerPurchases = purchases.filter(p => p.customerId === customer.id);
    const purchaseCount = customerPurchases.length;

    return {
      'Customer ID': customer.id,
      'Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone,
      'Category': customer.category,
      'Location': customer.location,
      'Join Date': customer.joinDate,
      'Total Spent (₦)': customer.totalSpent,
      'Purchase Count': purchaseCount,
      'Last Purchase': customer.lastPurchase
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

  // Set column widths
  const colWidths = [
    { wch: 12 }, { wch: 25 }, { wch: 30 }, { wch: 18 },
    { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 15 },
    { wch: 12 }, { wch: 15 }
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `customers_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export purchases to Excel
 */
export function exportPurchasesToExcel(
  purchases: Purchase[],
  customers: Customer[],
  products: Product[]
) {
  const data = purchases.map(purchase => {
    const customer = customers.find(c => c.id === purchase.customerId);
    const product = products.find(p => p.id === purchase.productId);

    return {
      'Purchase ID': purchase.id,
      'Date': purchase.date,
      'Customer Name': customer?.name || 'Unknown',
      'Customer Phone': customer?.phone || '',
      'Product Name': product?.name || 'Unknown',
      'Product Category': product?.category || '',
      'Quantity': purchase.quantity,
      'Amount (₦)': purchase.amount
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchases');

  worksheet['!cols'] = [
    { wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 18 },
    { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 12 }
  ];

  XLSX.writeFile(workbook, `purchases_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export interactions to Excel
 */
export function exportInteractionsToExcel(
  interactions: Interaction[],
  customers: Customer[]
) {
  const data = interactions.map(interaction => {
    const customer = customers.find(c => c.id === interaction.customerId);

    return {
      'Interaction ID': interaction.id,
      'Date': interaction.date,
      'Customer Name': customer?.name || 'Unknown',
      'Customer Phone': customer?.phone || '',
      'Type': interaction.type,
      'Notes': interaction.note
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Interactions');

  worksheet['!cols'] = [
    { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 18 },
    { wch: 12 }, { wch: 50 }
  ];

  XLSX.writeFile(workbook, `interactions_${new Date().toISOString().split('T')[0]}.xlsx`);
}
