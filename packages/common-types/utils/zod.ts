import { z } from "zod";

export function validateWith(schema: z.ZodTypeAny) {
  return class ValidatedClass<T> {
    constructor(data: T) {
      Object.assign(this, schema.parse(data));
    }
  };
}

export const zodErrorStringify = (error: z.ZodSafeParseError<any>) => {
  const errorMessages: string[] = [];
  for (const issue of error?.error?.issues) {
    errorMessages.push(`${issue.message}`);
  }
  return errorMessages.join(", ");
};
