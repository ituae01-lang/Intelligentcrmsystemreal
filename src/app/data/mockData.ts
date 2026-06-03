// Mock data for the CRM system

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'Frequent' | 'Occasional' | 'New';
  joinDate: string;
  totalSpent: number;
  lastPurchase: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Purchase {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  amount: number;
  date: string;
}

export interface Interaction {
  id: string;
  customerId: string;
  type: 'Sale' | 'Inquiry' | 'Complaint' | 'Call' | 'Visit' | 'Follow-up';
  note: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  role: 'Owner' | 'Staff';
  name: string;
}

export const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Chinedu Okafor',
    email: 'chinedu.okafor@email.com',
    phone: '+234 803 456 7890',
    category: 'Frequent',
    joinDate: '2025-01-15',
    totalSpent: 145000,
    lastPurchase: '2026-05-28',
    location: 'Ozoro, Delta State'
  },
  {
    id: 'C002',
    name: 'Amina Bello',
    email: 'amina.bello@email.com',
    phone: '+234 805 123 4567',
    category: 'Frequent',
    joinDate: '2025-02-10',
    totalSpent: 89000,
    lastPurchase: '2026-05-30',
    location: 'Agbor, Delta State'
  },
  {
    id: 'C003',
    name: 'Emeka Nwankwo',
    email: 'emeka.n@email.com',
    phone: '+234 807 234 5678',
    category: 'Occasional',
    joinDate: '2025-03-20',
    totalSpent: 52000,
    lastPurchase: '2026-04-15',
    location: 'Ozoro, Delta State'
  },
  {
    id: 'C004',
    name: 'Fatima Yusuf',
    email: 'fatima.y@email.com',
    phone: '+234 809 345 6789',
    category: 'Occasional',
    joinDate: '2025-05-05',
    totalSpent: 34000,
    lastPurchase: '2026-05-20',
    location: 'Warri, Delta State'
  },
  {
    id: 'C005',
    name: 'Ibrahim Musa',
    email: 'ibrahim.m@email.com',
    phone: '+234 810 456 7890',
    category: 'New',
    joinDate: '2026-04-10',
    totalSpent: 18000,
    lastPurchase: '2026-05-25',
    location: 'Ozoro, Delta State'
  },
  {
    id: 'C006',
    name: 'Grace Adeola',
    email: 'grace.adeola@email.com',
    phone: '+234 812 567 8901',
    category: 'Frequent',
    joinDate: '2025-01-25',
    totalSpent: 128000,
    lastPurchase: '2026-05-29',
    location: 'Sapele, Delta State'
  },
  {
    id: 'C007',
    name: 'Yusuf Mohammed',
    email: 'yusuf.m@email.com',
    phone: '+234 813 678 9012',
    category: 'Occasional',
    joinDate: '2025-06-12',
    totalSpent: 41000,
    lastPurchase: '2026-03-18',
    location: 'Ozoro, Delta State'
  },
  {
    id: 'C008',
    name: 'Blessing Okoro',
    email: 'blessing.o@email.com',
    phone: '+234 814 789 0123',
    category: 'New',
    joinDate: '2026-05-01',
    totalSpent: 12000,
    lastPurchase: '2026-05-22',
    location: 'Ughelli, Delta State'
  }
];

export const mockProducts: Product[] = [
  { id: 'P001', name: 'Samsung Phone Charger', category: 'Accessories', price: 3500, stock: 45 },
  { id: 'P002', name: 'iPhone Cable (Lightning)', category: 'Accessories', price: 4200, stock: 38 },
  { id: 'P003', name: 'Power Bank 10000mAh', category: 'Accessories', price: 8500, stock: 22 },
  { id: 'P004', name: 'Bluetooth Earphones', category: 'Audio', price: 12000, stock: 18 },
  { id: 'P005', name: 'Phone Screen Protector', category: 'Accessories', price: 1500, stock: 67 },
  { id: 'P006', name: 'USB-C Cable', category: 'Accessories', price: 2800, stock: 54 },
  { id: 'P007', name: 'Wireless Headphones', category: 'Audio', price: 18000, stock: 12 },
  { id: 'P008', name: 'Phone Case (Universal)', category: 'Accessories', price: 2500, stock: 43 },
  { id: 'P009', name: 'Memory Card 64GB', category: 'Storage', price: 6500, stock: 29 },
  { id: 'P010', name: 'Car Phone Holder', category: 'Accessories', price: 3200, stock: 31 }
];

export const mockPurchases: Purchase[] = [
  { id: 'PU001', customerId: 'C001', productId: 'P001', quantity: 2, amount: 7000, date: '2026-05-28' },
  { id: 'PU002', customerId: 'C001', productId: 'P003', quantity: 1, amount: 8500, date: '2026-05-28' },
  { id: 'PU003', customerId: 'C002', productId: 'P004', quantity: 1, amount: 12000, date: '2026-05-30' },
  { id: 'PU004', customerId: 'C002', productId: 'P005', quantity: 3, amount: 4500, date: '2026-05-30' },
  { id: 'PU005', customerId: 'C003', productId: 'P002', quantity: 1, amount: 4200, date: '2026-04-15' },
  { id: 'PU006', customerId: 'C004', productId: 'P006', quantity: 2, amount: 5600, date: '2026-05-20' },
  { id: 'PU007', customerId: 'C005', productId: 'P008', quantity: 1, amount: 2500, date: '2026-05-25' },
  { id: 'PU008', customerId: 'C006', productId: 'P007', quantity: 1, amount: 18000, date: '2026-05-29' },
  { id: 'PU009', customerId: 'C006', productId: 'P009', quantity: 1, amount: 6500, date: '2026-05-29' },
  { id: 'PU010', customerId: 'C001', productId: 'P004', quantity: 2, amount: 24000, date: '2026-03-12' },
  { id: 'PU011', customerId: 'C001', productId: 'P005', quantity: 4, amount: 6000, date: '2026-03-12' },
  { id: 'PU012', customerId: 'C002', productId: 'P001', quantity: 1, amount: 3500, date: '2026-04-08' },
  { id: 'PU013', customerId: 'C008', productId: 'P010', quantity: 1, amount: 3200, date: '2026-05-22' }
];

export const mockInteractions: Interaction[] = [
  {
    id: 'I001',
    customerId: 'C001',
    type: 'Sale',
    note: 'Purchased chargers and power bank. Customer very satisfied.',
    date: '2026-05-28'
  },
  {
    id: 'I002',
    customerId: 'C002',
    type: 'Sale',
    note: 'Bought earphones and screen protectors for family members.',
    date: '2026-05-30'
  },
  {
    id: 'I003',
    customerId: 'C003',
    type: 'Complaint',
    note: 'Cable stopped working after 2 weeks. Offered replacement.',
    date: '2026-04-28'
  },
  {
    id: 'I004',
    customerId: 'C004',
    type: 'Inquiry',
    note: 'Asked about wireless earphones availability. Informed will restock next week.',
    date: '2026-05-18'
  },
  {
    id: 'I005',
    customerId: 'C005',
    type: 'Sale',
    note: 'First-time customer. Referred by Chinedu. Purchased phone case.',
    date: '2026-05-25'
  },
  {
    id: 'I006',
    customerId: 'C006',
    type: 'Sale',
    note: 'Regular customer. Bought headphones and memory card.',
    date: '2026-05-29'
  },
  {
    id: 'I007',
    customerId: 'C001',
    type: 'Follow-up',
    note: 'Called to confirm satisfaction with power bank. Very happy.',
    date: '2026-05-30'
  },
  {
    id: 'I008',
    customerId: 'C007',
    type: 'Visit',
    note: 'Browsed but did not purchase. Interested in headphones but price concern.',
    date: '2026-05-26'
  }
];

export const mockUsers: User[] = [
  { id: 'U001', username: 'admin', role: 'Owner', name: 'Business Owner' },
  { id: 'U002', username: 'staff1', role: 'Staff', name: 'Emmanuel Ade' }
];
