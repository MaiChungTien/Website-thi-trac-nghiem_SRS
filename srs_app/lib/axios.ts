export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    console.warn(`GET ${url} is not implemented yet.`);
    return [] as T;
  },
};
