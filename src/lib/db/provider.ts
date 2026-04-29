/**
 * DATABASE PROVIDER (RUNTIME SWITCH)
 * 
 * Orchestrates the selection of the active ChatDBAdapter based on 
 * environment variables, enabling zero-code transitions between 
 * Supabase (Local) and DynamoDB (Production).
 */

import { ChatDBAdapter } from "./index";
import { SupabaseChatAdapter } from "./supabase";
import { DynamoDBChatAdapter } from "./dynamodb";

const DB_PROVIDER = process.env.NEXT_PUBLIC_DB_PROVIDER || "supabase";

// 🛡️ SAFE INITIALIZATION
if (DB_PROVIDER === "supabase" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("⚠️ [DB_PROVIDER] Missing Supabase config. Running in Safe Mode.");
}

// Instantiate the singleton adapter instance
const chatAdapter: ChatDBAdapter = 
  DB_PROVIDER === "dynamodb" 
    ? new DynamoDBChatAdapter() 
    : new SupabaseChatAdapter();

export const db = chatAdapter;
export const activeProvider = DB_PROVIDER;
