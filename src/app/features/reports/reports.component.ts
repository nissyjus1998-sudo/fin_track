import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartType,
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FinanceService } from '../../services/finance.service';
import { Transaction } from '../../models/transaction';
Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
);
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})

export class ReportsComponent implements OnInit {
constructor(
  private financeService: FinanceService
) {}
transactions: Transaction[] = [];
ngOnInit(): void {
  this.loadTransactions();
}
loadTransactions(): void {
  this.financeService.getTransactions().subscribe({
    next: (transactions) => {
      this.transactions = transactions;
      this.updateCategoryChart();
      this.updateMonthlyChart();
    },
    error: (error) => {
      console.error('Failed to load transactions', error);
    }
  });
}
updateCategoryChart(): void {

  const categories = [
    'Food',
    'Housing',
    'Transport',
    'Entertainment'
  ];

  const spending = categories.map(category =>
    this.transactions
      .filter(
        transaction =>
          transaction.type === 'expense' &&
          transaction.category === category
      )
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      )
  );

  this.categoryChartData = {
    labels: categories,
    datasets: [
      {
        data: spending,  backgroundColor: [
        '#4F46E5', // Food
        '#22C55E', // Housing
        '#F59E0B', // Transport
        '#EF4444'  // Entertainment
      ],
      borderWidth: 0
      }
    ]
  };
}
updateMonthlyChart(): void {

  const income = this.getTotalIncome();
  const expenses = this.getTotalExpenses();

  this.monthlyChartData = {
    labels: ['September'],
    datasets: [
      {
        label: 'Income',
        data: [income],
        backgroundColor: '#22C55E'
      },
      {
        label: 'Expenses',
        data: [expenses],
        backgroundColor: '#EF4444'
      }
    ]
  };
}
getTotalIncome(): number {
  return this.transactions
    .filter(transaction => transaction.type === 'income')
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
}

getTotalExpenses(): number {
  return this.transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
}

getBalance(): number {
  return this.getTotalIncome() - this.getTotalExpenses();
}

getSavings(): number {
  return this.getBalance();
}
  public categoryChartType: ChartType = 'doughnut';
 public monthlyChartType: ChartType = 'bar';
public categoryChartData: ChartConfiguration<'doughnut'>['data'] = {
  labels: ['Food', 'Housing', 'Transport', 'Entertainment'],
  datasets: [
    {
      data: [145, 900, 0, 0],
        backgroundColor: [
        '#4F46E5', // Food
        '#22C55E', // Housing
        '#F59E0B', // Transport
        '#EF4444'  // Entertainment
      ],
      borderWidth: 0
    }
  ]
};
public monthlyChartData: ChartConfiguration<'bar'>['data'] = {
  labels: ['September'],
  datasets: [
    {
      label: 'Income',
      data: [4800],
      backgroundColor: '#22C55E'
    },
    {
      label: 'Expenses',
      data: [1045],
      backgroundColor: '#EF4444'
    }
  ]
};
}
