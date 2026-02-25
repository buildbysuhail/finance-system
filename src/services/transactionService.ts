// src/services/transactionService.ts

import api from "./api";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  date: string;
  description?: string;
}

export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const createTransaction = async (
  data: Omit<Transaction, "id">
) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const updateTransaction = async (
  id: string,
  data: Partial<Transaction>
) => {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};