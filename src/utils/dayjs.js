import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
// dayjs 语言默认为英文，我们这里设置成中文
// 全局使用
dayjs.locale('zh-cn')

Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

// dayjs() 获取当前最新时间
// dayjs().format('YYYY-MM-DD')
