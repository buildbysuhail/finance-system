export interface User {
  id: string
  name: string
  email: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
}

export interface Transaction {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string
  description: string
}