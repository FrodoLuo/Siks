const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const formatDate = (date: Date) => {
  const now = Date.now();
  const past = date.getTime();
  if (now - past < DAY) {
    if (now - past < HOUR) {
      if (now - past < MINUTE) {
        return `${((now - past) / SECOND).toFixed(0)}秒前`;
      } else {
        return `${((now - past) / MINUTE).toFixed(0)}分钟前`;
      }
    } else {
      return `${((now - past) / HOUR).toFixed(0)}小时前`;
    }
  } else {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
};
