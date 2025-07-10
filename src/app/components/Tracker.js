"use client";

import styles from "../shared.module.css";

import { useState } from "react";

export default function Tracker() {
  const ptransactions = [
    { id: 1, name: "Birthday Gifts", price: 500, type: "Expense" },
    { id: 2, name: "Pocket Money", price: 1750, type: "Budget" },
  ];

  const [transactions, setTransactions] = useState(ptransactions);

  return (
    <div className={styles.tracker}>
      <div style={{ textAlign: "center" }}>
        <b style={{ fontSize: "25px" }}>Expense Tracker</b>
      </div>
      <OverviewComponent
        transactions={transactions}
        setTransactions={setTransactions}
      />
      <TransactionsContainer
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}

function OverviewComponent({ transactions, setTransactions }) {
  const [addMode, setAddMode] = useState(false);

  let budgetTotal = 0,
    expenseTotal = 0,
    total = 0;
  for (const transaction of transactions) {
    if (transaction.type === "Expense") {
      expenseTotal += transaction.price;
      total -= transaction.price;
    } else {
      budgetTotal += transaction.price;
      total += transaction.price;
    }
  }

  return (
    <div className={styles.overview}>
      <div
        style={{
          fontSize: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div style={{ width: "87%" }}>
          Balance <b>${total}</b>
        </div>
        <div style={{ width: "13%", display: "flex", alignItems: "center" }}>
          {addMode ? (
            <button style={{ width: "100%" }} onClick={() => setAddMode(false)}>
              Cancel
            </button>
          ) : (
            <button style={{ width: "100%" }} onClick={() => setAddMode(true)}>
              Add
            </button>
          )}
        </div>
      </div>
      {addMode && (
        <AddTransaction
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
      <div className={styles.breakdown}>
        <div className={styles.breakdownitem}>
          Expense
          <div style={{ fontSize: "20px", color: "red" }}>
            <b>${expenseTotal}</b>
          </div>
        </div>
        <div className={styles.breakdownitem}>
          Budget
          <div style={{ fontSize: "20px", color: "green" }}>
            <b>${budgetTotal}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTransaction({ transactions, setTransactions }) {
  const [formData, setFormData] = useState({
    name: null,
    price: null,
    type: "Expense",
  });

  function setName(name) {
    setFormData({
      ...formData,
      name: name,
    });
  }

  function setPrice(price) {
    console.log(price);
    if (!Number.isNaN(price)) {
      setFormData({
        ...formData,
        price: price,
      });
    }
  }

  function setType(type) {
    setFormData({
      ...formData,
      type: type,
    });
  }

  function addTransaction() {
    console.log(formData);
    if (formData.name !== null && formData.price !== null) {
      const lastTransactionId = transactions[transactions.length - 1].id;
      const newTransactions = [
        ...transactions,
        {
          id: lastTransactionId + 1,
          name: formData.name,
          price: formData.price,
          type: formData.type,
        },
      ];
      setTransactions(newTransactions);
    }
  }

  return (
    <div className={styles.addtransaction}>
      <input
        className={styles.addinput}
        placeholder="300"
        onChange={(e) => setPrice(Number(e.target.value))}
      ></input>
      <input
        className={styles.addinput}
        placeholder="Groceries"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "0 auto",
          gap: "10px",
        }}
      >
        <div>
          <input
            type="radio"
            checked={formData.type === "Expense"}
            onChange={() => setType("Expense")}
          />
          Expense
        </div>
        <div>
          <input
            type="radio"
            checked={formData.type === "Budget"}
            onChange={() => setType("Budget")}
          />
          Budget
        </div>
      </div>
      <button className={styles.addbutton} onClick={() => addTransaction()}>
        Add Transaction
      </button>
    </div>
  );
}

function TransactionsContainer({ transactions, setTransactions }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.transactions}>
      <b style={{ fontSize: "20px" }}>Transactions</b>
      <input
        className={styles.search}
        placeholder="Search here"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TransactionItems
        filteredTransactions={filteredTransactions}
        transactions={transactions}
        setTransactions={setTransactions}
      />
    </div>
  );
}

function TransactionItems({
  filteredTransactions,
  transactions,
  setTransactions,
}) {
  function remove(rtransaction) {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== rtransaction.id)
    );
  }

  return (
    <>
      {filteredTransactions.map((transaction) => (
        <div className={styles.transaction} key={transaction.id}>
          <div style={{ width: "45%" }}>{transaction.name}</div>
          <div style={{ width: "30%" }}>${transaction.price}</div>
          <div style={{ width: "24%" }}>
            <button onClick={() => remove(transaction)}>Remove</button>
          </div>
          <div style={{ width: "1%" }}>
            {transaction.type === "Expense" ? (
              <div
                style={{
                  backgroundColor: "red",
                  height: "30px",
                  width: "100%",
                }}
              ></div>
            ) : (
              <div
                style={{
                  backgroundColor: "green",
                  height: "30px",
                  width: "100%",
                }}
              ></div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
