<template>
  <div class="channel-edit">
      <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <van-button
          type="danger"
          plain round
          class="edit-btn"
          @click="isEdit = !isEdit"
          size="small">
          {{ isEdit ? '完成' : '编辑' }}
        </van-button>
      </van-cell>

      <van-grid :gutter="10" class="my-grid">
        <van-grid-item
          class="grid-item"
          v-for="(channel, index) in myChannels"
          :key="index"
          @click="onlyMyChannelClick(channel, index)"
        >
          <van-icon
            v-show="isEdit && !fixChannels.includes(channel.id)"
            slot="icon"
            name="clear"
          ></van-icon>

          <span
            class="text"
            :class="{ active: index === active }"
            slot="text"
          >
            {{channel.name}}
          </span>
        </van-grid-item>
      </van-grid>

      <!-- 频道推荐 -->
      <van-cell :border="false">
        <div slot="title" class="title-text">频道推荐</div>
      </van-cell>
      <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item
          @click="onAddChannel(channel)"
          icon="plus"
          class="grid-item"
          v-for="(channel, index) in recommendChannels"
          :key="index"
          :text="channel.name"
        />
      </van-grid>
      <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // 数组的filter方法
      // 会遍历数组，把符合的储存并且返回
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fixChannels: [0] // 固定频道，不允许删除
    }
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取全部列表失败！')
      }
    },

    async onAddChannel (channel) {
      // this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败，请重试')
        }
        // 已登录，把数据请求接口放到线上
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    onlyMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 如果点到推荐了，就return出去
        if (this.fixChannels.includes(channel.id)) {
          return
        }
        // 如果是编辑状态，则执行删除频道
        if (index <= this.active) {
          // 让激活频道的索引 - 1
          this.$emit('update-active', this.active - 1, true)
        }
        // this.myChannels.splice(index, 1)
        // 数据持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel (channel) {
      if (this.user) {
        // 已登录
        try {
          await deleteUserChannel(channel.id)
        } catch (err) {
          this.$toast('删除失败，请重试！')
        }
      } else {
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }

}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    line-height: 48px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: #f85959;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }

  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
      .grid-item {
        .van-grid-item__content {
          white-space: nowrap;
          flex-direction: row;
          .van-icon-plus {
            font-size: 26px;
            margin-right: 6px;
          }

        }
      }
  }
}
</style>
