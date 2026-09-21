import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../models/budget';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent implements OnInit {

  budgets: Budget[] = [];

  budgetForm: FormGroup;

  showForm = false;

  editingBudget: Budget | null = null;

  constructor(
    private budgetService: BudgetService,
    private fb: FormBuilder
  ) {
    this.budgetForm = this.fb.group({
      category: ['', Validators.required],
      limit: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

 loadBudgets(): void {
  this.budgetService.getBudgetsWithSpending().subscribe({
    next: (budgets) => {
      this.budgets = budgets;
    },
    error: (error) => {
      console.error('Failed to load budgets', error);
    }
  });
}

  addBudget(): void {

    if (this.budgetForm.invalid) {
      this.budgetForm.markAllAsTouched();
      return;
    }

    const budget: Budget = {
      id: this.editingBudget
        ? this.editingBudget.id
        : Date.now(),

      category: this.budgetForm.value.category,
      limit: this.budgetForm.value.limit,

      // Temporary value.
      // We will calculate this from transactions later.
      spent: this.editingBudget
        ? this.editingBudget.spent
        : 0
    };

    if (this.editingBudget) {

      this.budgetService.updateBudget(budget).subscribe({
        next: () => {
          this.loadBudgets();
          this.resetForm();
        },
        error: (error) => {
          console.error('Failed to update budget', error);
        }
      });

    } else {

      this.budgetService.addBudget(budget).subscribe({
        next: () => {
          this.loadBudgets();
          this.resetForm();
        },
        error: (error) => {
          console.error('Failed to add budget', error);
        }
      });
    }
  }

  editBudget(budget: Budget): void {

    this.editingBudget = budget;
    this.showForm = true;

    this.budgetForm.patchValue({
      category: budget.category,
      limit: budget.limit
    });
  }

  deleteBudget(id: number): void {

    this.budgetService.deleteBudget(id).subscribe({
      next: () => {
        this.loadBudgets();
      },
      error: (error) => {
        console.error('Failed to delete budget', error);
      }
    });
  }

  resetForm(): void {

    this.budgetForm.reset({
      category: '',
      limit: 0
    });

    this.editingBudget = null;
    this.showForm = false;
  }

  getPercentage(budget: Budget): number {

    if (budget.limit === 0) {
      return 0;
    }

    return Math.min(
      (budget.spent / budget.limit) * 100,
      100
    );
  }

  getRemaining(budget: Budget): number {
    return budget.limit - budget.spent;
  }

  getStatus(budget: Budget): string {

    const percentage = (budget.spent / budget.limit) * 100;

    if (percentage > 100) {
      return 'over';
    }

    if (percentage >= 75) {
      return 'warning';
    }

    return 'good';
  }
}
