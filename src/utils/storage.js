/*
* 封装本地存储模块
*/

// 存储数据
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    // 将数组、对象的数据转换成JSON字符串进行存储
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取数据
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  // try ... catch
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
