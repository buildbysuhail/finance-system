# Requirements Document

## 1. Introduction

This document defines the functional and non-functional requirements for the Finance Management System frontend application.

---

## 2. Functional Requirements

### Authentication
- User can log in using mock authentication.
- User session is maintained locally.

### Transactions
- User can create a transaction.
- User can edit a transaction.
- User can delete a transaction.
- User can view list of transactions.
- User can filter transactions by type.
- Form validation must be applied.

### Categories
- User can create a category.
- User can edit a category.
- User can delete a category.
- Categories are linked to transactions.

### Dashboard
- System calculates total income.
- System calculates total expense.
- System calculates net balance.
- Dashboard displays summary statistics.

### Reports
- System displays income vs expense chart.
- System displays category-based report.
- User can filter reports by month.

---

## 3. Non-Functional Requirements

- Responsive design
- Clean UI/UX
- Strong TypeScript typing
- Modular architecture
- Reusable components
- Centralized API management
- Error handling
- Loading states
- Maintainable code structure
- Clear documentation

---

## 4. Constraints

- Frontend-only implementation
- Backend simulated using MockAPI.io
- 5-day development timeline