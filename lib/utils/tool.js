exports.deepClone = function (obj) {
  if (obj === null || typeof obj !== 'object') return obj
  let newObj = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? exports.deepClone(obj[key]) : obj[key]
    }
  }
  return newObj
}

exports.type = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase()
}