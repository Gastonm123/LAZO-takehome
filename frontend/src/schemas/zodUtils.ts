import z from "zod";

/** Trim; cadena vacía → `null`. */
export const trimmedEmptyToNull = z.string().transform((value) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
});
