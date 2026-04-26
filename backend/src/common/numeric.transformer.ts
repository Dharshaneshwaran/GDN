import { ValueTransformer } from "typeorm";

export const numericTransformer: ValueTransformer = {
  to: (value: number | null): number | null => value,
  from: (value: string | number | null): number | null => {
    if (value === null) {
      return null;
    }

    return Number(value);
  }
};
