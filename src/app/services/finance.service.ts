import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private transactions: Transaction[] = [
    {
      id: 1,
      description: 'Salary',
      category: 'Income',
      type: 'income',
      amount: 4200,
      date: '2026-09-15'
    },
    {
      id: 2,
      description: 'Rent Payment',
      category: 'Housing',
      type: 'expense',
      amount: 900,
      date: '2026-09-10'
    },
    {
      id: 3,
      description: 'Grocery Shopping',
      category: 'Food',
      type: 'expense',
      amount: 145,
      date: '2026-09-08'
    },
    {
      id: 4,
      description: 'Utility Payment',
      category: 'Income',
      type: 'income',
      amount: 600,
      date: '2026-09-05'
    }
  ];

  getTransactions(): Observable<Transaction[]> {
    return of(this.transactions);
  }
  getSpendingByCategory(category: string): Observable<number> {
  const total = this.transactions
    .filter(
      transaction =>
        transaction.type === 'expense' &&
        transaction.category === category
    )
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  return of(total);
}
  // CREATE
  addTransaction(transaction: Transaction): Observable<Transaction> {
    this.transactions.push(transaction);

    return of(transaction);
  }

  // UPDATE
  updateTransaction(transaction: Transaction): Observable<Transaction> {
    const index = this.transactions.findIndex(
      item => item.id === transaction.id
    );

    if (index !== -1) {
      this.transactions[index] = transaction;
    }

    return of(transaction);
  }

  // DELETE
  deleteTransaction(id: number): Observable<boolean> {
    this.transactions = this.transactions.filter(
      transaction => transaction.id !== id
    );

    return of(true);
  }

}