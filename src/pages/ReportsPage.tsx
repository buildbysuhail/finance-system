import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTransactions, type Transaction } from "@/services/transactionService";
import { calculateSummary } from "@/services/reportService";
import { Calendar, Filter, TrendingUp, TrendingDown } from "lucide-react";

// interface Summary {
//   totalIncome: number;
//   totalExpense: number;
//   balance: number;
//   transactionCount: number;
// }

interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface CategoryData {
  category: string;
  income: number;
  expense: number;
  total: number;
}

// const COLORS_PIE = ["#10b981", "#ef4444"];
// const COLORS_CHART = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];

export const ReportsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"all" | "income" | "expense">(
    "all"
  );

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data: Transaction[] = await getTransactions();
        setTransactions(data);

        // Set default month to current month
        const now = new Date();
        const monthString = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;
        setSelectedMonth(monthString);
      } catch (error) {
        // Error handling without console logs
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Get available months from transactions
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // Filter transactions by month and type
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const monthMatch = selectedMonth ? month === selectedMonth : true;
      const typeMatch =
        selectedType === "all" ? true : t.type === selectedType;
      return monthMatch && typeMatch;
    });
  }, [transactions, selectedMonth, selectedType]);

  // Calculate summary for filtered data
  const filteredSummary = useMemo(() => {
    return calculateSummary(filteredTransactions);
  }, [filteredTransactions]);

  // Calculate monthly summary data
  const monthlySummaryData = useMemo(() => {
    const monthMap = new Map<string, MonthlySummary>();

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });

      const current = monthMap.get(month) || {
        month,
        income: 0,
        expense: 0,
        balance: 0,
      };

      if (t.type === "income") {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      current.balance = current.income - current.expense;
      monthMap.set(month, current);
    });

    return Array.from(monthMap.values()).reverse().slice(0, 12);
  }, [transactions]);

  // Calculate income vs expense pie data
  const pieData = useMemo(() => {
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return [
    { name: "Income", value: income || 0, fill: "#10b981" },
    { name: "Expense", value: expense || 0, fill: "#ef4444" },
  ];
}, [filteredTransactions]);

  // Calculate category breakdown data
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, CategoryData>();

    filteredTransactions.forEach((t) => {
      const cat = t.categoryId || "Uncategorized";
      const current = categoryMap.get(cat) || {
        category: cat,
        income: 0,
        expense: 0,
        total: 0,
      };

      if (t.type === "income") {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      current.total = current.income + current.expense;
      categoryMap.set(cat, current);
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [filteredTransactions]);

  const getMonthLabel = (monthString: string) => {
    const [year, month] = monthString.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">
            View your financial analytics and insights
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            {/* Month Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Months</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {getMonthLabel(month)}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Transaction Type
              </label>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as "all" | "income" | "expense")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedMonth("");
                setSelectedType("all");
              }}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-md p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium mb-2">Net Balance</p>
            <p className="text-3xl font-bold">
              ₹ {filteredSummary.balance.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-blue-200 mt-4">
              {filteredSummary.transactionCount} transactions
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-medium">Total Income</p>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₹ {filteredSummary.totalIncome.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-medium">Total Expense</p>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">
              ₹ {filteredSummary.totalExpense.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income vs Expense Pie Chart */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Income vs Expense
            </h3>
            {filteredTransactions.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <p>No data available for selected filters</p>
              </div>
            ) : pieData[0].value === 0 && pieData[1].value === 0 ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <p>No transactions to display</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ₹${(value / 100000).toFixed(1)}L`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    // colors={COLORS_PIE}
                  />
                  <Tooltip
                    formatter={(value) =>
                      `₹ ${(value as number).toLocaleString("en-IN")}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category Breakdown Bar Chart */}
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Spending by Category
            </h3>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <p>No category data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) =>
                      `₹ ${(value as number).toLocaleString("en-IN")}`
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name="Income"
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                    name="Expense"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            12-Month Trend
          </h3>
          {monthlySummaryData.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <p>No monthly data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlySummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) =>
                    `₹ ${(value as number).toLocaleString("en-IN")}`
                  }
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expense"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  name="Expense"
                />
                <Bar
                  dataKey="balance"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  name="Balance"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};