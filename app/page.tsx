import Footer from 'components/layout/footer';
import Link from 'next/link';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 py-20">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-black dark:text-white md:text-6xl">
            Welcome to Next.js Commerce
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            High-performance ecommerce store built with Next.js, Vercel, and AI-powered product recommendations.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse Products
            </Link>
            <Link
              href="/search"
              className="rounded-lg border border-neutral-300 bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
            >
              Search
            </Link>
          </div>

          {/* Features */}
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
              <div className="mb-3 text-3xl">🛍️</div>
              <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">
                Product Catalog
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Browse our curated collection of products with detailed information and images.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
              <div className="mb-3 text-3xl">🤖</div>
              <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">
                AI Assistant
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Get personalized product recommendations using our AI-powered chat assistant.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
              <div className="mb-3 text-3xl">🔍</div>
              <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">
                Smart Search
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Find exactly what you're looking for with our semantic search powered by AI.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
              Try the AI Assistant
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              Click the blue chat button in the bottom-right corner to interact with our AI-powered product assistant.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
