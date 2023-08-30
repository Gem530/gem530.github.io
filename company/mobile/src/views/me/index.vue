<template>
  <div>
    <h1>{{$t('router.me.title')}}</h1>
    <h2>测试scss文件</h2>
    <router-link to="/">首页</router-link>
    <div>{{ htmlValue }}</div>
    <input id="inputEmosId" ref="inputEmosRef" v-model="emoValue" placeholder="请输入聊天内容">
    <button @click="sendMsg">发送</button>
    <div class="emojis-list">
      <div class="emojis-item" v-for="(item, i) in emoList" :key="i" @click="getEmo(i)">{{ unicodeToEmoji(item.u) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup name="Me">
import { ref } from 'vue'
import { insertStr } from '@/utils'
import { emoList, unicodeToEmoji } from '@/utils/emojis'

const inputEmosRef = ref()
const emoValue = ref<string>('')
const htmlValue = ref<string>('')
const getEmo = (index: any) => {
  function changeSelectedText(str: any) {
    const dom: any = document.getElementById('inputEmosId')
    if (window.getSelection()) {
      const Index = dom.selectionStart // 表单光标焦点位置
      // 非IE浏览器
      emoValue.value = insertStr(emoValue.value, Index, unicodeToEmoji(str))
      dom.focus()
      setTimeout(() => {
        // 在未选中文本的情况下，重新设置光标位置
        dom.setSelectionRange(Index + 2, Index + 2)
      }, 0)
    }
  }
  changeSelectedText(emoList[index].u);
}

const sendMsg = () => {
  htmlValue.value = emoValue.value
}
</script>

<style lang="scss" scoped>
h2 {
  color: $bodyColorWhite;
  background: #000;
}

.emojis-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;

  .emojis-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
  }
}
</style>