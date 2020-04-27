/*包 含 n个 日 期 时 间 处 理 的 工 具 函 数 模 块*/

/* 格 式 化 日 期 */
export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
    + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}