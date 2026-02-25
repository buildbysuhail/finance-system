# Testing Document

## 1. Testing Strategy

Manual functional testing was performed to validate all core features.

---

## 2. Test Cases

### Authentication

| Test Case | Action | Expected Result |
|-----------|--------|----------------|
| TC-01 | Login with valid data | Redirect to dashboard |

---

### Transactions

| Test Case | Action | Expected Result |
|-----------|--------|----------------|
| TC-02 | Create valid transaction | Transaction added successfully |
| TC-03 | Create without amount | Validation error displayed |
| TC-04 | Edit transaction | Updated transaction saved |
| TC-05 | Delete transaction | Transaction removed from list |

---

### Categories

| Test Case | Action | Expected Result |
|-----------|--------|----------------|
| TC-06 | Create category | Category added |
| TC-07 | Delete category | Category removed |

---

### Dashboard

| Test Case | Action | Expected Result |
|-----------|--------|----------------|
| TC-08 | Add income | Total income updated |
| TC-09 | Add expense | Total expense updated |

---

### Reports

| Test Case | Action | Expected Result |
|-----------|--------|----------------|
| TC-10 | View report page | Charts render correctly |
| TC-11 | Filter by month | Data updates correctly |

---

## 3. Edge Cases Tested

- Empty transaction list
- API failure scenario
- Invalid form inputs
- Large numbers in transactions