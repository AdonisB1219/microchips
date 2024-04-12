import dayjs from 'dayjs';

export const formatDate = date => {
  const dateString = date.toISOString();
  const dateWithoutTime = dateString.split('T')[0];

  return dayjs(dateWithoutTime).format('YYYY-MM-DD');
};