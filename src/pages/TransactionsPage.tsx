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
// import { Button } from "@/components/ui/Button";

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingId(transaction.id);
    reset(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };



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
      console.error("Error saving transaction", error);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Transaction List</h2>

        {loading ? (
          <p>Loading...</p>
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
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2">{t.title}</td>

                    <td className="py-2 font-medium">₹{t.amount}</td>

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

      {/*  COMMON MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Transaction" : "Add Transaction"}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <input
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

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
          </div>

          <div>
            <select
              {...register("type", { required: "Type is required" })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <input
              placeholder="Category ID"
              {...register("categoryId", {
                required: "Category is required",
              })}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              {...register("description")}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 rounded-sm border font-medium bg-red-100"
            >
              Cancel
            </button>
            {/* <Button variant="danger" title= {"sdfsd"}/> */}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-sm transition font-medium"
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
      />
    </div>
  );
};