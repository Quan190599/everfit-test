import { Transform } from "class-transformer";

import { ExposeOptions } from "class-transformer";

export function TransformId(options?: ExposeOptions) {
  return (target: any, propertyKey: string) => {
    Transform((params) => {
      if (Array.isArray(params.obj[propertyKey])) {
        return params.obj[propertyKey].map((item) => item?.toString());
      }

      return params.obj[propertyKey]?.toString();
    }, options)(target, propertyKey);
  };
}

export const toSnakeCase = (str: string) =>
  str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/^_/, "")
    .toLowerCase();
