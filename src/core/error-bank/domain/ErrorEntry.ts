export interface ErrorEntry {
  questionId: number;
  timesFailed: number;
  consecutiveCorrect: number;
  lastFailedAt: string;
}

export class ErrorBankDomainService {
  static shouldRemoveFromBank(entry: ErrorEntry): boolean {
    return entry.consecutiveCorrect >= 2;
  }
}
