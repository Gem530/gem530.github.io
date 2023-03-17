<template>
  <div class="create-name">
    <h3>生成姓名</h3>
    <div class="create-label">随机名字组 <span>文字用/隔开，如：美/雅</span></div>
    <textarea class="create-name-textarea" v-model="namesText" placeholder="用于生成名字，美/雅"></textarea>

    <div class="create-label">随机生成多少个名字</div>
    <input type="text" class="create-len-input" v-model="nameLen" placeholder="随机生成多少个名字">
    
    <div class="create-label">姓名
      <span>有几个格子，就生成多长的姓名，也可在格子中填写名</span>
      <br/>
      <span>例子：第二个格子中填写 美，陈美x</span>
    </div>
    <div class="create-list">
      <div class="create-item" v-for="(item, i) in creates" :key="i">
        <input
          type="text"
          v-model="item.name"
          class="create-item-input"
          :placeholder="i === 0 ? '姓' : '名'"
          @input="(e) => mustChinese(e)"
        >
        <van-button class="create-item-btn" icon="delete" size="small" @click="delName(i)"/>
      </div>
      <van-button class="create-item-btn" type="primary" icon="plus" size="small" @click="addName"/>
    </div>
    <van-button size="small" @click="submitName">随机生成</van-button>

    <div class="create-label">随机姓名列表</div>
    <div class="name-list" v-if="nameList.length">
      <div
        :key="i"
        :class="{
          'name-item': true,
          'name-item-active': nameActives.includes(item)
        }"
        v-for="(item, i) in nameList"
        @click="chooseName(item)"
      >{{ item }}</div>
    </div>
    <div v-else>暂无姓名~</div>

    <div class="create-label">选中的姓名</div>
    <div class="name-list" v-if="nameActives.length">
      <div class="name-item name-item-active" v-for="(item, i) in nameActives" :key="i">{{ item }}</div>
    </div>
    <div v-else>暂无姓名~</div>
  </div>
</template>

<script setup name="CreateName" lang="ts">
import { ref, computed } from 'vue'
import { names } from '@/utils/chinese'
import { twoNumberBetween } from '@/utils'
interface createsType {
  name: string|undefined
}

const nameLen = ref(100)
const namesText = ref<string>('')
const nameList = ref<string[]>([])
const nameActives = ref<string[]>([])
const creates = ref<createsType[]>([{
  name: '陈'
}, {
  name: undefined
}])

namesText.value = names.join('/')
const namesArr = computed(() => namesText.value.split('/'))

const mustChinese = (e: any) => {
  e.target.value = e.target.value.replace(/[^\u4E00-\u9FA5]/g, '').slice(0, 1)
}

const addName = () => {
  creates.value.push({
    name: undefined
  })
}

const delName = (i: number) => {
  creates.value.splice(i, 1)
}

const chooseName = (val: string) => {
  const num = nameActives.value.indexOf(val)
  if (num !== -1) {
    nameActives.value.splice(num, 1)
  } else {
    nameActives.value.push(val)
  }
}

const submitName = () => {
  nameList.value = []
  nameActives.value = []
  for (let i = 0; i < nameLen.value; i++) {
    let tempName = ''
    creates.value.forEach(({ name }) => {
      if (name) {
        tempName += name
      } else {
        tempName += namesArr.value[twoNumberBetween(0, namesArr.value.length - 1)]
      }
    })
    nameList.value.includes(tempName) ? '' : nameList.value.push(tempName)
  }
}
</script>

<style lang="scss" scoped>
.create-name {
  padding: 10px 12px;
  textarea,
  input {
    border-radius: 4px;
    border: 1px solid #e4e4e4;
    &:hover {
      border-color: #3f62ff;
    }
  }
  .create-label {
    font-size: 16px;
    margin: 15px 0 10px;
    
    span {
      font-size: 12px;
      color: #999999;
    }
  }

  .create-name-textarea {
    width: 100%;
    min-height: 100px;
  }

  // .create-len-input {
  //   border: 1px solid #e4e4e4;
  // }

  .create-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    .create-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 10px;
      margin-bottom: 10px;
      &:first-child {
        margin-left: 0;
      }

      .create-item-input {
        width: 60px;
        height: 30px;
        font-size: 16px;
        text-align: center;
      }
    }

    .create-item-btn {
      height: 30px;
      margin-left: 5px;
    }
  }

  .name-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    .name-item {
      height: 30px;
      padding: 0 10px;
      margin: 5px 5px 0 0;
      border: 1px solid #e4e4e4;
      font-size: 16px;
      text-align: center;
      line-height: 30px;
      border-radius: 4px;

      &.name-item-active {
        border-color: #3f62ff;
        color: #3f62ff;
      }
    }
  }
}
</style>