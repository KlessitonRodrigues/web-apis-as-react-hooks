import { z } from "zod";
import { dictionaries } from "../constants/dictionary";
import { COMMON } from "../types/common";

export const createTransactionSchemas = (
  options: COMMON.CreateSchemaOptions,
) => {
  const dictionary = dictionaries[options.lang];

  const transactionSchema = {
    id: z.string().default(""),
    name: z.string().min(3, dictionary.REQUIRED).default(""),
    date: z.string().default(""),
    type: z.string().min(1, dictionary.REQUIRED).default(""),
    value: z.coerce.number().positive(dictionary.MUST_BE_POSITIVE).default(0),
  };

  return {
    createTransaction: z.object({
      name: transactionSchema.name,
      date: transactionSchema.date,
      value: transactionSchema.value,
      type: transactionSchema.type,
    }),
  };
};
