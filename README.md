
# Expense Tracker CLI

**Expense Tracker CLI** is a command-line application built with Node.js that helps you manage and track your expenses, set monthly budgets, categorize expenses, and export data to CSV. The tool is designed to be simple, efficient, and highly customizable for personal finance management.

## Features

- **Add Expense**: Add an expense with a description, amount, and optional category.
- **Update Expense**: Modify an existing expense by ID.
- **Delete Expense**: Remove an expense by ID.
- **View Expenses**: List all expenses in a table format.
- **Filter by Category**: View expenses filtered by category.
- **Set Monthly Budget**: Define a monthly budget for each month of the year.
- **Budget Warnings**: Receive a warning when your expenses exceed the budget.
- **Expense Summary**: View a total summary of your expenses, either for a specific month or overall.
- **Export to CSV**: Export all expenses into a CSV file for easy record-keeping.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker-cli.git
   ```

2. Navigate into the project directory:
   ```bash
   cd expense-tracker-cli
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application using the available commands.

## Usage

### Commands:

- **Add an expense**:
  ```bash
  expense-tracker add --description "Lunch" --amount 20 --category "Food"
  ```

- **List all expenses**:
  ```bash
  expense-tracker list
  ```

- **Filter expenses by category**:
  ```bash
  expense-tracker filter --category "Food"
  ```

- **Set a monthly budget**:
  ```bash
  expense-tracker set-budget --month 8 --amount 500
  ```

- **View expenses summary**:
  ```bash
  expense-tracker summary --month 8
  ```

- **Export expenses to CSV**:
  ```bash
  expense-tracker export
  ```

## Project Roadmap

For the project roadmap and future feature plans, visit: [Expense Tracker Roadmap](https://roadmap.sh/projects/expense-tracker)

## License

This project is open-source and available under the [MIT License](LICENSE).
```

