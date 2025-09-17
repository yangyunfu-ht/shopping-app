// 校验中国大陆手机号和座机号
export const validPhone = (phone: string) => {
  const mobileRegex = /^1[3-9]\d{9}$/
  const landlineRegex = /^(\d{3,4}-)?\d{7,8}(-\d{1,4})?$/
  return mobileRegex.test(phone) || landlineRegex.test(phone)
}

// 校验中国大陆身份证号和港澳台通行证号
export const validIdCard = (idCard: string) => {
  const mainlandIdRegex =
    /^(^[1-9]\d{5}(18|19|20|21)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$)|(^[1-9]\d{7}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$)$/
  // 港澳通行证（H/M开头，8位数字）
  const hkMacaoPassRegex = /^[HMhm]\d{8}$/
  // 台湾通行证（以字母+9位数字）
  const taiwanPassRegex = /^[A-Z][0-9]{9}$/
  return (
    mainlandIdRegex.test(idCard) ||
    hkMacaoPassRegex.test(idCard) ||
    taiwanPassRegex.test(idCard)
  )
}
