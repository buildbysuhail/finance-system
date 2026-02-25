// src/pages/CategoriesPage.tsx

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";

import type { Category } from "@/services/categoryService";
import { useToast } from "@/context/ToastContext";

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { register, handleSubmit, reset } = useForm<Category>();

  const {showToast} = useToast();

console.log(categories, "categoriesssss")
  const defaultCategories: Omit<Category, "id">[] = [
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

  const fetchCategories = async () => {
  try {
    setLoading(true);

    const data = await getCategories();

    // If no categories exist, seed defaults
    if (Array.isArray(data) && data.length === 0) {
      await Promise.all(defaultCategories.map((cat) => createCategory(cat)));

      const seededData = await getCategories();
    //   console.log(seededData, data, "dataINCategory")
      setCategories(seededData);
    } else {
      setCategories(data);
    }
  } catch {
    setError("Failed to load categories");
  } finally {
    setLoading(false);
  }
};

const incomeCategories = categories.filter(
  (cat) => cat.type === "income"
);

const expenseCategories = categories.filter(
  (cat) => cat.type === "expense"
);

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({ name: "", type: "expense" });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    reset(category);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Category) => {
    try {
      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, data);
        showToast("Category updated", "info", 2500)
      } else {
        await createCategory(data);
        showToast("Category added", "success", 2500)
      }
      
      setIsModalOpen(false);
      fetchCategories();
    } catch {
      showToast("Something went wrong", "warning", 2500);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Categories
        </h1>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* List */}
      <div className="bg-white shadow rounded-xl p-6">
        {loading && <p className="text-gray-500">Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && categories.length === 0 && (
          <p className="text-gray-500">No categories found.</p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-sm text-gray-400">{cat.type}</p>
                </div>

                <div className="space-x-3">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id!)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("name", { required: true })}
                placeholder="Category Name"
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                {...register("type")}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-red-100 rounded-sm font-medium hover:cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-sm font-medium hover:cursor-pointer"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};