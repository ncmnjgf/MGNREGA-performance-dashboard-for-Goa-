import React, { useMemo, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Icon } from "../ui/EnhancedIcon";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/**
 * ComparisonChart component for comparing data across districts or time periods
 */
export const ComparisonChart = ({
  data = [],
  districts = [],
  selectedDistrict,
  metrics = ["personDays", "households", "fundsSpent"],
  height = 400,
  title = "District Comparison",
  subtitle,
  loading = false,
  error = null,
  variant = "bar", // 'bar', 'pie', 'line'
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className = "",
  colors = {
    personDays: "#34a05f",
    households: "#f97316",
    fundsSpent: "#2563eb",
    completionRate: "#16a34a",
    default: ["#34a05f", "#f97316", "#2563eb", "#16a34a", "#8b5cf6", "#ef4444"],
  },
  summary,
  ...props
}) => {
  const [activeMetric, setActiveMetric] = useState(metrics[0]);
  const [viewMode, setViewMode] = useState("absolute"); // 'absolute' or 'percentage'
  const [sortBy, setSortBy] = useState("value"); // 'value' or 'name'
  const chartRef = useRef();

  // Process data for comparison
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    let processedData = data.map((item, index) => {
      const districtInfo = districts.find(
        (d) => d.code === item.districtCode,
      ) || { name: item.district || `District ${index + 1}` };

      return {
        name: districtInfo.name,
        district: item.district || districtInfo.name,
        districtCode: item.districtCode,
        personDays: item.personDays || 0,
        households: item.households || 0,
        fundsSpent: item.fundsSpent || 0,
        completionRate: item.completionRate || 0,
        isSelected: selectedDistrict === item.districtCode,
        // Format display values
        fundsSpentDisplay: (item.fundsSpent || 0) / 100000, // Convert to lakhs
        fundsSpentFormatted: formatCurrency(item.fundsSpent || 0),
        personDaysFormatted: formatNumber(item.personDays || 0),
        householdsFormatted: formatNumber(item.households || 0),
      };
    });

    // Sort data
    if (sortBy === "value") {
      processedData.sort(
        (a, b) => (b[activeMetric] || 0) - (a[activeMetric] || 0),
      );
    } else {
      processedData.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Convert to percentage if needed
    if (viewMode === "percentage" && processedData.length > 0) {
      const total = processedData.reduce(
        (sum, item) => sum + (item[activeMetric] || 0),
        0,
      );
      if (total > 0) {
        processedData = processedData.map((item) => ({
          ...item,
          [`${activeMetric}Percentage`]: (
            ((item[activeMetric] || 0) / total) *
            100
          ).toFixed(1),
        }));
      }
    }

    const labels = processedData.map((item) => item.name);
    const dataKey =
      viewMode === "percentage" ? `${activeMetric}Percentage` : activeMetric;
    const displayDataKey =
      activeMetric === "fundsSpent" ? "fundsSpentDisplay" : dataKey;

    const chartDataValues = processedData.map(
      (item) => item[displayDataKey] || 0,
    );

    // Generate colors for each data point
    const backgroundColors = processedData.map((item, index) => {
      if (item.isSelected) {
        return colors[activeMetric] || colors.default[0];
      }
      if (variant === "pie") {
        return colors.default[index % colors.default.length];
      }
      return colors[activeMetric] || colors.default[0];
    });

    const borderColors = processedData.map((item, index) => {
      if (item.isSelected) {
        return "#1f2937";
      }
      if (variant === "pie") {
        return colors.default[index % colors.default.length];
      }
      return colors[activeMetric] || colors.default[0];
    });

    return {
      labels,
      datasets: [
        {
          label: getMetricLabel(activeMetric),
          data: chartDataValues,
          backgroundColor:
            variant === "pie"
              ? backgroundColors
              : backgroundColors.map((color) => `${color}CC`),
          borderColor: borderColors,
          borderWidth: processedData.map((item) => (item.isSelected ? 2 : 1)),
          borderRadius: variant === "bar" ? 4 : 0,
          hoverBackgroundColor: backgroundColors,
          hoverBorderColor: borderColors,
          hoverBorderWidth: 2,
        },
      ],
      processedData,
    };
  }, [
    data,
    districts,
    selectedDistrict,
    activeMetric,
    viewMode,
    sortBy,
    colors,
    variant,
  ]);

  // Helper functions
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMetricLabel = (metric) => {
    const labels = {
      personDays: "Person Days",
      households: "Households",
      fundsSpent: "Funds Spent",
      fundsSpentDisplay: "Funds (₹ Lakhs)",
      completionRate: "Completion Rate (%)",
    };
    return labels[metric] || metric;
  };

  const formatMetricValue = (metric, value) => {
    if (!value && value !== 0) return "N/A";

    switch (metric) {
      case "fundsSpent":
        return formatCurrency(value);
      case "fundsSpentDisplay":
        return `₹${value.toFixed(1)}L`;
      case "completionRate":
        return `${value}%`;
      case "personDays":
      case "households":
        return formatNumber(value);
      default:
        return value;
    }
  };

  // Chart options
  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend && variant === "pie",
          position: "right",
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
            },
            generateLabels: (chart) => {
              if (variant !== "pie") return [];

              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => ({
                  text: label,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth[i],
                  hidden: false,
                  index: i,
                }));
              }
              return [];
            },
          },
        },
        tooltip: {
          enabled: showTooltip,
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
              const value = context.parsed.y || context.parsed;
              return `${getMetricLabel(activeMetric)}: ${formatMetricValue(activeMetric, value)}`;
            },
            afterLabel: (context) => {
              if (chartData?.processedData?.[context.dataIndex]?.isSelected) {
                return "Selected District";
              }
              return "";
            },
          },
        },
        title: {
          display: false,
        },
      },
    };

    if (variant === "pie") {
      return baseOptions;
    }

    // Add scales for bar and line charts
    return {
      ...baseOptions,
      scales: {
        x: {
          display: true,
          grid: {
            display: showGrid && variant !== "pie",
            color: "#f3f4f6",
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
            display: showGrid && variant !== "pie",
            color: "#f3f4f6",
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
            },
            callback: (value) => {
              if (value >= 100000) {
                return `${(value / 100000).toFixed(1)}L`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
              }
              return value;
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
    };
  }, [showLegend, showTooltip, showGrid, variant, activeMetric, chartData]);

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
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
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
            Comparison Error
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
          <Icon name="chart-bar" size="xl" color="gray" className="mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Comparison Data
          </h4>
          <p className="text-gray-600">
            There's no data to compare at this time.
          </p>
        </div>
      </div>
    );
  }

  // Render chart based on variant
  const ChartComponent =
    variant === "pie" ? Pie : variant === "line" ? Line : Bar;

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`} {...props}>
      {/* Header */}
      {title && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon
                  name="chart-bar"
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
              <select
                value={activeMetric}
                onChange={(e) => setActiveMetric(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {metrics.map((metric) => (
                  <option key={metric} value={metric}>
                    {getMetricLabel(metric)}
                  </option>
                ))}
              </select>

              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
          </div>

          {/* Additional controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  View:
                </label>
                <button
                  onClick={() => setViewMode("absolute")}
                  className={`px-2 py-1 text-xs rounded ${
                    viewMode === "absolute"
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Absolute
                </button>
                <button
                  onClick={() => setViewMode("percentage")}
                  className={`px-2 py-1 text-xs rounded ${
                    viewMode === "percentage"
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Percentage
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort:
                </label>
                <button
                  onClick={() => setSortBy("value")}
                  className={`px-2 py-1 text-xs rounded ${
                    sortBy === "value"
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  By Value
                </button>
                <button
                  onClick={() => setSortBy("name")}
                  className={`px-2 py-1 text-xs rounded ${
                    sortBy === "name"
                      ? "bg-primary-100 text-primary-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  By Name
                </button>
              </div>
            </div>

            {summary && (
              <div className="text-sm text-gray-600">
                Total: {formatMetricValue(activeMetric, summary[activeMetric])}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height: height - (title ? 120 : 0) }} className="w-full">
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
            <span>📊 {chartData.labels.length} districts</span>
            <span>📈 Showing {getMetricLabel(activeMetric).toLowerCase()}</span>
            {selectedDistrict && (
              <span className="text-primary-600 font-medium">
                🎯 {chartData.processedData?.find((d) => d.isSelected)?.name}{" "}
                selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="information-circle" size="xs" />
            <span>Compare districts side by side</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Simple comparison chart for smaller spaces
 */
export const SimpleComparisonChart = ({
  data = [],
  metric = "personDays",
  height = 200,
  className = "",
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      labels: data.map((item) => item.district || item.name || "District"),
      datasets: [
        {
          data: data.map((item) => item[metric] || 0),
          backgroundColor: "#34a05f",
          borderColor: "#34a05f",
          borderWidth: 1,
          borderRadius: 2,
        },
      ],
    };
  }, [data, metric]);

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
  };

  if (!chartData) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-gray-400 text-sm">No comparison data</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ComparisonChart;
