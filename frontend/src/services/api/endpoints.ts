import { axiosClient, axiosClientNotAuth } from "./axios_client";
import type {
  BookRequest,
  LoanRequest,
  StudentRequest,
} from "./request_types";
import type {
  BookResponse,
  LoanResponse,
  StudentResponse,
  BookMetrics,
  PaginatedList,
  BookProxyOLResponse,
} from "./response_types";

const bookList: {
  (params?: { search?: string; period?: string }): Promise<BookResponse[]>;
  (params?: { search?: string; period?: string; page: number; page_size: number }): Promise<PaginatedList<BookResponse>>;
} = async (params) => {
  const { data } = await axiosClient.get("/books/", { params }) as any;
  return data
}
// === BOOKS ===
export const BooksAPI = {
  list: bookList,
  retrieve: async (id: number) => {
    const { data } = await axiosClient.get<BookResponse>(`/books/${id}/`)
    return data
  },
  create: async (body: BookRequest) => {
    const { data } = await axiosClient.post<BookResponse>("/books/", body)
    return data
  },
  update: async (id: number, body: BookRequest) => {
    const { data } = await axiosClient.put<BookResponse>(`/books/${id}/`, body)
    return data
  },
  partialUpdate: async (id: number, body: Partial<BookRequest>) => {
    const { data } = await axiosClient.patch<BookResponse>(`/books/${id}/`, body)
    return data
  },
  delete: async (id: number) => {
    const { data } = await axiosClient.delete(`/books/${id}/`)
    return data
  },
  metrics: async (period?: "W" | "M" | "Y" | "D") => {
    const { data } = await axiosClient.get<BookMetrics[]>('/books/metrics/', { params: { period } })
    return data
  },
  bookByIsbn: async (isbn: string) => {
    const { data } = await axiosClient.get<BookProxyOLResponse>(`/proxy/book/${isbn}/`)
    return data
  }
};

// === LOANS ===
const loanList: {
  (params: { search: string; }): Promise<LoanResponse[]>;
  (params: { search: string; page: number; page_size: number }): Promise<PaginatedList<LoanResponse>>;
} = async (params?) => {
  const { data } = await axiosClient.get("/loans/", { params });
  return data
}
export const LoansAPI = {
  list: loanList,
  retrieve: async (id: number) => {
    const { data: response } = await axiosClient.get<LoanResponse>(`/loans/${id}/`)
    return response
  },
  create: async (data: LoanRequest) => {
    const { data: response } = await axiosClient.post<LoanResponse>("/loans/", data)
    return response
  },
  update: async (id: number, data: LoanRequest) => {
    const { data: response } = await axiosClient.put<LoanResponse>(`/loans/${id}/`, data)
    return response
  },
  partialUpdate: async (id: number, data: Partial<LoanRequest>) => {
    const { data: response } = await axiosClient.patch<LoanResponse>(`/loans/${id}/`, data)
    return response
  },
  delete: async (id: number) => {
    const { data: response } = await axiosClient.delete(`/loans/${id}/`)
    return response
  },
  postponed: async (id: number, postponed_date: string) => {
    const { data: response } = await axiosClient.post(`/loans/${id}/postponed/`, { postponed_date })
    return response
  },
  return_book: async (id: number) => {
    const { data: response } = await axiosClient.post(`/loans/${id}/return_book/`)
    return response
  }
};

// === STUDENTS ===
const studentList: {
  (params: { search: string; }): Promise<StudentResponse[]>;
  (params: { search: string; page: number; page_size: number }): Promise<PaginatedList<StudentResponse>>;
} = async (params?) => {
  const { data } = await axiosClient.get("/students/", { params })
  return data;
}
export const StudentsAPI = {
  list: studentList,
  retrieve: async (id: number) => {
    const { data: response } = await axiosClient.get<StudentResponse>(`/students/${id}/`)
    return response
  },
  create: async (data: StudentRequest) => {
    const { data: response } = await axiosClient.post<StudentResponse>("/students/", data)
    return response
  },
  update: async (id: number, data: StudentRequest) => {
    const { data: response } = await axiosClient.put<StudentResponse>(`/students/${id}/`, data)
    return response
  },
  partialUpdate: async (id: number, data: Partial<StudentRequest>) => {
    const { data: response } = await axiosClient.patch<StudentResponse>(`/students/${id}/`, data)
    return response
  },
  delete: async (id: number) => {
    const { data: response } = await axiosClient.delete(`/students/${id}/`)
    return response
  },
};


export const TokenAPI = {
  token: async (request: {
    username: string;
    password: string;
  }) => {
    const { data } = await axiosClientNotAuth.post<{
      access: string;
      refresh: string;
    }>("/token/", request)
    return data
  },
  tokenRefresh: async (request: {
    refresh: string;
  }) => {
    const { data } = await axiosClientNotAuth.post<{
      access: string;
    }>("/token/refresh/", request)
    return data
  }
}
