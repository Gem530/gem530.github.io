<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="mb-[10px]" v-show="showSearch">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
                <el-option v-for="dict in sys_dept_status" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门简称" prop="deptShortName">
              <el-input v-model="queryParams.deptShortName" placeholder="请输入部门简称" clearable style="width: 240px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover" class="xtable-card">
      <!-- <template #header>
        <el-row :gutter="10" class="global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" @click="handleAdd()" >新增部门</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button plain @click="handleToggleExpandAll">全部展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :showRefresh="false"></right-toolbar>
        </el-row>
      </template> -->

      <XTable
        border
        height="100%"
        :data="deptList"
        :seq-config="{}"
        :pageShow="false"
        :loading="loading"
        ref="deptTableRef"
        :showRefresh="true"
        class="xtable-content"
        :columnList="columnList"
        toolId="systemDeptColumn"
        :scroll-y="{enabled: true, gt: 0}"
        :row-config="{ keyField: 'deptId' }"
        :tree-config="{transform: true,lazy: true,rowField: 'deptId',parentField: 'parentId',}"
        @searchChange="getList"
      >
        <!-- hasChild: 'hasChildren' -->
        <template #header-tool>
          <el-button type="primary" @click="handleAdd()">新增部门</el-button>
          <el-button plain @click="handleToggleExpandAll">全部展开/折叠</el-button>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :showRefresh="false"></right-toolbar>
        </template>
        <template #default-isCompany="scope">
          <el-tag v-if="scope.row.isCompany == 1">单位节点</el-tag>
          <span v-else></span>
        </template>
        <template #default-status="scope">
          <el-switch v-model="scope.row.status" inactive-value="1" active-value="0" @change="() => changeStatus(scope.row)"></el-switch>
        </template>
        <template #default-isProduction="scope">
          <dict-tag :options="productionList" :value="scope.row.isProduction" />
        </template>
        <template #default-deptUserCount="scope">
          <span class="pointer primary-color" @click="toUserMang(scope.row)">{{ scope.row?.deptUserCount || 0 }}</span>
        </template>
        <template #default-createTime="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
        <template #default-make="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
          <el-button link type="primary" @click="handleAddUser(scope.row)">新增用户</el-button>
          <el-button link type="primary" @click="handleAdd(scope.row)">添加子级</el-button>
        </template>
      </XTable>
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" destroy-on-close append-to-bod width="50%">
      <el-form ref="deptFormRef" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="23">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="23" v-if="form.parentId !== 0 && form.isCompany != '1'">
            <el-form-item label="上级部门" prop="parentId">
              <el-tree-select
                v-model="form.parentId"
                :data="deptOptions"
                :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
                value-key="deptId"
                placeholder="选择上级部门"
                check-strictly
                style="width: 100%"
                :disabled="form.isCompany === '1' || dialog.title == '修改部门信息'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="23" v-if="dialog.title !== '修改部门信息' && form.parentId === 100">
            <el-form-item label="节点类型" prop="isCompany">
              <el-radio-group v-model="form.isCompany">
                <el-radio v-for="dict in statusList" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :precision="0" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="16">
            <el-form-item label="负责人" prop="leader">
              <el-select v-model="form.leader" placeholder="请选择负责人" style="width: 100%">
                <el-option v-for="item in deptUserList" :key="item.userId" :label="item.userName" :value="item.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col> -->
          <el-col :span="23" v-if="dialog.title != '修改部门信息'">
            <el-form-item label="状态">
              <!-- <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group> -->
              <el-switch v-model="form.status" inactive-value="1" active-value="0"></el-switch>&nbsp;{{ form.status == '1' ? '停用' : '启用' }}
            </el-form-item>
          </el-col>
          <el-col :span="16" v-if="form.parentId !== 0 && form.isCompany != '1'">
              <el-form-item label-width="130px">
                <template #label>
                <span>
                  <el-tooltip content="标记为生产部门后，该部门所产生的成本会被用在相关的生产利润统计表汇总" placement="top">
                    <el-icon> <question-filled /> </el-icon>
                  </el-tooltip>
                  是否为生产部门
                </span>
                </template>
                <el-radio-group v-model="form.isProduction">
                  <el-radio v-model="form.isProduction" v-for="dict in productionList" :key="dict.value" :label="dict.value">{{
                      dict.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>

          </el-col>
          <el-col :span="23">
            <el-form-item label="部门简称" prop="deptShortName">
              <el-input v-model="form.deptShortName" placeholder="请输入部门简称" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" maxlength="200" />
            </el-form-item>
          </el-col>
          <el-col :span="23" v-if="dialog.title == '修改部门信息' && form.isCompany == '1'">
            <el-form-item label="单位logo" prop="fileList">
              <div class="global-flex flex-start">
                <XUpload
                  v-model:model-value="form.fileList"
                  :fileType="fileType"
                  @fileChange="handleFileChange"
                  @delFile="handleFileChange"
                  model="preview"
                  :limit="1"
                  :multiple="false"
                  :fileSize="2"
                  accept="image/png, image/bmp, image/jpeg, image/jpg, image/gif"
                ></XUpload>
              </div>
            </el-form-item>
            <!-- 提示 -->
            <el-form-item label="">
              <span style="color: #AAA">注：图片格式必须为：png,bmp,jpeg,jpg,gif, 建议使用png格式图片，以保持最佳效果；不可大于2M，建议图片尺寸为144px*144px</span>
            </el-form-item>
          </el-col>
          <el-col :span="23" v-if="form.isCompany=='1'">
            <el-form-item label="单位识别号">
              <el-input type="textarea" v-model="form.uscc" maxlength="200" />
            </el-form-item>
          </el-col>
          
          <el-col :span="23" v-if="form.isCompany=='1'">

            <el-button style="margin-left: 5px;" type="primary"  size="small" @click="addBank">新增</el-button>

            <el-form-item label="银行账户">
              <XTable toolId="deptOwnerBank" height="100%" class="xtable-content"
                      :data="accountTableDataList"
                      :columnList="accountColumnList"
                      ref="XTableRef2" min-height="240"
                      border :showRefresh="true"
                      @searchChange="getAccountTableData"
                      :column-config="{ resizable: true }"
                      :row-config="{ keyField:'id' }"
                      :enterFresh="true" :pageShow="false"
              >
                <template #default-type="scope">
                  {{ payWayTypeList.filter(pf => pf.value == scope.row.type).length>0?payWayTypeList.filter(pf => pf.value == scope.row.type)[0].label:''}}
                </template>
                <template #default-make="scope">
                  <el-button link type="primary" @click="updateBank(scope.row.id)" >修改</el-button>
                  <el-button link type="primary" @click="delBank(scope.row.id)">删除</el-button>
                </template>
              </XTable>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" @click="cancel">取消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确定{{ dialog.title == '修改部门信息' ? '修改' : '新增' }}</el-button
          >
        </div>
      </template>
    </el-dialog>

    
    <el-dialog :title="bankDialog.title" v-model="bankDialog.visible" destroy-on-close append-to-bod width="600px">
      <el-form ref="deptBankFormRef" :model="bankForm" :rules="bankRule" label-width="180px">
        <el-row>
          <el-col :span="23">
            <el-form-item label="银行账户名称" prop="label">
              <el-input v-model="bankForm.label"  maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="银行账号" prop="bankNo">
              <el-input v-model="bankForm.bankNo"  maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="补充信息" prop="extraInfo">
              <el-input v-model="bankForm.extraInfo"  maxlength="400" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="类型" prop="type">
              <el-select v-model="bankForm.type" clearable filterable style="width: 100%;" >
                <el-option v-for="item in payWayTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button  @click="bankDialog.visible=false">取消</el-button>
          <el-button type="primary" @click="submitBankForm" >确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 新增用户弹框 -->
    <EditUser ref="editUserRef" @getList="getList"></EditUser>
  </div>
</template>

<script setup name="Dept" lang="ts">
import { listDept, getDept, delDept, addDept, updateDept, updateDeptStaus, listDeptExcludeChild,
  listDeptBank,deleteDeptBank,updateDeptBank,addDeptBank, } from "@/api/system/dept"
import { DeptForm, DeptQuery, DeptVO } from "@/api/system/dept/types";
import {UserVO} from "@/api/system/user/types";
import {listUserByDeptId} from "@/api/system/user";
import EditUser from '../user/editUser'
import { useUserStore } from '@/store/modules/user';
import { deepClone } from "@/utils";

interface DeptOptionsType {
  deptId: number | string;
  deptName: string;
  children: DeptOptionsType[];

}

/**运行文件上传的类型 */
const fileType: string[] = ["png", "bmp", "jpeg", "jpg", "gif"];
const router = useRouter()
const userStore = useUserStore();
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { sys_normal_disable, sys_dept_iscompany } = toRefs<any>(proxy?.useDict("sys_normal_disable", "sys_dept_iscompany"));
const statusList = ref([
  { label: '单位节点', value: "1" },
  { label: '普通节点', value: "2" },
]);
const sys_dept_status = ref([
  { label: '全部', value: "-1" },
  { label: '已启用', value: "0" },
  { label: '已停用', value: "1" },
]);
const productionList = ref([
  { label: '是', value: "1" },
  { label: '否', value: "0" },
]);
const deptList = ref<DeptVO[]>([])
const loading = ref(true)
const showSearch = ref(true)
const deptOptions = ref<DeptOptionsType[]>([])
const isExpandAll = ref(true)
const deptUserList = ref<UserVO[]>([]);

const editUserRef = ref()
const newVxeTableRef = ref();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const deptTableRef = ref();
const buttonLoading = ref(false);
const queryFormRef = ref<ElFormInstance>();
const deptFormRef = ref<ElFormInstance>();

const initFormData: DeptForm = {
  deptId: undefined,
  parentId: undefined,
  deptName: undefined,
  deptShortName: undefined,
  orderNum: 0,
  leader: undefined,
  phone: undefined,
  email: undefined,
  status: "0",
  isCompany: '2',
}
const data = reactive<PageData<DeptForm, DeptQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    deptName: undefined,
    deptShortName: undefined,
    status: undefined
  },
  rules: {
    parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
    deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
    isCompany: [{ required: true, message: "节点类型不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
    phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }]
  },
})

const columnList = ref([
  { title: "序号", type: 'seq', fixed: "left", field: '1', align: 'left', width: '60' },
  { title: '部门名称', field: 'deptName', width: '260', align: 'left', treeNode: true },
  { title: '节点类型', field: 'isCompany', width: '130', align: 'center', isPermi: () => ['100'].includes(userStore.ownerId+'') },
  { title: '部门简称', field: 'deptShortName', width: '150', align: 'center' },
  { title: '排序', field: 'orderNum', width: '80', align: 'center' },
  { title: '用户数量', field: 'deptUserCount', width: '100', align: 'center' },
  { title: '是否为生产部门', field: 'isProduction', width: '105', align: 'center' },
  { title: '备注', field: 'remark', minWidth: '200', align: 'center' },
  { title: '状态', field: 'status', width: '100', align: 'center' },
  { title: '创建时间', field: 'createTime', width: '130', align: 'center' },
  { title: '操作', field: 'make', width: '260', align: 'center', fixed: 'right' },
])

const { queryParams, form, rules } = toRefs<PageData<DeptForm, DeptQuery>>(data)

/** 查询菜单列表 */
const getList = async () => {
  loading.value = true;
  let params = JSON.parse(JSON.stringify(queryParams.value))
  if (params.status == '-1') {
    delete params.status
  }
  const res = await listDept(params);
  // const data = proxy?.handleTree<DeptVO>(res.data, "deptId")
  // if (data) {
    deptList.value = res.data
  // }
  loading.value = false
}

/** 查询当前部门的所有用户 */
async function getDeptAllUser(deptId: any) {
  if (deptId !== null && deptId !== "" && deptId !== undefined) {
    const res = await listUserByDeptId(deptId);
    deptUserList.value = res.data;
  }
}

/** 取消按钮 */
const cancel = () => {
  reset()
  dialog.visible = false
}
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  deptFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery()
}

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(deptList.value, isExpandAll.value)
}
/** 展开/折叠所有 */
const toggleExpandAll = (data: DeptVO[], status: boolean) => {
  // data.forEach((item) => {
    deptTableRef.value?.xTableRef?.setAllTreeExpand(!status)
    // if (item.children && item.children.length > 0) toggleExpandAll(item.children, status)
  // })
}

/** 新增按钮操作 */
const handleAdd = async (row?: DeptVO) => {
  reset();
  const res = await listDept();
  const data = proxy?.handleTree<DeptOptionsType>(res.data, "deptId");
  if (data) {
    deptOptions.value = data
    if (row && row.deptId) {
      form.value.parentId = row?.deptId;
    } else {
      form.value.parentId = deptOptions.value?.length ? deptOptions.value[0]?.deptId : ''
      // console.log(deptOptions.value)
    }
    form.value.isProduction = '0';
    dialog.visible = true;
    dialog.title = "新增部门信息";
  }
}

/** 修改按钮操作 */
const handleUpdate = async (row: DeptVO) => {
  reset();
  //查询当前部门所有用户
  getDeptAllUser(row.deptId);
  const res = await getDept(row.deptId);
  console.log("部门：",res.data);

  form.value = res.data
  const response = await listDeptExcludeChild(row.deptId);
  const data = proxy?.handleTree<DeptOptionsType>(response.data, "deptId")
  if (data) {
    deptOptions.value = data;
    if (data.length === 0) {
      const noResultsOptions: DeptOptionsType = {
        deptId: res.data.parentId,
        deptName: res.data.parentName,
        children: []
      };
      deptOptions.value.push(noResultsOptions);
    }
  }
  dialog.visible = true;
  dialog.title = "修改部门信息";
}
/** 修改状态 */
const changeStatus = async (row: any) => {
  let text = row.status === "0" ? "启用" : "停用"
  try {
    await proxy?.$modal.confirm('确认要' + text + '"' + row.deptName + '"吗?');
    await updateDeptStaus(row.deptId);
    // console.log(row)
    proxy?.$modal.msgSuccess(text + "成功");
    await getList();
  } catch (err) {
    row.status = row.status === "0" ? "1" : "0";
  }
  // buttonLoading.value = true;
  // updateDept(row).then(async () => {
  //   proxy?.$modal.msgSuccess("操作成功");
  //   dialog.visible = false;
  //   await getList();
  // }).catch(() => {
  //   row.status = (row.status == '1' ? '0' : '1')
  // }).finally(() => {
  //   buttonLoading.value = false;
  // })
}
/** 提交按钮 */
const submitForm = () => {
  deptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      form.value.deptId ? await updateDept(form.value).finally(() => { buttonLoading.value = false; }) : await addDept(form.value).finally(() => { buttonLoading.value = false; });
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  })
}
/** 删除按钮操作 */
const handleDelete = async (row: DeptVO) => {
  await proxy?.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的部门，关联人数为'+row.deptUserCount+'?');
  proxy?.$modal.loading('加载中...');
  await delDept(row.deptId).finally(() => proxy?.$modal.closeLoading());
  await getList();
  proxy?.$modal.msgSuccess("删除成功");
}

// 新增用户
const handleAddUser = (row: any) => {
  editUserRef.value.handleAdd({ deptId: row.deptId })
}

// 点击用户数量跳转到用户管理页
const toUserMang = (row: any) => {
  router.push(`/system/user?deptId=${row.deptId}`)
}

/**
 * handleFileChange 清空form.fileList 校验
 */
const handleFileChange = (file: any) => {

  if (file.length > 0) {
    form.value.fileList = file;
  } else {
    form.value.fileList = [];
  }
}

const bankDialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const bankData = reactive<PageData<DeptForm, DeptQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    deptName: undefined,
    status: undefined
  },
  rules: {
    label: [{ required: true, message: "银行名称不能为空", trigger: "change" }],
    bankNo: [{ required: true, message: "银行账号不能为空", trigger: "change" }],
    type: [{ required: true, message: "类型不能为空", trigger: "change" }],
  },
})
const deptBankFormRef = ref();
const accountTableDataList = ref();
const { form:bankForm, rules:bankRule } = toRefs<PageData<DeptForm, DeptQuery>>(bankData);
const payWayTypeList = ref([
    {label: '基本户', value: '1', elTagType: 'default', elTagClass: ''},
    {label: '一般户', value: '2', elTagType: 'default', elTagClass: ''},
    {label: '香港账户', value: '3', elTagType: 'default', elTagClass: ''},
    {label: '企业微信', value: '4', elTagType: 'default', elTagClass: '' },
    {label: '企业支付宝', value: '5', elTagType: 'default', elTagClass: '' },
  ]);

const accountColumnList = ref([
  { title: "序号", width: "50", type: "seq", filed: "index", align: "center" ,fixed: 'left' },
  { title: "银行名称", width: "260", field: "label", align: "center" },
  { title: "银行账号", width: "230", field: "bankNo", align: "center" },
  { title: "追加信息", width: "230", field: "extraInfo", align: "center" },
  { title: "账号类型", width: "100", field: "type", align: "center" },
  { title: '操作' , width: "100",  align: "center", field: "make",fixed: 'right' }
]);

const getAccountTableData = async () => {
  const bank=await listDeptBank();
  accountTableDataList.value=bank.data;
  console.log(bank);
}

const addBank = () => {
  bankForm.value={};
  bankDialog.visible=true;
  bankDialog.title = "新增部门银行账号信息";
}

const updateBank = async (_id:any) => {
  const bank  =await listDeptBank();
  const bankInfo  = bank.data.filter(b=>b.id==_id);
  console.log("bankInfo",bankInfo);
  if(bankInfo.length > 0){
    bankForm.value = deepClone(bankInfo[0]);
  }
  bankDialog.visible = true;
  bankDialog.title = "修改部门银行账号信息";
}

const delBank = async (_id:any) => {
  await deleteDeptBank({id:_id});
  await getAccountTableData();
}

const submitBankForm = async() => {

  deptBankFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if(bankForm.value.id){
        await updateDeptBank(bankForm.value);
      }else{
        await addDeptBank(bankForm.value);
      }
      await getAccountTableData();
      bankDialog.visible = false;
    }
  })
}

onMounted(() => {
  getList();
  getAccountTableData();
});
</script>
