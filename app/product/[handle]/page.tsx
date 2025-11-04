import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from 'components/layout/footer';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import { mockProducts } from 'lib/mock-products';
import { getProduct } from 'lib/shopify';
import Link from 'next/link';
import { Suspense } from 'react';

// Helper function to get product emoji
function getProductEmoji(title: string): string {
  if (title.includes('T-Shirt')) return '👕';
  if (title.includes('Hoodie')) return '🧥';
  if (title.includes('Jeans')) return '👖';
  if (title.includes('Sneakers') || title.includes('Shoes')) return '👟';
  if (title.includes('Backpack')) return '🎒';
  if (title.includes('Water Bottle')) return '💧';
  if (title.includes('Jacket')) return '🧥';
  if (title.includes('Cap')) return '🧢';
  if (title.includes('Mug')) return '☕';
  if (title.includes('Socks')) return '🧦';
  if (title.includes('Notebook')) return '📓';
  return '🛍️';
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  // Try to get from mock products first
  const mockProduct = mockProducts.find((p) => p.handle === params.handle);

  if (mockProduct) {
    return {
      title: mockProduct.title,
      description: mockProduct.description,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true
        }
      }
    };
  }

  // Fallback to Shopify
  try {
    const product = await getProduct(params.handle);
    if (!product) return notFound();

    const { url, width, height, altText: alt } = product.featuredImage || {};

    return {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true
        }
      },
      openGraph: url
        ? {
            images: [
              {
                url,
                width,
                height,
                alt
              }
            ]
          }
        : null
    };
  } catch (error) {
    return notFound();
  }
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;

  // Try to get from mock products first
  const mockProduct = mockProducts.find((p) => p.handle === params.handle);

  if (mockProduct) {
    const emoji = getProductEmoji(mockProduct.title);

    const productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: mockProduct.title,
      description: mockProduct.description,
      offers: {
        '@type': 'AggregateOffer',
        availability: mockProduct.availableForSale
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        priceCurrency: mockProduct.priceRange.minVariantPrice.currencyCode,
        highPrice: mockProduct.priceRange.maxVariantPrice.amount,
        lowPrice: mockProduct.priceRange.minVariantPrice.amount
      }
    };

    return (
      <ProductProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd)
          }}
        />
        <div className="mx-auto max-w-screen-2xl px-4 py-8">
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
            {/* Product Image */}
            <div className="h-full w-full basis-full lg:basis-4/6">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-6 text-[200px]">{emoji}</div>
                    <p className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300">
                      {mockProduct.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="basis-full lg:basis-2/6">
              <Suspense fallback={null}>
                <ProductDescription product={mockProduct} />
              </Suspense>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts currentHandle={mockProduct.handle} />
        </div>
        <Footer />
      </ProductProvider>
    );
  }

  // Fallback to Shopify product
  try {
    const product = await getProduct(params.handle);
    if (!product) return notFound();

    const productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.featuredImage?.url,
      offers: {
        '@type': 'AggregateOffer',
        availability: product.availableForSale
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        priceCurrency: product.priceRange.minVariantPrice.currencyCode,
        highPrice: product.priceRange.maxVariantPrice.amount,
        lowPrice: product.priceRange.minVariantPrice.amount
      }
    };

    return (
      <ProductProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd)
          }}
        />
        <div className="mx-auto max-w-screen-2xl px-4 py-8">
          <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
            <div className="basis-full lg:basis-2/6">
              <Suspense fallback={null}>
                <ProductDescription product={product} />
              </Suspense>
            </div>
          </div>
        </div>
        <Footer />
      </ProductProvider>
    );
  } catch (error) {
    return notFound();
  }
}

async function RelatedProducts({ currentHandle }: { currentHandle: string }) {
  // Get related products from mock data (exclude current product)
  const relatedProducts = mockProducts
    .filter((p) => p.handle !== currentHandle)
    .slice(0, 4);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">Related Products</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {relatedProducts.map((product) => {
          const emoji = getProductEmoji(product.title);
          return (
            <Link
              key={product.handle}
              href={`/product/${product.handle}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <div className="flex h-full items-center justify-center">
                  <span className="text-6xl">{emoji}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">
                  {product.title}
                </h3>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  ${product.priceRange.minVariantPrice.amount}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
