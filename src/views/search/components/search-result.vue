<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })
        // 2. 将数据添加到数组列表之中
        const { results } = data.data
        this.list.push(...results)
        // 3. 将本次加载中的loading关闭
        this.loading = false
        // 4. 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
        // this.$toast('结果加载失败，请重试！')
      }
    }
  }
}
</script>

<style>

</style>
