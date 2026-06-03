// AI Recommendation Engine using Collaborative Filtering

import { Purchase, Product, Customer } from '../data/mockData';

interface CustomerProductMatrix {
  [customerId: string]: {
    [productId: string]: number;
  };
}

/**
 * Calculate cosine similarity between two customer purchase vectors
 */
function cosineSimilarity(vector1: number[], vector2: number[]): number {
  if (vector1.length !== vector2.length) return 0;

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    mag1 += vector1[i] * vector1[i];
    mag2 += vector2[i] * vector2[i];
  }

  const magnitude1 = Math.sqrt(mag1);
  const magnitude2 = Math.sqrt(mag2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Build customer-product matrix from purchases
 */
function buildCustomerProductMatrix(purchases: Purchase[], allProducts: Product[]): CustomerProductMatrix {
  const matrix: CustomerProductMatrix = {};

  purchases.forEach(purchase => {
    if (!matrix[purchase.customerId]) {
      matrix[purchase.customerId] = {};
    }
    // Store quantity as the rating/preference score
    matrix[purchase.customerId][purchase.productId] =
      (matrix[purchase.customerId][purchase.productId] || 0) + purchase.quantity;
  });

  return matrix;
}

/**
 * Get product recommendations for a customer using collaborative filtering
 */
export function getRecommendationsForCustomer(
  targetCustomerId: string,
  purchases: Purchase[],
  products: Product[],
  customers: Customer[],
  topN: number = 5
): { product: Product; score: number; reason: string }[] {
  const matrix = buildCustomerProductMatrix(purchases, products);

  // Get all product IDs
  const allProductIds = products.map(p => p.id);

  // Get products already purchased by target customer
  const targetPurchasedProducts = new Set(
    purchases
      .filter(p => p.customerId === targetCustomerId)
      .map(p => p.productId)
  );

  // Build vectors for all customers
  const customerVectors: { [customerId: string]: number[] } = {};
  Object.keys(matrix).forEach(customerId => {
    customerVectors[customerId] = allProductIds.map(productId =>
      matrix[customerId]?.[productId] || 0
    );
  });

  // If target customer hasn't made purchases, recommend popular products
  if (!customerVectors[targetCustomerId]) {
    return getPopularProducts(purchases, products, topN);
  }

  // Find similar customers
  const similarities: { customerId: string; score: number }[] = [];
  Object.keys(customerVectors).forEach(customerId => {
    if (customerId !== targetCustomerId) {
      const similarity = cosineSimilarity(
        customerVectors[targetCustomerId],
        customerVectors[customerId]
      );
      if (similarity > 0) {
        similarities.push({ customerId, score: similarity });
      }
    }
  });

  // Sort by similarity
  similarities.sort((a, b) => b.score - a.score);

  // Get top 3 similar customers
  const topSimilarCustomers = similarities.slice(0, 3);

  // Aggregate product scores from similar customers
  const productScores: { [productId: string]: { score: number; buyers: string[] } } = {};

  topSimilarCustomers.forEach(({ customerId, score }) => {
    const similarCustomerProducts = matrix[customerId] || {};
    Object.keys(similarCustomerProducts).forEach(productId => {
      if (!targetPurchasedProducts.has(productId)) {
        if (!productScores[productId]) {
          productScores[productId] = { score: 0, buyers: [] };
        }
        productScores[productId].score += similarCustomerProducts[productId] * score;
        productScores[productId].buyers.push(customerId);
      }
    });
  });

  // Convert to recommendations array
  const recommendations = Object.entries(productScores)
    .map(([productId, { score, buyers }]) => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;

      // Create reason based on similar customers
      const buyerNames = buyers
        .slice(0, 2)
        .map(id => customers.find(c => c.id === id)?.name.split(' ')[0])
        .filter(Boolean);

      const reason = buyerNames.length > 0
        ? `Customers like ${buyerNames.join(' and ')} also purchased this`
        : 'Based on your purchase history';

      return { product, score, reason };
    })
    .filter((r): r is { product: Product; score: number; reason: string } => r !== null);

  // Sort by score and return top N
  recommendations.sort((a, b) => b.score - a.score);

  // If we don't have enough recommendations, add popular products
  if (recommendations.length < topN) {
    const popularProducts = getPopularProducts(purchases, products, topN - recommendations.length)
      .filter(p => !targetPurchasedProducts.has(p.product.id) &&
                   !recommendations.some(r => r.product.id === p.product.id));
    recommendations.push(...popularProducts);
  }

  return recommendations.slice(0, topN);
}

/**
 * Get popular products as fallback recommendations
 */
function getPopularProducts(
  purchases: Purchase[],
  products: Product[],
  topN: number
): { product: Product; score: number; reason: string }[] {
  const productCounts: { [productId: string]: number } = {};

  purchases.forEach(purchase => {
    productCounts[purchase.productId] = (productCounts[purchase.productId] || 0) + purchase.quantity;
  });

  return Object.entries(productCounts)
    .map(([productId, count]) => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;
      return {
        product,
        score: count,
        reason: 'Popular among all customers'
      };
    })
    .filter((r): r is { product: Product; score: number; reason: string } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Identify at-risk customers (haven't purchased recently)
 */
export function getAtRiskCustomers(
  customers: Customer[],
  daysSinceLastPurchase: number = 45
): Customer[] {
  const today = new Date();

  return customers.filter(customer => {
    const lastPurchaseDate = new Date(customer.lastPurchase);
    const daysDiff = Math.floor((today.getTime() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > daysSinceLastPurchase && customer.category !== 'New';
  });
}
