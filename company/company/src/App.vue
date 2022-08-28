<template>
    <div class="content">
        <GForm
            ref="GFormRef"
            :col="12"
            :rules="form.rules"
            label-width="100px"
            :formList="form.formList"
            @search="getList">
            <template #tips="item">
                <el-input v-model="item.formData[item.prop]" @keyup.enter="(event) => { if (event.keyCode==13) GFormRef.searchHandle() }"></el-input>
            </template>
            <template #test="item">222-{{item.data}}</template>
        </GForm>
    </div>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from '@/components/HelloWorld.vue'
import GForm from '@/components/g-form/index.vue'
import { reactive, ref } from 'vue'
import { optins } from './config'
const GFormRef = ref()
const form = reactive({
    rules: {},
    formList: [
        {
            type: 'input',
            defaultValue: '',
            isHide: (item) => item.age>=1,
            attrs: {
                type: 'text',
                clearable: true,
                placeholder: '请输入名称',
                'onkeyup': (event) => { if (event.keyCode==13) GFormRef.value.searchHandle() }
            },
            formAttrs: {
                label: '名称',
                prop: 'name'
            }
        },
        {
            type: 'number',
            defaultValue: 1,
            attrs: {
                min: 1,
                max: 20,
                size: 'small',
                placeholder: '请输入年龄',
                controlsPosition: "right"
            },
            formAttrs: {
                label: '年龄',
                prop: 'age'
            }
        },
        {
            type: 'input',
            defaultValue: '',
            attrs: {
                label: '描述',
                type: 'textarea',
                placeholder: '请输入描述'
            },
            formAttrs: {
                label: '描述',
                prop: 'desc'
            }
        },
        {
            type: 'radio',
            defaultValue: undefined,
            formAttrs: {
                label: '性别',
                prop: 'sex'
            },
            data: [{
                label: '男',
                value: 1
            }, {
                label: '女',
                value: 0
            }]
        },
        {
            type: 'checkbox',
            defaultValue: [],
            formAttrs: {
                label: '爱好',
                prop: 'like'
            },
            data: [{
                label: '跑步',
                value: 1
            }, {
                label: '游泳',
                value: 0
            }]
        },
        {
            type: 'select',
            defaultValue: 1,
            formAttrs: {
                label: '学校',
                prop: 'school',
                placeholder: '请选择学校'
            },
            data: [{
                label: '祁阳二中',
                value: 1
            }, {
                label: '祁阳一中',
                value: 0
            }]
        },
        {
            type: 'select',
            defaultValue: [1],
            attrs: {
                multiple: true,
                clearable: true,
                placeholder: '请选择曾经名次'
            },
            formAttrs: {
                label: '曾经名次',
                prop: 'grade'
            },
            data: [{
                label: '第一',
                value: 1
            }, {
                label: '第二',
                value: 2
            }]
        },
        {
            type: 'date',
            defaultValue: '',
            attrs: {
                type: 'date',
                placeholder: '请选择入学日期'
            },
            formAttrs: {
                label: '入学日期',
                prop: 'createTime'
            }
        },
        {
            type: 'date',
            defaultValue: '',
            attrs: {
                type: 'datetimerange',
                startPlaceholder: "开始时间",
                endPlaceholder: "结束时间"
            },
            formAttrs: {
                label: '入学日期范围',
                prop: 'createTimeBetween'
            }
        },
        {
            type: 'cascader',
            defaultValue: '',
            attrs: {
                clearable: true
            },
            formAttrs: {
                label: '级联选择',
                prop: 'cascaderItem'
            },
            data: optins
        },
        {
            type: 'switch',
            defaultValue: 1,
            attrs: {
                activeValue: 1,
                inactiveValue: 0
            },
            formAttrs: {
                label: '状态',
                prop: 'state'
            }
        },
        {
            type: 'slot',
            defaultValue: '插槽测试11',
            formAttrs: {
                label: '插槽',
                prop: 'tips'
            }
        },
        {
            type: 'btn',
            btn: {
                search: true,
                reset: true
            }
        },
        {
            type: 'slot',
            defaultValue: '插槽6666666',
            formAttrs: {
                prop: 'test'
            }
        }
    ]
})

const getList = (data: Object) => {
    console.log('data', data)
}
</script>

<style scoped>
.content {
    width: 100%;
    height: 100vh;
}
</style>
