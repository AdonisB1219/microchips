export const emptyCellOneLevel = (
  row: any,
  key: string,
  defaultValue: string = 'N/A'
) => {
  const keys = key.split('.'); 
  let value = row?.original;

  for (const k of keys) {
    value = value?.[k];
    if (value == null) {
      break;
    }
  }

  return value != null && value.toString().trim() ? value : defaultValue;
};
