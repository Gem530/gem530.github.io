<template>
  <div class="img-choice-list global-flex flex-start">
    <div
      :class="{
            'img-choice-item': true,
            'active': activeIndex == index
        }"
      v-for="(item, index) in props.data"
      @click="choose(item, index)"
    >
      <el-image :src="item.url" :style="{width: props.width+'px', height: props.height+'px'}"></el-image>
      <div class="img-choice-bottom global-flex flex-center">
        <el-tooltip placement="top" :content="item.signName">
          <div class="img-choice-name" :style="`max-width: ${props.width-20}px;`">{{item.signName}}</div>
        </el-tooltip>
        <el-icon color="var(--el-color-primary)" @click.stop="openViewer(index)"><ZoomIn /></el-icon>
      </div>
    </div>
  </div>
  <!-- element-plus 文件预览组件 -->
  <el-image-viewer
    v-if="imgView.showView"
    :initial-index="imgView.index"
    :url-list="(props.data.map(v => v.url) as string[])"
    @close="closeViewer"
  ></el-image-viewer>
</template>

<script setup name="ImgChoice" lang="ts">
const emits = defineEmits(['choose'])
const props = withDefaults(defineProps<{
  data: any[],
  width: number,
  height: number,
}>(), {
  data: () => [],
  width: 100,
  height: 100,
})

const activeIndex = ref(-1)
const imgView = ref({
    index: 0,
    showView: false,
})

const choose = (row: any, index: number) => {
    activeIndex.value = index
    emits('choose', row, activeIndex.value)
    console.log(row, activeIndex.value)
}

const openViewer = (index: number) => {
    imgView.value.index = index
    imgView.value.showView = true
}

const closeViewer = () => {
    imgView.value.showView = false
}

defineExpose({  })
</script>

<style lang="scss" scoped>
.img-choice-list {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    .img-choice-item {
        padding: 5px;
        // margin: 0 10px 10px 0;
        box-sizing: border-box;

        &.active {
            background: rgba(216, 242, 253, 1);
        }

        .img-choice-name {
            margin-right: 4px;
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}
</style>
