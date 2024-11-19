<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="待审核列表" :name="1">
          <div class="head-btn-flex">
            <el-button :loading="buttonLoading" type="primary" @click="borrowingMaterialReview">借料审核</el-button>
          </div>
          <XTable toolId="purchaseMaterialBorrowWait" v-model:page-size="waitQueryParams.pageSize"
            v-model:current-page="waitQueryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: auditTotal }" :data="materialBorrowList" :columnList="columnList"
            ref="xTableForm" size="mini" v-if="editableTabsValue == 1" border @searchChange="searchWaitChange"
            :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
            :loading="waitLoading"
             :intervalCondition="['borrowTime']"
            >
            <template #default-status="scope">
              <dict-tag :options="material_borrow_detail_status" :value="scope.row.status" />
            </template>
              <template #default-storageId="scope">
              {{ scope.row.storageName }}
            </template>
            <template #default-type="scope">
              <dict-tag :options="material_borrow_type" :value="scope.row.type" />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleExamine(scope.row)">审核
              </el-button>
            </template>
          </XTable>

        </el-tab-pane>
        <el-tab-pane label="借料列表" :name="2">
          <div class="head-btn-flex">
            <el-button :loading="buttonLoading" type="primary" @click="handleBorrow">物料借入</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="handlelend">物料借出</el-button>
          </div>

          <XTable toolId="purchaseMaterialBorrowList1" v-model:page-size="queryParams.pageSize"
            v-model:current-page="queryParams.pageNum" height="100%" class="xtable-content"
            :page-params="{ perfect: true, total: total }" :data="allMaterialBorrowList" :columnList="columnList2"
            ref="xTable" size="mini" @selection-change="handleSelectionChange" v-if="editableTabsValue == 2" border
            @searchChange="searchChange" :column-config="{ resizable: true }" :row-config="{ keyField: 'id' }"
            :loading="loading"
            :intervalCondition="['borrowTime']"
            >
            <template #default-status="scope">
              <dict-tag :options="material_borrow_detail_status" :value="scope.row.status" />
            </template>
             <template #default-storageId="scope">
              {{ scope.row.storageName }}
            </template>
            <template #default-type="scope">
              <dict-tag :options="material_borrow_type" :value="scope.row.type" />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdate(scope.row)" v-if="scope.row.status != 4">编辑
              </el-button>
              <el-button link type="primary" @click="handleBorrowUpdate(scope.row)" v-if="scope.row.status != 4">提交
              </el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)" v-if="scope.row.status != 4">删除
              </el-button>
              <el-button v-if="scope.row.status == 4" link type="primary" @click="handleGiveBack(scope.row)">还回
              </el-button>
              <el-button link type="primary" @click="handleRecord(scope.row)">借还记录
              </el-button>
            </template>
          </XTable>

        </el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->

    <!-- 添加或修改物料借料管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="75%">
      <el-form ref="materialBorrowFormRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" label="借料单号:" prop="code">
              <el-input v-model="form.code" :rows="2" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="借料日期:" prop="borrowTime">
              <el-date-picker v-model="form.borrowTime" style="width: 100%;" type="date" placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:MM:SS" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="借料类型:" prop="type">
              <dict-tag :options="material_borrow_type" :value="form.type" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="物料编码:" prop="materialCode">
              <el-input v-model="form.materialCode" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="物料名称:" prop="materialName">
              <el-input v-model="form.materialName" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="材质牌号:" prop="materialQuality">
              <el-input v-model="form.materialQuality" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="板厚:" prop="boardThickness">
              <el-input v-model="form.boardThickness" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="铜厚:" prop="copperThickness">
              <el-input v-model="form.copperThickness" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="级别:" prop="level">
              <el-input v-model="form.level" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="颜色:" prop="color">
              <el-input v-model="form.color" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="长（mm）:" prop="length">
              <el-input v-model="form.length" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="宽（mm）:" prop="width">
              <el-input v-model="form.width" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="品牌:" prop="manufacturer">
              <el-input v-model="form.manufacturer" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="生产日期:" prop="productionDate">
              <el-input v-model="form.productionDate" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="存货仓:" prop="storageName">
              <el-input v-model="form.storageName" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="库存单位:" prop="unit">
              <el-input v-model="form.unit" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="借料人:" prop="borrowUserName">
              <el-input v-model="form.borrowUserName" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="联系方式:" prop="borrowUserPhone">
              <el-input v-model="form.borrowUserPhone" :rows="2" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="数量:" prop="quantity">
              <el-input-number v-model="form.quantity" :precision="2" style="width: 99%;" @change="totalAmount(form)"
                :controls="false" :rows="0" maxlength="14" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item size="small" label="单价:" prop="price">
              <el-input-number v-model="form.price" :precision="4" style="width: 99%;" @change="totalAmount(form)"
                :controls="false" :rows="0" maxlength="14" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="金额:" prop="amount">
              <el-input v-model="form.amount" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="借料供应商:" prop="supplierName">
              <el-input v-model="form.supplierName" :rows="2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="借料地址:" prop="addressId">
              <el-select v-model="form.addressId" style="width: calc(100% - 63px)" clearable :collapse-tags="true"
                filterable placeholder="请选择借料地址">
                <el-option v-for="item in customerAddressList" :key="item.id"
                  :label="`${item.status==0?'(已禁用)-':''}${item.name},${item.phone},${item.address}`"
                  :disabled="item.status==0"
                  :value="item.id" />
              </el-select>
              <el-button style="width: 60px;margin-left: 3px" text="plain" @click="handleAddAddress">
                <el-icon>
                  <Plus/>
                </el-icon>
                添加地址
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="备注:">
              <el-input maxlength="1000" v-model="form.remark" :rows="2" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 物料借入 -->
    <el-drawer v-model="dialogBorrowExamine.visible" :title="dialogBorrowExamine.title" center size="90%" draggable destroy-on-close>
      <!-- 主体 -->
      <el-form ref="inBorrowFormRef" border label-width="100px" :rules="borrowRules" :model="formBorrowMaterial">
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="借料人：" prop="borrowUserName">
              <el-input v-model="formBorrowMaterial.borrowUserName" placeholder="借料人" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="联系方式：">
              <el-input v-model="formBorrowMaterial.borrowUserPhone" placeholder="请输入联系方式" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="借料厂商：" prop="suppId">
              <el-select style="width: 100%;" v-model="formBorrowMaterial.suppId" filterable placeholder="请选择"
                @change="queryAddressName">
                <el-option v-for="item in suppliers" :key="item.id" :label="item.supplierName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="借料地址：" prop="addressId">
              <el-select v-model="formBorrowMaterial.addressId" style="width: calc(100% - 63px)" clearable
                :collapse-tags="true" filterable placeholder="请选择借料地址">
                <el-option v-for="item in customerAddressList" :key="item.id"
                   :label="`${item.status==0?'(已禁用)-':''}${item.name},${item.phone},${item.address}`"
                  :disabled="item.status==0"
                  :value="item.id" />
              </el-select>
              <el-button style="width: 60px;margin-left: 3px" text="plain" @click="handleAddAddress">
                <el-icon>
                  <Plus/>
                </el-icon>
                添加地址
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">已选物料</el-divider>

      <XTable :pageShow="false" border keep-source size="mini" height="345px" :row-config="{ height: 50 }" :scroll-x="{enabled: true}"
        :show-footer="false" :edit-rules="validRules" show-overflow :loading="loading" ref="inXTableBorrowMaterial"
        :column-config="{ resizable: true }" :data="tableDataBorrowMaterial" :columnList="checkedColumnList"
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: true, showStatus: true }">

        <template #default-expirationDate="{ row, rowIndex }">
          <span>{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #edit-expirationDate="{ row }">
          <span>{{ parseTime(row.expirationDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #default-productionDate="{ row, rowIndex }">
          <span>{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #edit-productionDate="{ row }">
          <el-date-picker style="width: 100%" size="small" v-model="row.productionDate" type="datetime" placeholder="选择日期"
            value-format="YYYY-MM-DD" format="YYYY-MM-DD" clearable @change="dispatchTimeChange(row)" />
        </template>
        <template #default-expirationDays="{ row, rowIndex }">
          <span>{{ row.expirationDays }}</span>
        </template>
        <template #edit-expirationDays="{ row }">
          <el-input v-model="row.expirationDays" @change="expirationTimeChange(row)"></el-input>
        </template>
        <template #default-supplierName="{ row, rowIndex }">
          <span>{{ row.supplierName }}</span>
        </template>
        <template #edit-supplierName="{ row }">
          <vxe-select v-model="row.supplierId" @change="tabSupplierChange(row)">
            <vxe-option v-for="item in suppliers" :key="item.id" :label="item.supplierName" :value="item.id" />
          </vxe-select>
        </template>
        <template #default-storageName="{ row }">
          <span>{{ row.storageName }}</span>
        </template>
        <template #edit-storageName="{ row }">
          <vxe-select v-model="row.storageId" @change="tabStorageChange(row)">
            <vxe-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.id" />
          </vxe-select>
        </template>
        <template #default-returnBorrowQuantity="{ row }">
          <span>{{ row.returnBorrowQuantity }}</span>
        </template>
        <template #edit-returnBorrowQuantity="{ row }">
          <el-input-number v-model="row.returnBorrowQuantity" :precision="0" style="width: 99%;"  @change="totalPriceAmount(row)"
                :controls="false" :min="0" maxlength="14" />
        </template>
        <template #default-price="{ row }">
          <span>{{ row.price }}</span>
        </template>
        <template #edit-price="{ row }">
          <el-input v-model="row.price" type="number" @change="totalPriceAmount(row)" :min="0"></el-input>
        </template>
        <template #default-remark="{ row }">
          <span>{{ row.remark }}</span>
        </template>
        <template #edit-remark="{ row }">
          <el-input v-model="row.remark"   maxlength="1000" />
        </template>
        <template #default-make="{ row, rowIndex }">
          <el-button size="small" text="plain" @click="deleteRowEventBorrow(row, rowIndex)">删除</el-button>
        </template>
      </XTable>

      <el-divider content-position="left">待选物料</el-divider>
      <!-- <div style="text-align: right">
        <el-button :loading="buttonLoading" type="primary" @click="submitPurchase">确定</el-button>
      </div> -->
      <el-container>
        <el-main style="padding:0px;overflow-x:hidden;">
            <XTable
            v-loading="materialLoading"
            :pageShow="true"
            v-model:page-size="selectQueryParams.pageSize"
            v-model:current-page="selectQueryParams.pageNum"
            :page-params="{ perfect: true, total: materialTotal }"
            :data="materialInventoryList"
            :columnList="selectedMaterialColumnList"
            ref="inventoryTableRef"
            @searchChange="pageChangeBorrow"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'id' }"
            @checkbox-change="selectChangeEvent"
            @checkbox-all="selectAllChangeEvent"
            height="440"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
          </XTable>
          <!-- <pagination v-show="total > 0" :total="total" v-model:page="queryParamsCommodity.pageNum"
            v-model:limit="queryParamsCommodity.pageSize" @pagination="choosePurchase" /> -->
        </el-main>
      </el-container>
      <template #footer>
        <!-- <div style="display: flex; justify-content: center;">
          <span class="dialog-footer"> -->
            <el-button :loading="buttonLoading" type="primary" @click="saveRawMaterialBorrow('1', '1')">保存</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="saveRawMaterialBorrow('2', '1')">提交</el-button>
            <el-button :loading="buttonLoading" @click="dialogBorrowExamine.visible = false">关闭</el-button>
          <!-- </span>
        </div> -->
      </template>
    </el-drawer>

    <!-- 借还记录 -->
    <el-dialog v-model="dialogRecordExamine.visible" :title="dialogRecordExamine.title" center width="50%" draggable>
      <XTable :pageShow="false" border keep-source size="mini" align="center" height="345px" :row-config="{ height: 50 }"
        :show-footer="true" show-overflow :loading="loading" ref="recordRef" :columnList="recordColumnList"
        :column-config="{ resizable: true }" :data="tabRecordBorrowMaterial">
        <template #default-type="scope">
          <dict-tag :options="record_borrow_type" :value="scope.row.type" />
        </template>
      </XTable>
      <template #footer>
        <!-- <div style="display: flex; justify-content: center;">
          <span class="dialog-footer"> -->
            <el-button @click="dialogRecordExamine.visible = false">关闭</el-button>
          <!-- </span>
        </div> -->
      </template>
    </el-dialog>

    <!-- 物料还回 -->
    <el-drawer v-model="dialogGiveBack.visible" title="物料还回" center size="90%" draggable destroy-on-close>
      <!-- 主体 -->
      <el-form :label-position="labelPosition" border label-width="100px" :model="formGiveBackMaterial">
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="还料人：">
              <el-input v-model="formGiveBackMaterial.borrowUserName" placeholder="请填写还料人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="联系方式：">
              <el-input v-model="formGiveBackMaterial.borrowUserPhone" placeholder="请输入联系方式" type="number" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">已选物料</el-divider>
      <XTable border keep-source size="mini" align="center" height="200px" :row-config="{ height: 50 }"
         :edit-rules="validRules" :loading="loading" ref="xTableBorrowBackMaterialRef"
        :columnList="borrowBackColumn" :column-config="{ resizable: true }" :data="tabBackBorrowMaterial"
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: true, showStatus: true }"
        :pageShow="false"
        >
        <template #default-productionDate="{ row, rowIndex }">
          <span>{{ parseTime(row.productionDate, '{y}-{m}-{d}') }}</span>
        </template>
        <template #edit-productionDate="{ row }">
          <el-date-picker style="width: 100%" size="small" v-model="row.productionDate" type="datetime" placeholder="选择日期"
            value-format="YYYY-MM-DD" format="YYYY-MM-DD" clearable @change="dispatchTimeChange(row)" />
        </template>
        <template #default-expirationDays="{ row, rowIndex }">
          <span>{{ row.expirationDays }}</span>
        </template>
        <template #edit-expirationDays="{ row }">
          <el-input v-model="row.expirationDays" @change="expirationTimeChange(row)"></el-input>
        </template>

        <template #edit-supplierName="{ row }">
          <vxe-select v-model="row.supplierId" @change="tabSupplierChange(row)">
            <vxe-option v-for="item in suppliers" :key="item.id" :label="item.supplierName" :value="item.id" />
          </vxe-select>
        </template>
        <template #default-storageName="{ row }">
          <span>{{ row.storageName }}</span>
        </template>
        <template #edit-storageName="{ row }">
          <vxe-select v-model="row.storageId" @change="tabStorageChange(row)">
            <vxe-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.id" />
          </vxe-select>
        </template>
        <template #default-returnBorrowQuantity="{ row }">
          <span>{{ row.returnBorrowQuantity }}</span>
        </template>
        <template #edit-returnBorrowQuantity="{ row }">
          <el-input-number v-if="returnBorrowMaterial.type=='1'" v-model="row.returnBorrowQuantity" style="width:100%" :max="row.inventoryQuantity" :precision="0" :controls="false" type="number" @change="totalPriceAmount(row)" :min="0" />
          <el-input-number v-else v-model="row.returnBorrowQuantity" style="width:100%"  :precision="0" :controls="false" type="number" @change="totalPriceAmount(row)" :min="0" />
        </template>
        <template #default-price="{ row }">
          <span>{{ row.price }}</span>
        </template>
        <template #edit-price="{ row }">
          <!-- <el-input v-model="row.price" type="number" @change="totalPriceAmount(row)" :min="0"></el-input> -->
           <el-input-number v-model="row.price" style="width:100%" :precision="2" :controls="false"  @change="totalPriceAmount(row)" :min="0" />
        </template>
          <template #default-remark="{ row }">
          <span>{{ row.remark }}</span>
        </template>
        <template #edit-remark="{ row }">
             <el-input maxLength="100"   v-model="row.remark" />
        </template>
        <template #default-make="{ row, rowIndex }">
          <el-button size="small" link type="primary" @click="deleteRowEventReturn(row, rowIndex)">删除</el-button>
        </template>
      </XTable>

      <el-divider content-position="left">待选物料</el-divider>

        <el-main style="padding:0px;overflow-x:hidden;">
          <XTable
            v-loading="materialLoading"
            :pageShow="true"
            v-model:page-size="selectQueryParams.pageSize"
            v-model:current-page="selectQueryParams.pageNum"
            :page-params="{ perfect: true, total: materialTotal }"
            :data="materialInventoryList"
            :columnList="materialColumnList"
            ref="returnTableRef"
            @searchChange="pageChangeReturn"
            :checkbox-config="{ reserve: true }"
            :row-config="{ keyField: 'id' }"
            @checkbox-change="returnSelectChangeEvent"
            @checkbox-all="returnSelectAllChangeEvent"
            height="440"
          >
            <template #default-categoryId="scope">
              <div>{{ scope.row.categoryName }}</div>
            </template>
              <template #default-make="{ row, rowIndex }">
          <el-button size="small" link type="primary" @click="addRowEventReturn(row, rowIndex)">添加</el-button>
        </template>
          </XTable>
        </el-main>

      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" type="primary" @click="saveInventoryBorrow">提交</el-button>
            <el-button :loading="buttonLoading" @click="dialogGiveBack.visible = false">关闭</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!--借料审核-->
    <el-dialog v-model="dialogBorrowReviewExamine.visible" title="借料审核" center width="90%" draggable>

      <!-- 主体 -->
      <XTable border keep-source size="mini" align="center" height="545px" :row-config="{ height: 50 }"
        :show-footer="true" :edit-rules="validRules" show-overflow :loading="loading" ref="xTableBorrow"
        :pageShow="false" :columnList="columnListBorrowProcess" toolId="borrowProcessDialogToolId"
        :column-config="{ resizable: true }" :data="tableDataBorrowList"
        :edit-config="{ trigger: 'click', mode: 'row', autoClear: false, showStatus: true }">
        <!-- <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column field="type" title="借料类型"> -->
          <template #default-type="scope">
            <dict-tag :options="material_borrow_type" :value="scope.row.type" />
          </template>
        <!-- </vxe-column>
        <vxe-column field="materialCode" title="物料编码"> -->
          <template #edit-materialCode="{ row }">
            <el-input v-model="row.materialCode"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="materialName" title="物料名称"> -->
          <template #edit-materialName="{ row }">
            <el-input v-model="row.materialName"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="materialQuality" title="材质牌号"> -->
          <template #edit-materialQuality="{ row }">
            <el-input v-model="row.materialQuality"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="boardThickness" title="板厚"> -->
          <template #edit-boardThickness="{ row }">
            <el-input v-model="row.boardThickness"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="copperThickness" title="铜厚"> -->
          <template #edit="{ row }">
            <el-input v-model="row.copperThickness"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="color" title="颜色"> -->
          <template #edit-color="{ row }">
            <el-input v-model="row.color"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="level" title="级别"> -->
          <template #edit-level="{ row }">
            <el-input v-model="row.level"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="length" title="长"> -->
          <template #edit-length="{ row }">
            <el-input v-model="row.length"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="width" title="宽"> -->
          <template #edit-width="{ row }">
            <el-input v-model="row.width"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="manufacturer" title="品牌"> -->
          <template #edit-manufacturer="{ row }">
            <el-input v-model="row.manufacturer"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="storageName" title="存货仓"> -->
          <template #edit-storageName="{ row }">
            <el-input v-model="row.storageName"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="inventoryQuantity" title="库存数"> -->
          <template #edit-inventoryQuantity="{ row }">
            <el-input v-model="row.inventoryQuantity"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="price" title="单价" :edit-render="{ placeholder: '请点击输入' }" width="70"> -->
          <template #edit-price="{ row }">
            <el-input v-model="row.price" @change="totalPriceCount(row)"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="quantity" title="数量"> -->
          <template #edit-quantity="{ row }">
            <el-input v-model="row.quantity"></el-input>
          </template>
        <!-- </vxe-column>

        <vxe-column field="totalPrice" title="金额"> -->
          <template #edit-totalPrice="{ row }">
            <el-input v-model="row.totalPrice"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="borrowUserName" title="借料人"> -->
          <template #edit-borrowUserName="{ row }">
            <el-input v-model="row.borrowUserName"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="borrowUserPhone" title="联系方式"> -->
          <template #edit-borrowUserPhone="{ row }">
            <el-input v-model="row.borrowUserPhone"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="supplierName" title="借料供应商" width="70"> -->
          <template #edit-supplierName="{ row }">
            <el-input v-model="row.supplierName"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column field="addressName" title="借料供应商地址" width="90"> -->
          <template #edit-addressName="{ row }">
            <el-input v-model="row.addressName"></el-input>
          </template>
        <!-- </vxe-column>
        <vxe-column title="操作" width="70"> -->
          <template #default-make="{ row, rowIndex }">
            <el-button size="small" link type="primary" @click="deleteRowEvent(row, rowIndex)">删除</el-button>
          </template>
        <!-- </vxe-column> -->
      </XTable>
      <template #footer>
        <!-- <div style="display: flex; justify-content: center;">
          <span class="dialog-footer"> -->
            <el-button :loading="buttonLoading" type="danger" @click="updateRejectBorrow">驳回</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="saveRejectBorrow">通过</el-button>
            <el-button :loading="buttonLoading" @click="dialogBorrowReviewExamine.visible = false">取消</el-button>
          <!-- </span>
        </div> -->
      </template>
    </el-dialog>

    <!-- 新增地址弹窗-->
    <el-dialog v-model="addressDialog.visible" :title="addressDialog.title" :destroy-on-close="true"
               :close-on-click-modal="false" width="350px">
      <el-form label-width="80px" ref="customerAddressFormRef" :model="formAddress" :rules="rulesAddress">
        <el-form-item size="small" label="联系人" prop="name">
          <el-input v-model="formAddress.name" autocomplete="off" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系电话" prop="phone">
          <el-input v-model="formAddress.phone" autocomplete="off" placeholder="请输入联系电话" type="number"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系地址" prop="address">
          <el-input v-model="formAddress.address" autocomplete="off" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item size="small" label="物流周期" prop="logisticsCycle">
          <el-input v-model="formAddress.logisticsCycle" autocomplete="off" type="number" placeholder="请输入物流周期"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button :loading="buttonLoading" type="primary" @click="submitAddress">确 定</el-button>
        <el-button @click="cancelAddress">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 库存锁定提示框 -->
    <InventoryLock title="物料盘点提示" inventoryType="2" v-model:show="inventoryCheck" :data="inventoryRes" @close="inventoryCheck = false"/>
  </div>
</template>

<script setup name="MaterialBorrow" lang="ts">
import {
  addMaterialBorrow,
  delMaterialBorrow,
  getMaterialBorrow,
  listMaterialBorrow, savaInventoryBorrowDetail,
  saveRawMaterialBorrowDetail,
  saveRejectBorrowDetail,
  updateMaterialBorrow,
  updateMaterialReject,
  updatePurchaseMaterialBorrow,
  getBorrowRecordDetail
} from '@/api/purchase/materialBorrow';
import {
  DirectMaterialBorrow,
  DirectMaterialReject,
  MaterialBorrowForm,
  MaterialBorrowQuery,
  MaterialBorrowVO
} from '@/api/purchase/materialBorrow/types';
import { listMaterialInventory,getMaterialInventoryList } from "@/api/purchase/materialInventory";
import { ref } from "vue";
import { MaterialInventoryVO } from "@/api/purchase/materialInventory/types";
import { OrderVO } from "@/api/order/directOrder/types";
import { VXETable, VxeTableInstance, VxeTablePropTypes } from "vxe-table";
import useUserStore from "@/store/modules/user";
import { SupplierVO } from "@/api/basedata/supplier/types";
import { listSupplierNoPage } from "@/api/basedata/supplier";
import {addCustomerAddress, listCustomerSupplierAddress} from "@/api/basedata/customerAddress";
import {CustomerAddressForm, CustomerAddressQuery, CustomerAddressVO} from "@/api/basedata/customerAddress/types";
import { MaterialStorageVO } from "@/api/purchase/materialStorage/types";
import { listMaterialStorage } from "@/api/purchase/materialStorage";
import { savaRawMaterialCheckDetail } from "@/api/purchase/materialCheckDetail";
import dayjs from "dayjs";
import { AnyAaaaRecord } from 'node:dns';
import { VxeTableEvents } from 'vxe-table'
import {listMaterialInventoryInfo} from "@/api/purchase/materialApply";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import { decryptBase64ByStr } from '@/utils/crypto'

const xTableBorrowBackMaterialRef=ref();
const recordRef = ref();
const materialBorrowList = ref<MaterialBorrowVO[]>([]);
const allMaterialBorrowList = ref<MaterialBorrowVO[]>([]);
const tableDataBorrowMaterial = ref<MaterialInventoryVO[]>([]);
const tabBackBorrowMaterial = ref<MaterialInventoryVO[]>([]);
const tabRecordBorrowMaterial = ref([]);

const buttonLoading = ref(false);
const loading = ref(true);
const waitLoading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
//待审核
const auditTotal = ref(0);
//物料
const materialTotal = ref(0);
//物料加载
const materialLoading = ref(false);

const queryFormRef = ref<ElFormInstance>();
const materialBorrowFormRef = ref<ElFormInstance>();
const inBorrowFormRef = ref<ElFormInstance>();
const outBorrowFormRef = ref<ElFormInstance>();

const materialInventoryList = ref<MaterialInventoryVO[]>([]);
const { material_borrow_type } = toRefs<any>(proxy?.useDict("material_borrow_type"));
const { material_borrow_detail_status } = toRefs<any>(proxy?.useDict("material_borrow_detail_status"));

const record_borrow_type =ref([
  { label: '借入', value: "1" },
  { label: '借出', value: "2" },
  { label: '还回', value: "3" },
]);
const type =ref([
  { label: '借入', value: "1" },
  { label: '借出', value: "2" },
]);

// 新增属性
const editableTabsValue = ref(1);
const purchaseTable = ref<ElFormInstance>();
const route = useRoute();
/**
 * 进入页面次数
 */
const isFirst = ref(0)
/**
 * 待办跳转参数
 */
const pendingParams = ref()
//选择订单
const handleSelectionChangePurchase = (val: MaterialInventoryVO[]) => {
  alreadySelectPurchase.value = val;
}


const getVoidedList = async () => {
  queryParams.value.statusType = editableTabsValue.value;
  if (editableTabsValue.value == "1") {
    getWaitList();
  } else {
    getList();
  }
}

const initMaterialFormData: MaterialApplyForm = {
  id: undefined,
  code: undefined,
  applyType: undefined,
  deliverTime: undefined,
  addressId: undefined,
  applyUserId: undefined,
  applyTime: undefined,
  remark: undefined,
  materialApplyDetailsList: []
}
const SelectData = reactive<PageData<any, any>>({
  form: { ...initMaterialFormData },
  queryParams: {
    id: undefined,
    pageNum: 1,
    pageSize: 20,
    categoryId: undefined,
    categoryIds: undefined,
    name: undefined,
    specification: undefined,
    materialQuality: undefined,
    units: undefined,
    manufacturer: undefined,
    supplier: undefined,
    color: undefined,
    level: undefined,
    copperThickness: undefined,
    length: undefined,
    width: undefined,
    fileId: undefined,
    boardThickness: undefined,
    params: {},
    actualStock:undefined,
    availableStock:undefined,
    onWayStock:undefined,
    applyNum:undefined
  },
  rules: {
    addressId: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],


  }
});
const { form:selectForm,  queryParams:selectQueryParams,  rules:selectRules } = toRefs(SelectData);
const initQueryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});


const pageChangeReturn = async(params: any) => {
   if (params) {
    queryParamsCommodity.value = params;
  }else{
    queryParamsCommodity.value={...initQueryParamsCommodity.value};
  }

  materialLoading.value = true;
  await choosePurchase(returnBorrowMaterial&&returnBorrowMaterial.type=='1',true);
  materialLoading.value = false;
}
const pageChangeBorrow = async(params: any) => {
   if (params) {
    queryParamsCommodity.value = params;
  }else{
    queryParamsCommodity.value={...initQueryParamsCommodity.value};
  }
   materialLoading.value = true;
  await choosePurchase(dialogBorrowExamine.title=="物料借出");
   materialLoading.value = false;
}


const inventoryTableRef = ref();

const returnTableRef = ref();
//选中的物料
const selectInventoryList = ref<any[]>([]);

//选择物料 单选
const selectChangeEvent: VxeTableEvents.CheckboxChange<any> = ({ checked, row }) => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
      tableDataBorrowMaterial.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());

  }
}

//物料还回选择物料 单选
const returnSelectChangeEvent: VxeTableEvents.CheckboxChange<any> = ({ checked, row }) => {
  const $table = returnTableRef.value.xTableRef
  if ($table) {
      tabBackBorrowMaterial.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}
//物料还回选择物料全选
const returnSelectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = () => {
  const $table = returnTableRef.value.xTableRef
  console.log("returnSelectAllChangeEvent", $table);

  if ($table) {
      tabBackBorrowMaterial.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}
//清空勾选
const clearSelect = () => {
  nextTick(() => {
      const $table = returnTableRef.value.xTableRef
      if ($table) {
          $table.clearCheckboxRow();
      }
      //将选中的
  })


}

//选择物料全选
const selectAllChangeEvent: VxeTableEvents.CheckboxAll<any> = () => {
  const $table = inventoryTableRef.value.xTableRef
  if ($table) {
      tableDataBorrowMaterial.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
  }
}

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MaterialBorrowForm = {
  id: undefined,
  code: undefined,
  type: undefined,
  supplierId: undefined,
  submitUserId: undefined,
  submitUserName: undefined,
  auditUserId: undefined,
  auditUserName: undefined,
  addressId: undefined,
  borrowTime: undefined
}
const data = reactive<PageData<MaterialBorrowForm, MaterialBorrowQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    supplierId: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    addressId: undefined,
    borrowTime: undefined,
    params: {}
  },
  rules: {
    id: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "借料单号不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "类型 不能为空", trigger: "change" }
    ],
    supplierId: [
      { required: true, message: "借料厂家id不能为空", trigger: "blur" }
    ],
    submitUserId: [
      { required: true, message: "提交人不能为空", trigger: "blur" }
    ],
    submitUserName: [
      { required: true, message: "提交人名称不能为空", trigger: "blur" }
    ],
    auditUserId: [
      { required: true, message: "审核人不能为空", trigger: "blur" }
    ],
    auditUserName: [
      { required: true, message: "审核人名称不能为空", trigger: "blur" }
    ],
    addressId: [
      { required: true, message: "借料地址不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    quantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    suppId: [
      { required: true, message: "借料厂商不能为空", trigger: "blur" }
    ],
  }
});

const waitData = reactive<PageData<MaterialBorrowForm, MaterialBorrowQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    type: undefined,
    supplierId: undefined,
    submitUserId: undefined,
    submitUserName: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    addressId: undefined,
    borrowTime: undefined,
    params: {}
  },
  rules: {
  }
});
const { queryParams, form, rules } = toRefs(data);
const { queryParams:waitQueryParams } = toRefs(waitData);

const borrowRules = {
  addressId: [
    { required: true, message: "借料地址不能为空", trigger: "blur" }
  ],
  suppId: [
    { required: true, message: "借料厂商不能为空", trigger: "blur" }
  ],
}
//Tab正整数校验
const positiveIntValid = (cellValue: any) => {
  if (!/^[1-9]\d*$/.test(cellValue)) {
    return new Error('请输入正整数')
  }
}
const nullOrPositiveNumberWithTwoDecimals = (cellValue: any) => {
  //0|[1-9]\d*)(\.\d{1,2}
  if (!/^([1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
    return new Error('请输入数字、最多2位小数点')
  }
}
VXETable.validators.add('positiveIntValid', {
  cellValidatorMethod({ cellValue }) {
    return positiveIntValid(cellValue)
  }
})
VXETable.validators.add('nullOrPositiveNumberWithTwoDecimals', {
  cellValidatorMethod({ cellValue }) {
    return nullOrPositiveNumberWithTwoDecimals(cellValue)
  }
})
const validRules = ref<VxeTablePropTypes.EditRules>({
  returnBorrowQuantity: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals'}
  ],
  price: [
    { required: true, validator: 'nullOrPositiveNumberWithTwoDecimals' }
  ],
  storageName: [
    { required: true }
  ],
})

const outValidRules = ref<VxeTablePropTypes.EditRules>({
  returnBorrowQuantity: [
    { required: true, validator: 'positiveIntValid', message: "请输入正整数" }
  ],
  price: [
    { required: true }
  ],
  storageName: [
    { required: true }
  ],
})
const dialogBorrowExamine = reactive<DialogOption>({
  visible: false,
  title: '入'
});

const dialogRecordExamine = reactive<DialogOption>({
  visible: false,
  title: '借还记录'
});

const dialogGiveBack = reactive<DialogOption>({
  visible: false,
  title: ''
});

const dialogLendExamine = reactive<DialogOption>({
  visible: false,
  title: '出'
});

const purchaseDialog = reactive<DialogOption>({
  visible: false,
  title: '选择物料'
});

const dialogBorrowReviewExamine = reactive<DialogOption>({
  visible: false,
  title: '借料审核'
});

const tableData = ref<MaterialInventoryVO[]>([]);
const xTable = ref<VxeTableInstance<MaterialInventoryVO>>();
const xTableBorrow = ref<VxeTableInstance<MaterialInventoryVO>>();
const xTableForm = ref<VxeTableInstance<MaterialInventoryVO>>();
//借入
const inXTableBorrowMaterial = ref();
//借入
const outXTableBorrowMaterial = ref<VxeTableInstance<MaterialInventoryVO>>();

//地址
const customerAddressList = ref<CustomerAddressVO[]>([]);

const userStore = useUserStore().nickname;

const initAddressFormData: CustomerAddressForm = {
  name: undefined,
  phone: undefined,
  address: undefined
};
const addressData = reactive<PageDataAddress<CustomerAddressForm, CustomerAddressQuery>>({
  formAddress: {...initAddressFormData},
  queryParamsAddress: {
    pageNum: 1,
    pageSize: 20,
    customerId: undefined,
    name: undefined,
    phone: undefined,
    address: undefined,
    params: {}
  },
  rulesAddress: {
    name: [
      {required: true, message: "联系人不能为空", trigger: "blur"}
    ],
    phone: [
      {required: true, message: "电话不能为空", trigger: "blur"}
    ],
    address: [
      {required: true, message: "联系地址不能为空", trigger: "blur"}
    ],
    logisticsCycle: [
      {required: true, message: "物流周期不能为空", trigger: "blur"}
    ]
  }
});

const {queryParamsAddress, formAddress, rulesAddress} = toRefs(addressData);

/**
 * 物料借入
 */
let formBorrowMaterial = reactive({
  id: undefined,
  borrowUserName: userStore,
  borrowUserPhone: undefined,
  otherReceiptList: [],
  storageName: undefined,
  addressName: undefined,
  addressId: undefined,
  suppId: undefined,
});

/**
 * 物料还回
 */
let formGiveBackMaterial = reactive({
  id: undefined,
  supplierId: undefined,
  type: undefined,
  borrowUserName: undefined,
  borrowUserPhone: undefined,
  rawMaterialInvontoryId: undefined,
});
const selectedMaterialColumnList = ref([

  { type: 'checkbox', align: 'center', field: "checkbox", width: '40',fixed: 'left', },
  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '单位名称', field: 'unit', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '备注', field: 'remark', width: '80', align: 'center',  },
  { title: '实际库存', field: 'quantity', width: '80', align: 'center',fixed: 'right',},

  { title: '在途数量', field: 'inTransitNumber', width: '120', align: 'center', fixed: 'right',},

]);
const materialColumnList = ref([


  { title: '物料编码', field: 'materialCode', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料名称', field: 'name', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '物料类别', field: 'categoryName', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '单位名称', field: 'unit', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' }, },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌', field: 'manufacturer', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板厚', field: 'boardThickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长', field: 'length', width: '80', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽', field: 'width', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', field: 'color', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', field: 'level', width: '80', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '备注', field: 'remark', width: '80', align: 'center',  },
  { title: '实际库存', field: 'quantity', width: '80', align: 'center',fixed: 'right',},

  { title: '在途数量', field: 'inTransitNumber', width: '120', align: 'center', fixed: 'right',},
  { title: '操作', field: 'make', width: '120', align: 'center', fixed: 'right',},

]);

const columnList = ref([
  { type: 'checkbox', fixed: 'left', width: '60', align: 'center', showOverflow: false },
  { title: "序号", fixed: 'left', width: '60', type: 'seq', align: 'center', showOverflow: false },
  { title: '单据状态', width: '80', field: 'status', align: 'center'
 },
  { title: '借料单号', width: '100', field: 'code', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '借料日期', width: '140', field: 'borrowTime', align: 'center',
    filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    } },
  { title: '借料类型', width: '80', field: 'type', align: 'center'
, filterType: 'radioButton',
    filterParam: { placeholder: '请输入类型' },
    filterData: () => type.value,
},
  { title: '物料编码', width: '80', field: 'materialCode', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称', width: '80', field: 'materialName', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '材质牌号', width: '80', field: 'materialQuality', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '板厚', width: '60', field: 'boardThickness', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '铜厚', width: '60', field: 'copperThickness', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '级别', width: '60', field: 'level', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '颜色', width: '60', field: 'color', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '长（mm）', width: '60', field: 'length', align: 'center' ,
    filterType: 'input',
    filterParam: {placeholder: '请输入长（mm）',type:'number'}
  },
  { title: '宽（mm）', width: '60', field: 'width', align: 'center' ,
    filterType: 'input',
    filterParam: {placeholder: '请输入宽（mm）',type:'number'}
  },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌', width: '80', field: 'manufacturer', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '存货仓', width: '80', field: 'storageName', align: 'center'
    , filterType: 'radioButton',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => storageOptions,
    filterCustom: {label: 'name', value: 'id'}
},
  { title: '库存单位', width: '120', field: 'unit', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '数量', width: '120', field: 'quantity', align: 'center' },
  { title: '借料人', width: '80', field: 'borrowUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '联系方式', width: '80', field: 'borrowUserPhone', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '借料供应商', width: '80', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '借料地址', width: '160', field: 'addressName', align: 'center' },
  { title: '备注', width: '200', field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '140', fixed: 'right', showOverflow: false },
]);

const columnList2 = ref([
  { title: "序号", fixed: 'left', width: '60', type: 'seq', align: 'center', showOverflow: false },
  { title: '单据状态', width: '80', field: 'status', align: 'center'
    , filterType: 'checkboxButton',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => material_borrow_detail_status.value,
},
  { title: '借料单号', width: '100', field: 'code', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '借料日期', width: '140', field: 'borrowTime', align: 'center' ,
    filterType: 'intervalDate',  filterParam: {
      startParams: { placeholder: '请输入开始时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      endParams: { placeholder: '请输入结束时间', clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    }},
  { title: '借料类型', width: '80', field: 'type', align: 'center'
 , filterType: 'radioButton',
    filterParam: { placeholder: '请输入类型' },
    filterData: () => type.value,
},
  { title: '物料编码', width: '80', field: 'materialCode', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '物料名称', width: '80', field: 'materialName', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '材质牌号', width: '80', field: 'materialQuality', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '板厚', width: '60', field: 'boardThickness', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '铜厚', width: '60', field: 'copperThickness', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '级别', width: '60', field: 'level', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', width: '60', field: 'color', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '长（mm）', width: '60', field: 'length', align: 'center' ,
    filterType: 'input',
    filterParam: {placeholder: '请输入长（mm）',type:'number'}},
  { title: '宽（mm）', width: '60', field: 'width', align: 'center',
    filterType: 'input',
    filterParam: {placeholder: '请输入宽（mm）',type:'number'}
  },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '品牌', width: '80', field: 'manufacturer', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  //{ title: '生产日期', width: '120', field: 'productionDate', align: 'center' },
  { title: '存货仓', width: '80', field: 'storageId', align: 'center'
   , filterType: 'radioButton',
    filterParam: { placeholder: '请输入状态' },
    filterData: () => storageOptions,
    filterCustom: {label: 'name', value: 'id'}

},
  { title: '库存单位', width: '120', field: 'unit', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '数量', width: '120', field: 'quantity', align: 'center' },
  { title: '单价', width: '120', field: 'price', align: 'center' },
  { title: '金额', width: '120', field: 'amount', align: 'center' },
  { title: '借料人', width: '80', field: 'borrowUserName', align: 'center', filterType: 'input', filterParam: { placeholder: '' }},
  { title: '联系方式', width: '80', field: 'borrowUserPhone', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '借料供应商', width: '80', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '' } },
  { title: '借料地址', width: '160', field: 'addressName', align: 'center' , filterType: 'input', filterParam: { placeholder: '' }},
  { title: '备注', width: '200', field: 'remark', align: 'center' },
  { title: '操作', field: 'make', align: 'center', width: '240', fixed: 'right', showOverflow: false },
]);

const recordColumnList = ref([
  { title: "序号", field: 'seq', fixed: 'left', width: '60', type: 'seq', align: 'center', showOverflow: false },
  { title: '操作类型', width: '80', field: 'type', align: 'center' },
  { title: '数量', width: '120', field: 'quantity', align: 'center' },
  { title: '备注', field: 'remark', align: 'center' },
  { title: '操作时间', width: '120', field: 'createTime', align: 'center' },
  { title: '操作人员', width: '100', field: 'createByName', align: 'center' },
]);

const borrowBackColumn = ref([
  { title: "序号", field: 'seq', width: '60', type: 'seq', align: 'center', showOverflow: false },
  { title: '物料编码', width: '80', field: 'materialCode', align: 'center' },
  { title: '物料名称', width: '120', field: 'name', align: 'center' },
  { title: '材质牌号', width: '80', field: 'materialQuality', align: 'center' },
  { title: '板厚', width: '80', field: 'boardThickness', align: 'center' },
  { title: '铜厚', width: '80', field: 'copperThickness', align: 'center' },
  { title: '级别', width: '70', field: 'level', align: 'center' },
  { title: '颜色', width: '70', field: 'color', align: 'center' },
  { title: '长（mm）', width: '80', field: 'length', align: 'center' },
  { title: '宽（mm）', width: '80', field: 'width', align: 'center' },
  { title: '品牌', width: '80', field: 'manufacturer', align: 'center' },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', },
  { title: '规格型号', field: 'specification', width: '80', align: 'center',  },
  { title: '直径', field: 'diameter', width: '80', align: 'center',  },
  { title: '库存数', width: '100', field: 'inventoryQuantity', align: 'center' },
  { title: '借出/借入数量', width: '100', field: 'quantity', align: 'center' },
  { title: '单价', width: '100', field: 'borrowPrice', align: 'center' },
  { title: '金额', width: '100', field: 'borrowTotalPrice', align: 'center' },

  { title: '还回数量', width: '100', field: 'returnBorrowQuantity', align: 'center', editRender: {} ,fixed: 'right',},
  { title: '还回单价', width: '100', field: 'price', align: 'center', editRender: {} ,fixed: 'right',},
  { title: '还回总金额', width: '100', field: 'totalPrice', align: 'center',fixed: 'right', },
    { title: '备注', width: '100', field: 'remark', align: 'center', editRender: {} ,fixed: 'right',},
  { title: '操作', width: '100', field: 'make', align: 'center',fixed: 'right', },
]);

const checkedColumnList = ref([
  { title: "序号", field: 'seq', fixed: 'left', width: '50', type: 'seq', align: 'center', showOverflow: false },
  { title: '物料编码', width: '80', field: 'materialCode', align: 'center' },
  { title: '物料名称', width: '100', field: 'name', align: 'center' },
  { title: '供应商', width: '120', field: 'supplierName', align: 'center' },
  { title: '材质牌号', width: '70', field: 'materialQuality', align: 'center' },
  { title: '板厚', width: '70', field: 'boardThickness', align: 'center' },
  { title: '铜厚', width: '70', field: 'copperThickness', align: 'center' },
  { title: '级别', width: '70', field: 'level', align: 'center' },
  { title: '颜色', width: '70', field: 'color', align: 'center' },
  { title: '长（mm）', width: '70', field: 'length', align: 'center' },
  { title: '宽（mm）', width: '70', field: 'width', align: 'center' },
  { title: '品牌', width: '70', field: 'manufacturer', align: 'center' },
  { title: '厚度', field: 'thickness', width: '80', align: 'center',  },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', },
  { title: '铜厚', field: 'copperThickness', width: '80', align: 'center', },
  { title: '可用库存数', width: '80', field: 'quantity', align: 'center' },
  { title: '存货仓', width: '80', field: 'storageName', align: 'center', editRender: {} },
  // { title: '生产日期', width: '120', field: 'productionDate', align: 'center', editRender: {} },
  // { title: '保质期（天）', width: '100', field: 'expirationDays', align: 'center', editRender: {} },
  // { title: '过期日期', width: '120', field: 'expirationDate', align: 'center', editRender: {} },
  { title: '数量', width: '120', field: 'returnBorrowQuantity', align: 'center', editRender: {} },
  { title: '备注', width: '150', field: 'remark', align: 'center', editRender: {} },
  { title: '操作', width: '120', field: 'make', align: 'center' ,fixed: 'right',},
]);

const outCheckedColumnList = ref([
  { title: "序号", field: 'seq', fixed: 'left', width: '50', type: 'seq', align: 'center', showOverflow: false },
  { title: '物料编码', width: '80', field: 'materialCode', align: 'center' },
  { title: '物料名称', width: '100', field: 'name', align: 'center' },
  { title: '供应商', width: '120', field: 'supplierName', align: 'center' },
  { title: '材质牌号', width: '60', field: 'materialQuality', align: 'center' },
  { title: '板厚', width: '60', field: 'boardThickness', align: 'center' },
  { title: '铜厚', width: '60', field: 'copperThickness', align: 'center' },
  { title: '级别', width: '60', field: 'level', align: 'center' },
  { title: '颜色', width: '60', field: 'color', align: 'center' },
  { title: '长（mm）', width: '60', field: 'length', align: 'center' },
  { title: '宽（mm）', width: '60', field: 'width', align: 'center' },
  { title: '品牌', width: '60', field: 'manufacturer', align: 'center' },
  // { title: '生产日期', width: '120', field: 'productionDate', align: 'center'  },
  // { title: '保质期（天）', width: '100', field: 'expirationDays', align: 'center'  },
  // { title: '过期日期', width: '120', field: 'expirationDate', align: 'center' },
  { title: '存货仓', width: '100', field: 'storageName', align: 'center' },
  { title: '可用库存数', width: '120', field: 'quantity', align: 'center' },
  { title: '借出数量', width: '120', field: 'returnBorrowQuantity', align: 'center', editRender: {} },
  { title: '备注', width: '150', field: 'remark', align: 'center', editRender: {} },
  { title: '操作', width: '120', field: 'make', align: 'center' },
]);

// 借料审核弹框表格
const columnListBorrowProcess = ref([
{ type: 'seq',title: '序号',align: 'center', fixed: 'left' },
{ title: '借料类型',field: 'type',align: 'center',  },
{ title: '物料编码',field: 'materialCode',align: 'center',  },
{ title: '物料名称',field: 'materialName',align: 'center',  },
{ title: '材质牌号',field: 'materialQuality',align: 'center',  },
{ title: '板厚',field: 'boardThickness',align: 'center',  },
{ title: '铜厚',field: 'copperThickness',align: 'center',  },
{ title: '颜色',field: 'color',align: 'center',  },
{ title: '级别',field: 'level',align: 'center',  },
{ title: '长',field: 'length',align: 'center',  },
{ title: '宽',field: 'width',align: 'center',  },
{ title: '品牌',field: 'manufacturer',align: 'center',  },
{ title: '存货仓',field: 'storageName',align: 'center',  },
{ title: '库存数',field: 'inventoryQuantity',align: 'center',  },
{ width: '70',title: '单价',field: 'price',editRender: {},align: 'center',  },
{ title: '数量',field: 'quantity',align: 'center',  },
{ title: '金额',field: 'totalPrice',align: 'center',  },
{ title: '借料人',field: 'borrowUserName',align: 'center',  },
{ title: '联系方式',field: 'borrowUserPhone',align: 'center',  },
{ width: '70',title: '借料供应商',field: 'supplierName',align: 'center',  },
{ width: '90',title: '借料供应商地址',field: 'addressName',align: 'center',  },
{ width: '70',title: '操作',align: 'center', field: 'make', fixed: 'right' },
]);
// 获取 搜索条件
const searchWaitChange = (params: any) => {
  waitQueryParams.value = params
  getWaitList();
}

const searchChange = (params: any) => {
    if (params) {
    if (params.status && Array.isArray(params.status)) {
       params.statusList = params.status.join(",");
       params.status = undefined;
    }
  }
  queryParams.value = params
  getList()
}

/**
 * 物料借入
 */
const handleBorrow = async () => {
  tableDataBorrowMaterial.value = [];
  customerAddressList.value = [];
  formBorrowMaterial.borrowUserPhone = "";
  formBorrowMaterial.addressId = "";
  formBorrowMaterial.suppId = "";
  formBorrowMaterial.borrowUserName = userStore;
  const $table = inXTableBorrowMaterial.value;
  if ($table) {
    if ($table.xTableRef) {
      $table.xTableRef.clearCheckboxRow();
    } else {
      $table.clearCheckboxRow();
    }
  }
  queryParamsCommodity.value={pageNum: 1,pageSize: 20,params: {}}
selectQueryParams.value.pageNum = 1;
selectQueryParams.value.pageSize = 20;

  choosePurchase();
  getSupplierLists();
  alreadySelectPurchase.value = []
  dialogBorrowExamine.visible = true;
  dialogBorrowExamine.title = "物料借入";
  checkedColumnList.value[17].title = '借入数量';
  loading.value = false;
}


const tableDataBorrowList = ref<MaterialBorrowVO[]>([]);

/**
 * 借料审核按钮弹窗
 */
const borrowingMaterialReview = async () => {
  const $table = xTableForm.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (selectRecords.length < 1) {
      proxy?.$modal.msgError("请先选择待审核列表");
      return;
    }
    tableDataBorrowList.value = selectRecords;
  }
  loading.value=false;
  dialogBorrowReviewExamine.visible = true;
}

const cancelAddress = () => {
  resetAddress();
  addressDialog.visible = false;
};

//地址提交
const submitAddress = () => {
  let supId:any = "";
  if(dialogBorrowExamine.visible){
    supId = formBorrowMaterial.suppId
  }
  if(dialog.visible){
    supId = form.value.supplierId
  }
  customerAddressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      formAddress.value.type = '3';
      formAddress.value.supplierId = supId
      if (customerAddressList.value.length == 0) {
        formAddress.value.isDefault = 2;
      } else {
        formAddress.value.isDefault = 1;
      }
      await addCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("保存成功");
      addressDialog.visible = false;
      queryAddressName(supId);
      // getAddressList(formInline.customerId);
    }
  });
};

const resetAddress = () => {
  formAddress.value = {...initAddressFormData};
  customerAddressFormRef.value?.resetFields();
};

const customerAddressFormRef = ref<ElFormInstance>();

const addressDialog = reactive<DialogOption>({
  visible: false,
  title: ""
});

//新增地址按钮操作
const handleAddAddress = () => {
  resetAddress();
  if((dialogBorrowExamine.visible && (formBorrowMaterial.suppId == undefined || formBorrowMaterial.suppId == "")) || (dialog.visible && (form.value.supplierId == undefined || form.value.supplierId == ""))){
    ElMessage.error("请先选择厂商再为其添加地址")
    return;
  }
  addressDialog.title = "添加地址";
  addressDialog.visible = true;
};


/**
 * 物料借出
 */
const handlelend = async () => {
  tableDataBorrowMaterial.value = [];
  customerAddressList.value = [];
  formBorrowMaterial.borrowUserPhone = "";
  formBorrowMaterial.addressId = "";
  formBorrowMaterial.suppId = "";
  formBorrowMaterial.borrowUserName = userStore;
  const $table = outXTableBorrowMaterial.value;
  if ($table) {
    $table.xTableRef.clearCheckboxRow();
  }
  queryParamsCommodity.value={pageNum: 1,pageSize: 20,params: {}}
selectQueryParams.value.pageNum = 1;
selectQueryParams.value.pageSize = 20;
  choosePurchase(true);
  getSupplierLists();
  alreadySelectPurchase.value = []
  // dialogLendExamine.visible = true;
   dialogBorrowExamine.visible = true;
  dialogBorrowExamine.title = "物料借出";
    checkedColumnList.value[17].title = '借出数量';
  loading.value = false;
}

const queryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});
/**
 * 选择物料
 */
const choosePurchase = async (isGreaterThanZero?:boolean,isFirst?:boolean) => {
  if(isGreaterThanZero){
    queryParamsCommodity.value.isGreaterThanZero='1'
  }else{
    queryParamsCommodity.value.isGreaterThanZero='0'
  }
  if(isFirst){
    queryParamsCommodity.value.firstRawMaterialId = returnBorrowMaterial.value.rawMaterialId;
  }
  const res = await listMaterialInventory(queryParamsCommodity.value);
  materialInventoryList.value = res.rows;
  materialTotal.value = res.total;
  //purchaseDialog.visible = true;
}


let alreadySelectPurchase = ref<MaterialInventoryVO[]>([]);
//选择物料确认
const submitPurchase = () => {
  const list = alreadySelectPurchase.value.map((item) => {
    const materialInventoryVO: MaterialInventoryVO = reactive({
      id: "",
      materialCode: "",
      name: "",
      boardThickness: "",
      copperThickness: "",
      level: "",
      color: "",
      length: "",
      width: "",
      manufacturer: "",
      materialQuality: 0,
      supplierName: "",
      quantity: "",
      expirationDate: "",
      expirationDays: "",
      productionDate: "",
      price: "",
      storageName: "",
      rawMaterialId: "",
      storageId: "",
      supplierId: "",
    });
    Object.keys(materialInventoryVO).forEach((info) => {
      materialInventoryVO[info] = item[info] ? item[info] : materialInventoryVO[info];
    })
    //不重复添加
    if (tableDataBorrowMaterial.value.findIndex((item) => item.id == materialInventoryVO.id) == -1) {
      tableDataBorrowMaterial.value.push(materialInventoryVO);
    }
  })
  console.log("tableDataBorrowMaterial.value", tableDataBorrowMaterial.value);
  // cancelPurchase();
}

//移除已选订单
const removeDataOrder = (data: MaterialInventoryVO) => {
  var index = alreadySelectPurchase.value.indexOf(data);
  if (index > -1) {
    alreadySelectPurchase.value.splice(index, 1);
  }
  purchaseTable.value.toggleRowSelection(data, false);
}

/** 查询物料借料管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialBorrow(queryParams.value);
  allMaterialBorrowList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}
const getWaitList = async () => {
  waitLoading.value = true;
  waitQueryParams.value.status='2'
  const res = await listMaterialBorrow(waitQueryParams.value);
  materialBorrowList.value = res.rows;
  auditTotal.value = res.total;
  waitLoading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  materialBorrowFormRef.value?.resetFields();
}


/** 多选框选中数据 */
const handleSelectionChange = (selection: MaterialBorrowVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialBorrowVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialBorrow(_id);
  Object.assign(form.value, res.data);
  queryAddressName(form.value.supplierId);
  console.log(res.data);
  dialog.visible = true;
  dialog.title = "修改物料借料管理";
}

//仓库
let storageOptions: MaterialStorageVO[] = [];

//还回对象
const returnBorrowMaterial = ref<MaterialInventoryVO>({});
/**
 * 物料还回
 */
const handleGiveBack = async (row?: MaterialBorrowVO) => {
  returnBorrowMaterial.value=row;
  tabBackBorrowMaterial.value = [];
  formGiveBackMaterial.borrowUserName=undefined;
  formGiveBackMaterial.borrowUserPhone=undefined;

  queryParamsCommodity.value={pageNum: 1,pageSize: 20,params: {}}
selectQueryParams.value.pageNum = 1;
selectQueryParams.value.pageSize = 20;
  choosePurchase(row && row.type == '1',true);

  const materialInventoryVO: MaterialInventoryVO = reactive({
    id: "",
    materialCode: "",
    name: "",
    boardThickness: "",
    copperThickness: "",
    level: "",
    color: "",
    length: "",
    width: "",
    manufacturer: "",
    materialQuality: 0,
    supplierName: "",
    quantity: "",
    expirationDate: "",
    expirationDays: "",
    productionDate: "",
    price: "",
    storageName: "",
    rawMaterialId: "",
    storageId: "",
    supplierId: "",
    materialName: "",
    rawMaterialInvontoryId: "",
    inventoryQuantity: "",
     specification: "",
    diameter: "",
    thickness: "",
    borrowPrice:0,
    borrowTotalPrice:0
  });
  Object.keys(materialInventoryVO).forEach((info) => {
    materialInventoryVO[info] = row[info] ? row[info] : materialInventoryVO[info];
    materialInventoryVO['name'] = row['materialName'] ? row['materialName'] : materialInventoryVO['name'];
  })
  // materialInventoryVO
  tabBackBorrowMaterial.value.push(materialInventoryVO);
  //还回单小于0则默认为0
  tabBackBorrowMaterial.value.forEach(item=>{
    item.price=item.price&&Number(item.price)>0?item.price:0;
    item.borrowPrice=item.price&&Number(item.price)>0?item.price:0;
    let _total=0;
    if(item.borrowPrice&&item.quantity){
      _total=Number(item.borrowPrice)*Number(item.quantity)
    }
    item.borrowTotalPrice=_total.toFixed(2);
  })
  getSupplierLists();
  formGiveBackMaterial.type = row?.type;
  formGiveBackMaterial.rawMaterialInvontoryId = row.rawMaterialInvontoryId;
  formGiveBackMaterial.supplierId = row?.supplierId
  formGiveBackMaterial.id = row?.id
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
  dialogGiveBack.visible = true;
  clearSelect();
}


const deleteBorrowBack = (row: MaterialInventoryVO, index: number) => {
  console.log(row, index);
  ElMessageBox.confirm("您确定要删除该记录吗?", "提示",
    {
      confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
    })
    .then(() => {
      ElMessage({ type: "success", message: "删除成功" });
      tabBackBorrowMaterial.value.splice(index, 1);//删除该行记录
    })
    .catch(() => {
      ElMessage({ type: "info", message: "取消删除" });
    });
};
/**
 * 审核按钮
 */
const handleExamine = async (row?: MaterialBorrowVO) => {
  loading.value=false;
  tableDataBorrowList.value = [];
  tableDataBorrowList.value.push(row);
  dialogBorrowReviewExamine.visible = true;
}

/** 提交按钮操作 */
const handleBorrowUpdate = async (row?: MaterialBorrowVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  proxy?.$modal.loading('加载中...');
  const res = await updatePurchaseMaterialBorrow(_id).finally(() => proxy?.$modal.closeLoading());
  Object.assign(form.value, res.data);
  proxy?.$modal.msgSuccess("提交成功");
  await getList();
}

/** 提交按钮 */
const submitForm = () => {
  materialBorrowFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialBorrow(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMaterialBorrow(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialBorrowVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除物料借料管理编号为"' + row.code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delMaterialBorrow(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}


/**
 * 保存
 * @param row
 */
const saveRowEvent = (row: MaterialInventoryVO) => {
  console.log(row)
  const $table = xTable.value;
  if ($table) {
    $table.clearEdit().then(() => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
        VXETable.modal.message({ content: `保存成功！name=${row.materialCode}`, status: "success" });
      }, 300);
    });
  }
};



/**
 * 计算总金额
 */
const totalPriceCount = async (row: any) => {
  row.totalPrice = Number(row.price) * Number(row.quantity)
}
/**
 * 计算还回数量的总金额
 */
const totalPriceAmount = async (row: any) => {
  console.log("totalPriceAmount", row)
  row.totalPrice = Number(row.price * row.returnBorrowQuantity).toFixed(2);
}

const totalAmount = async (row: any) => {
  console.log("totalAmount", row)
  row.amount = Number(row.price * row.quantity).toFixed(2);
}

const inventoryCheck = ref(false);
const inventoryRes = ref<any[]>([]);
/**
 *审核通过
 */
const saveRejectBorrow = async () => {
  if (tableDataBorrowList.value.length < 1) {
    proxy?.$modal.msgError("请先选择待审核数据");
    return;
  }
  // 查询是否存在盘点中物料
  let ids = tableDataBorrowList.value.map(item => item.rawMaterialId);
  let query = {
    pageNum: 1,
    pageSize: 20,
    idList: ids,
    isCheck: '1'
  }
  const res = await listMaterialInventoryInfo(query);
  if (res.rows && res.rows.length > 0) {
    inventoryRes.value = res.rows;
    inventoryCheck.value = true;
    return;
  }

  const directMaterialReject: DirectMaterialReject = {
    tableDataBorrowList: [],
  };
  directMaterialReject.tableDataBorrowList = tableDataBorrowList.value;
  buttonLoading.value = true;
  await saveRejectBorrowDetail(directMaterialReject).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("通过成功");
  dialogBorrowReviewExamine.visible = false;
  await getWaitList();
}

/**
 * 借还记录
 */
const handleRecord = async (row: any) => {
  materialBorrowList.value = [];
  let _title = "借还记录";
  console.log("row", row)
  //getBorrowRecord();
  let obj = {
    id: row.id
  }
  let res = await getBorrowRecordDetail(obj);
  tabRecordBorrowMaterial.value = res;
  dialogRecordExamine.title = row.materialCode + '-' + _title;
  dialogRecordExamine.visible = true;
}
/**
 * 审核驳回
 */
const updateRejectBorrow = async () => {
  if (tableDataBorrowList.value.length < 1) {
    proxy?.$modal.msgError("请先选择待审核数据");
    return;
  }
  const directMaterialReject: DirectMaterialReject = {
    tableDataBorrowList: [],
  };
  directMaterialReject.tableDataBorrowList = tableDataBorrowList.value;
  buttonLoading.value = true;
  await updateMaterialReject(directMaterialReject).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("驳回成功");
  dialogBorrowReviewExamine.visible = false;
  await getWaitList();
}

/**
 * 物料借入报存按钮
 */
const saveRawMaterialBorrow = async (status: string, type: string) => {
  if (tableDataBorrowMaterial.value.length < 1) {
    proxy?.$modal.msgError("请先选择物料");
    return;
  }

  //借入校验
  let _valid = true;
  if (dialogBorrowExamine.title=="物料借入") {
    type = "1";
  } else {
    type = "2";
  }
  await inBorrowFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      _valid = false;
    }
  });

  //明细校验
  const $table = inXTableBorrowMaterial.value.xTableRef;
  if ($table) {
    let errMap = await $table.validate(true);
    if (errMap) {
      _valid = false;
    }
  }


  if (!_valid) {
    return;
  }
  const directMaterialBorrow: DirectMaterialBorrow = {
    tableDataBorrowMaterial: [],
    borrowUserName: "",
    borrowUserPhone: "",
    addressName: "",
    addressId: "",
    suppId: "",
    status: '',
    type: '',
  };
  directMaterialBorrow.tableDataBorrowMaterial = tableDataBorrowMaterial.value;
  directMaterialBorrow.borrowUserPhone = formBorrowMaterial.borrowUserPhone;
  directMaterialBorrow.addressId = formBorrowMaterial.addressId;
  directMaterialBorrow.suppId = formBorrowMaterial.suppId;
  directMaterialBorrow.status = status;
  directMaterialBorrow.type = type;
  buttonLoading.value = true;
  await saveRawMaterialBorrowDetail(directMaterialBorrow).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("保存成功");
  dialogBorrowExamine.visible = false;
  dialogLendExamine.visible = false;
  await getList();

}

/**
 * 还回提交
 */
const saveInventoryBorrow = async () => {
  if (tabBackBorrowMaterial.value.length < 1) {
    proxy?.$modal.msgError("请先选择物料");
    return;
  }
  let ids = tabBackBorrowMaterial.value.map(item => item.rawMaterialId);
  let query = {
    pageNum: 1,
    pageSize: 20,
    idList: ids,
    isCheck: '1'
  }
  const res = await listMaterialInventoryInfo(query);
  if (res.rows && res.rows.length > 0) {
    inventoryRes.value = res.rows;
    inventoryCheck.value = true;
    return;
  }

  if (formGiveBackMaterial.borrowUserName == null) {
    proxy?.$modal.msgError("请输入还料人");
    return;
  }
  const _table = xTableBorrowBackMaterialRef.value.xTableRef;
  let errMap = await _table.validate(true);
  if (errMap) {
    return;
  }

  const flag = tabBackBorrowMaterial.value.some(v => v.returnBorrowQuantity == null);
  if (flag) {
    proxy?.$modal.msgError("还回数量不能为空");
    return;
  }
  const flag2 = tabBackBorrowMaterial.value.some(v => v.price == null);
  if (flag2) {
    proxy?.$modal.msgError("还回单价不能为空");
    return;
  }

  const directMaterialBorrow: DirectMaterialBorrow = {
    tableDataBorrowMaterial: [],
    rawMaterialInvontoryId: undefined,
    borrowUserName: undefined,
    borrowUserPhone: undefined,
    type: undefined,
    id: undefined,
    supplierId: undefined,
  };
  directMaterialBorrow.type = formGiveBackMaterial.type;
  directMaterialBorrow.id = formGiveBackMaterial.id;
  directMaterialBorrow.supplierId = formGiveBackMaterial.supplierId;
  directMaterialBorrow.borrowUserName = formGiveBackMaterial.borrowUserName;
  directMaterialBorrow.borrowUserPhone = formGiveBackMaterial.borrowUserPhone;
  directMaterialBorrow.rawMaterialInvontoryId = formGiveBackMaterial.rawMaterialInvontoryId;
  directMaterialBorrow.tableDataBorrowMaterial = tabBackBorrowMaterial.value;
  buttonLoading.value = true;
  await savaInventoryBorrowDetail(directMaterialBorrow).finally(() => buttonLoading.value = false);
  proxy?.$modal.msgSuccess("保存成功");
  dialogGiveBack.visible = false;
  await getList();


}


/**
 * 删除 物料审核删除
 * @param row
 * @param index
 */
const deleteRowEventBorrow = (row: MaterialInventoryVO, index: number) => {
  ElMessageBox.confirm(
    "您确定要删除该记录吗?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
   const id = row?.id;
  //删除已选物料
  tableDataBorrowMaterial.value = tableDataBorrowMaterial.value.filter(item => item.id != id);

 const $table =  inventoryTableRef.value.xTableRef;
  if ($table) {
    $table.setCheckboxRow(row, false);
  }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};

/**
 * 删除 物料审核删除
 * @param row
 * @param index
 */
const deleteRowEventReturn = (row: MaterialInventoryVO, index: number) => {
  ElMessageBox.confirm(
    "您确定要删除该记录吗?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
   const id = row?.id;
  //删除已选物料
  tabBackBorrowMaterial.value = tabBackBorrowMaterial.value.filter(item => item.id != id);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};
/**
 * 物料还回添加物料
 * @param row
 * @param index
 */
const addRowEventReturn = (row: MaterialInventoryVO, index: number) => {

   const rawMaterialId = row?.rawMaterialId;
  //已选物料
  let check = tabBackBorrowMaterial.value.find(item => item.rawMaterialId == rawMaterialId);
  if (check) {
    proxy?.$modal.msgError("已选择该物料");
    return;
  }else{
    row.inventoryQuantity = row.quantity;

    row.borrowPrice=row.price&&Number(row.price)>0?row.price:0;
    let _total=0;
    if(row.borrowPrice&&row.quantity){
      _total=Number(row.borrowPrice)*Number(row.quantity)
    }
    row.borrowTotalPrice=_total.toFixed(2);

    tabBackBorrowMaterial.value.push(row);
  }

};
/**
 * 删除 物料审核删除
 * @param row
 * @param index
 */
const deleteRowEvent = (row: MaterialInventoryVO, index: number) => {
  // const type = await VXETable.modal.confirm('您确定要删除该数据?');
  ElMessageBox.confirm(
    "您确定要删除该记录吗?",
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
      tableDataBorrowList.value.splice(index, 1);//删除该行记录
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};

const queryAddressName = async (value: string) => {
  console.log(value);
  formBorrowMaterial.addressId = undefined;
  formBorrowMaterial.addressName = undefined;
  const res = await listCustomerSupplierAddress(value);
  customerAddressList.value = res.data;

  //formBorrowMaterial.addressId
  //默认选中默认地址
  // customerAddressList.value.forEach(item => {
  //   if (item.isDefault == 1) {
  //     formBorrowMaterial.addressId = item.id;
  //     formBorrowMaterial.addressName = item.address;
  //   }
  // })

      let find = customerAddressList.value.find(item => item.isDefault === 1&&item.status==1);
      if (find) {
        formBorrowMaterial.addressId = find.id;
         formBorrowMaterial.addressName = find.address;
      } else {
        if (customerAddressList.value.length !== 0) {
           let select = customerAddressList.value.find(item => item.status==1);
           formBorrowMaterial.addressId = select.id;
           formBorrowMaterial.addressName = select.address;
        }
      }
}

/**
 * 输入生产日期保存过期日期
 * @param row
 */
const dispatchTimeChange = (row: MaterialInventoryVO) => {
  if (row.expirationDays != 0) {
    const dayjs1 = dayjs(row.productionDate);
    const dayjs2 = dayjs1.add(Number(row.expirationDays) * 24, 'hour');
    row.expirationDate = dayjs2.format("YYYY-MM-DD");
  }
}

const tabSupplierChange = (row: MaterialInventoryVO) => {
  if (row.supplierId) {
    suppliers.forEach(item => {
      if (item.id == row.supplierId) {
        row.supplierName = item.supplierName
      }
    })
  }
}

const tabStorageChange = (row: MaterialInventoryVO) => {
  if (row.storageId) {
    storageOptions.forEach(item => {
      if (item.id == row.storageId) {
        row.storageName = item.name
      }
    })
  }
}
/**
 * 变更保质期
 * @param row
 */
const expirationTimeChange = (row: MaterialInventoryVO) => {
  if (row.productionDate != null) {
    const dayjs1 = dayjs(row.productionDate);
    const dayjs2 = dayjs1.add(Number(row.expirationDays) * 24, 'hour');
    row.expirationDate = dayjs2.format("YYYY-MM-DD");
  }

}

/**
 * 供应商
 */
let suppliers: SupplierVO[] = [];
const getSupplierLists = async () => {
  const res = await listSupplierNoPage();
  console.log(res);
  suppliers = res;
  suppliers.forEach(item => {
    item.supplierName = String(item.supplierName)
  })
}

const getStorageOptions = async () => {
  const storageResponse: any = await listMaterialStorage();
  storageOptions = storageResponse.rows;
}
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = decryptBase64ByStr(newVal)
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      let tab = !isNaN(Number(params.tab)) ? Number(params.tab) : 1;
      editableTabsValue.value = tab
      let tempColumnList = [{field: 'code', defaultValue: params.bizNo}]
      if (tab === 1) {
        waitQueryParams.value.code = params.bizNo
        setTimeout(() => {
          xTableForm.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === 2) {
        queryParams.value.orderCode = params.bizNo
        setTimeout(() => {
          xTable.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
    //等于1代表查询待收货列表
    queryParams.value.statusType = "1";
    getWaitList();
    getSupplierLists();
    getStorageOptions();
});
</script>
