export interface Transaction {
    id: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
}
