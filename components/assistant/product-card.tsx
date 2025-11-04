'use client';

import Link from 'next/link';

interface ProductCardProps {
  product: {
    productHandle: string;
    title: string;
    description: string;
    price: string;
    availableForSale: boolean;
  };
}

function getProductEmoji(title: string): string {
  const lowerTitle = title.toLowerCase();

  // T-Shirts and Tees
  if (lowerTitle.includes('t-shirt') || lowerTitle.includes('tee')) return '👕';

  // Hoodies
  if (lowerTitle.includes('hoodie')) return '🧥';

  // Caps and Hats
  if (lowerTitle.includes('cap') || lowerTitle.includes('hat')) return '🧢';
  if (lowerTitle.includes('beanie')) return '🎩';

  // Bags
  if (lowerTitle.includes('backpack')) return '🎒';
  if (lowerTitle.includes('tote') || lowerTitle.includes('bag')) return '👜';
  if (lowerTitle.includes('messenger')) return '💼';

  // Drinkware
  if (lowerTitle.includes('water bottle') || lowerTitle.includes('sports bottle')) return '💧';
  if (lowerTitle.includes('mug') || lowerTitle.includes('travel mug')) return '☕';

  // Other clothing
  if (lowerTitle.includes('jeans') || lowerTitle.includes('pants')) return '👖';
  if (lowerTitle.includes('sneakers') || lowerTitle.includes('shoes')) return '👟';
  if (lowerTitle.includes('socks')) return '🧦';
  if (lowerTitle.includes('jacket')) return '🧥';

  // Accessories
  if (lowerTitle.includes('notebook')) return '📓';

  return '🛍️';
}

export function ProductCard({ product }: ProductCardProps) {
  const emoji = getProductEmoji(product.title);

  return (
    <Link
      href={`/product/${product.productHandle}`}
      className="block rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="flex gap-3 p-3">
        {/* Product Image/Icon */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <span className="text-3xl">{emoji}</span>
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {product.title}
            </h4>
            <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400">
              {product.description}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {product.price}
            </span>
            {product.availableForSale ? (
              <span className="text-xs text-green-600 dark:text-green-400">✓ In Stock</span>
            ) : (
              <span className="text-xs text-red-600 dark:text-red-400">✗ Out of Stock</span>
            )}
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="flex items-center">
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

