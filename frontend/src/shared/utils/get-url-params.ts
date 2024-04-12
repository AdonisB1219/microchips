export const getUrlParams = (params: Object): string => {
  const queryParams = new URLSearchParams();

  // Recorrer los parámetros y agregar solo aquellos que tienen un valor
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};
