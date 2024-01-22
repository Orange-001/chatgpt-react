import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

export function isToday(targetDate: Dayjs): boolean {
  const result = dayjs(targetDate).isSame(dayjs(), 'day')
  return result
}

export function isYesterday(targetDate: Dayjs): boolean {
  const result = dayjs(targetDate).isSame(dayjs().subtract(1, 'day'), 'day')
  return result
}

export function isWithin7Days(targetDate: Dayjs): boolean {
  const result =
    dayjs(targetDate).isAfter(dayjs().subtract(7, 'day')) &&
    dayjs(targetDate).isSameOrBefore(dayjs())
  return result
}

export function isWithin30Days(targetDate: Dayjs): boolean {
  const result =
    dayjs(targetDate).isAfter(dayjs().subtract(30, 'day')) &&
    dayjs(targetDate).isSameOrBefore(dayjs())
  return result
}
