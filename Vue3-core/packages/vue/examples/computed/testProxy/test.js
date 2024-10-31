/*
 * @Description: 
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-10-31 14:31:59
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2024-10-31 15:19:03
 * @FilePath: \Vue3-core\packages\vue\examples\computed\testProxy\test.js
 * Endless Story. - NANA
 */
const obj = {
  _value: 0,
  get value() {
    console.log('get')
    return obj._value
  },
  set value(value) {
    obj._value = value
  },
}
obj.value = [1, 2, 3, 4, 5]
console.log('********')
obj.value.push('12')
// set
// ********
// get


