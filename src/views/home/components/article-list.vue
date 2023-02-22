<template>
  <div class="article-list">
        <van-pull-refresh
            v-model="isreFreshLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
            :success-duration="1500"
        >
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                :error.sync="error"
                error-text="请求失败，点击重新加载"
                @load="onLoad"
            >
                <!-- <van-cell
                v-for="(article, index) in list"
                :key="index"
                :title="article.title"
                /> -->
                <article-item
                  v-for="(article, index) in list"
                  :key="index"
                  :article="article"
                />

            </van-list>
        </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      error: false,
      isreFreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 初始化或者滚动到底部的时候会触发onLoad()
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.tamestap || Date.now(),
          with_top: 1
        })
        const { results } = data.data
        // 数组展开操作符，会把数组拿出来再放进去
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.timestap = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished设置为true
          // 不再load加载更多了
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },

    // 当下拉刷新的时候会触发该函数
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          // 下拉刷新，每次请求获取最新数据
          // 所以传递当前最新时间戳
          with_top: 1
        })
        // 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...data.data.results)

        this.isreFreshLoading = false

        // 更新刷新成功的数据
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
      }
      // 请求获取数据
      // 将数据追加到列表的顶部
      // 关闭下拉刷新的 loading 状态

      console.log('onRefresh')
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
    height: 79vh;
    overflow-y: auto;
}

</style>
