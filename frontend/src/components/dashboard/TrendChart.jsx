import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Icon } from "../ui/EnhancedIcon";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/**
 * TrendChart component for displaying time-series data using Chart.js
 */
export const TrendChart = ({
  data = [],
  metrics = ["personDays", "households", "fundsSpent"],
  height = 300,
  title,
  subtitle,
  loading = false,
  error = null,
  variant = "line", // 'line' or 'bar'
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className = "",
  colors = {
    personDays: "#34a05f",
    households: "#f97316",
    fundsSpent: "#2563eb",
    completionRate: "#16a34a",
  },
  ...props
}) => {
  const [activeMetrics, setActiveMetrics] = useState(metrics);
  const [focusedMetric, setFocusedMetric] = useState(null);
  const chartRef = useRef();

  // Process data for chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const processedData = data.map((item, index) => ({
      index,
      month: item.month || `Month ${index + 1}`,
      date: item.date,
      year: item.year,
      ...item,
      fundsSpentDisplay: (item.fundsSpent || 0) / 100000, // Convert to lakhs
    }));

    const labels = processedData.map((item) => item.month);

    const datasets = activeMetrics.map((metric) => {
      const color = colors[metric] || "#6b7280";
      const isHighlighted = !focusedMetric || focusedMetric === metric;
      const dataKey = metric === "fundsSpent" ? "fundsSpentDisplay" : metric;

      return {
        label: getMetricLabel(metric),
        data: processedData.map((item) => item[dataKey] || 0),
        borderColor: color,
        backgroundColor: variant === "line" ? `${color}20` : color,
        borderWidth: isHighlighted ? 2 : 1,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: isHighlighted ? 4 : 3,
        pointHoverRadius: 6,
        fill: variant === "line" ? false : true,
        tension: 0.4,
        opacity: isHighlighted ? 1 : 0.7,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [data, activeMetrics, focusedMetric, colors, variant]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: showLegend,
          position: "top",
          align: "start",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: "500",
            },
            color: "#374151",
            generateLabels: (chart) => {
              const original =
                ChartJS.defaults.plugins.legend.labels.generateLabels;
              const labels = original.call(this, chart);

              return labels.map((label, index) => ({
                ...label,
                fillStyle: activeMetrics.includes(metrics[index])
                  ? label.fillStyle
                  : "#d1d5db",
                strokeStyle: activeMetrics.includes(metrics[index])
                  ? label.strokeStyle
                  : "#d1d5db",
              }));
            },
          },
          onClick: (event, legendItem, legend) => {
            const metric = metrics[legendItem.datasetIndex];
            toggleMetric(metric);
          },
        },
        tooltip: {
          enabled: showTooltip,
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          titleColor: "#111827",
          bodyColor: "#374151",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            title: (context) => {
              return context[0]?.label || "";
            },
            label: (context) => {
              const metric = metrics[context.datasetIndex];
              const value = context.parsed.y;
              return `${getMetricLabel(metric)}: ${formatMetricValue(metric, value)}`;
            },
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: showGrid,
            color: "#f3f4f6",
            borderDash: [3, 3],
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
            },
            maxRotation: 45,
          },
          border: {
            display: false,
          },
        },
        y: {
          display: true,
          grid: {
            display: showGrid,
            color: "#f3f4f6",
            borderDash: [3, 3],
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
            },
            callback: (value) => {
              return formatAxisValue(value);
            },
          },
          border: {
            display: false,
          },
        },
      },
      elements: {
        point: {
          hoverRadius: 8,
        },
      },
    }),
    [showLegend, showTooltip, showGrid, activeMetrics, metrics],
  );

  // Get metric label for display
  const getMetricLabel = (metric) => {
    const labels = {
      personDays: "Person Days",
      households: "Households",
      fundsSpent: "Funds Spent",
      fundsSpentDisplay: "Funds (₹ Lakhs)",
      completionRate: "Completion Rate",
    };
    return labels[metric] || metric;
  };

  // Format metric values for display
  const formatMetricValue = (metric, value) => {
    if (!value && value !== 0) return "N/A";

    switch (metric) {
      case "fundsSpent":
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value);
      case "fundsSpentDisplay":
        return `₹${value.toFixed(1)}L`;
      case "completionRate":
        return `${value}%`;
      case "personDays":
      case "households":
        return new Intl.NumberFormat("en-IN").format(value);
      default:
        return value;
    }
  };

  // Format axis values
  const formatAxisValue = (value) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  // Toggle metric visibility
  const toggleMetric = (metric) => {
    if (activeMetrics.includes(metric)) {
      setActiveMetrics(activeMetrics.filter((m) => m !== metric));
    } else {
      setActiveMetrics([...activeMetrics, metric]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg p-6 ${className}`}
        style={{ height }}
      >
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-4/6"></div>
              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
              <div className="h-2 bg-gray-200 rounded w-3/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`bg-white rounded-lg p-6 ${className}`}
        style={{ height }}
      >
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Icon
            name="exclamation-triangle"
            size="xl"
            color="error"
            className="mb-4"
          />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Chart Error
          </h4>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!chartData || chartData.labels.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg p-6 ${className}`}
        style={{ height }}
      >
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Icon name="chart-line" size="xl" color="gray" className="mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Data Available
          </h4>
          <p className="text-gray-600">
            There's no trend data to display at this time.
          </p>
        </div>
      </div>
    );
  }

  // Render chart
  const ChartComponent = variant === "bar" ? Bar : Line;

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`} {...props}>
      {/* Header */}
      {title && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon
                  name="chart-line"
                  size="base"
                  color="primary"
                  className="mr-2"
                />
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>

            {/* Chart controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVariant(variant === "line" ? "bar" : "line")}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title={`Switch to ${variant === "line" ? "bar" : "line"} chart`}
              >
                <Icon name="chart-bar" size="sm" />
              </button>
            </div>
          </div>

          {/* Custom Legend with Toggle */}
          {showLegend && (
            <div className="mt-4 flex flex-wrap gap-4">
              {metrics.map((metric) => (
                <button
                  key={metric}
                  onClick={() => toggleMetric(metric)}
                  onMouseEnter={() => setFocusedMetric(metric)}
                  onMouseLeave={() => setFocusedMetric(null)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                    activeMetrics.includes(metric)
                      ? "bg-gray-100 text-gray-900"
                      : "bg-gray-50 text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[metric] || "#6b7280" }}
                  />
                  <span className="font-medium">{getMetricLabel(metric)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height: height - (title ? 100 : 0) }} className="w-full">
        <ChartComponent
          ref={chartRef}
          data={chartData}
          options={chartOptions}
        />
      </div>

      {/* Footer with insights */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>📊 {chartData.labels.length} data points</span>
            <span>📈 {activeMetrics.length} active metrics</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="information-circle" size="xs" />
            <span>Click legend items to toggle visibility</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Simple trend chart for smaller spaces
 */
export const SimpleTrendChart = ({
  data = [],
  metric = "personDays",
  color = "#34a05f",
  height = 100,
  className = "",
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      labels: data.map((item, index) => item.month || `Month ${index + 1}`),
      datasets: [
        {
          data: data.map((item) => item[metric] || 0),
          borderColor: color,
          backgroundColor: `${color}20`,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }, [data, metric, color]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  if (!chartData) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-400 text-sm">No trend data</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
