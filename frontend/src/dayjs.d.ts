import dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';

declare module 'dayjs' {
  interface Dayjs {
    isoWeek(): number;
  }
}

dayjs.extend(isoWeek);