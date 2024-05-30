import React, { useState, useEffect } from "react";
import "./Record.css";

function Record() {
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0);

  useEffect(() => {
    setTotalExpense(totalCredit - totalDebit);
  }, [totalCredit, totalDebit]);

  useEffect(() => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
    calculateTotals(storedTransactions);
    calculateCurrentMonthExpense(storedTransactions);
  }, []);

  function submitForm(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const desc = document.getElementById("desc").value;
    const transactionType = document.querySelector(
      'input[name="transactionType"]:checked'
    ).value;

    const newTransaction = { amount, date, desc, transactionType };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);

    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    calculateTotals(updatedTransactions);
    calculateCurrentMonthExpense(updatedTransactions);

    document.getElementById("trans-form").reset();
  }

  function calculateTotals(transactions) {
    let credit = 0;
    let debit = 0;
    transactions.forEach((transaction) => {
      if (transaction.transactionType === "credit") {
        credit += transaction.amount;
      } else if (transaction.transactionType === "debit") {
        debit += transaction.amount;
      }
    });
    setTotalCredit(credit);
    setTotalDebit(debit);
  }

  function calculateCurrentMonthExpense(transactions) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    const totalCurrentMonthExpense = currentMonthTransactions.reduce(
      (total, transaction) => {
        return transaction.transactionType === "debit"
          ? total - transaction.amount
          : total + transaction.amount;
      },
      0
    );
    setCurrentMonthExpense(totalCurrentMonthExpense);
  }

  return (
    <>
      <div className="Content">
        <div className="record">
          <div className="form">
            <h2>Enter Transaction Details</h2>
            <form id="trans-form" onSubmit={submitForm}>
              <div>
                <label htmlFor="amount">
                  <b>Amount:</b>
                </label>
                <input type="number" id="amount" name="amount" required />
              </div>
              <div>
                <label htmlFor="date">
                  <b>Date:</b>
                </label>
                <input type="date" id="date" name="date" required />
              </div>
              <div>
                <label>
                  <b>Desc:</b>
                </label>
                <input type="text" id="desc" name="desc" required />
              </div>
              <div>
                <label>
                  <b>Type of Transaction:</b>
                </label>
                <input
                  type="radio"
                  id="credit"
                  name="transactionType"
                  value="credit"
                  required
                />
                <label htmlFor="credit">Credit</label>
                <input
                  type="radio"
                  id="debit"
                  name="transactionType"
                  value="debit"
                  required
                />
                <label htmlFor="debit">Debit</label>
              </div>
              <div className="button">
                <button type="submit">SUBMIT</button>
              </div>
            </form>
          </div>
          <div className="list">
            <h2>
              <font id="transaction_list" color="#66FF00">
                List of Transactions
              </font>
            </h2>
            <div id="list_of_transactions">
              {transactions.map((transaction, index) => (
                <p
                  key={index}
                  style={{
                    color:
                      transaction.transactionType === "credit"
                        ? "green"
                        : "red",
                  }}
                >
                  {transaction.transactionType} -{" "}
                  {transaction.amount.toFixed(2)} - {transaction.date} -{" "}
                  {transaction.desc}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="totals">
          <h2>Total Expense: {totalExpense.toFixed(2)}</h2>
          <h2>Current Month Expense: {currentMonthExpense.toFixed(2)}</h2>
        </div>
      </div>
    </>
  );
}

export default Record;
