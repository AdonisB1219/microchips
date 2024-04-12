export const emptyCellOneLevel = (
  row: any,
  key: string,
  defaultValue: string = 'N/A'
) => {
  const value = row?.original?.[key]?.toString()?.trim();
  return value ? value : defaultValue;
};
