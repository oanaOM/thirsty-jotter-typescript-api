// Generated by Xata Codegen 0.26.4. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "plants",
    columns: [
      { name: "category", type: "string" },
      { name: "description", type: "text" },
      { name: "images", type: "file[]" },
      {
        name: "added_at_date",
        type: "datetime",
        notNull: true,
        defaultValue: "now",
      },
      { name: "quantity", type: "int" },
      { name: "name", type: "string" },
      { name: "labels", type: "string" },
    ],
  },
  {
    name: "users",
    columns: [
      { name: "hash", type: "string" },
      { name: "salt", type: "string" },
      { name: "email", type: "string", unique: true },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Plants = InferredTypes["plants"];
export type PlantsRecord = Plants & XataRecord;

export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;

export type DatabaseSchema = {
  plants: PlantsRecord;
  users: UsersRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Oana-s-workspace-qj71f1.eu-central-1.xata.sh/db/thirsty-jotter",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
