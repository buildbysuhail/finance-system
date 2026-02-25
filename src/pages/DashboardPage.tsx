import { useEffect, useState } from "react";
import { getTransactions, type Transaction } from "@/services/transactionService";
import { calculateSummary } from "@/services/reportService";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Briefcase,
  Coffee,
  Home,
  Heart,
  // MoreVertical,
} from "lucide-react";

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

// interface Transaction {
//   id: string;
//   title: string;
//   amount: number;
//   type: "income" | "expense";
//   date: string;
//   categoryId?: string;
// }

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  shopping: <ShoppingCart className="w-5 h-5" />,
  work: <Briefcase className="w-5 h-5" />,
  food: <Coffee className="w-5 h-5" />,
  utilities: <Home className="w-5 h-5" />,
  health: <Heart className="w-5 h-5" />,
};

const getCategoryIcon = (categoryId?: string) => {
  if (!categoryId) return <Wallet className="w-5 h-5" />;
  return CATEGORY_ICONS[categoryId.toLowerCase()] || <Wallet className="w-5 h-5" />;
};

export const DashboardPage = () => {
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const transactions: Transaction[] = await getTransactions();

        setSummary(calculateSummary(transactions));

        const sortedRecent = [...transactions]
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 8);

        setRecentTransactions(sortedRecent);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial overview...</p>
        </div>
      </div>
    );
  }

  const expensePercentage =
    summary.totalIncome > 0
      ? (summary.totalExpense / summary.totalIncome) * 100
      : 0;
  const savingsPercentage = 100 - expensePercentage;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Overview
          </h1>
          <p className="text-gray-600">
            Track your income, expenses, and manage your finances
          </p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Balance Card */}
          <div className="lg:col-span-2 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">
                  Net Balance
                </p>
                <h2 className="text-4xl font-bold">
                  ₹ {summary.balance.toLocaleString("en-IN")}
                </h2>
              </div>
              <Wallet className="w-8 h-8 text-blue-200" />
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-blue-100">
                <span>Savings Rate</span>
                <span className="font-semibold">
                  {savingsPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-blue-500 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(savingsPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm font-medium">Total Income</p>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ₹ {summary.totalIncome.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {summary.transactionCount} transactions
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm font-medium">Total Expense</p>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">
              ₹ {summary.totalExpense.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {expensePercentage.toFixed(1)}% of income
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Recent Transactions
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Your latest financial activity
              </p>
            </div>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No transactions yet</p>
              <p className="text-gray-500 text-sm">
                Start by adding your first transaction
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all border border-gray-100 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {getCategoryIcon(transaction.categoryId)}
                        <span
                          className={`${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        ></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {transaction.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"} ₹
                        {transaction.amount.toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-block text-xs font-medium mt-2 px-2 py-1 rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type
                          ? transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};