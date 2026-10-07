import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { CombinedGraphQLErrors } from "@apollo/client/errors";

/** First user-facing message of an Apollo error. */
export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (CombinedGraphQLErrors.is(error)) return error.errors[0]?.message ?? fallback;
  if (error instanceof Error && error.message) {
    return /fetch|network/i.test(error.message) ? "Can't reach the server. Check your connection." : error.message;
  }
  return fallback;
}

export function errorCode(error: unknown): string | undefined {
  if (!CombinedGraphQLErrors.is(error)) return undefined;
  return error.errors[0]?.extensions?.code as string | undefined;
}

/**
 * The backend puts the input field into the GraphQL error `path` (limelite convention).
 * Returns true when the error was attached to a field, otherwise the caller shows a toast.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly string[],
): boolean {
  if (!CombinedGraphQLErrors.is(error)) return false;
  let applied = false;
  for (const e of error.errors) {
    const path = e.path?.map(String).join(".");
    if (!path) continue;
    if (fields.includes(path) || fields.includes(path.split(".")[0]!)) {
      setError(path as Path<T>, { type: "server", message: e.message });
      applied = true;
    }
  }
  return applied;
}
