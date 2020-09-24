/*包 含 n个 日 期 时 间 处 理 的 工 具 函 数 模 块*/

/* 格 式 化 日 期 */
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '-' + plusZero(date.getMonth() + 1) + '-' + plusZero(date.getDate()) + ' '
    + plusZero(date.getHours()) + ':' + plusZero(date.getMinutes()) + ':' + plusZero(date.getSeconds())
}
function plusZero(num){
  if(num<10) return '0' + num
  else return num
}