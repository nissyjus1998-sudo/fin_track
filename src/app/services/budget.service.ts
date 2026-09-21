import { Injectable } from '@angular/core';
import { Observable, of ,forkJoin} from 'rxjs';
import { Budget } from '../models/budget';
import { map, switchMap } from 'rxjs/operators';

import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {
  constructor(
  private financeService: FinanceService
) {}

  private budgets: Budget[] = [
    {
      id: 1,
      category: 'Food',
      limit: 500,
      spent: 320
    },
    {
      id: 2,
      category: 'Housing',
      limit: 1200,
      spent: 900
    },
    {
      id: 3,
      category: 'Transport',
      limit: 300,
      spent: 180
    },
    {
      id: 4,
      category: 'Entertainment',
      limit: 250,
      spent: 210
    }
  ];

  getBudgets(): Observable<Budget[]> {
    return of(this.budgets);
  }
getBudgetsWithSpending(): Observable<Budget[]> {
  return this.getBudgets().pipe(
    switchMap(budgets =>
      forkJoin(
        budgets.map(budget =>
          this.financeService
            .getSpendingByCategory(budget.category)
            .pipe(
              map(spent => ({
                ...budget,
                spent
              }))
            )
        )
      )
    )
  );
}
  addBudget(budget: Budget): Observable<Budget> {
    this.budgets.push(budget);

    return of(budget);
  }

  updateBudget(budget: Budget): Observable<Budget> {

    const index = this.budgets.findIndex(
      item => item.id === budget.id
    );

    if (index !== -1) {
      this.budgets[index] = budget;
    }

    return of(budget);
  }

  deleteBudget(id: number): Observable<boolean> {

    this.budgets = this.budgets.filter(
      budget => budget.id !== id
    );

    return of(true);
  }
}
