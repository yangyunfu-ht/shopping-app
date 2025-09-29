import { dayjs } from 'element-plus'

/**
 * 根据当前时间返回不同的问候语。
 * @returns {string} 问候语 (例如：'早上好')
 */
export const getTimeBasedGreeting = () => {
  const hour = dayjs().hour()

  let greeting = '您好'

  if (hour >= 5 && hour < 12) {
    greeting = '早上好'
  } else if (hour >= 12 && hour < 14) {
    greeting = '中午好'
  } else if (hour >= 14 && hour < 18) {
    greeting = '下午好'
  } else {
    greeting = '晚上好'
  }

  return greeting
}
