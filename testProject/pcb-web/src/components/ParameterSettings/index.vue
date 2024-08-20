<template>
    <el-form label-width="135px">
        <ParameterItem
            :key="item.uuid"
            :title="props.title"
            :currentItem="showList[i]"
            v-for="(item, i) in showList"
            @paramChange="(param) => paramChange(param, i)"
        ></ParameterItem>
        <el-form-item label="备注">
            <el-input type="textarea" placeholder="请输入备注" v-model="crtRemark" @blur="paramsChange('remark')"></el-input>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts" name="ParameterSettings">
import ParameterItem from './ParameterItem.vue'
import { deepClone } from '@/utils'

const emits = defineEmits(['paramsChange'])
const props = withDefaults(defineProps<{
    remark: any
    pnlList: any[]
    title?: string
    localUid: string
    requirement: any
    isScheme: boolean
    isDiffer: boolean
    schemeList: any[]
    configVoList: any
}>(), {
    title: undefined,
    remark: undefined,
    isScheme: false,
    isDiffer: false,
    pnlList: () => [],
    schemeList: () => [],
    requirement: undefined,
    configVoList: () => [],
})

const tid = computed(() => props.title)
const uid = computed(() => props.localUid)

const showList = ref<any[]>([])
const crtRemark = ref()
const allShowList = ref([])
const requirementTemp = ref(props.requirement || [])
const tempOldRequirement = ref(props.requirement || [])

const initFormData = () => {
    showList.value = []
    let tempconfigVoList: any = []
    let oldconfigVoList = props.configVoList && JSON.parse(JSON.stringify(props.configVoList)) || []

    oldconfigVoList.map((v: any) => {
        if (v.isDifferentiatePnl == '1') {
            const obj = requirementTemp.value.find((val: any) => val.id == v.id)
            if (props.isDiffer) {
                const crtValue = obj?.differPNL?.length && obj?.differPNL?.find((val: any) => val.pnlName == props.title)
                // console.log(crtValue)
                if (crtValue) {
                    v.isBold = crtValue.isBold
                    v.isChecked = crtValue.isChecked
                    v.defaultValue = crtValue.defaultValue
                    v.differPNL = obj.differPNL
                    tempconfigVoList.push(v)
                } else {
                    v.isBold = v.isBold
                    v.isChecked = v.isChecked
                    v.defaultValue = v.defaultValue
                    v.differPNL = v.differPNL || []
                    tempconfigVoList.push(v)
                }
                // const crtValue = obj?.differPNL?.find(val => val.pnlName == props.title)
                // if (crtValue) {
                //     v.isBold = crtValue.isBold
                //     v.isChecked = crtValue.isChecked
                //     v.defaultValue = crtValue.defaultValue
                //     v.differPNL = obj.differPNL
                //     tempconfigVoList.push(v)
                // } else {
                //     if (!(v.differPNL && v.differPNL.length)) {
                //         if (!(obj?.differPNL)) {
                //             v.differPNL = [{
                //                 isBold: v.isBold || '0',
                //                 isChecked: v.isChecked || '0',
                //                 defaultValue: v.defaultValue || '',
                //                 pnlName: props.title
                //             }]
                //         } else {
                //             let tempDifferPNL = [...obj.differPNL, {
                //                 isBold: '0',
                //                 isChecked: '0',
                //                 defaultValue: '',
                //                 pnlName: props.title
                //             }]
                //             v.differPNL = tempDifferPNL
                //             v.isBold = '0'
                //             v.isChecked = '0'
                //             v.defaultValue = ''
                //         }
                //     }
                //     tempconfigVoList.push(v)
                // }
            } else {
                if (obj) {
                    v.differPNL = obj.differPNL
                } else {
                    v.differPNL = [{
                        isBold: v.isBold || '0',
                        isChecked: v.isChecked || '0',
                        defaultValue: v.defaultValue || '',
                        pnlName: props.title
                    }]
                }
                tempconfigVoList.push(v)
            }
        } else {
            const obj = requirementTemp.value.find((val: any) => val.id == v.id)
            if (obj) {
                v.isBold = obj.isBold
                v.isChecked = obj.isChecked
                v.defaultValue = obj.defaultValue
            }
            tempconfigVoList.push(v)
        }
        return v
    })
    allShowList.value = JSON.parse(JSON.stringify(tempconfigVoList))
    showList.value = tempconfigVoList.filter((v: any) => v.isDifferentiatePnl == (props.isDiffer ? '1' : '0'))
    showList.value.map((v: any) => {
        v.uuid = v.id + tid.value + uid.value + Math.random()
    })
}
initFormData()
const initRemark = () => {
    crtRemark.value = undefined
    
    if (props.isDiffer) {
        crtRemark.value = props.remark?.differPNL?.length && props.remark.differPNL.find((val: any) => val.pnlName == props.title)?.remark || ''
    } else {
        crtRemark.value = props.remark && props.remark?.public || ''
    }
}
initRemark()

const deepCloneHandle = (val: any) => {
    if (val && ['array','object'].includes(typeof val)) {
        return deepClone(val)
    } else {
        return val
    }
}
// 需要加上深拷贝，不然oldValue与newValue的值会相同 https://blog.csdn.net/m0_60976718/article/details/134290880
watch(() => [deepCloneHandle(props.configVoList), deepCloneHandle(props.requirement), deepCloneHandle(props.remark)], ([v1, v2, v3], [old1, old2, old3]) => {
    if (v1 != old1 || v2 != old2) {
        requirementTemp.value = v2 || []
        nextTick(() => initFormData())
    }
    if (v3 != old3) {
        nextTick(() => initRemark())
    }
}, { deep: true })

const paramsChange = (str?: string) => {
    let remarkJson = props.remark
    if (props.isDiffer) {
        props[props.isScheme ? 'schemeList' : 'pnlList'].forEach(val => {
            const obj = remarkJson?.differPNL?.length && remarkJson.differPNL.find((v: any) => v.pnlName == props.title)
            if (obj) {
                obj.remark = crtRemark.value
            } else {
                remarkJson.differPNL.push({
                    pnlName: props.title,
                    remark: crtRemark.value
                })
            }
        })
    } else {
        remarkJson.public = crtRemark?.value || ''
    }
    
    let requireData = JSON.parse(JSON.stringify(props.configVoList))
    let newTempRequirementJSON: any = []

    let newTempData = allShowList.value.map((v: any) => {
        let temp = v
        const obj = showList.value.find((val: any) => val.id == v.id)
        if (obj) {
            temp = obj
        }
        return temp
    })
    newTempData = JSON.parse(JSON.stringify(newTempData))
    newTempData.forEach((v: any) => {
        let temp = v
        if (v.isDifferentiatePnl == '1') {
            // 非公共参数
            props[props.isScheme ? 'schemeList' : 'pnlList'].forEach(val => {
                if (props.isDiffer) {
                    let i = temp?.differPNL?.length && temp.differPNL.findIndex((el: any) => el.pnlName == props.title)
                    if (i != -1) {
                        let tempDifferData = JSON.parse(JSON.stringify(temp))
                        temp.differPNL[i] = {
                            pnlName: props.title,
                            isBold: tempDifferData.isBold,
                            isChecked: tempDifferData.isChecked,
                            defaultValue: tempDifferData.defaultValue
                        }
                    }
                }
            })
            newTempRequirementJSON.push(temp)
        } else {
            newTempRequirementJSON.push(temp)
        }
    })
    
    newTempRequirementJSON = newTempRequirementJSON.map((v: any)=>{
        if (v.isDifferentiatePnl == '1') {
            v.isChecked = v?.differPNL?.length && v.differPNL.some((el: any) => el.isChecked == '1') ? '1' : '0'
        }
        return v
    })
    newTempRequirementJSON = newTempRequirementJSON
    // .filter(v => v.isChecked == '1')
    emits('paramsChange', {
        requirement: str == 'remark' ? '' : newTempRequirementJSON,
        remark: str == 'remark' ? remarkJson : undefined
    })
}

const paramChange = (item: any, i: any) => {
    showList.value[i] = item
    paramsChange()
}
</script>

<style lang="scss" scoped>
.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>