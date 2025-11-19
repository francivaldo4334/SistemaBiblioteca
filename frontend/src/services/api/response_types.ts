export interface BookResponse {
  id: number;
  title: string;
  isbn: string;
  quantity: number;
  authors: string;
  book_type: string;
  publisher: string;
  image: string;
  not_returned_count: number;
  available_count: number;
  publish_date: string;
}

export interface BookProxyOLResponse {
  title: string;
  authors: {
    name: string;
  }[];
  publishers: {
    name: string;
  }[];
  publish_date: string;
  cover: {
    small: string;
    medium: string;
    large: string;
  }
}

export interface PaginatedList<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[],
  total_pages: number;
  current_page: number;
}

export interface LoanResponse {
  id: number;
  created: string;
  modified: string;
  return_date: string;
  postponed_date?: string | null;
  status: "OBT" | "RTN" | "PPD";
  book: number;
  student: number;
}

export interface StudentResponse {
  id: number;
  status: 0 | 1;
  activate_date?: string | null;
  deactivate_date?: string | null;
  name: string;
  registration: string;
}

export interface BookMetrics {
  key: string;
  value: number;
  period: "W" | "Y" | "M" | "D"
}


// // === OpenLibrary Response Types ===

// // Dados básicos de um livro retornado pelo endpoint /api/books
// export interface OLBookData {
//   title?: string;
//   subtitle?: string;
//   authors?: { name: string; url: string }[];
//   publish_date?: string;
//   number_of_pages?: number;
//   identifiers?: Record<string, string[]>;
//   publishers?: { name: string }[];
//   cover?: { small?: string; medium?: string; large?: string };
//   subjects?: { name: string; url: string }[];
//   url?: string;
// }

// // Resultado do endpoint /search.json
// export interface OLSearchResult {
//   numFound: number;
//   start: number;
//   numFoundExact: boolean;
//   docs: {
//     key: string;
//     title: string;
//     author_name?: string[];
//     author_key?: string[];
//     isbn?: string[];
//     first_publish_year?: number;
//     cover_i?: number;
//     subject?: string[];
//   }[];
// }

// // Autor
// export interface OLAuthor {
//   key: string; // Ex: /authors/OL23919A
//   name: string;
//   birth_date?: string;
//   death_date?: string;
//   bio?: string | { value: string };
//   links?: { title: string; url: string }[];
//   photos?: number[];
//   alternate_names?: string[];
// }

// // Lista de obras de um autor
// export interface OLAuthorWorks {
//   links?: { self: string; author: string };
//   entries: {
//     key: string;
//     title: string;
//     covers?: number[];
//     first_publish_date?: string;
//     subjects?: string[];
//   }[];
//   size: number;
// }

// // Dados de um assunto
// export interface OLSubject {
//   key: string;
//   name: string;
//   work_count: number;
//   works: {
//     key: string;
//     title: string;
//     authors?: { name: string; key: string }[];
//     cover_id?: number;
//   }[];
// }

// // Dados de um Work
// export interface OLWork {
//   key: string;
//   title: string;
//   description?: string | { value: string };
//   subjects?: string[];
//   authors?: { author: { key: string; name?: string } }[];
//   covers?: number[];
// }

// // Dados do volume breve (edições resumidas)
// export interface OLVolumeBrief {
//   items?: Array<{
//     title: string;
//     authors?: { name: string }[];
//     publish_date?: string;
//     identifiers?: Record<string, string[]>;
//   }>;
// }
