import dayjs from 'dayjs';

export const formatDate = (date: string): string => {
  const dateWithoutTime = date.split('T')[0];
  return dayjs(dateWithoutTime).format('YYYY-MM-DD');
};
