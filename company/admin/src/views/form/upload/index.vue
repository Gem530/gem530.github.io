<template>
  <div>
    <g-img-upload :limit="4" v-model="imglist" accept="image/*"></g-img-upload>
  </div>
</template>

<script lang="ts" setup name="upload">
import { ref, watch } from 'vue'

const imglist = ref([
  'https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/About us备份@2x.png',
  'https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/Analysis备份@2x.png',
  'https://fa-file-test.s3.ap-southeast-1.amazonaws.com/uploadfile/Bill备份@2x.png'
])

watch(() => imglist.value, (val: any[]) => {
  console.log(val)
})
</script>