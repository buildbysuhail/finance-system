import { useEffect, useState } from "react";

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export const DashboardPage = () => {
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary mock data (Replace with API later)
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        title: "Salary",
        amount: 50000,
        type: "income",
        date: "2026-02-01",
      },
      {
        id: "2",
        title: "Groceries",
        amount: 2500,
        type: "expense",
        date: "2026-02-03",
      },
      {
        id: "3",
        title: "Electricity Bill",
        amount: 1800,
        type: "expense",
        date: "2026-02-05",
      },
    ];

    const totalIncome = mockTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = mockTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    setSummary({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });

    setRecentTransactions(mockTransactions);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Financial Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm text-gray-500">Total Income</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹ {summary.totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm text-gray-500">Total Expense</h2>
          <p className="text-2xl font-bold text-red-600">
            ₹ {summary.totalExpense.toLocaleString()}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-sm text-gray-500">Balance</h2>
          <p
            className={`text-2xl font-bold ${
              summary.balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            ₹ {summary.balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

        {recentTransactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions found.</p>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{transaction.title}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"} ₹
                  {transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};