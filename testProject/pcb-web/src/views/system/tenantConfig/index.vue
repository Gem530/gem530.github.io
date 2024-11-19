<template>
  <div class="p-2">
    <!--    配置项类型(1单选、2多选、3下拉、4输入框、5文本框、6开关、7编码生成组件、8数字-->
    <!-- <el-card> -->
      <el-card class="configContent">
        <template #header>
          <div class="card-header configHead global-flex flex-end">
            <el-button type="primary" plain icon="DocumentChecked" @click="submitForm"
              :loading="buttonLoading">保存配置</el-button>
            <!-- <el-divider content-position="left"></el-divider> -->
          </div>
        </template>
        <el-form ref="xFormRef" label-width="170px" :model="form" v-loading="_loading" class="configBody">
          <el-row v-for="item in form.tenantConfigBoList" :key="item.id">
            <el-col :span="12">
              <el-form-item :label="item.name + ':'">
                <el-radio-group v-if="item.type == '1'" v-model="item.values">
                  <el-radio v-for="(itemOption, index) in item.options" :key="index" :label="itemOption.value"
                    :value="itemOption.value">
                    {{itemOption.label}}
                  </el-radio>
                </el-radio-group>
                <el-checkbox-group v-if="item.type == '2'" v-model="item.values">
                  <el-checkbox v-for="(itemOption, index) in item.options" :key="index" :label="itemOption.value"
                    :value="itemOption.value">
                  </el-checkbox>
                </el-checkbox-group>
                <el-select v-if="item.type == '3'" v-model="item.values" :placeholder="'请选择' + item.name" clearable
                  filterable transfer popup-class-name="pop-select" style="width: 100%;">
                  <el-option v-for="itemOption in item.options" :key="itemOption" :label="itemOption.value"
                    :value="itemOption.value" />
                </el-select>
                <el-input v-if="item.type == '4'" v-model="item.values" :placeholder="'请输入' + item.name" clearable
                  style="width: 100%;" />
                <el-input v-if="item.type == '5'" v-model="item.values" :placeholder="'请输入' + item.name" clearable
                  style="width: 100%;" type="textarea" />
                <el-switch v-if="item.type == '6'" size="small" v-model="item.values" active-value="true"
                  inactive-value="false" />
                <el-row v-if="item.type == '7'">
                  <el-col :span="24">
                    <el-button link type="primary" v-if="item.options[0]?.type == '1' || item.name.includes('工序')" @click="addOption(item,'1')">配置选项</el-button>
                    <el-button link type="primary" v-if="item.options[0]?.type == '2' || item.name.includes('物料类型')" @click="addOption(item,'2')">配置选项</el-button>
                    <el-button link type="primary" v-if="item.options[0]?.type == '3'" @click="addOption(item,'3')">配置选项</el-button>
                    <el-button link type="primary" v-if="item.options[0]?.type == '4'" @click="addOption(item,'4')">配置选项</el-button>
                    <el-button link type="primary" v-if="item.options[0]?.type == '5' || item.name.includes('春节')" @click="addOption(item,'5')">配置选项</el-button>
                    <el-button link type="primary" v-if="item.options[0]?.type == '6' || item.name.includes('客户')" @click="addOption(item,'6')">配置选项</el-button>
                    <el-check-tag class="configCheckTag" size="small" :checked="item.values.includes(item.options[index]?.value)"
                      @click="onChange(index, item)" v-for="(itemName, index) in item?.options" :key="index"
                       v-model="item.values">{{ itemName.label }}</el-check-tag>
                  </el-col>
                  <el-col :span="24">
                    <el-card class="tagCard">
                      <div v-if="item.values.length > 0">
                        <el-tag v-for="tag in item.values" :key="tag" class="mx-1" closable :disable-transitions="false"
                                @close="handleClose(tag, item.values)">
                          {{ item?.options.find(v => v.value == tag)?.label }}
                        </el-tag>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
                <el-input-number v-if="item.type == '8'" size="small" v-model="item.values" />
                <div v-if="item.type == '9'">
                  出账日+<x-input-number :controls="false" :min="0" :precision="0" size="small" v-model="item.values"/>天
                </div>
                <span class="labelTip">{{ item.remark }}</span>
              </el-form-item>

            </el-col>
          </el-row>
        </el-form>
      </el-card>
    <!-- </el-card> -->
    <el-dialog
      v-model="dialogVisible"
      title="选项配置"
      width="37%"
      destroy-on-close
    >
      <el-transfer
        v-model="transValue"
        filterable
        target-order="push"
        :props="{
        key:'value',
        label:'label',
      }"
        :titles="transferTitle"
        filter-placeholder="搜索"
        @change="transferChanged"
        :data="optionData"
      />
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confrimCraft">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TenantConfig" lang="ts">
import { getCurrentInstance, ref } from "vue";
import { listTenantConfig,listWxMenu } from "@/api/system/tenantConfig";
import { TenantConfigQuery, TenantConfigForm } from "@/api/system/tenantConfig/types";
import { updateTenantConfig } from "@/api/system/tenantConfig";
import {getCraftList} from "@/api/basedata/craft";
import {listMaterialStorageNoPage} from "@/api/purchase/materialStorage";
import {listRawMaterialCategoryNoPage} from "@/api/basedata/rawMaterialCategory";
import dayjs from "dayjs";
import { getListCustomer } from "@/api/basedata/customer";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const _loading = ref(false);
const buttonLoading = ref(false);
const xFormRef = ref<ElFormInstance>();
const dialogVisible = ref(false)


const initFormData: TenantConfigForm = {
  id: undefined,
  createDeptName: undefined,
  createByName: undefined,
  updateByName: undefined,
  name: undefined,
  code: undefined,
  type: undefined,
  options: undefined,
  defaultValue: [],
  optionNames: undefined,
  remark: undefined,
  value: undefined,
  values: []
};
const data = reactive<PageData<TenantConfigForm, TenantConfigQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    name: undefined,
    code: undefined,
    type: undefined,
    options: undefined,
    defaultValue: undefined
  },
  rules: {}
});

const { queryParams, form } = toRefs(data);

const onChange = (num: any, obj: any) => {
  // 选中已存在的值，删除对应值
  if (obj.values.includes(obj.options[num]?.value)) {
    obj.values.splice(obj.values.indexOf(obj.options[num]?.value), 1)
  }
  //否则添加对应值
  else {
    obj.values.push(obj.options[num]?.value);
  }
}

/** 查询租户配置列表 */
const getList = async () => {
  _loading.value = true;
  listTenantConfig(queryParams.value).then(res => {
    //不直接操作form.value，防止组件抖动
    const tmp = res;
    //类型转换
    tmp.forEach(info => {
      //非数组转换对应类型，减少前端判断
      if (info.type == '1' || info.type == '3' || info.type == '4' || info.type == '5') {
        info.values = info.values ? info.values[0] : "";
        info.defaultValue = info.defaultValue ? info.defaultValue[0] : "";
      }
      if (info.type == '6') {
        info.values = info.values ? info.values[0] : false;
        info.defaultValue = info.defaultValue ? info.defaultValue[0] : false;
      }
      if (info.type == '8') {
        info.defaultValue = Number(info.defaultValue ? info.defaultValue[0] : 0);
        info.values = info.values == undefined || info.values == 'null' || info.values == null?info.defaultValue:info.values;
        //数字类型判断需要单独处理
      }else{
        info.values = info.values ? info.values : info.defaultValue;
      }

    });
    form.value.tenantConfigBoList = tmp;
    console.log("tenantConfigBoList", form.value.tenantConfigBoList);
  });
  _loading.value = false;
};

/**
 * 获取配置匹配对象
 * @param val
 */
const handleClose = (tag: string, tagList: Array<string>) => {
  tagList.splice(tagList.indexOf(tag), 1)
}

/** 提交按钮 */
const submitForm = () => {
  buttonLoading.value = true;
  _loading.value = true;
  xFormRef.value?.validate(async (valid: boolean) => {
    console.log("initFormDataValue", form.value);
    formatterSave();
    await updateTenantConfig(form.value).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess("修改成功");
    await getList();
  });
};

const formatterSave = () => {
  form.value.tenantConfigBoList.forEach(saveObj => {
    //非数组转换对应类型
    saveObj.values = Array.isArray(saveObj.values) ? saveObj.values : [saveObj.values];
    saveObj.defaultValue = Array.isArray(saveObj.defaultValue) ? saveObj.defaultValue : [saveObj.defaultValue];
  });
}

//选中数据
const transValue:any = ref([]);

const currenInfo = ref();

//备选数据
const optionData = ref();

const transferTitle = ref();

const addOption = (item: any, type?: any) => {
  if(type == '1'){
    optionData.value = craftOptions.value
    transferTitle.value = ['工艺名', '已选工艺']
  } else if (type == '2'){
    optionData.value = categoryOptions.value;
    transferTitle.value = ['物料类别', '已选物料类别']
  } else if (type == '3'){
    optionData.value = storageOptions.value
    transferTitle.value = ['仓库', '已选仓库']
  }else if (type == '4'){
    optionData.value = wxMenuOptions.value
    transferTitle.value = ['菜单', '已选菜单']
  }else if (type == '5'){
    optionData.value = monthOptions.value
    transferTitle.value = ['年月', '已选年月']
  } else if (type == '6'){
    optionData.value = customerList.value
    transferTitle.value = ['客户', '已选客户']
}
  currenInfo.value = item;
  transValue.value = item.options.map((v: any) =>  v.value);
  dialogVisible.value = true;
}

const confrimCraft  = () => {
  currenInfo.value.options = optionData.value.filter((v:any)=> transValue.value.includes(v.value))
  currenInfo.value.values = currenInfo.value.values.filter((v:any)=>transValue.value.includes(v));
  dialogVisible.value = false;
}

/**
 * 穿梭框change事件
 */
const transferChanged = (
  value: any,
  direction: "left" | "right",
  movedKeys: string[] | number[]
) => {
  value.forEach((item: string | number) => {
    optionData.value.forEach((info:any) => {
      if (item == info.value && !transValue.value.includes(info.value)) {
        transValue.value.push(info.value);
      }
    });
  });
};

let craftOptions:any = ref([]);

/**
 * 查询工艺列表
 */
const getListCraft = async () => {
  const res = await getCraftList();
  craftOptions.value = res.data.map(item => {
    return {
      value: String(item.id),
      label: item.craftName,
      type: "1"
    }
  });
};

let categoryOptions:any = ref([]);

/** 查询物料分类列表 */
const getListCategory = async () => {
  const res:any = await listRawMaterialCategoryNoPage(queryParams.value);
  categoryOptions.value = res.map((item:any) => {
    return {
      value: String(item.id),
      label: item.name,
      type: "2"
    }
  });
}

let storageOptions:any = ref([]);

/**
 * 查询仓库列表
 */
const getListStorage= async () => {

  const res = await listMaterialStorageNoPage();
  storageOptions.value = res.data.map(item => {
    return {
      value: String(item.id),
      label: item.name,
      type: "3"
    }
  });

}

let wxMenuOptions:any = ref([]);

/**
 * 查询小程序菜单列表
 */
const getWxMenuListStorage= async () => {
  const res = await listWxMenu();
  wxMenuOptions.value = res.data.map(item => {
    return {
      value: String(item.menuId),
      label: item.menuName,
      type: "4"
    }
  });
}

let monthOptions:any = ref([]);

/** 获取从2020年开始10年中的所有月份 */
const getAllMonths = () => {
  let currentYear = new Date("2020-01-01").getFullYear();
  let years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  let months = Array.from({ length: 12 }, (_, i) => new Date(0, i));
  monthOptions.value = years.flatMap(year => months.map(month => {
    let dateStr = dayjs(new Date(year, month.getMonth())).format("YYYY-MM");
    return {
      value: dateStr,
      label: dateStr,
      type: "5"
    }
  }));
}


/*获取启用的客户*/

let customerList:any = ref([]);

//客户下拉数据
const getCustomerList = async () => {
  const res = await getListCustomer();
  customerList.value = res.data.map(item => {
    return {
      value: String(item.id),
      label: item.customerName,
      type: "6"
    }
  });
};

onMounted(() => {
  getList();
  getListCraft();
  getListCategory();
  getListStorage();
  getWxMenuListStorage();
  getAllMonths();
  getCustomerList()
});
</script>
<style scoped lang="scss">
:deep(.configContent) {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &>form,&header,&section,&footer,
  &>div {
    width: 100%;
  }
  // margin-top: 40px;
  //height: 100%;
  .el-card__body {
    flex: 1;
    overflow-y: auto;
  }
}

.configCheckTag {
  margin-right: 10px;
  font-weight: 400;
  padding: 6px 7px;
  font-size: 12px;
}

.labelTip {
  color: #adb2b7;
  font-size: 12px;
  width: 100%;
}

.tagCard {
  min-height: 68px;
  margin-top: 5px;
}

// .configHead {
//   position: absolute;
//   width: 100%;
// }

.configBody {
}

.el-transfer {
  height: 700px;

  :deep(.el-transfer-panel) {
    height: 100%;

    .el-transfer-panel__body {
      height: 90%
    }
  }
}


</style>
