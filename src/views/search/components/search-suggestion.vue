<template>
    <div class="search-suggestion">
        <van-cell
          icon="search"
          v-for="(text, index) in suggestions"
          :key="index"
          @click="$emit('search', text)"
        >
          <div slot="title" v-html="highlight(text)"></div>
        </van-cell>
    </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载有好处，只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
      // 当searchText发生改变的时候就会调用handler函数
      // 注意：handler函数名称是固定的
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const data = await getSearchSuggestions(q)
        // console.log(data)
        this.suggestions = data.data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      try {
        const highlightStr = `<span class="active">${this.searchText}</span>`
        // 正则表达式//中间的内容都会被当作匹配字符来使用，而不是数据变量
        // 如果需要根据数据变量动态地创建正则表达式，则手动 new RegExp
        const reg = new RegExp(this.searchText, 'gi')
        // text.replace(/dsadsa/gi, highlightStr)
        return text.replace(reg, highlightStr)
      } catch {
        return text
      }
    }
  }

}
</script>

<style lang="less" scoped>
.search-suggestion {
    /deep/ span.active {
        color: #3296fa !important;
    }
}
</style>
