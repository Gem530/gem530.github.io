<!--
  传入：
  detailsJson:加工要求的JSON结构

  displayType
        UnDefine = 0,
        Select = 10,
        Switch = 20,
        CheckBox = 30,
        RadioButton = 40,
        TextBox = 50,
        DateTime = 60,
        Textarea = 70,
        Number=80,
        Picture=90,

  -->
<template>
  <ul>
    <template v-for="item in paras" :key="item.id">
      <li style="text-align:left;">
        <!--  v-if="item.isChecked == '1'" -->
        <!-- 公共参数的显示 -->
        <div v-if="!(item.isDifferentiatePnl == '1') && item.isChecked == '1'" :style="getParaStyle(item)">
          <!-- 参数名 -->
          <span :style="{ fontWeight: item.isParameterNameBold ? 'bolder' : 'normal' }">
            {{ item.name }}<spna class="none">-{{item?.sort}}</spna>
          </span>
          <!-- 是否显示 ： -->
          <span v-if="item.type != 9">：</span>
          <!-- 参数值 -->
          <span v-if="item.type != 9" :style="{ color: '#54bfda', fontWeight: item.isBold == '1' ? 'bolder' : 'normal' }">
            {{ item.type == 7 ? (item.defaultValue == '1' ? '开' : item.defaultValue == '0' ? '关' : item.defaultValue) : item.defaultValue }}
          </span>
          <!-- 单位 -->
          <span v-if="item.type != 9">{{ item.unit }}</span>
        </div>
        <!-- 非公共参数的显示 -->
        <div v-if="item.isDifferentiatePnl == '1' && item.isChecked == '1'" :style="getParaStyle(item)">
          <!-- 参数名 -->
          <span :style="{ fontWeight: item.isParameterNameBold ? 'bolder' : 'normal' }">
            {{ item.name }}<spna class="none">-{{item?.sort}}</spna>
          </span>
          <!-- 是否显示 ： -->
          <span>：</span>
          <!-- 如果有多个Pnl或Scheme 则需要显示Pnl/Scheme的名称-->
          <ul id="pnlParaList" v-if="item?.differPNL?.length > 1">
            <template v-for="pnlPara in item.differPNL">
              <li v-if="pnlPara.isChecked == '1'">
                <span
                  :style="{ color: pnlPara.defaultValue ? '#54bfda' : 'red', fontWeight: pnlPara.isBold == '1' ? 'bolder' : 'normal' }">
                  {{ pnlPara.pnlName }}:{{ item.type == 7 ? (pnlPara.defaultValue == '1' ? '开' : pnlPara.defaultValue == '0' ? '关' : pnlPara.defaultValue) : pnlPara.defaultValue }}
                </span>
                <span>{{ item.unit }};&nbsp;&nbsp;</span>
              </li>
            </template>
          </ul>
          <!-- 否则，不需要显示Pnl/Scheme的名称，只显示参数值 -->
          <div v-else>
            <span style="color:#54bfda" v-if="item?.differPNL?.length">
              {{ item.type == 7 ? (item.differPNL[0].defaultValue == '1' ? '开' : item.differPNL[0].defaultValue == '0' ? '关' : item.differPNL[0].defaultValue) : item.differPNL[0].defaultValue }}
              <!-- {{ item.differPNL[0].defaultValue }} -->
            </span>
            <span>{{ item.unit }}</span>
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>
<script setup name="CraftQuirementText" lang="ts">
  // props: ['detailsJson',],
  // computed: {
  //   paras: function () {
  //     var result = JSON.parse(this.detailsJson);
  //     if (result)
  //       return result;
  //     else
  //       return [];
  //   }
  // },
const props: any = defineProps({
  detailsJson: Object
})
const paras: any = computed(() => {
  let result = props.detailsJson ? props.detailsJson : undefined;
  if (result)
    return result;
  else
    return [];
})

const getParaStyle = (item: any) => {
  var result: any = {
  };
  //如果不是仅显示的项，且没有赋值
  if (item.type != 9) {
    //如果是公共参数，且没有赋值，则显示红色
    if (item.isDifferentiatePnl == '1') {
      result.display = 'flex';
      result.justifyContent = 'flex-start';
    }
    if (!(item.isDifferentiatePnl == '1') && !item.defaultValue) {
      result.color = 'red';
    }

    //如果是非公共参数，则需要判断是否每个Pnl/Scheme都赋了值
    if (item.isDifferentiatePnl == '1') {
      //找到没有赋值的参数
      var tmp = item?.differPNL?.length && item?.differPNL.find(o => {
        return !o.defaultValue;
      });
      if (tmp) {
        result.color = 'red';
      }
    }
  }
  return result;
}
</script>
<style scoped>
#pnlParaList {}
ol, ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
#pnlParaList li {
  float: left;
}
</style>
  