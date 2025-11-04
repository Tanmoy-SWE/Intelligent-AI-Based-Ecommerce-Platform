'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalMessages: number;
  totalSessions: number;
  totalSearches: number;
  missingProducts: number;
  topSearches: Array<{ search_query: string; count: number }>;
  topMissing: Array<{ search_query: string; count: number }>;
  messagesPerDay: Array<{ date: string; count: number }>;
}

interface AIInsights {
  hotProducts: string[];
  trendingCategories: string[];
  customerIntent: string[];
  recommendations: string[];
  summary: string;
}

interface InsightsData {
  summary: {
    totalQueries: number;
    successfulSearches: number;
    failedSearches: number;
    avgProductsPerSearch: number;
    successRate: string;
  };
  aiInsights: AIInsights;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchAnalytics(token);
    fetchInsights(token);
  }, [router, days]);

  const fetchAnalytics = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          router.push('/admin');
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsights = async (token: string) => {
    setIsLoadingInsights(true);
    try {
      const response = await fetch(`/api/admin/insights?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setInsights(data.data);
      } else {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          router.push('/admin');
        }
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600 dark:border-neutral-700 dark:border-t-blue-500"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                📊 Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Chat analytics and user insights
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="mb-6 flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Time Range:
          </label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Messages"
            value={analytics.totalMessages}
            icon="💬"
            color="blue"
          />
          <StatCard
            title="Chat Sessions"
            value={analytics.totalSessions}
            icon="👥"
            color="green"
          />
          <StatCard
            title="Product Searches"
            value={analytics.totalSearches}
            icon="🔍"
            color="purple"
          />
          <StatCard
            title="Missing Products"
            value={analytics.missingProducts}
            icon="⚠️"
            color="red"
          />
        </div>

        {/* AI Insights Section */}
        {isLoadingInsights ? (
          <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-600 dark:border-neutral-700 dark:border-t-blue-500"></div>
              <span className="ml-3 text-neutral-600 dark:text-neutral-400">
                Generating AI insights...
              </span>
            </div>
          </div>
        ) : insights ? (
          <div className="mb-8 space-y-6">
            {/* AI Summary */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
              <h2 className="mb-3 flex items-center text-lg font-semibold text-blue-900 dark:text-blue-100">
                <span className="mr-2 text-2xl">🤖</span>
                AI-Powered Insights
              </h2>
              <p className="text-sm text-blue-800 dark:text-blue-200">{insights.aiInsights.summary}</p>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Hot Products */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-neutral-900 dark:text-white">
                  <span className="mr-2 text-xl">🔥</span>
                  Hot Products
                </h3>
                {insights.aiInsights.hotProducts.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.aiInsights.hotProducts.map((product, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="mr-2 text-orange-500">•</span>
                        {product}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Not enough data yet
                  </p>
                )}
              </div>

              {/* Trending Categories */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-neutral-900 dark:text-white">
                  <span className="mr-2 text-xl">📊</span>
                  Trending Categories
                </h3>
                {insights.aiInsights.trendingCategories.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.aiInsights.trendingCategories.map((category, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="mr-2 text-purple-500">•</span>
                        {category}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Not enough data yet
                  </p>
                )}
              </div>

              {/* Customer Intent */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-neutral-900 dark:text-white">
                  <span className="mr-2 text-xl">💡</span>
                  Customer Intent
                </h3>
                {insights.aiInsights.customerIntent.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.aiInsights.customerIntent.map((intent, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="mr-2 text-blue-500">•</span>
                        {intent}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Not enough data yet
                  </p>
                )}
              </div>

              {/* Recommendations */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-neutral-900 dark:text-white">
                  <span className="mr-2 text-xl">✨</span>
                  Recommendations
                </h3>
                {insights.aiInsights.recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.aiInsights.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="mr-2 text-green-500">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Not enough data yet
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Searches */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              🔥 Top Search Queries
            </h2>
            {analytics.topSearches.length > 0 ? (
              <div className="space-y-3">
                {analytics.topSearches.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {item.search_query}
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{
                            width: `${analytics.topSearches[0] ? (item.count / analytics.topSearches[0].count) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No search data available
              </p>
            )}
          </div>

          {/* Missing Products */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              ❌ Most Requested Missing Products
            </h2>
            {analytics.topMissing.length > 0 ? (
              <div className="space-y-3">
                {analytics.topMissing.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {item.search_query}
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{
                            width: `${analytics.topMissing[0] ? (item.count / analytics.topMissing[0].count) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No missing product requests
              </p>
            )}
          </div>

          {/* Messages Per Day */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              📈 Messages Per Day
            </h2>
            {analytics.messagesPerDay.length > 0 ? (
              <div className="space-y-2">
                {analytics.messagesPerDay.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="h-8 w-full rounded bg-neutral-100 dark:bg-neutral-800">
                        <div
                          className="h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{
                            width: `${(item.count / Math.max(...analytics.messagesPerDay.map((d) => d.count))) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No message data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-full p-3 text-2xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

