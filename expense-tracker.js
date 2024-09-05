// Import required modules
const { program } = require("commander"); // Commander for parsing CLI arguments
const fs = require("fs"); // File system for reading/writing data

// Paths to the files where expenses, budgets, and CSV data will be stored
const expenseFilePath = "./expenses.json";
const budgetFilePath = "./budgets.json";
const csvFilePath = "./expenses.csv";

// Helper function to ensure a file exists, otherwise create it with initial content
function initializeFile(filePath, initialContent = "[]") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, initialContent);
    console.log(`File created: ${filePath}`);
  }
}

// Initialize all necessary files
function initializeFiles() {
  initializeFile(expenseFilePath, "[]"); // Initialize the expenses.json file
  initializeFile(budgetFilePath, "{}"); // Initialize the budgets.json file
  initializeFile(csvFilePath, "ID,Date,Description,Amount,Category\n"); // Initialize the expenses.csv file with headers
}

// Load data from the specified JSON file
function loadFile(filePath, defaultContent = "[]") {
  initializeFile(filePath, defaultContent);
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Save data to the specified JSON file
function saveFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Load expenses from the JSON file
function loadExpenses() {
  return loadFile(expenseFilePath);
}

// Save expenses to the JSON file
function saveExpenses(expenses) {
  saveFile(expenseFilePath, expenses);
}

// Load budgets from the JSON file
function loadBudgets() {
  return loadFile(budgetFilePath, "{}");
}

// Save budgets to the JSON file
function saveBudgets(budgets) {
  saveFile(budgetFilePath, budgets);
}

// Helper function to export expenses to a CSV file
function exportExpensesToCSV(expenses) {
  // Ensure CSV file is created and contains headers
  initializeFile(csvFilePath, "ID,Date,Description,Amount,Category\n");

  // Prepare CSV rows for expenses
  const rows = expenses
    .map(
      (expense) =>
        `${expense.id},${expense.date},${expense.description},${
          expense.amount
        },${expense.category || "Uncategorized"}`
    )
    .join("\n");

  // Append the expenses to the CSV file
  fs.appendFileSync(csvFilePath, rows + "\n");
  console.log(`Expenses exported to ${csvFilePath}`);
}

// Command to add a new expense with category
program
  .command("add")
  .description("Add a new expense")
  .requiredOption("--description <description>", "Description of the expense")
  .requiredOption("--amount <amount>", "Amount of the expense")
  .option("--category <category>", "Category of the expense") // Optional category
  .action((options) => {
    const expenses = loadExpenses();
    const newExpense = {
      id: expenses.length + 1,
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      description: options.description,
      amount: parseFloat(options.amount),
      category: options.category || "Uncategorized", // Default to 'Uncategorized'
    };

    expenses.push(newExpense);
    saveExpenses(expenses);

    console.log(
      `Expense added: ${newExpense.description} - $${newExpense.amount} (${newExpense.category})`
    );
  });

// Command to filter expenses by category
program
  .command("filter")
  .description("Filter expenses by category")
  .requiredOption("--category <category>", "Category to filter by")
  .action((options) => {
    const expenses = loadExpenses();
    const filteredExpenses = expenses.filter(
      (expense) => expense.category === options.category
    );

    if (filteredExpenses.length > 0) {
      console.log("ID  Date       Description  Amount  Category");
      filteredExpenses.forEach((expense) => {
        console.log(
          `${expense.id}   ${expense.date}   ${expense.description}   $${expense.amount}   ${expense.category}`
        );
      });
    } else {
      console.log(`No expenses found in the "${options.category}" category.`);
    }
  });

// Command to set a budget for a specific month
program
  .command("set-budget")
  .description("Set a budget for a specific month")
  .requiredOption("--month <month>", "Month (1-12)")
  .requiredOption("--amount <amount>", "Budget amount")
  .action((options) => {
    const budgets = loadBudgets();
    budgets[options.month] = parseFloat(options.amount);

    saveBudgets(budgets);
    console.log(`Budget for month ${options.month} set to $${options.amount}`);
  });

// Command to show expenses summary with budget warning
program
  .command("summary")
  .description("View total summary of expenses")
  .option(
    "--month <month>",
    "View summary for a specific month (e.g., 8 for August)"
  )
  .action((options) => {
    const expenses = loadExpenses();
    const budgets = loadBudgets();
    let filteredExpenses = expenses;

    // Filter by month if specified
    if (options.month) {
      filteredExpenses = expenses.filter((expense) => {
        const expenseMonth = new Date(expense.date).getMonth() + 1;
        return expenseMonth === parseInt(options.month);
      });
    }

    // Calculate the total amount of expenses
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const budget = budgets[options.month];

    if (options.month) {
      console.log(`Total expenses for month ${options.month}: $${total}`);
      if (budget && total > budget) {
        console.log(
          `Warning: You have exceeded your budget of $${budget} for month ${options.month}.`
        );
      }
    } else {
      console.log(`Total expenses: $${total}`);
    }
  });

// Command to export expenses to a CSV file
program
  .command("export")
  .description("Export all expenses to a CSV file")
  .action(() => {
    const expenses = loadExpenses();
    exportExpensesToCSV(expenses);
  });

// Ensure all required files exist before executing any commands
initializeFiles();

// Parse the arguments provided by the user
program.parse(process.argv);
