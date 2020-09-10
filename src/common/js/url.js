/*
* 解析url参数
* @example ?id=ljh&a=b
* @return Object {id:ljh,a:b}
* */
export function urlParse() {
  const url = window.location.search
  const obj = {}
  const reg = /[?&][^?&]+=[^?&]+/g
  const arr = url.match(reg)
  // ['?id=ljh','&a=b']
  if (arr) {
    arr.forEach((item) => {
      const tempArr = item.substring(1).split('=')
      const key = decodeURIComponent(tempArr[0])
      const val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
