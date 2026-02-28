// src/pages/TransactionsPage.tsx

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

import type { Transaction } from "@/services/transactionService";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";

interface Category {
  name: string;
  type: "income" | "expense";
}

const DEFAULT_CATEGORIES: Category[] = [
  { name: "Salary", type: "income" },
  { name: "Freelance", type: "income" },
  { name: "Petty Cash", type: "income" },
  { name: "Other Income", type: "income" },

  { name: "Food & Dining", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Utilities", type: "expense" },
  { name: "Transportation", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Healthcare", type: "expense" },
  { name: "Education", type: "expense" },
  { name: "Other Expense", type: "expense" },
];

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"income" | "expense">("expense");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Transaction, "id">>();

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filter categories based on selected type
  const filteredCategories = DEFAULT_CATEGORIES.filter(
    (cat) => cat.type === selectedType
  );

  const openCreateModal = () => {
    setEditingId(null);
    setSelectedType("expense");
    reset();
    setIsModalOpen(true);
  };
// console.log(loading, "loadingggggggg")
  const openEditModal = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setSelectedType(transaction.type);
    reset(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const filteredTransactions = transactions.filter((t) =>
    filterType === "all" ? true : t.type === filterType
  );

  const onSubmit = async (data: Omit<Transaction, "id">) => {
    try {
      if (editingId) {
        await updateTransaction(editingId, data);
        showToast("Transaction updated successfully", "success");
      } else {
        await createTransaction(data);
        showToast("Transaction added successfully", "success");
      }

      closeModal();
      await loadTransactions();
    } catch (error) {
      // Error handling
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteTransaction(deleteId);
      await loadTransactions();
      showToast("Transaction deleted successfully", "success", 3000);
    } catch (error) {
      showToast("Failed to delete transaction", "error", 3000);
    }

    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition font-medium"
        >
          + Add Transaction
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {/* Filter Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Transaction List</h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filterType === "income"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filterType === "expense"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No transactions found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="py-2">Title</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Date</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2">{t.title}</td>

                    <td className="py-2 font-medium">₹{t.amount.toLocaleString("en-IN")}</td>

                    <td
                      className={`py-2 font-medium capitalize ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type}
                    </td>

                    <td className="py-2">{t.date}</td>

                    <td className="py-2 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(t)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(t.id);
                          setIsDeleteOpen(true);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Transaction" : "Add Transaction"}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Type Dropdown */}
          <div>
            <select
              {...register("type", { required: "Type is required" })}
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as "income" | "expense");
              }}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Category Dropdown - Filtered by Type */}
          <div>
            <select
              {...register("title", { required: "Category is required" })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              defaultValue=""
            >
              <option value="">Select Category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <input
              type="number"
              placeholder="Amount"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <textarea
              placeholder="Description (optional)"
              {...register("description")}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            {/* <Button variant="danger" title= {"Cancel"}/> */}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium cursor-pointer"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        loading
      />
    </div>
  );
};