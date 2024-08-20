<!--
  传入：
  remarkJson:工艺备注的JSON结构

  identifyJsonDetails(remarkJson):返回字符串

  -->

<template>
  <div style="text-align:left">
    <div>{{remark.public}}</div>
    <template v-for="(item,index) in (remark.differPNL || [])" :key="index">
      <!-- <div v-if="item.remark != undefined || item.remark != null || item.remark != ''"> -->
      <div v-if="item.remark">
        <span>{{item.pnlName}}:{{item.remark}}</span>
      </div>
    </template>
  </div>
</template>
<script setup name="RemarkText" lang="ts">
const props = defineProps({
  remarkJson: Object
})
const remark = computed(() => {
  var result = props.remarkJson ? props.remarkJson : undefined;
  if (!result) {
    result = {
      public: '',
      differPNL:[]
    }
  }
  return result;
})
const text = ref('')
</script>
