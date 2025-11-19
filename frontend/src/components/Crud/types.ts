import type { PaginatedList } from "@/services/api/response_types";
import type { LucideIcon } from "lucide-vue-next";

interface BaseSchemaField {
  label: string;
  required?: boolean;
  actions?: {
    Icon: LucideIcon;
    onAction: (params: {
      setFieldValue: (key: string, value: any) => void
      getFieldValue: (key: string) => any
    }) => void;
  }[]
}

interface DefaultSchemaField extends BaseSchemaField {
  type: "string" | "number" | "file" | "date";
}

interface SelectSchemaField extends BaseSchemaField {
  type: "select";
  baseQueryKey: string;
  option: (it: any) => { label: string; value: number }
  viewsetAPI: {
    list: {
      (params: { search: string; page: number; page_size: number; }): Promise<PaginatedList<any>>
      (params: { search: string; }): Promise<any[]>
    }
  }
}

interface ReadOnlySchemaField extends BaseSchemaField {
  type: "readonly",
}


export type SchemaField = DefaultSchemaField | SelectSchemaField | ReadOnlySchemaField


export type Schema = Record<string, SchemaField>


export interface Action {
  onAction(ids: number[]): void
  label: string;
}

export type Actions = Record<string, Action>
