<template>
    <el-dialog :title="props.title" v-model="show" :="attrs">
      <div>
        <el-steps style="max-width: 100%;" :active="active" align-center>
            <el-step title="上传文件" />
            <el-step title="导入" />
            <el-step :status="resInfo.isSuccess ? (active == 3 ? 'finish' : 'process') : 'error'" :title="resInfo.isSuccess ? '导入成功' : '导入失败'" />
        </el-steps>
        <div style="width: 380px;margin: 20px auto 0;">
            <XUpload drag v-model:model-value="fileList" model="download" :fileSize="20" :fileType="['xls', 'xlsx']" @fileChange="fileChange" @delFile="delFile">
                <div class="upload-content global-flex flex-center flex-column">
                    <template v-if="active == 1">
                        <el-icon size="50"><UploadFilled /></el-icon>
                        <div class="upload-click-tips global-flex flex-center">
                            <div class="blue-unline">点击上传</div>或将文件拖拽到这里上传
                        </div>
                        <div class="upload-tips">支持扩展名：.xls、.xlsx，大小不超过20M</div>
                    </template>
                    <template v-if="active == 2">
                        <el-icon size="50"><UploadFilled /></el-icon>
                        <div class="upload-click-tips global-flex flex-center">数据正在导入...</div>
                    </template>
                    <template v-if="active == 3">
                        <el-icon size="50"><UploadFilled /></el-icon>
                        <template v-if="resInfo.isSuccess">
                            <div class="upload-click-tips global-flex flex-center">{{resInfo.resMsg}}</div>
                        </template>
                        <template v-else>
                            <div class="upload-click-tips global-flex flex-center">{{resInfo.resMsg}}</div>
                            <div class="upload-click-tips global-flex flex-center" @click.stop="downLoadHandle(resInfo.fileKey)">
                                <div class="blue-unline">点击下载失败数据</div>
                            </div>
                        </template>
                    </template>
                </div>
            </XUpload>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
            <template v-if="active == 3">
                <el-button @click="show = false">我知道了</el-button>
            </template>
            <template v-else>
                <el-button @click="closeHandle">取消</el-button>
                <el-button :loading="props.loading" type="primary" @click="confirmHandle">开始导入</el-button>
            </template>
        </div>
      </template>
    </el-dialog>
</template>

<script setup name="GExportInvoice" lang="ts">
import fileSaver from "file-saver";
import { downloadUrl } from '@/api/upload/index'

const slots = useSlots()
const attrs = useAttrs()
const { proxy } = getCurrentInstance() as any
const emits = defineEmits(['update:open', 'confirm', 'close'])
const props = withDefaults(defineProps<{
    open: boolean
    title?: string
    loading?: boolean,
}>(), {
    title: '',
    open: false,
    loading: false,
})

const active = ref(1)
const resInfo = ref({
    resMsg: '',
    fileKey: '',
    isSuccess: true,
})
const fileList = ref<any[]>([])

const show = computed({
    get () {
        return props.open
    },
    set (val: boolean) {
        emits('update:open', val)
        emits('close')
    }

})
watch(() => show.value, (val) => {
  if (val) {
    active.value = 1
    resInfo.value.isSuccess = true
    fileList.value = []
  }
})

const fileChange = (files: any[]) => {
    console.log(files)
    if (files?.length >= 2) {
        setTimeout(() => {
            fileList.value = files.slice(files.length - 1, files.length)
            console.log(fileList.value)
        }, 10)
    }
    if (files?.length) {
      active.value = 2
    }
}

const delFile = () => {
    active.value = 1
}

// 文件下载
const downLoadHandle = (key: string) => {
    if (!key) {
        proxy?.$modal.msgError('文件不存在')
        return
    }
    proxy?.$modal.loading()
    downloadUrl(key).then(res => {
        proxy?.$modal.closeLoading()
        if (res.code == 200) {
            const { data } = res
            // window.open(data[key])
            fileSaver.saveAs(data[key])
            // downloadFile(data[key])
        }
    }).catch((err) => {
        proxy?.$modal.closeLoading()
    })
}

// 关闭
const closeHandle = () => {
    show.value = false;
    emits('close')
}

// 确定
const confirmHandle = () => {
    if (!fileList.value?.length) {
        ElMessage.error('请上传文件')
        return
    }
    emits('confirm', fileList.value, (data: {
        resMsg: string,
        fileKey: string,
        isSuccess: boolean,
    }) => {
        active.value = 3
        resInfo.value = data
        console.log(data)
    })
}
</script>

<style lang="scss" scoped>
:deep(.el-steps) {
    .el-step {
        .el-step__head {
            &.is-process {
                .el-step__icon {
                    border-color: #a8abb2;
                    .el-step__icon-inner {
                        color: #a8abb2;
                    }
                }
            }
        }
        .el-step__main {
            .el-step__title {
                &.is-process {
                    color: #a8abb2;
                }
            }
        }
    }
}
.upload-content {
    .upload-click-tips {
        color: #333;
        .blue-unline {
            color: var(--el-color-primary);
            text-decoration: underline;
        }
    }
    .upload-tips {
        font-size: 14px;
        color: #999;
    }
}
</style>
