export interface BookRequest {
  title: string;
  isbn: string;
  quantity: number;
  authors: string;
  book_type: string;
  publisher: string;
}

export interface LoanRequest {
  return_date: string; // formato: YYYY-MM-DD
  postponed_date?: string | null;
  status: "OBT" | "RTN" | "PPD";
  book: number;
  student: number;
}

export interface StudentRequest {
  status: 0 | 1;
  activate_date?: string | null;
  deactivate_date?: string | null;
  name: string;
  registration: string;
}
