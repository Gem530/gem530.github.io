<template>
    <el-drawer
        size="50%"
        v-model="open"
        destroy-on-close
        :title="props.title"
        custom-class="ptable-dialog"
        :close-on-click-modal="false">
        <div class="ptable-card" v-loading="props.loading">
            <div class="global-flex flex-end" style="color: #f56c6c;">客户扫码时将看到修改后的数据，修改完成时间时请注意合理性</div>
            <div class="progress-drawer-title">工序进度:</div>
            <el-row style="display: flex;">
                <el-button type="primary" :disabled="!state?.saleOrderProcessVoList || state?.saleOrderProcessVoList.length == 0" @click="setSinkCopper">一键设置沉铜</el-button>
                <el-button type="primary" :disabled="!state?.saleOrderProcessVoList || state?.saleOrderProcessVoList.length == 0" @click="setTest">一键设置测试架</el-button>
            </el-row>
            <XTable
                height="100%"
                :pageShow="false"
                class="ptable-content"
                :columnList="columnList"
                :data="state?.saleOrderProcessVoList">
                <template #default-craftNameCustomize="{ row }">
                    <el-input v-model="row.craftNameCustomize" placeholder="工艺名称" maxlength="20"></el-input>
                </template>
                <template #default-completeTimeCustomize="{ row, rowIndex }">
                    <el-date-picker class="progress-drawer-date" type="datetime" v-model="row.completeTimeCustomize" placeholder="完成时间" value-format="YYYY-MM-DD HH:mm:ss" @change="(date: any) => disabledDate(date, row, rowIndex)"></el-date-picker>
                    <!-- @change="(date: any) => disabledDate(date, row, rowIndex)" -->
                </template>
              <template #default-isHidden="{ row, rowIndex }">
                <el-switch
                  v-model="row.isHidden"
                  active-text="隐藏"
                  inactive-text="显示"
                  active-value = "1"
                  inactive-value = "0"
                />
              </template>
            </XTable>
            <div class="progress-drawer-title">进度查询二维码:</div>
            <div class="global-flex flex-center">
                <img :src="codeUrl" v-if="props.id"/>
            </div>
        </div>
        <template #footer>
            <div class="global-flex flex-center" v-loading="props.loading">
                <el-button :loading="buttonLoading" @click="open = false">取消</el-button>
                <el-button :loading="buttonLoading" type="primary" @click="confirmHandle('save')">保存</el-button>
                <el-button :loading="buttonLoading" :type="state.isShowProcess == '0' ? 'primary' : 'danger'" @click="confirmHandle('')">{{state.isShowProcess == '0' ? '确定开放' : '取消开放'}}</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts" name="ProgressCheck">
import * as QRCode from "qrcode";
import { deepClone } from '@/utils'
import { openProcess, closeProcess } from "@/api/order/directOrder";

const emits = defineEmits(['update:show', 'confirm'])
const props = withDefaults(defineProps<{
    data: any[],
    show?: boolean,
    title?: string,
    loading: boolean,
    id: string|number,
}>(), {
    id: '',
    show: true,
    loading: false,
    data: () => [],
    title: '查看操作记录',
})
const state = ref()
const codeUrl = ref('')
const buttonLoading = ref(false)
const open = computed({
    get () {
        return props.show
    },
    set (val) {
        emits('update:show', val)
    }
})
watch(() => [open.value, props.data], (val) => {
    if (val[1]) {
        state.value = val[1]
    }
    if (val[0] && val[1]) {
        let urlTemp = import.meta.env.VITE_APP_ENV != 'production' ? `http://pcb-test.enfccn.com:9100/?id=${props.id}` : `https://pcb.enfccn.com/?id=${props.id}`
        console.log(import.meta.env.VITE_APP_ENV != 'production', urlTemp)
        QRCode.toDataURL(urlTemp, {errorCorrectionLevel: 'H'}, (err: any, url: string) => {
            if (err) {
                console.log('Error: ' + err);
            } else {
                codeUrl.value = url;
            }
        });
    }
}, { immediate: true })
const columnList = ref([
    {title: "序号", field: 'index', type: 'seq', align: 'center', width: '60' },
    // {field: "expand", type: 'expand', width: '40', align: 'center'},
    {
        // width: '110',
        title: '工艺名称',
        field: 'craftNameDefault',
        align: 'center',
    },
    {
        // width: '110',
        title: '修改工艺名称',
        field: 'craftNameCustomize',
        align: 'center',
    },
    {
        // width: '110',
        title: '完成时间',
        field: 'completeTimeDefault',
        align: 'center',
    },
    {
        // width: '110',
        title: '修改完成时间',
        field: 'completeTimeCustomize',
        align: 'center',
    },
    {
      // width: '110',
      title: '是否隐藏',
      field: 'isHidden',
      align: 'center',
    },
])

const disabledDate = (date: any, row: any, index: number) => {
    if (!date) return
    let list = state.value?.saleOrderProcessVoList || []
    let tempData = deepClone(list.filter((f: any) => f.completeTimeCustomize || f.completeTimeDefault))
    let rowIndex = tempData.findIndex((f: any) => f.miNodeInfoId == row.miNodeInfoId)
    console.log(date, row, rowIndex, tempData)
    let prevData = tempData[rowIndex - 1]?.completeTimeCustomize || tempData[rowIndex - 1]?.completeTimeDefault
    let nextData = tempData[rowIndex + 1]?.completeTimeCustomize || tempData[rowIndex + 1]?.completeTimeDefault

    let prevDisabled = prevData ? (new Date(date).getTime() < new Date(prevData).getTime()) : false
    let nextDisabled = nextData ? (new Date(date).getTime() > new Date(nextData).getTime()) : false
    if (index == 0) {
        // 第一条
        if (nextDisabled) {
            // 大于第二条
            ElMessage.error('当前完成时间不可晚于下一节点完成时间')
            row.completeTimeCustomize = undefined
            return
        }
    } else if (index == (list.length - 1)) {
        // 最后一条
        if (prevDisabled) {
            // 大于第二条
            ElMessage.error('当前完成时间不可早于上一节点完成时间')
            row.completeTimeCustomize = undefined
            return
        }
    } else {
        // 中间数据
        if (prevDisabled) {
            // 大于第二条
            ElMessage.error('当前完成时间不可早于上一节点完成时间')
            row.completeTimeCustomize = undefined
            return
        }
        if (nextDisabled) {
            // 大于第二条
            ElMessage.error('当前完成时间不可晚于下一节点完成时间')
            row.completeTimeCustomize = undefined
            return
        }
    }
}

const openProcessHandle = (params: any, fn: Function) => {
    buttonLoading.value = true
    openProcess(params).then((res: any) => {
        if (res.code == 200) {
            fn && fn()
        }
    }).finally(() => {
        buttonLoading.value = false
    })
}

const closeProcessHandle = (params: any, fn: Function) => {
    buttonLoading.value = true
    closeProcess(params).then((res: any) => {
        if (res.code == 200) {
            fn && fn()
        }
    }).finally(() => {
        buttonLoading.value = false
    })
}

const confirmHandle = (type?: string) => {
    let isShowProcess = state.value.isShowProcess
    if (type == 'save'||type=='oneKeySave') {
        isShowProcess = isShowProcess == '0' ? '1' : '0'
    }
    let params = {
        saleOrderId: props.id,
        saleOrderProcessBoList: state.value.saleOrderProcessVoList || [],
        isShowProcess: isShowProcess == '0' ? '1' : '0'
    }
    if (isShowProcess == '0') {
        // 未开放
        openProcessHandle(params, () => {
            if(type=='oneKeySave'){
                open.value = true
            }else{
                open.value = false
            }
            emits('confirm', state.value)
            // console.log('confirm', state.value)
        })
    } else {
        // 已开放
        closeProcessHandle(params, () => {
            if(type=='oneKeySave'){
                open.value = true
            }else{
                open.value = false
            }
            emits('confirm', state.value)
            // console.log('confirm', state.value)
        })
    }
}
//一键设置沉铜
const setSinkCopper = () =>{
    let valid= state.value.saleOrderProcessVoList.filter(st=>st.craftNameDefault=='导电膜');
    if(valid.length==0){
        ElMessage.error('无导电膜工序')
        return ;
    }
    state.value.saleOrderProcessVoList.forEach(st=>{
        if(st.craftNameDefault=='导电膜'){
            st.craftNameCustomize='沉铜'
        }
    })
    confirmHandle('oneKeySave');
}
//一键设置测试架
const setTest = ()=>{
    let setList=state.value.saleOrderProcessVoList;
    //仅飞针，且飞针不在FQC前面一键设置
    if(isFZBeforeFQC(setList)){
        //ElMessage.error('测试架无需设置')
        return ;
    }
    let fzInx=state.value.saleOrderProcessVoList.findIndex(item=>item.craftNameDefault==="飞针");
    let FQCInx=state.value.saleOrderProcessVoList.findIndex(item=>item.craftNameDefault==="FQC");
    
    for(let i=0;i<setList.length;i++){
        if(i>=fzInx && i<(FQCInx-1)){
            setList[i].craftNameCustomize=setList[i+1].craftNameDefault
        }
        if(i==(FQCInx-1)){
            setList[i].craftNameCustomize="测试架"
        }
    }

    confirmHandle('oneKeySave');
}

//判断测试是否在成形前
const isTestAfterVC = (setList:any)=>{
    let foundA = false;
    for (let i = 0; i < setList.length; i++) {
        if (setList[i].craftNameDefault === "V-CUT" || setList[i].craftNameDefault === "成形") {
            foundA = true;
        } else if (foundA && (setList[i].craftNameDefault === '测试架'||setList[i].craftNameDefault === '飞针')) {
            return true; // 测试在vcut或者成形之后
        }
    }
    return false;
}
//判断FQC前是否是飞针
const isFZBeforeFQC = (setList:any)=>{
    //不包含飞针工艺的话直接退出
    let fzList=setList.filter(item=>item.craftNameDefault==="飞针");
    let fqcList=setList.filter(item=>item.craftNameDefault==="FQC");
    let csjList=setList.filter(item=>item.craftNameDefault==="测试架");
    let hasFZ=fzList.length > 0;
    let hasFQC=fqcList.length > 0;
    let hasCSJ=csjList.length > 0;
    if(hasCSJ){
        ElMessage.error('测试架无需设置');
        return true;
    }
    if(!hasFZ){
        ElMessage.error('无飞针工序');
    }
    if(!hasFQC){
        ElMessage.error('无FQC工序');
    }
    if(!hasFZ || !hasFQC){
        return true;
    }
    for (let i = 0; i < setList.length; i++) {
        if (i>1 && setList[i].craftNameDefault === "FQC") {
            if(setList[i-1].craftNameDefault !=='飞针'){
                return false;
            }
        }
    }
    return true;
}
</script>

<style lang="scss" scoped>
:deep(.progress-drawer-date) {
    --el-date-editor-width: 100%;
}
.progress-drawer-title {
    margin: 10px 0;
}
</style>

<style lang="scss">
.el-drawer__header {
    width: 100%;
}
</style>
