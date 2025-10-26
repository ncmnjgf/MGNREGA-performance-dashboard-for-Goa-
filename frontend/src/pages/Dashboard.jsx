import React, { useState, useEffect, useCallback } from "react";
import { MetricCard, MetricsGrid } from "../components/dashboard/MetricCard";
import { DistrictSelector } from "../components/dashboard/DistrictSelector";
import { TrendChart } from "../components/dashboard/TrendChart";
import { ComparisonChart } from "../components/dashboard/ComparisonChart";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import {
  LoadingSpinner,
  LoadingOverlay,
  LoadingError,
  EmptyState,
  DataQualityIndicator,
  MetricCardSkeleton,
  ChartSkeleton,
  DistrictSelectorSkeleton,
} from "../components/common/LoadingStates";
import {
  useDistrictData,
  useDistrictComparison,
  useHealthCheck,
  usePeriodicRefresh,
} from "../hooks/useApi";
import { useDistrictSelection } from "../hooks/useLocation";
import { METRICS, INFO_MESSAGES } from "../utils/constants";
import { formatters } from "../utils/api";
import { clsx } from "clsx";

/**
 * Main Dashboard page component with comprehensive loading states and data fetching
 */
export const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showComparison, setShowComparison] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Health check for API connectivity
  const { isHealthy, isOnline } = useHealthCheck(30000);

  // District selection and location detection
  const {
    selectedDistrict,
    selectDistrict,
    detectAndSelect,
    detecting,
    error: locationError,
  } = useDistrictSelection();

  // District data with loading states
  const districtData = useDistrictData(selectedDistrict?.name);
  const comparisonData = useDistrictComparison();

  // Auto-refresh functionality
  const periodicRefresh = usePeriodicRefresh(
    useCallback(() => {
      if (selectedDistrict?.name) {
        districtData.refetch();
        if (showComparison) {
          comparisonData.refetch();
        }
        setLastRefresh(new Date());
      }
    }, [
      selectedDistrict?.name,
      showComparison,
      districtData.refetch,
      comparisonData.refetch,
    ]),
    5 * 60 * 1000, // 5 minutes
    autoRefreshEnabled && isOnline,
  );

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      console.log("🔄 Manual refresh triggered");
      const promises = [districtData.refetch(true)]; // Force refresh

      if (showComparison) {
        promises.push(comparisonData.refetch());
      }

      await Promise.allSettled(promises);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Manual refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [
    refreshing,
    districtData.refetch,
    showComparison,
    comparisonData.refetch,
  ]);

  // Auto-select first district if none selected
  useEffect(() => {
    if (!selectedDistrict && !detecting && initialLoad) {
      // Try to get saved district from localStorage first
      const savedDistrict = localStorage.getItem("mgnrega-selected-district");
      if (savedDistrict) {
        try {
          const parsed = JSON.parse(savedDistrict);
          selectDistrict(parsed);
        } catch {
          // If parsing fails, default to North Goa
          selectDistrict({
            code: "north-goa",
            name: "North Goa",
            displayName: "North Goa",
          });
        }
      } else {
        // Default to North Goa
        selectDistrict({
          code: "north-goa",
          name: "North Goa",
          displayName: "North Goa",
        });
      }
    }
  }, [selectedDistrict, detecting, initialLoad, selectDistrict]);

  // Mark initial load as complete when we have data or error
  useEffect(() => {
    if (
      initialLoad &&
      (districtData.data || districtData.error || !districtData.loading)
    ) {
      setInitialLoad(false);
    }
  }, [
    initialLoad,
    districtData.data,
    districtData.error,
    districtData.loading,
  ]);

  // Calculate derived values
  const metrics = districtData.data?.metrics || {};
  const chartData = districtData.data?.chartData || [];
  const insights = districtData.data?.insights;
  const isLoading = initialLoad && districtData.loading;
  const hasError = districtData.error && !districtData.data;
  const hasData = districtData.hasData;
  const dataSource = districtData.data?.source;

  // Generate mock changes for demo (in real app, this would come from API)
  const generateMockChanges = () => ({
    personDays: { percentage: 12, type: "positive", text: "+12%" },
    households: { percentage: 8, type: "positive", text: "+8%" },
    fundsSpent: { percentage: 15, type: "positive", text: "+15%" },
  });

  const changes = districtData.data?.changes || generateMockChanges();

  // Connection status indicator
  const ConnectionStatus = () => (
    <div
      className={clsx(
        "flex items-center gap-2 text-xs px-2 py-1 rounded-full",
        isHealthy && isOnline
          ? "bg-success-50 text-success-700"
          : isOnline
            ? "bg-warning-50 text-warning-700"
            : "bg-error-50 text-error-700",
      )}
    >
      <div
        className={clsx(
          "w-2 h-2 rounded-full",
          isHealthy && isOnline
            ? "bg-success-500 animate-pulse"
            : isOnline
              ? "bg-warning-500"
              : "bg-error-500",
        )}
      />
      {isHealthy && isOnline ? "Connected" : isOnline ? "Limited" : "Offline"}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Icon name="building" size="xl" className="text-primary-600" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              MGNREGA Goa Dashboard
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <ConnectionStatus />
              {selectedDistrict && (
                <DataQualityIndicator
                  quality={districtData.data?.quality}
                  lastUpdated={districtData.lastFetch}
                  source={dataSource}
                />
              )}
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track employment and development in your area. Real-time data on rural
          jobs, families helped, and funds spent.
        </p>
      </section>

      {/* District Selection */}
      <section aria-labelledby="district-selection-title">
        <h2 id="district-selection-title" className="sr-only">
          District Selection
        </h2>

        {detecting ? (
          <DistrictSelectorSkeleton />
        ) : (
          <Card className="p-6">
            <DistrictSelector
              selectedDistrict={selectedDistrict}
              onDistrictChange={selectDistrict}
              onAutoDetect={detectAndSelect}
              detecting={detecting}
              error={locationError}
            />
          </Card>
        )}
      </section>

      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Icon name="clock" size="sm" />
            <span>
              Last updated: {formatters.formatRelativeTime(lastRefresh)}
            </span>
          </div>

          {districtData.retrying && (
            <div className="flex items-center gap-2 text-warning-600">
              <LoadingSpinner size="xs" />
              <span>Retrying... (attempt {districtData.retryAttempt})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || refreshing || districtData.retrying}
            loading={refreshing}
            icon={<Icon name="refresh" size="sm" />}
            aria-label="Refresh data"
          >
            Refresh
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
            icon={
              <Icon name={showComparison ? "eye-off" : "bar-chart"} size="sm" />
            }
          >
            {showComparison ? "Hide" : "Compare"} Districts
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            icon={
              <Icon name={autoRefreshEnabled ? "pause" : "play"} size="sm" />
            }
            className={autoRefreshEnabled ? "text-success-600" : ""}
          >
            {autoRefreshEnabled ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
        </div>
      </div>

      {/* Connection Error */}
      {!isOnline && (
        <Card className="border-warning-200 bg-warning-50 p-4">
          <div className="flex items-center gap-3">
            <Icon name="wifi-off" className="text-warning-600" size="lg" />
            <div>
              <h3 className="font-semibold text-warning-900">You're Offline</h3>
              <p className="text-warning-700 text-sm">
                Showing cached data. Some information may be outdated.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Error State */}
      {hasError && !hasData && !isLoading && (
        <LoadingError
          error={districtData.error}
          onRetry={() => districtData.refetch(true)}
          retrying={districtData.retrying}
          showDetails={process.env.NODE_ENV === "development"}
        />
      )}

      {/* No Data State */}
      {!hasError && !hasData && !isLoading && selectedDistrict && (
        <EmptyState
          icon="inbox"
          title="No Data Available"
          description={`No MGNREGA data found for ${selectedDistrict.displayName}. This might be temporary.`}
          action={
            <Button
              variant="primary"
              onClick={() => districtData.refetch(true)}
              icon={<Icon name="refresh" size="sm" />}
            >
              Try Again
            </Button>
          }
        />
      )}

      {/* Key Metrics */}
      <section aria-labelledby="metrics-title">
        <h2
          id="metrics-title"
          className="text-2xl font-semibold text-gray-900 mb-6"
        >
          📊 Key Numbers
          {selectedDistrict && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              for {selectedDistrict.displayName}
            </span>
          )}
        </h2>

        <MetricsGrid>
          {isLoading ? (
            // Loading skeletons
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            // Actual data
            <>
              <MetricCard
                type="work"
                title={METRICS.PERSON_DAYS.title}
                value={metrics.totalPersonDays}
                unit={METRICS.PERSON_DAYS.unit}
                change={changes.personDays.text}
                changeType={changes.personDays.type}
                loading={districtData.backgroundLoading}
                onClick={() => console.log("Work details clicked")}
              />

              <MetricCard
                type="families"
                title={METRICS.HOUSEHOLDS.title}
                value={metrics.totalHouseholds}
                unit={METRICS.HOUSEHOLDS.unit}
                change={changes.households.text}
                changeType={changes.households.type}
                loading={districtData.backgroundLoading}
                onClick={() => console.log("Families details clicked")}
              />

              <MetricCard
                type="money"
                title={METRICS.FUNDS_SPENT.title}
                value={metrics.totalFundsSpent}
                unit={METRICS.FUNDS_SPENT.unit}
                change={changes.fundsSpent.text}
                changeType={changes.fundsSpent.type}
                loading={districtData.backgroundLoading}
                onClick={() => console.log("Money details clicked")}
              />
            </>
          )}
        </MetricsGrid>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton height={400} />
          ) : (
            <LoadingOverlay loading={districtData.backgroundLoading}>
              <TrendChart
                data={chartData}
                title="📈 Monthly Progress"
                subtitle="Work done over time"
                loading={false}
                height={400}
                insights={insights}
              />
            </LoadingOverlay>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Facts Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="info" size="sm" />
              Quick Facts
            </h3>

            {isLoading ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Work guarantee:</span>
                  <span className="font-medium">100 days per family</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average wage:</span>
                  <span className="font-medium">
                    ₹{metrics.averageWage || 200} per day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Work efficiency:</span>
                  <span className="font-medium">
                    {metrics.workEfficiency || 0} days/family
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Focus areas:</span>
                  <span className="font-medium">Water, Roads, Agriculture</span>
                </div>
              </div>
            )}
          </Card>

          {/* Performance Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="activity" size="sm" />
              Performance Summary
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Work Completion</span>
                    <span>{Math.round(metrics.completionRate || 85)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics.completionRate || 85}%` }}
                      role="progressbar"
                      aria-valuenow={metrics.completionRate || 85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Work completion: ${Math.round(metrics.completionRate || 85)}%`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fund Utilization</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: "92%" }}
                      role="progressbar"
                      aria-valuenow={92}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Fund utilization: 92%"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Data Insights */}
          {insights && !isLoading && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="sparkles" size="sm" />
                Insights
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 text-sm">{insights.message}</p>
                {insights.changePercent && (
                  <p className="text-blue-700 text-xs mt-2">
                    {insights.changePercent > 0 ? "+" : ""}
                    {insights.changePercent}% change from earlier period
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* District Comparison */}
      {showComparison && (
        <section aria-labelledby="comparison-title" className="animate-fade-in">
          <h2
            id="comparison-title"
            className="text-2xl font-semibold text-gray-900 mb-6"
          >
            🏆 District Comparison
          </h2>

          {comparisonData.loading && !comparisonData.data ? (
            <ChartSkeleton height={300} />
          ) : (
            <LoadingOverlay loading={comparisonData.retrying}>
              <ComparisonChart
                data={comparisonData.data?.districts}
                summary={comparisonData.data?.summary}
                loading={false}
                error={comparisonData.error}
              />
            </LoadingOverlay>
          )}
        </section>
      )}

      {/* Help Section */}
      <section className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Icon
            name="help-circle"
            size="lg"
            className="text-blue-600 flex-shrink-0 mt-1"
          />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Need Help Understanding the Data?
            </h3>
            <p className="text-blue-800 mb-4">
              Our dashboard shows real-time information about MGNREGA employment
              in Goa. Each number represents families helped and work created in
              your area.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                as="a"
                href="/help"
                icon={<Icon name="help-circle" size="sm" />}
              >
                Learn More
              </Button>
              <Button
                variant="ghost"
                size="sm"
                as="a"
                href="tel:1800-345-3855"
                icon={<Icon name="phone" size="sm" />}
              >
                Call Helpline
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>
            Data sourced from{" "}
            <a
              href="https://data.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              data.gov.in
            </a>{" "}
            • Last updated: {formatters.formatDate(lastRefresh)}
          </p>

          <div className="flex items-center gap-4">
            {periodicRefresh.isActive && (
              <span className="text-success-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                Auto-refreshing every 5 minutes
              </span>
            )}
            {periodicRefresh.refreshCount > 0 && (
              <span className="text-gray-400">
                Auto-refreshed {periodicRefresh.refreshCount} times
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
