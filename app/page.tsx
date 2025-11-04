import { mockProducts } from 'lib/mock-products';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const PRODUCTS_PER_PAGE = 6;

export const metadata = {
  title: 'Products',
  description: 'Browse our product catalog',
  openGraph: {
    type: 'website'
  }
};

function ProductCard({ product }: { product: (typeof mockProducts)[0] }) {
  return (
    <Link
      href={`/product/${product.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
            <div className="text-center">
              <div className="mb-4 text-6xl">
                {product.title.includes('T-Shirt') && '👕'}
                {product.title.includes('Hoodie') && '🧥'}
                {product.title.includes('Cap') && '🧢'}
                {product.title.includes('Hat') && '🧢'}
                {product.title.includes('Beanie') && '🧢'}
                {product.title.includes('Water Bottle') && '💧'}
                {product.title.includes('Backpack') && '🎒'}
                {product.title.includes('Bag') && '🎒'}
                {product.title.includes('Mug') && '☕'}
                {product.title.includes('Socks') && '🧦'}
                {product.title.includes('Notebook') && '📓'}
                {!product.title.match(/T-Shirt|Tee|Hoodie|Cap|Hat|Beanie|Water Bottle|Backpack|Bag|Mug|Socks|Notebook/) && '🛍️'}
              </div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {product.title}
              </p>
            </div>
          </div>
        )}
        {!product.availableForSale && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-sm font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
          {product.title}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              ${product.priceRange.minVariantPrice.amount}
            </span>
            {product.priceRange.minVariantPrice.amount !==
              product.priceRange.maxVariantPrice.amount && (
              <span className="text-xs text-neutral-500">
                - ${product.priceRange.maxVariantPrice.amount}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
            View Details →
          </span>
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function ProductGrid({ products }: { products: (typeof mockProducts) }) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-neutral-600 dark:text-neutral-400">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          ← Previous
        </Link>
      )}

      <div className="flex gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={`/?page=${page}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Next →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const totalProducts = mockProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Calculate pagination
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = mockProducts.slice(startIndex, endIndex);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Our Products
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
        </p>
      </div>

      {/* Product Grid */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Image skeleton */}
                <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700"></div>
                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-6 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      >
        <ProductGrid products={paginatedProducts} />
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}

      {/* AI Assistant CTA */}
      <div className="mt-16 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-950">
        <h2 className="mb-2 text-xl font-semibold text-blue-900 dark:text-blue-100">
          Need help finding the perfect product?
        </h2>
        <p className="mb-4 text-blue-700 dark:text-blue-300">
          Try our AI-powered product assistant! Click the blue chat button in the bottom-right
          corner.
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Ask questions like "Show me winter clothing" or "I need a hoodie"
        </p>
      </div>
    </div>
  );
}
