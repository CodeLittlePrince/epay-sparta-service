exports.deepClone = function (obj) {
  const objType = exports.type(obj)
  if (objType === 'array' || objType === 'object') {
    let newObj = objType === 'array' ? [] : {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = typeof obj[key] === 'object' ? exports.deepClone(obj[key]) : obj[key]
      }
    }
    return newObj
  } else {
    return obj
  }
}

exports.type = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase()
}