import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';

import { FinanceService } from '../../services/finance.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit  {
  transactions: Transaction[] = [];

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    this.financeService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Failed to load transactions', error);
      }
    });
    
  }
getTotalIncome(): number {
  return this.transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
}

getTotalExpenses(): number {
  return this.transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
}

getBalance(): number {
  return this.getTotalIncome() - this.getTotalExpenses();
}

getSavings(): number {
  return this.getTotalIncome() - this.getTotalExpenses();
}
}
