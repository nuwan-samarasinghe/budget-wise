export type Category = {
  id: string;
  name: string;
};

export type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};
