import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { Transaction } from '../../models/transaction';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule, ReactiveFormsModule,
    MatFormFieldModule,
  MatInputModule,
  MatSelectModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];
  transactionForm: FormGroup;
  showForm = false;
  editingTransaction: Transaction | null = null;

  constructor(private financeService: FinanceService,
  private fb: FormBuilder
  ) 
    {
  this.transactionForm = this.fb.group({
    description: ['', Validators.required],
    category: ['', Validators.required],
    type: ['expense', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required]
  });
}
  

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.financeService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        console.error('Failed to load transactions', error);
      }
    });
  }
  addTransaction(): void {

  if (this.transactionForm.invalid) {
    this.transactionForm.markAllAsTouched();
    return;
  }
 const transaction: Transaction = {
    id: this.editingTransaction
      ? this.editingTransaction.id
      : Date.now(),

    description: this.transactionForm.value.description,
    category: this.transactionForm.value.category,
    type: this.transactionForm.value.type,
    amount: this.transactionForm.value.amount,
    date: this.transactionForm.value.date
  };

  
  if (this.editingTransaction) {

    this.financeService.updateTransaction(transaction).subscribe({
      next: () => {
        this.loadTransactions();
        this.resetForm();
      },
      error: (error) => {
        console.error('Failed to update transaction', error);
      }
    });

  } else {

    this.financeService.addTransaction(transaction).subscribe({
      next: () => {
        this.loadTransactions();
        this.resetForm();
      },
      error: (error) => {
        console.error('Failed to add transaction', error);
      }
    });

  }
}
resetForm(): void {

  this.transactionForm.reset({
    type: 'expense',
    amount: 0
  });

  this.editingTransaction = null;
  this.showForm = false;
}
deleteTransaction(id: number): void {

  this.financeService.deleteTransaction(id).subscribe({
    next: () => {
      this.loadTransactions();
    },
    error: (error) => {
      console.error('Failed to delete transaction', error);
    }
  });
}
editTransaction(transaction: Transaction): void {

  this.editingTransaction = transaction;
  this.showForm = true;

  this.transactionForm.patchValue({
    description: transaction.description,
    category: transaction.category,
    type: transaction.type,
    amount: transaction.amount,
    date: transaction.date
  });
}
}