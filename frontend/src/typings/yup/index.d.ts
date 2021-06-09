import { ArraySchema } from 'yup';

declare module "yup" {
  interface ArraySchema {
    genreHasCategories: () => ArraySchema;
  }
}