<template xmlns="http://www.w3.org/1999/html">
  <div class="p-2 xtable-page">
    <!-- <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch"> -->
        <el-form v-show="showSearch" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px" @submit.native.prevent>
          <el-form-item label="工艺名称" prop="craftName" >
            <el-input v-model="queryParams.craftName" placeholder="请输入工艺名称" clearable
                      @keyup.enter="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      <!-- </div>
    </transition> -->

    <!-- <el-card shadow="never" class="xtable-card"> -->
      <div class="head-btn-flex">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-if="checkPermi(['basedata:craft:add'])">新增
        </el-button>

        <right-toolbar style="margin-left: 0;" v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </div>

      <XTable
        height="100%"
        :data="craftList"
        :loading="loading"
        :showRefresh="true"
        class="xtable-content"
        ref="multipleTableRef"
        :columnList="columnList"
        :intervalCondition="['createTime']"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        @searchChange="searchChange">
        <template #default-craftParameterConfigs="scope">
          <div style="text-align:left;">
            <el-tag v-for="(item,index) in scope.row.craftParameterConfigs" :key="index"
                    style="margin-left:2px;margin-bottom:2px;">
              {{ item.name }}
            </el-tag>
          </div>
        </template>
        <template #default-isOpen="scope">
          <el-switch @change="handleStatusChange(scope.row)" v-model="scope.row.isOpen" active-value="1"
                     inactive-value="0"/>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
        <template #default-equipment="scope">
          <div style="text-align:left;">
            <el-tag v-for="(item,index) in scope.row.equipmentVoList"
                    :key="index"
                    style="margin-left:2px;margin-bottom:2px;">
              {{ item.equipmentName }}
            </el-tag>
          </div>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)"
          >修改</el-button>
        </template>
      </XTable>
    <!-- </el-card> -->



    <!-- 添加或修改工艺对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="65%" destroy-on-close @close="reset()">
      <el-form ref="craftFormRef" :model="form" :rules="rules" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工艺名称" prop="craftName" style="width: 100%">
              <el-input v-model="form.craftName" maxlength="100" placeholder="工艺名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工艺编码" prop="code" style="width: 100%">
              <el-input v-model="form.code" placeholder="工艺编码" maxlength="100"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="排序" prop="sort" style="width: 100%">
              <el-input-number v-model="form.sort" placeholder="请输入" min="0" max="9999" precision="0"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isOutSource" false-label="0" true-label="1" label="是否可以外协" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isAutoWip" false-label="0" true-label="1" label="是否自动过数" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isDrill" false-label="0" true-label="1" label="是否钻孔" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isCutting" false-label="0" true-label="1" label="是否开料" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isMoulding" false-label="0" true-label="1" label="是否成型" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isLamination" false-label="0" true-label="1" label="是否压合" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isScreen" false-label="0" true-label="1" label="是否需要网板" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isFilin" false-label="0" true-label="1" label="是否需要菲林" size="large"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0px">
              <el-checkbox v-model="form.isOutSourceOrder" false-label="0" true-label="1" label="支持外协接单" size="large"/>
            </el-form-item>
          </el-col>
        </el-row>


        <!-- 工艺参数配置 -->
        <el-divider content-position="left">工艺参数配置</el-divider>
        <div v-for="(item, index) in form.craftParameterConfigs" :key="index" style="display: flex">
          <el-row>
            <el-row>
              <el-col :span="1.5">
                <el-form-item label="序号" label-width="80">
                  {{ index + 1 }}
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="参数名称" prop="parameterName" label-width="80">
                  <el-input v-model="item.name" maxlength="100" placeholder="参数名称"/>
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label="数据类型" prop="dataType" label-width="80" :rules="[{
               validator:(rule: any, value: any, callback: any)=>validatePass(rule, value, callback, index,'type','数据类型'),trigger: 'change' }]">
                  <el-select v-model="item.type" placeholder="数据类型" clearable style="width: 440px">
                    <el-option v-for="dict in craft_parameter_type" :key="dict.value" :label="dict.label"
                               :value="dict.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="单位" label-width="60">
                  <el-input v-model="item.unit" maxlength="50" placeholder=""/>
                </el-form-item>
              </el-col>

              <el-col :span="3">
                <div class="ml20">
                  <el-checkbox style="width: 80px" v-model="item.isDifferentiatePnl" false-label="1" true-label="0"
                               label="公共参数"
                               size="large"/>
                </div>
              </el-col>

              <el-col :span="2">
                <div>
                  <el-checkbox v-model="item.isBold" false-label="0" true-label="1" label="加粗" size="large"/>
                </div>
              </el-col>

              <el-col :span="2">
                <el-checkbox v-model="item.isChecked" false-label="0" true-label="1" label="选中" size="large"/>
              </el-col>
              <!--  添加-->
              <el-col :span="1" v-if="index === form.craftParameterConfigs.length - 1">
                <div class="mb-2 flex items-center text-sm">
                  <div @click="configsAdd(index)">
                    <el-icon>
                      <Plus/>
                    </el-icon>
                  </div>
                </div>
              </el-col>
              <!--  删除-->
              <el-col :span="1" v-if=" index !== 0">
                <div class="mb-2 flex items-center text-sm">
                  <div @click="configsDelete(index)" @change="paramerDelFlag(item)">
                    <el-icon>
                      <Minus/>
                    </el-icon>
                  </div>
                </div>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary" v-if=" index !== 0" @click="configsUp(index)">上移</el-link>
              </el-col>
              <el-col :span="1">
                <el-link :underline="false" type="primary" v-if="index !== form.craftParameterConfigs.length-1"
                         @click="configsDown(index)">下移
                </el-link>
              </el-col>
            </el-row>
            <el-col :span="12">
              <el-form-item label="工艺参数编码" label-width="100" prop="craftParameterConfigs.code" :rules="[{
               validator:(rule: any, value: any, callback: any)=>validatePass(rule, value, callback, index,'code', '工艺参数编码'),trigger: 'blur' }]">
                <!-- <el-form-item label="工艺参数编码" label-width="100" prop="craftParameterConfigs.code" > -->
                <el-input
                  v-model="item.code"
                  autosize
                  type="textarea"
                  maxlength="100"
                  placeholder="工艺参数编码"
                />
              </el-form-item>
            </el-col>
            <!-- 默认值            -->
            <el-col :span="12">
              <!-- <el-form-item label="默认值" prop="defaultValue" :rules="[{
               validator:(rule: any, value: any, callback: any)=>validatePass(rule, value, callback, index,'defaultValue','默认值'),trigger: 'blur' }]"> -->
              <el-form-item label="默认值" prop="defaultValue" >
                <el-input
                  v-model="item.defaultValue"
                  autosize
                  type="textarea"
                  maxlength="2000"
                  placeholder="默认值"
                />
              </el-form-item>
            </el-col>

            <!--     选项       -->
            <!--            <span  >{{item}} </span>-->
            <el-row>
              <el-col :span="24" v-if="item.type === '5'  || item.type === '6' || item.type === '8'" size="large">
                <el-tag
                  style="margin-left: 5px;margin-top: 5px"
                  v-for="(item2, index2) in  item.optionsValueList "
                  closable
                  :disable-transitions="false"
                  @close="selectConfigsDelete(index, index2)">
                  {{item2}}
                </el-tag>

                <el-input
                  class="input-new-tag ml5"
                  style="width: 150px"
                  v-show="item.inputHidden"
                  v-model="item.inputHiddenValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="e => inputBlur(e, index)">
                </el-input>

                <el-button class="button-new-tag   ml5" :inline="true" size="small" @click="selectConfigsAdd(index)">+ 备选项
                </el-button>

              </el-col>
            </el-row>
            <el-divider />
          </el-row>

        </div>

        <el-row style="padding-top: 50px">
          <el-col :span="24">
            <el-form-item label="工艺角色" prop="managerRole" >
              <el-select style="width: 100%;" v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in craftRoles"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="关联部门">
          <el-tree-select
            default-expand-all
            ref="menuRef"
            node-key="id"
            value-key="id"
            :data="deptOptions"
            style="width: 100%;"
            v-model="form.deptId"
            empty-text="加载中，请稍候"
            :props="{ value: 'id', label: 'label', children: 'children' }"
          ></el-tree-select>
        </el-form-item>


      </el-form>
      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>


    <!-- 配置设备对话框-->
    <el-drawer :title="equipmentDrawer.title" v-model="equipmentDrawer.visible" size="50%"
               :direction="equipmentDrawer.direction">
      <el-card shadow="never">
        <!-- 配置设备对话框内搜索-->
        <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                    :leave-active-class="proxy?.animate.searchAnimate.leave">
          <div class="search" v-show="queryParamsEquipment">
            <el-form :model="queryParamsEquipment" ref="queryFormRefEqui" :inline="true" label-width="68px">
              <el-form-item label="查询条件" prop="craftName">
                <el-input v-model="queryParamsEquipment.equipmentCode" placeholder="设备编号" clearable
                          @keyup.enter="handleQueryEquipment"/>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQueryEquipment">搜索</el-button>

                <!--                <el-button icon="Refresh" @click="resetQueryEquipment">重置</el-button>-->

              </el-form-item>
            </el-form>

          </div>
        </transition>

        <!-- 配置设备对话框内字段-->
        <el-table
          ref="equipmentListTableRef"
          :data="equipmentList"
          style="width: 100%"
          @selection-change="handleEquipmentSelectionChange"
          :row-key="row => row.id"
        >
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="设备编码" align="center" prop="equipmentCode" width="150">
          </el-table-column>
          <el-table-column label="设备名称" align="center" prop="equipmentName" width="150">

          </el-table-column>

          <el-table-column label="设备状态" align="center" prop="delFlag" width="150">
            <template #default="scope">
              <span>{{ scope.row.delFlag !== "2" && scope.row.delFlag !== "1" ? "设备启用中" : "设备停用中" }}</span>
            </template>
          </el-table-column>

          <el-table-column label="设备负责人" align="center" prop="sysUserList" width="150">
            <template #default="scope">
              <div style="text-align:left;">
                <el-tag v-for="(item,index) in scope.row.sysUserList"
                        :key="index"
                        style="margin-left:2px;margin-bottom:2px;">
                  {{ item.userName }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <!--          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100" fixed="right">
                      <template #default="scope">
                        <el-tooltip content="编辑" placement="top">
                          <el-button link type="primary" icon="Edit" @click="handleUpdateEquipment(scope.row)"
                                     >编辑
                          </el-button>
                        </el-tooltip>

                      </template>
                    </el-table-column>-->

        </el-table>

        <pagination
          v-show="totalEquipment>0"
          :total="totalEquipment"
          ref="tableRef"
          v-model:page="queryParamsEquipment.pageNum"
          v-model:limit="queryParamsEquipment.pageSize"
          @pagination="getEquipmentList"
        />

      </el-card>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button :loading="buttonLoading" type="primary" @click="submitEquipment">确 定</el-button>
          <el-button @click="cancelEquipment">取 消</el-button>
        </div>
      </template>

    </el-drawer>

  </div>
</template>


<script setup name="Craft" lang="ts">
import {
  listCraft,
  getCraft,
  delCraft,
  addCraft,
  updateCraft,
  getRoleLists,
  changeCraftStatus,
  configEquipmentInfo
} from "@/api/basedata/craft";
import { listDept } from '@/api/system/dept'
import {checkPermi} from "@/utils/permission";
import api from "@/api/system/user"
import {CraftVO, CraftQuery, CraftForm} from "@/api/basedata/craft/types";
import {
  listCraftParameterConfig, craftParameterList, updateCraftParameterConfig
} from "@/api/basedata/craftParameterConfig";
import {
  CraftParameterConfigForm, CraftParameterConfigQuery, CraftParameterConfigVO
} from "@/api/basedata/craftParameterConfig/types";
import {RoleVO} from "@/api/system/role/types";
import {EquipmentForm, EquipmentVO, EquipmentQuery} from "@/api/basedata/equipment/types";
import {getEquipment, listEquipment, listEquipmentsNoPage} from "@/api/basedata/equipment";
import {CraftEquipmentForm, CraftEquipmentQuery, CraftEquipmentVO} from "@/api/basedata/craftEquipment/types";
import {EquipmentUserVO, EquipmentUserForm, EquipmentUserQuery} from "@/api/basedata/equipmentUser/types";
import {getEquipmentUserList, listEquipmentUserNoPage} from "@/api/basedata/equipmentUser";
import {nextTick} from "vue";
import {ElTable} from "element-plus";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const {sys_normal_disable} = toRefs<any>(proxy?.useDict("sys_normal_disable"));
const {craft_parameter_type} = toRefs<any>(proxy?.useDict("craft_parameter_type"));
const craftList = ref<CraftVO[]>([]);
const buttonLoading = ref(false);

const deptList = ref<any>([])
const craftParamers = ref<any>([]);
const allCraftParamers = ref<any>([]);
const craftRoles = ref<any>([]);
const buttonLoading2 = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const customerAddressFormRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();
const queryFormRefEqui = ref<ElFormInstance>();
const craftFormRef = ref<ElFormInstance>();

const equipmentIds = ref<Array<string | number>>([]);

const equipmentId2s = ref<Array<string | number>>([]);


const checkedValue = ref(false); // 创建一个 ref 变量来存储复选框的值


const dialog = reactive<DialogOption>({
  visible: false,
  title: ""
});


/**
 * 配置设备边框
 */
const equipmentDrawer = reactive<DrawerOption>({
  visible: false,
  title: "",
  direction: "rtl"
});


const equipmentDialog = reactive<DialogOption>({
  visible: false,
  title: ""
});


const initFormData: CraftForm = {
  id: undefined,
  voluntarilyCount: undefined,
  craftRoleNames: undefined,
  remark: undefined,
  updateByName: undefined,
  code: undefined,
  sort: 0,
  craftName: undefined,
  isOutSource: undefined,
  isOutSourceOrder: undefined,
  isAutoWip: undefined,
  publicDefaultRemark: undefined,
  wipName: undefined,
  isOpen: undefined,
  roleIds: [],
  deptIds: [],
  deptId: undefined,
  craftParameterConfigs: [
    {
      sort: "",
      name: "",
      type: "",
      unit: "",
      isDifferentiatePnl: "1",
      isBold: "",
      defaultValue: "",
      inputHidden: false,
      inputHiddenValue: "",
      optionsValueList: []
    }
  ]
};

const deptOptions = ref([])


/*const inputHidden = ref(false);
const inputHiddenValue = ref(null);*/

const a = ref([]);

const data = reactive<PageData<CraftForm, CraftQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    canOutsource: undefined,
    voluntarilyCount: undefined,
    roleIds: undefined,
    craftName: undefined,
    code: undefined,
    isOutSource: undefined,
    isOutSourceOrder: undefined,
    isAutoWip: undefined,
    publicDefaultRemark: undefined,
    wipName: undefined,
    isOpen: undefined

  },
  rules: {
    id: [
      {required: true, message: "id不能为空", trigger: "blur"}
    ],
    canOutsource: [
      {required: true, message: "是否可以外协不能为空", trigger: "blur"}
    ],
    voluntarilyCount: [
      {required: true, message: "是否自动过数不能为空", trigger: "blur"}
    ],
    roleIds: [
      {required: true, message: "工艺负责角色不能为空", trigger: "blur"}
    ],
    craftName: [
      {required: true, message: "工艺名称不能为空", trigger: "blur"},
      {max: 100, message: "工艺名称输入不能超过100个字符", trigger: "blur"}
    ],
    sort: [
      {required: true, message: "排序不能为空", trigger: "blur"},
    ],
    code: [
      {max: 100, message: "工艺编码输入不能超过100个字符", trigger: "blur"}
    ]
  }
});



const validatePass = (rule: any, value: any, callback: any, index: any,param:string, lable: any ) => {
  const val = form.value.craftParameterConfigs[index][param]
  if (form.value.craftParameterConfigs[index].name) {
    // craftFormRef.value
    if (val == '' || val == undefined || val == null) {
      callback(new Error(lable+ '不能为空'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const columnList = ref([
  { width: '150',title: '工艺名称',field: 'craftName',align: 'center',  },
  { width: '500',title: '工艺参数',field: 'craftParameterConfigs',align: 'center', filterType: 'checkboxSearch', filterData: () => craftParamers.value },
  { title: '工艺负责角色',field: 'craftRoleNames',align: 'center', filterType: 'checkboxSearch', filterData: () => craftRoles.value  },
  { width: '70',title: '排序',field: 'sort',align: 'center', filterType: 'number', },
  { width: '70',title: '状态',field: 'isOpen',align: 'center', filterType: 'radioButton', filterData: () => [{label: '启用',value:'1'}, {label: '禁用', value: '0'}] },
  { width: '160',title: '创建时间',field: 'createTime',align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      endParams: { type: 'datetime', placeholder: '请选择结束月份', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      startParams: { type: 'datetime', placeholder: '请选择开始月份', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }
  },
  { width: '100',title: '关联部门',field: 'deptName',align: 'center', filterType: 'checkboxSearch', filterData: () => deptList.value },
  { width: '100',title: '设备',field: 'equipment',align: 'center',  },
  { title: '操作',field: 'make',align: 'center', fixed: 'right'  },
]);





const {queryParams, form, rules} = toRefs(data);

const initFormDataEquipment: EquipmentForm = {
  id: undefined,
  equipmentCode: undefined,
  equipmentName: undefined
};
const dataEquipment = reactive<PageData<EquipmentForm, EquipmentQuery>>({
  formEquipment: {...initFormDataEquipment},
  queryParamsEquipment: {
    pageNum: 1,
    pageSize: 20,
    equipmentCode: undefined,
    equipmentName: undefined,
    keyword: undefined

  },
  rulesEquipment: {}
});
const {queryParamsEquipment, formEquipment, rulesEquipment} = toRefs(dataEquipment);


const equipmentLists = ref<EquipmentVO[]>([]);

const equipmentListTableRef = ref<InstanceType<typeof ElTable>>();
const tableRef = ref<ElTableInstance>();

const totalEquipment = ref(0);
const equipmentList = ref<EquipmentVO[]>([]);
/**
 * 查询设备列表
 */
const getEquipmentLists = async () => {
  loading.value = true;
  const res = await listEquipment();
  equipmentList.value = res.rows;
  totalEquipment.value = res.total;
  console.log(res);
  loading.value = false;

};

let equipmentUserLists: EquipmentUserVO[] = [];
/**
 * 设备负责人信息
 */
const getEquipmentUserList = async () => {
  const res = await listEquipmentUserNoPage();
  console.log(res);
  equipmentUserLists = res.data;
  // equipmentUserLists.forEach(item => {
  //
  // })
  console.log(equipmentUserLists);
};


const configsAdd = (index) => {
  const obj = {
    sort: index + 2,
    name: "",
    type: "",
    unit: "",
    isDifferentiatePnl: "1",
    isBold: "",
  };
  form.value.craftParameterConfigs.push(obj);
};

const configsDelete = (index: number) => {
  form.value.craftParameterConfigs.splice(index, 1);
};

//上移
const configsUp = (index) => {
  let parameterConfigs = form.value.craftParameterConfigs[index];
  let parameterConfigs2 = form.value.craftParameterConfigs[index - 1];

  form.value.craftParameterConfigs[index - 1] = parameterConfigs;
  form.value.craftParameterConfigs[index] = parameterConfigs2;
};

//下移
const configsDown = (index) => {
  let parameterConfigs = form.value.craftParameterConfigs[index];
  let parameterConfigs2 = form.value.craftParameterConfigs[index + 1];

  form.value.craftParameterConfigs[index + 1] = parameterConfigs;
  form.value.craftParameterConfigs[index] = parameterConfigs2;
};

const selectConfigsAdd = (index) => {
  form.value.craftParameterConfigs[index].inputHidden = true;
  form.value.craftParameterConfigs[index].inputHiddenValue = null;
};


const selectConfigsDelete = (index, index2: number) => {
  console.log(form.value.craftParameterConfigs);
  form.value.craftParameterConfigs[index].optionsValueList.splice(index2, 1);
};


const inputBlur = (val, index) => {

  console.log('inputBlur', val.target.value, index);
  form.value.craftParameterConfigs[index].inputHidden = false;
  console.log(form.value.craftParameterConfigs[index]);

  if (form.value.craftParameterConfigs[index].optionsValueList == null) {
    form.value.craftParameterConfigs[index].optionsValueList = [];

    console.log(form.value.craftParameterConfigs[index].optionsValueList);
    form.value.craftParameterConfigs[index].optionsValueList.push(val.target.value);

  } else {
    console.log(val.target.value);

    if (val.target.value == undefined || val.target.value == null || val.target.value == '') {
      return;
    }
    form.value.craftParameterConfigs[index].optionsValueList.push(val.target.value);
  }


};


/** 编辑配置参数删除的标记 */
const paramerDelFlag = (item: any) => {
  const obj = {
    sort: item.sort,
    name: item.name,
    type: item.type,
    unit: "",
    isDifferentiatePnl: "1",
    isBold: "",
    id: item.id
  };
};


/** 查询工艺列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCraft(queryParams.value);
  craftList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

// 表格搜索
const searchChange = (params: any) => {
  let tempQuery = JSON.parse(JSON.stringify(queryParams.value))
  let craftName = tempQuery.craftName
  queryParams.value = params
  queryParams.value.craftName = craftName
  if (queryParams.value?.craftParameterConfigs) {
    queryParams.value.configIds = queryParams.value?.craftParameterConfigs;
    queryParams.value.configIds.map((m) => {
      m = m+''
    })
    let nameList = allCraftParamers.value.map((item:any)=>{
      let res = ''
      if (queryParams.value.configIds.includes(item.id+'')) {
        res = item.name
      }
      return res
    }).filter((f) => f)
    queryParams.value.configIds = allCraftParamers.value.filter(item => {
      return nameList.includes(item.name)
    }).map(v=>v.id)
    delete queryParams.value?.craftParameterConfigs
  }
  if (queryParams.value?.craftRoleNames) {
    queryParams.value.roleIds = queryParams.value?.craftRoleNames
    delete queryParams.value?.craftRoleNames
  }
  if (queryParams.value?.deptName) {
    queryParams.value.deptIds = queryParams.value?.deptName
    delete queryParams.value?.deptName
  }
  getList()
}

/** 工艺状态修改  */
const handleStatusChange = async (row: CraftVO) => {
  try {

    /* // await proxy?.$modal.confirm('确认要"' + text + '""' + row.craftName + '"工艺状态吗?');
     // await changeCraftStatus(row.craftId, row.status);*/
    Object.assign(data, row);
    /*   proxy?.$modal.msgSuccess(text + "成功");*/
    await changeCraftStatus(row.id, row.isOpen).then(res => {
      buttonLoading.value = false;
      getList();
    });


  } catch (err) {
    row.status = row.status === "0" ? "1" : "0";
  }
};


/**
 * 查询角色列表
 */
const getCraftRoleLists = async () => {
  const res = await getRoleLists();
  console.log(res);
  craftRoles.value = res.data;
  craftRoles.value.forEach(item => {
    item.roleName = String(item.roleName);
    item.value = item.roleId;
    item.label = item.roleName;
  });
  console.log(craftRoles.value);
};

// 获取部门列表
const getListDept = () => {
  listDept().then((res) => {
    if (res.code == 200) {
      deptList.value = res.data || []
      deptList.value.map((m) => {
        m.value = m.deptId
        m.label = m.deptName
      })
    }
  })
}

let srcList: string[] = [];
/** 设备配置按钮操作(编辑) */
const handleAuthEquipment = async (row?: CraftVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  queryParamsEquipment.value.craftId = _id
  const res = getEquipmentLists();
  // const res = await listEquipment();

  //工艺id获取已关联设备
  const craftInfo = await getCraft(_id);
  console.log(craftInfo.data);
  // Object.assign(equipmentList.value, res.rows);
  console.log(equipmentList.value);

  equipmentDrawer.visible = true;
  equipmentDrawer.title = "配置设备共" + totalEquipment.value + "台";

  await nextTick();

  equipmentList.value.forEach(item => {
    const res = craftInfo.data.equipmentVoList.find(it => {
      return item.id === it.id;
    })
    if (res) {
      equipmentListTableRef.value!.toggleRowSelection(item)
    }
  })
};


/**
 * 查询设备列表
 */
const getEquipmentList = async () => {
  loading.value = true;
  const res = await listEquipment(queryParamsEquipment.value);
  equipmentList.value = res.rows;
  console.log(equipmentList);
  totalEquipment.value = res.total;
  loading.value = false;
};


/*//修改工艺设备关联按钮
const handleUpdateEquipment = async (row?: CraftEquipmentVO) => {
  resetAddress();
  const _id = row?.id || ids.value[0];
  const res = await getEquipment(_id);

  Object.assign(formEquipment.value, res.data);
  equipmentDialog.title = "修改工艺设备关联";
  equipmentDialog.visible = true;

};*/


/*const resetAddress = () => {
  formEquipment.value = { ...initFormDataEquipment };
  customerAddressFormRef.value?.resetFields();
};*/


/*const handleClose = (done: () => void) => {
  ElMessageBox.confirm("你确定关闭该窗口吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};*/

/**
 * 查询工艺配置列表
 */
const getCraftParameterLists = async () => {
  const res = await craftParameterList();
  console.log(res);
  craftParamers.value = res.data || [];
  allCraftParamers.value = JSON.parse(JSON.stringify(res.data || []))
  craftParamers.value = craftParamers.value.filter((item, index, self) => {
    return index === self.findIndex(obj => obj.name === item.name);
  });
  craftParamers.value.forEach(item => {
    item.id = String(item.id);
    item.value = item.id;
    item.label = item.name;
  });
  console.log(craftParamers.value);
};


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

// 取消
const cancelEquipment = () => {
  console.log(1);
  reset();
  equipmentDrawer.visible = false;
};


/**
 * 设备关联提交按钮
 */
const submitEquipment = async () => {

  buttonLoading2.value = true;
  const craftId = queryParamsEquipment.value.craftId;
  console.log(craftId);
  const eIds = equipmentIds.value.join(",");
  await configEquipmentInfo({craftId: craftId, equipmentIds: eIds});

  proxy?.$modal.msgSuccess("修改成功");
  await getEquipmentList();
  dialog.visible = false;
  close();
  equipmentDrawer.visible = false;
  getList();
};


/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  form.value.craftParameterConfigs = [
    {
      sort: 1,
      name: "",
      type: "",
      unit: "",
      isDifferentiatePnl: "1",
      isBold: "",
      defaultValue: "",
      inputHidden: false,
      inputHiddenValue: "",
      optionsValueList: []
    }
  ]
  craftFormRef.value?.resetFields();
};

/** 搜索按钮操作(工艺) */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};


/** 搜索按钮操作(设备) */
const handleQueryEquipment = () => {
  queryParamsEquipment.value.pageNum = 1;
  getEquipmentList();
};

/** 重置按钮操作(外面工艺) */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 重置按钮操作(里面设备) */
const resetQueryEquipment = () => {
  queryFormRefEqui.value?.resetFields();
  getEquipmentList();
};


/** 多选框选中数据(工艺表单) */
const handleSelectionChange = (selection: CraftVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};


/** 多选框选中数据(设备表单) */
const handleEquipmentSelectionChange = (selection: EquipmentVO[]) => {
  equipmentIds.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
  console.log(selection);
};


/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工艺";
};

const craftParameterConfigList = ref<CraftParameterConfigVO[]>([]);

/** 修改按钮操作(工艺编辑) */
const handleUpdate = async (row?: CraftVO) => {
  reset();
  //查询当前工艺所有配置参数
  getCraftAllPermeter(row?.id);
  const _id = row?.id || ids.value[0];
  const res = await getCraft(_id);
  if (!res.data.craftParameterConfigs.length) {
    const obj = {
      id: "",
      sort: "",
      name: "",
      type: "",
      unit: "",
      isDifferentiatePnl: "1",
      isBold: ""
    };
    res.data.craftParameterConfigs.push(obj);
  }
  res.data.deptId = res.data.deptIds?.length ? res.data.deptIds[0] : undefined;
  Object.assign(form.value, res.data);
  console.log(res.data.roleIds);
  form.value.roleIds = res.data.roleIds;
  dialog.visible = true;
  dialog.title = "修改工艺";
};


let queryFormRef2: CraftParameterConfigQuery = reactive({craftId: ""});

/** 查询当前工艺所有配置参数 */
async function getCraftAllPermeter(craftId: any) {
  queryFormRef2.craftId = craftId;
  const res = await craftParameterList(queryFormRef2);
  craftParameterConfigList.value = res.data;
  console.log(res.data);

}


/** 提交按钮 (工艺)*/
const submitForm = () => {
  craftFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      console.log(form);
      console.log(a);

      //过滤掉item.craftName为空的数据
      form.value.craftParameterConfigs = form.value.craftParameterConfigs.filter(item => {
        return item.name != null && item.name != undefined && item.name != '';
      });

      form.value.craftParameterConfigs = form.value.craftParameterConfigs.filter((item, index) => {
        return item.sort = (index + 1);
      });

      form.value.deptIds = form.value.deptId ? [form.value.deptId] : [];
      // console.log(form.value)
      //form.value.craftParameterConfigs.options = a.value;
      if (form.value.id) {
        await updateCraft(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCraft(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作(工艺) */
const handleDelete = async (row?: CraftVO) => {
  const _ids = row?.craftName || ids.value;
  await proxy?.$modal.confirm("是否确认删除工艺名称为\"" + _ids + "\"的数据项？").finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delCraft(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("basedata/craft/export", {
    ...queryParams.value
  }, `craft_${new Date().getTime()}.xlsx`);
};

/** 查询部门下拉树结构 */
const getTreeSelect = async () => {
  const res = await api.deptTreeSelect();
  deptOptions.value = res.data || [];
};

onMounted(() => {
  getList();
  getListDept();
  getCraftParameterLists();
  getCraftRoleLists();
  getTreeSelect();
});
</script>
