import * as drizzleQueries from "@batijs/drizzle/database/drizzle/queries/todos";
import * as sqliteQueries from "@batijs/sqlite/database/sqlite/queries/todos";
import * as d1Queries from "@batijs/d1-sqlite/database/d1/queries/todos";
import { getContext } from "telefunc";

export async function onNewTodo({ text }: { text: string }) {
  if (BATI.has("drizzle")) {
    const context = getContext();
    await drizzleQueries.insertTodo(context.db, text);
  } else if (BATI.has("sqlite") && !BATI.hasD1) {
    const context = getContext();
    sqliteQueries.insertTodo(context.db, text);
  } else if (BATI.hasD1) {
    const context = getContext();
    await d1Queries.insertTodo(context.db, text);
  } else {
    // This is where you'd persist the data
    console.log("Received new todo", { text });
  }
}
