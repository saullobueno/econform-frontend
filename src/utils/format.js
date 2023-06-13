import { ptBR } from 'date-fns/locale';
import { parseISO, format, formatDistanceToNowStrict } from 'date-fns';
import { Result } from 'antd';

const date = (date, formatDate = "dd' 'MMM' 'yyyy' às 'H'h'mm") => {
  if (!date || 0 === date.length) {
    return '-';
  }

  return format(parseISO(date), formatDate, { locale: ptBR });
};

const daysDistance = (date, days = 0) => {
  let compare = formatDistanceToNowStrict(date, {
    unit: 'day',
    roundingMethod: 'ceil',
  });
  let compare1 = compare.replace(' days', '');
  let compare2 = compare1.replace(' day', '');

  const result = Number(compare2) <= days;
  return result;
};

export { date, daysDistance };
