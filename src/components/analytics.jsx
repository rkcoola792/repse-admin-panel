import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Table2, LineChart } from "lucide-react";
import api from "../api/axios";

// Categorical palette (validated, fixed order — see dataviz skill reference/palette.md)
const CATEGORY_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"];
// Delivery-status colors kept consistent with Orders/Dashboard elsewhere in this app.
const STATUS_COLORS = {
  processing: "#eab308",
  intransit: "#3b82f6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};
const SEQUENTIAL_BLUE = "#2a78d6";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatStatusLabel = (status) => {
  if (status === "intransit") return "In Transit";
  return status.charAt(0).toUpperCase() + status.slice(1);
};
const formatDayLabel = (isoDate) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const RevenueTrendChart = ({ data }) => {
  const [hover, setHover] = useState(null);
  const [tableView, setTableView] = useState(false);
  const width = 600;
  const height = 200;
  const padding = { top: 12, right: 12, bottom: 24, left: 12 };

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const points = data.map((d, i) => {
    const x =
      padding.left +
      (i / Math.max(data.length - 1, 1)) * (width - padding.left - padding.right);
    const y =
      height -
      padding.bottom -
      (d.revenue / maxRevenue) * (height - padding.top - padding.bottom);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${height - padding.bottom} L ${points[0]?.x || 0} ${height - padding.bottom} Z`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800">Revenue — Last 30 Days</h3>
        <button
          onClick={() => setTableView((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          title={tableView ? "Show chart" : "Show table"}
        >
          {tableView ? <LineChart className="w-4 h-4" /> : <Table2 className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4 h-5">
        {hover ? `${formatDayLabel(hover.date)} — ${formatCurrency(hover.revenue)}` : "Hover the line to inspect a day"}
      </p>

      {data.every((d) => d.revenue === 0) ? (
        <p className="text-sm text-gray-500 py-10 text-center">No revenue in this period yet</p>
      ) : tableView ? (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase">
                <th className="py-1.5">Date</th>
                <th className="py-1.5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((d) => (
                <tr key={d.date}>
                  <td className="py-1.5 text-gray-700">{formatDayLabel(d.date)}</td>
                  <td className="py-1.5 text-right font-medium text-gray-800">
                    {formatCurrency(d.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" onMouseLeave={() => setHover(null)}>
          {[0.25, 0.5, 0.75, 1].map((frac) => (
            <line
              key={frac}
              x1={padding.left}
              x2={width - padding.right}
              y1={height - padding.bottom - frac * (height - padding.top - padding.bottom)}
              y2={height - padding.bottom - frac * (height - padding.top - padding.bottom)}
              stroke="#e1e0d9"
              strokeWidth="1"
            />
          ))}
          <path d={areaPath} fill={SEQUENTIAL_BLUE} fillOpacity="0.08" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke={SEQUENTIAL_BLUE}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, i) => (
            <g key={p.date}>
              <rect
                x={p.x - (width / data.length) / 2}
                y={0}
                width={width / data.length}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHover(p)}
              />
              {hover?.date === p.date && (
                <>
                  <line x1={p.x} x2={p.x} y1={0} y2={height - padding.bottom} stroke="#c3c2b7" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx={p.x} cy={p.y} r="4" fill={SEQUENTIAL_BLUE} stroke="#fff" strokeWidth="1.5" />
                </>
              )}
              {i === points.length - 1 && (
                <circle cx={p.x} cy={p.y} r="3" fill={SEQUENTIAL_BLUE} />
              )}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
};

const OrdersByStatusChart = ({ data }) => {
  const [hover, setHover] = useState(null);
  const [tableView, setTableView] = useState(false);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800">Orders by Status</h3>
        <button
          onClick={() => setTableView((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          title={tableView ? "Show chart" : "Show table"}
        >
          {tableView ? <LineChart className="w-4 h-4" /> : <Table2 className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4 h-5">
        {hover ? `${formatStatusLabel(hover.status)} — ${hover.count} orders` : "Hover a bar to inspect"}
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-10 text-center">No orders yet</p>
      ) : tableView ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs uppercase">
              <th className="py-1.5">Status</th>
              <th className="py-1.5 text-right">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((d) => (
              <tr key={d.status}>
                <td className="py-1.5 text-gray-700">{formatStatusLabel(d.status)}</td>
                <td className="py-1.5 text-right font-medium text-gray-800">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-end gap-4 h-48 px-2">
          {data.map((d) => (
            <div
              key={d.status}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-default"
              onMouseEnter={() => setHover(d)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="text-xs font-semibold text-gray-700">{d.count}</span>
              <div
                className="w-full rounded-t-md transition-opacity"
                style={{
                  height: `${Math.max((d.count / maxCount) * 100, 4)}%`,
                  backgroundColor: STATUS_COLORS[d.status] || "#898781",
                  opacity: hover && hover.status !== d.status ? 0.5 : 1,
                }}
              />
              <span className="text-xs text-gray-500 text-center">{formatStatusLabel(d.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SalesByCategoryChart = ({ data }) => {
  const [hover, setHover] = useState(null);
  const [tableView, setTableView] = useState(false);
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-800">Sales by Category</h3>
        <button
          onClick={() => setTableView((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          title={tableView ? "Show chart" : "Show table"}
        >
          {tableView ? <LineChart className="w-4 h-4" /> : <Table2 className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4 h-5">
        {hover ? `${hover.category} — ${formatCurrency(hover.revenue)}` : "Hover a bar to inspect"}
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-10 text-center">No sales yet</p>
      ) : tableView ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs uppercase">
              <th className="py-1.5">Category</th>
              <th className="py-1.5 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((d) => (
              <tr key={d.category}>
                <td className="py-1.5 text-gray-700">{d.category}</td>
                <td className="py-1.5 text-right font-medium text-gray-800">
                  {formatCurrency(d.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex items-end gap-4 h-48 px-2">
          {data.map((d, i) => (
            <div
              key={d.category}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-default"
              onMouseEnter={() => setHover(d)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="text-xs font-semibold text-gray-700">
                {formatCurrency(d.revenue)}
              </span>
              <div
                className="w-full rounded-t-md transition-opacity"
                style={{
                  height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%`,
                  backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  opacity: hover && hover.category !== d.category ? 0.5 : 1,
                }}
              />
              <span className="text-xs text-gray-500 text-center">{d.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/analytics");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const ordersByStatusOrdered = useMemo(() => {
    if (!data) return [];
    const order = ["processing", "intransit", "delivered", "cancelled"];
    return [...data.ordersByStatus].sort(
      (a, b) => order.indexOf(a.status) - order.indexOf(b.status),
    );
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
          <p className="text-gray-500 mt-1">Track your business performance</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(data.avgOrderValue)}</p>
          <p className="text-sm text-gray-500 mt-1">Per successful order</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Repeat Customer Rate</h3>
          <p className="text-3xl font-bold text-gray-800">{data.repeatCustomerRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Of customers who've ordered before</p>
        </div>
      </div>

      <div className="space-y-6">
        <RevenueTrendChart data={data.revenueByDay} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrdersByStatusChart data={ordersByStatusOrdered} />
          <SalesByCategoryChart data={data.salesByCategory} />
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
