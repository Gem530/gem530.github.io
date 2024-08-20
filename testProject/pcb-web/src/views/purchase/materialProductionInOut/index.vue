<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs type="border-card" v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="排产列表" :name="1">
          <XTable toolId="purchaseMaterialProductionInOutProd" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="getProductionInOutList"
                  :columnList="columnList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  :loading="loading"
                  @searchChange="searchChange"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
          >
            <template #default-planType="scope">
              <dict-tag :options="mi_type" :value="scope.row.planType"/>
            </template>
            <template #default-isRemediation="scope">
              <dict-tag :options="is_remediation_type" :value="scope.row.isRemediation"/>
            </template>
            <template #default-make="scope">
                <el-button link type="primary" @click="handleIssuance(scope.row)"
                           >发料
                </el-button>
                <el-button link type="primary" @click="handleSelect(scope.row)"
                           >发料/退料记录
                </el-button>
            </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="发料记录" :name="3">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBefore">导出</el-button>
          </div>
          <XTable toolId="purchaseMaterialProductionInOutSend" v-model:page-size="queryParamsRecord.pageSize" height="100%" class="xtable-content"
                  v-model:current-page="queryParamsRecord.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="materialProductionInOutList"
                  :intervalCondition="['inOutTime']"
                  :columnList="columnIssuanceList"
                  ref="XTableRef"
                  border :showRefresh="true"
                  :loading="loading"
                  @searchChange="searchChangeRecord"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
          >
            <template #default-make="scope">
              <el-button link type="primary" v-if="Number(scope.row.returnQuantity)<Number(scope.row.quantity)" @click="handleMaterialReturn(scope.row)"
                         >退料
              </el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="退料记录" :name="2">
          <div class="p-2" style="text-align: right;width: 100%">
            <el-button :loading="buttonLoading" type="primary" @click="exportExcelBeforeReturn">导出</el-button>
          </div>
          <XTable toolId="purchaseMaterialProductionInOutReturn" v-model:page-size="queryParamsReturn.pageSize" height="100%" class="xtable-content"
                  v-model:current-page="queryParamsReturn.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="materialProductionInOutListReturn"
                  :columnList="columnReturnList"
                  :intervalCondition="['inOutTime']"
                  ref="XTableRef"
                  border :showRefresh="true"
                  :loading="loading"
                  @searchChange="searchChangeReturn"
                  :column-config="{ resizable: true }"
                  @checkbox-all="selectChangeEvent"
                  @checkbox-change="selectChangeEvent"
                  :checkbox-config="{reserve: true }"
                  :row-config="{ keyField:'id' }"
          >
          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 生产物料 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" title="生产物料发料" center size="95%">
      <div v-loading="dialogTableLoading">
      <el-form ref="materialProductionInOutFormRef" :model="formInline" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="发料人：">
              <!--当前登录用户-->
              <el-input v-model="formInline.inOutUser" placeholder="发料人" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="发料时间：">
              <el-input v-model="formInline.createTime" placeholder="发料时间" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">投料信息</el-divider>
      <vxe-table
          border
          keep-source
          align="center"
          height="220px"
          show-footer="true"
          show-overflow
          show-header-overflow
          :loading="loading"
          ref="xTableDelivery"
          :column-config="{resizable: true}"
          :data="otherProductionList"
          :edit-config="{trigger: 'click', mode: 'row', autoClear: true, showStatus: true}"
      >
        <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column align="center" type="expand" width="40" :fixed="expandFixed">
          <template #content="{ row, rowIndex }">
            <div class="expand-wrapper">
              <vxe-table border :data="row.planPnlVoList">
                <vxe-column label="${}" align="center" prop="id" v-if="false"/>
                <vxe-column field="name" title="PNL名称"></vxe-column>
                <vxe-column field="pnlLength" title="长"></vxe-column>
                <vxe-column field="pnlWidth" title="宽"></vxe-column>
                <vxe-column field="commodityCode" title="产品编码">
                  <template #="{row}">
                    <div v-for="item in row.pnlSetBoList" :key="item.id">{{ item?.saleOrderBo?.commodityCode }}</div>
                  </template>
                </vxe-column>
                <vxe-column field="pnlPerScheme" title="pnl/大料">
                </vxe-column>
                <vxe-column field="quantity" title="set/pnl">
                  <template #="{row}">
                    <div v-for="item in row.pnlSetBoList" :key="item.id">{{ item?.quantity }}</div>
                  </template>
                </vxe-column>
                <vxe-column field="pcsPerScheme" title="pcs/大料">
                  <template #="{row}">
                    <div v-for="item in row.pnlSetBoList" :key="item.id">{{ item?.pcsPerScheme }}</div>
                  </template>
                </vxe-column>
                <vxe-column field="pcsPerPnl" title="pcs/pnl">
                  <template #="{row}">
                    <div v-for="item in row.pnlSetBoList" :key="item.id">{{ item?.pcsPerPnl }}</div>
                  </template>
                </vxe-column>
              </vxe-table>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="name" title="开料方案" width="90px">
          <template #edit="{ row }">
            <el-input v-model="row.name"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="rawMaterial.boardThickness" title="板厚">
          <template #edit="{ row }">
            <el-input v-model="row.rawMaterial.boardThickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="rawMaterial.copperThickness" title="铜厚">
          <template #edit="{ row }">
            <el-input v-model="row.rawMaterial.copperThickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="rawMaterial.name" title="板材">
          <template #edit="{ row }">
            <el-input v-model="row.rawMaterial.name"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="rawMaterial.manufacturer" title="品牌">
          <template #edit="{ row }">
            <el-input v-model="row.rawMaterial.manufacturer"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="rawMaterial.length" title="长（mm）">
          <template #edit="{ row }">
            <el-input v-model="row.rawMaterial.length"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="rawMaterial.width" title="宽（mm）">
          <template #edit="{ row }">
            <el-input v-model="row.rawMaterial.width"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="schemeArea" title="投料面积(㎡)">
          <template #edit="{ row }">
            <el-input v-model="row.schemeArea"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="feedQuantity" title="实投数">
          <template #edit="{ row }">
            <el-input v-model="row.feedQuantity"></el-input>
          </template>
        </vxe-column>
      </vxe-table>
      <el-divider content-position="left">物料信息</el-divider>
      <div>
        <el-button link @click="choosePurchase">
          <el-icon>
            <FolderDelete/>
          </el-icon>
          选择物料
        </el-button>
      </div>
      <vxe-table
          border
          keep-source
          align="center"
          height="260px"
          :edit-rules="validRules"
          show-overflow
          show-header-overflow
          :loading="loading"
          ref="xTable"
          :column-config="{resizable: true}"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'row', autoClear: true, showStatus: true}"
      >
        <vxe-column type="seq" title="序号"></vxe-column>
        <vxe-column field="categoryName" title="物料类别" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.categoryName"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="materialCode" title="物料编码" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.materialCode"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="name" title="物料名称" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.name"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="materialQuality" title="材质牌号" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.materialQuality"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="boardThickness" title="板厚" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.boardThickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="copperThickness" title="铜厚" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.copperThickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="level" title="级别" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.level"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="color" title="颜色" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.color"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="length" title="长（mm）" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.length"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="width" title="宽（mm）" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.width"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="manufacturer" title="品牌" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.manufacturer"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="diameter" title="直径" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.diameter"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="thickness" title="板厚" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.thickness"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="specification" title="规格型号" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.specification"></el-input>
          </template>
        </vxe-column>
<!--        <vxe-column field="productionDate" title="生产日期" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.productionDate"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="expirationDays" title="保质期（天）" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.expirationDays"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="expirationDate" title="过期日期" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.expirationDate"></el-input>
          </template>
        </vxe-column>-->
        <vxe-column field="unit" title="库存单位" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.unit"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="quantity" title="库存数" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.quantity"></el-input>
          </template>
        </vxe-column>
        <!--        <vxe-column field="quantity" title="可用库存数">
                  <template #edit="{ row }">
                    <el-input v-model="row.quantity"></el-input>
                  </template>
                </vxe-column>-->
        <vxe-column field="inTransitNumber" title="在途数" width="80">
          <template #edit="{ row }">
            <el-input v-model="row.inTransitNumber"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="producedQuantity" title="发料数量" :edit-render="{}" width="80">
          <template #edit="{ row }">
            <el-input-number v-model="row.producedQuantity" style="width: 100%" :min="0" :controls="false"></el-input-number>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" sort-type="string" :edit-render="{}" width="120">
          <template #edit="{ row }">
            <el-input v-model="row.remark"></el-input>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row,rowIndex}">
            <el-button size="small" type="primary" link @click="deleteRowEvent(row,rowIndex)">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitProductionInOut">确 定</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <!-- 发料退料记录 -->
    <el-drawer :title="dialogRecord.title" v-model="dialogRecord.visible" title="发料/退料记录" center size="85%">
      <div v-loading="dialogTableLoading">
        <el-divider content-position="left">发料信息</el-divider>
        <div class="global-flex flex-end">发料总数：{{issuanceQuantityTotal}}</div>
        <vxe-table
            border
            keep-source
            align="center"
            height="345px"
            show-overflow
            show-header-overflow
            :loading="loading"
            ref="xTableDelivery"
            :column-config="{resizable: true}"
            :data="materialProductInoutList"
        >
          <vxe-column type="seq" title="序号"></vxe-column>
          <vxe-column field="categoryName" title="物料类别" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.categoryName"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="materialCode" title="物料编码" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.materialCode"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="materialName" title="物料名称" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.materialName"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="materialQuality" title="材质牌号" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.materialQuality"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="boardThickness" title="板厚">
            <template #edit="{ row }">
              <el-input v-model="row.boardThickness"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="copperThickness" title="铜厚">
            <template #edit="{ row }">
              <el-input v-model="row.copperThickness"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="color" title="颜色">
            <template #edit="{ row }">
              <el-input v-model="row.color"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="level" title="级别">
            <template #edit="{ row }">
              <el-input v-model="row.level"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="length" title="长（mm）">
            <template #edit="{ row }">
              <el-input v-model="row.length"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="width" title="宽（mm）">
            <template #edit="{ row }">
              <el-input v-model="row.width"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="manufacturer" title="品牌">
            <template #edit="{ row }">
              <el-input v-model="row.manufacturer"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="unit" title="库存单位">
            <template #edit="{ row }">
              <el-input v-model="row.unit"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="inventoryQuantity" title="库存数">
            <template #edit="{ row }">
              <el-input v-model="row.inventoryQuantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="inventoryQuantity" title="可用库存数">
            <template #edit="{ row }">
              <el-input v-model="row.inventoryQuantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="inTransitNumber" title="在途数">
            <template #edit="{ row }">
              <el-input v-model="row.inTransitNumber"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="quantity" title="发料数量">
            <template #edit="{ row }">
              <el-input v-model="row.quantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="remark" title="备注">
            <template #edit="{ row }">
              <el-input v-model="row.remark"></el-input>
            </template>
          </vxe-column>
        </vxe-table>
        <el-divider content-position="left">退料信息</el-divider>
        <div class="global-flex flex-end">退料总数：{{quantityTotal}}</div>
        <vxe-table
            border
            keep-source
            align="center"
            height="545px"
            :edit-rules="validRules"
            show-overflow
            show-header-overflow
            :loading="loading"
            ref="xTable"
            :column-config="{resizable: true}"
            :data="materialProductReturnList"
        >
          <vxe-column type="seq" title="序号"></vxe-column>
          <vxe-column field="categoryName" title="物料类别" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.categoryName"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="materialCode" title="物料编码" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.materialCode"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="materialName" title="物料名称" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.materialName"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="materialQuality" title="材质牌号" width="90px">
            <template #edit="{ row }">
              <el-input v-model="row.materialQuality"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="boardThickness" title="板厚">
            <template #edit="{ row }">
              <el-input v-model="row.boardThickness"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="copperThickness" title="铜厚">
            <template #edit="{ row }">
              <el-input v-model="row.copperThickness"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="color" title="颜色">
            <template #edit="{ row }">
              <el-input v-model="row.color"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="level" title="级别">
            <template #edit="{ row }">
              <el-input v-model="row.level"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="length" title="长（mm）">
            <template #edit="{ row }">
              <el-input v-model="row.length"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="width" title="宽（mm）">
            <template #edit="{ row }">
              <el-input v-model="row.width"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="manufacturer" title="品牌">
            <template #edit="{ row }">
              <el-input v-model="row.manufacturer"></el-input>
            </template>
          </vxe-column>
<!--          <vxe-column field="productionDate" title="生产日期">
            <template #edit="{ row }">
              <el-input v-model="row.productionDate"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="expirationDays" title="保质期(天)">
            <template #edit="{ row }">
              <el-input v-model="row.expirationDays"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="expirationDate" title="过期日期">
            <template #edit="{ row }">
              <el-input v-model="row.expirationDate"></el-input>
            </template>
          </vxe-column>-->
          <vxe-column field="unit" title="库存单位">
            <template #edit="{ row }">
              <el-input v-model="row.unit"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="inventoryQuantity" title="库存数">
            <template #edit="{ row }">
              <el-input v-model="row.inventoryQuantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="inventoryQuantity" title="可用库存数">
            <template #edit="{ row }">
              <el-input v-model="row.inventoryQuantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="inTransitNumber" title="在途数">
            <template #edit="{ row }">
              <el-input v-model="row.inTransitNumber"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="quantity" title="退料数量">
            <template #edit="{ row }">
              <el-input v-model="row.quantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column field="remark" title="备注">
            <template #edit="{ row }">
              <el-input v-model="row.remark"></el-input>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
          <el-button @click="dialogRecord.visible= false">取 消</el-button>
          </span>
        </div>
      </template>
    </el-drawer>

    <el-dialog
        v-model="exportVisible"
        title="导出提示"
        width="20%"
        align-center
        destroy-on-close
    >
      <span>
        没有设置起始时间，将默认导出30天内的数据
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportVisible = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


    <!-- 生产退料 -->
    <el-dialog :title="dialogMaterialReturn.title" v-model="dialogMaterialReturn.visible" center
               width="500px" append-to-body @close="cancelReturn">
      <el-form ref="materialProductionInOutFormRef" :model="formInlineReturn" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="退料物料：">
              <!--当前登录用户-->
              <el-input v-model="formInlineReturn.materialName" placeholder="退料物料" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="退料数量：">
              <el-input-number v-model="formInlineReturn.returnQuanTity"  placeholder="请输入退料数量"
                :precision="2" style="width: 99%;"
                :controls="false" :min="0" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="备注：">
              <el-input type="textarea" v-model="formInlineReturn.remark" maxLength="1000" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center;">
          <span class="dialog-footer">
            <el-button :loading="buttonLoading" @click="cancelReturn">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitMaterialRerturn">确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>

    <!--选择物料弹窗-->
    <el-dialog v-model="purchaseDialog.visible" :title="purchaseDialog.title" :destroy-on-close="true"
               :close-on-click-modal="false" width="98%">
      <el-container>
        <el-aside width="310px" style="height:510px;overflow-y:auto;background-color: rgb(238, 241, 246)">
          <div style=" font-size:medium; font-weight:600">已选物料</div>
          <el-table :data="alreadySelectPurchase"
                    tooltip-effect="dark"
                    style="width: 100%;height: calc(100% - 40px);"
                    :show-header="false">
            <el-table-column prop="materialCode"
                             label="物料编码">
              <template #default="scope">
                {{ scope.row.materialCode }} - {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="50">
              <template #default="scope">
                <div style="text-align:center">
                  <el-button @click="removeDataOrder(scope.row)" link size="small" type="primary">X</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main style="padding:0px;overflow-x:hidden;">
          <XTable v-model:page-size="queryParamsCommodity.pageSize" height="450"
                  toolId="purchaseMaterialInventory"
            v-model:current-page="queryParamsCommodity.pageNum"
            :page-params="{ perfect: true, total: total }"
            :data="materialInventoryList"
            :columnList="materialInventoryColumnList"
            ref="purchaseTable"
            border
            :loading="loading"
            @searchChange="materialInventorySearchChange"
            :column-config="{ resizable: true }"
            @checkbox-all="handleSelectionChangePurchaseAll"
            @checkbox-change="handleSelectionChangePurchase">
          </XTable>
          <!-- :checkbox-config="{reserve:true}" -->
          <!-- <el-table ref="purchaseTable"
                    v-loading="loading"
                    :data="materialInventoryList"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    height="450"
                    :row-key="(row: any) => row.id"
                    @select="handleSelectionChangePurchase">
            <el-table-column type="selection"
                             width="45"
                             :reserve-selection="true"
                             align="center"
                             fixed>
            </el-table-column>
            <el-table-column prop="materialCode"
                             width="90"
                             label="物料编码"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="name"
                             width="100"
                             label="物料名称"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="boardThickness"
                             width="60"
                             label="板厚"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="copperThickness"
                             width="60"
                             label="铜厚"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="level"
                             width="70"
                             label="级别"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="color"
                             width="60"
                             label="颜色"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="length"
                             width="70"
                             label="长(mm)"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="width"
                             width="70"
                             label="宽(mm)"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="manufacturer"
                             width="70"
                             label="品牌"
                             :show-overflow-tooltip="true"
                             align="center">
            </el-table-column>
            <el-table-column prop="materialQuality"
                             label="材质牌号"
                             align="center"
                             min-width="70"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="unit"
                             label="单位"
                             align="center"
                             min-width="60"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="productionDate"
                             label="生产日期"
                             align="center"
                             min-width="80"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="expirationDays"
                             width="90"
                             align="center"
                             label="保质期(天)"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="expirationDate"
                             width="80"
                             align="center"
                             label="过期日期"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="quantity"
                             width="70"
                             align="center"
                             label="实际库存">
            </el-table-column>
            <el-table-column prop="quantity"
                             width="70"
                             align="center"
                             label="可用库存">
            </el-table-column>
            <el-table-column prop="inTransitNumber"
                             width="70"
                             align="center"
                             label="在途数">
            </el-table-column>
          </el-table>
          <pagination
              v-show="total>0"
              :total="total"
              v-model:page="queryParamsCommodity.pageNum"
              v-model:limit="queryParamsCommodity.pageSize"
              @pagination="choosePurchase"
          /> -->
        </el-main>
      </el-container>
      <template #footer>
        <div class="text-center">
          <el-button @click="purchaseDialog.visible = false">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitPurchase">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="MaterialProductionInOut" lang="ts">
import {
  addMaterialProductionInOut,
  delMaterialProductionInOut,
  getMaterialProductionInOut,
  listMaterialProductionInOut,
  saveMaterialRerturn,
  saveProductionInout,
  updateMaterialProductionInOut
} from '@/api/purchase/materialProductionInOut';
import {
  DirectProductInout,
  MaterialProductionInOutForm,
  MaterialProductionInOutQuery,
  MaterialProductionInOutVO
} from '@/api/purchase/materialProductionInOut/types';
import {VxeTableEvents} from 'vxe-table'
import {ProductionVO} from "@/api/production/production/types";
import {getProductionList, queryMiByProductionIds} from "@/api/production/production";
import {materialInventorySelectList} from "@/api/purchase/materialInventory";
import {ref} from "vue";
import {MaterialInventoryVO} from "@/api/purchase/materialInventory/types";
import useUserStore from "@/store/modules/user";
import dayjs from "dayjs";
import {deepClone} from '@/utils'

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const materialProductionInOutList = ref<MaterialProductionInOutVO[]>([]);
const materialProductionInOutListReturn = ref<MaterialProductionInOutVO[]>([]);
//投料信息
const otherProductionList = ref<ProductionVO[]>([]);
const planPnlVoList = ref<ProductionVO[]>([]);

const materialProductInoutList = ref<MaterialProductionInOutVO[]>([]);
const materialProductReturnList = ref<MaterialProductionInOutVO[]>([]);

const getProductionInOutList = ref<ProductionVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dialogTableLoading = ref(false)

const {mi_type} = toRefs<any>(proxy?.useDict("mi_type"));
const {is_remediation_type} = toRefs<any>(proxy?.useDict("is_remediation_type"));


const queryFormRef = ref<ElFormInstance>();
const materialProductionInOutFormRef = ref<ElFormInstance>();
const tableData = ref<MaterialInventoryVO[]>([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: '生产物料发料'
});

const dialogRecord = reactive<DialogOption>({
  visible: false,
  title: '发料/退料记录'
});

const dialogMaterialReturn = reactive<DialogOption>({
  visible: false,
  title: '生产物料退料'
});

const purchaseDialog = reactive<DialogOption>({
  visible: false,
  title: '选择物料'
});
let alreadySelectPurchase = ref<MaterialInventoryVO[]>([]);
//选择订单
const handleSelectionChangePurchase = ({checked, row}) => {
  if (checked) {
    alreadySelectPurchase.value.push(row)
  } else {
    const num = alreadySelectPurchase.value.findIndex((v: any) => v.id == row.id)
    // alreadySelectPurchase.value.push(row)
    if (num > -1) {
      alreadySelectPurchase.value.splice(num, 1)
    }
  }
}
// 全选
const handleSelectionChangePurchaseAll = ({checked}) => {
  const $table = purchaseTable.value.xTableRef
  if ($table) {
    if (checked) {
      const records = $table.getCheckboxRecords()
      // alreadySelectPurchase.value = alreadySelectPurchase.value.concat(records)

      records.forEach((item: any) => {
        const num = alreadySelectPurchase.value.findIndex((v: any) => v.id == item.id)
        // alreadySelectPurchase.value.push(row)
        if (num == -1) {
          alreadySelectPurchase.value.push(item)
        }
      })
    } else {
      // const records = $table.getCheckboxRecords()
      materialInventoryList.value.forEach((item: any) => {
        const num = alreadySelectPurchase.value.findIndex((v: any) => v.id == item.id)
        // alreadySelectPurchase.value.push(row)
        if (num > -1) {
          alreadySelectPurchase.value.splice(num, 1)
        }
      })
      // console.log(materialInventoryList.value, alreadySelectPurchase.value, alreadySelectPurchase.value == materialInventoryList.value)
    }
  }
}

const initFormData: MaterialProductionInOutForm = {
  id: undefined,
  rawMaterialId: undefined,
  quantity: undefined,
  remark: undefined,
  rawMaterialInvontoryId: undefined,
  type: undefined,
  inOutTime: undefined,
  inOutUser: undefined,
  inOutUserName: undefined,
  productionId: undefined,
  outId: undefined,
  price: undefined,
  storageId: undefined,
  ownerId: undefined
}
const data = reactive<PageData<MaterialProductionInOutForm, MaterialProductionInOutQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    quantity: undefined,
    rawMaterialInvontoryId: undefined,
    type: undefined,
    inOutTime: undefined,
    inOutTimeStart: undefined,
    inOutTimeEnd: undefined,
    inOutUser: undefined,
    inOutUserName: undefined,
    productionId: undefined,
    outId: undefined,
    price: undefined,
    storageId: undefined,
    ownerId: undefined,
    params: {}
  },
  queryParamsRecord:{
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    quantity: undefined,
    rawMaterialInvontoryId: undefined,
    type: undefined,
    inOutTime: undefined,
    inOutUser: undefined,
    inOutUserName: undefined,
    productionId: undefined,
    outId: undefined,
    price: undefined,
    storageId: undefined,
    ownerId: undefined,
    inOutTimeStart:undefined,
    inOutTimeEnd:undefined,
    params: {}
  },
  queryParamsReturn: {
    pageNum: 1,
    pageSize: 20,
    rawMaterialId: undefined,
    quantity: undefined,
    rawMaterialInvontoryId: undefined,
    type: undefined,
    inOutTime: undefined,
    inOutUser: undefined,
    inOutUserName: undefined,
    productionId: undefined,
    outId: undefined,
    price: undefined,
    storageId: undefined,
    inOutTimeStart:undefined,
    inOutTimeEnd:undefined,
    ownerId: undefined,
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "$comment不能为空", trigger: "blur"}
    ],
    rawMaterialId: [
      {required: true, message: "物料ID不能为空", trigger: "blur"}
    ],
    quantity: [
      {required: true, message: "数量不能为空", trigger: "blur"}
    ],
    remark: [
      {required: true, message: "备注不能为空", trigger: "blur"}
    ],
    rawMaterialInvontoryId: [
      {required: true, message: "物料库存表ID不能为空", trigger: "blur"}
    ],
    type: [
      {required: true, message: "类型 不能为空", trigger: "change"}
    ],
    inOutTime: [
      {required: true, message: "发料/退料时间不能为空", trigger: "blur"}
    ],
    inOutUser: [
      {required: true, message: "发料/退料人不能为空", trigger: "blur"}
    ],
    inOutUserName: [
      {required: true, message: "发料/退料人名称不能为空", trigger: "blur"}
    ],
    productionId: [
      {required: true, message: "排产单ID不能为空", trigger: "blur"}
    ],
    outId: [
      {required: true, message: "发料记录ID(退料一定有对应的发料记录)不能为空", trigger: "blur"}
    ],
    price: [
      {required: true, message: "单价不能为空", trigger: "blur"}
    ],
    storageId: [
      {required: true, message: "仓库ID不能为空", trigger: "blur"}
    ],
    ownerId: [
      {required: true, message: "所属单位ID不能为空", trigger: "blur"}
    ]
  }
});

const statusFilterData =ref( [
  { label: '正常投料', value: "0" },
  { label: '补料', value: "1" },
])

const XTableRef = ref()

const columnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '投料类型', field: 'isRemediation', align: 'center',width: '80',
    filterType: 'radio',
    filterParam: { placeholder: '' },
    filterData: () => statusFilterData.value
  },
  {title: '排产单号', field: 'code', align: 'center', width: '120', filterType: 'input', filterParam: {placeholder: ''}},
  {title: 'MI类型', field: 'planType', align: 'center', width: '80',
    filterType: 'radio',
    filterParam: {placeholder: ''},
    filterData: () => mi_type.value
  },
  {title: '产品编码', field: 'commodityCode', align: 'center',width: '200',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: '产品名称', field: 'commodityName', align: 'center',width: '480',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: 'MI单号', field: 'micode', align: 'center', width: '140', filterType: 'input', filterParam: {placeholder: ''}},
  {title: '预计开始时间', field: 'planStartTime', align: 'center',width: '140', },
  {title: '预计完成时间', field: 'planCompleteTime', align: 'center',width: '140', },
  {title: '操作', field: 'make', align: 'center', width: '150', fixed: 'right'},
]);
const materialInventoryColumnList = ref([
  {type: 'checkbox', align: 'center', width: '45',fixed:'left'},
  {title: '物料分类', field: 'categoryName', align: 'center',width: '90',
    filterType: 'input',
    filterParam: { placeholder: '' },
  },
  {title: '物料编码', field: 'materialCode', align: 'center',width: '90',
    filterType: 'input',
    filterParam: { placeholder: '请输入物料编码' },
  },
  {title: '物料名称', field: 'name', align: 'center', width: '100',
    filterType: 'input',
    filterParam: {placeholder: '请输入物料名称'},
  },
  {title: '板厚', field: 'boardThickness', align: 'center',width: '60',  filterType: 'input',
    filterParam: {placeholder: ''},},
  {title: '铜厚', field: 'copperThickness', align: 'center',width: '60',  filterType: 'input',
    filterParam: {placeholder: ''},},
  {title: '级别', field: 'level', align: 'center',width: '70',  filterType: 'input',
    filterParam: {placeholder: ''},},
  {title: '颜色', field: 'color', align: 'center',width: '60',  filterType: 'input',
    filterParam: {placeholder: ''},},
  {title: '长(mm)', field: 'length', align: 'center',width: '70',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '宽(mm)', field: 'width', align: 'center',width: '70',filterType: 'input', filterParam: {placeholder: ''},},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center' },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  {title: '品牌', field: 'manufacturer', align: 'center',width: '70',  filterType: 'input',
    filterParam: {placeholder: ''},},
  {title: '材质牌号', field: 'materialQuality', align: 'center',width: '70',  filterType: 'input',
    filterParam: {placeholder: ''},},
  {title: '单位', field: 'unit', align: 'center',width: '60',  filterType: 'input',
    filterParam: {placeholder: ''},},
  /*{title: '生产日期', field: 'productionDate', align: 'center',width: '80',},
  {title: '保质期(天)', field: 'expirationDays', align: 'center',width: '90',},
  {title: '过期日期', field: 'expirationDate', align: 'center',width: '80',},*/
  {title: '实际库存', field: 'quantity', align: 'center',width: '70',},
  {title: '可用库存', field: 'quantity', align: 'center',width: '70',},
  {title: '在途数', field: 'inTransitNumber', align: 'center',width: '70',},
])

const columnIssuanceList = ref([
  {title: "序号", type: 'seq', field: 'index',fixed: "left", align: 'center', width: '60'},
  {title: '排产单号', field: 'productionCode',fixed: "left", align: 'center',width: '100', filterType: 'input'},
  {title: '合同编码', field: 'orderCode', align: 'center',fixed: "left",width: '100', filterType: 'input',},
  {title: '产品编码', field: 'commodityCode', align: 'center',fixed: "left", width: '180',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: '产品名称', field: 'commodityName', align: 'center',width: '480',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: '发料人', field: 'inOutUserName', align: 'center',width: '100', filterType: 'input', filterParam: {placeholder: ''}},
  {title: '发料日期', field: 'inOutTime', align: 'center',width: '130',

    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    }
  },
  {title: '物料编码', field: 'materialCode', width: '80', align: 'center',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '物料名称', field: 'materialName', width: '80', align: 'center',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '材质牌号', field: 'materialQuality', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '板厚', field: 'boardThickness', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '铜厚', field: 'copperThickness', width: '50', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '颜色', field: 'color', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '级别', field: 'level', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '长(mm)', field: 'length', width: '70', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '宽(mm)', field: 'width', width: '70', align: 'center',filterType: 'input', filterParam: {placeholder: ''}},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center' },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
  {title: '品牌', field: 'manufacturer', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '库位', field: 'storageName', width: '80', align: 'center',},
  /*{title: '生产日期', field: 'productionDate', width: '100', align: 'center',},
  {title: '保质期天数', field: 'expirationDays',width: '80', align: 'center',},
  {title: '过期日期', field: 'expirationDate',width: '100', align: 'center',},
  {title: '库存单位', field: 'unit', align: 'center',width: '80',},*/
  {title: '库存数', field: 'inventoryQuantity', align: 'center',width: '80',},
  // {title: '可用库存数', field: 'inventoryQuantity', align: 'center',width: '100',},
  {title: '操作前库存数', field: 'beforeQuantity', align: 'center',width: '100',},
  {title: '在途数', field: 'inTransitNumber', align: 'center', width: '100',},
  {title: '发料数量', field: 'quantity', align: 'center',width: '80',},
  {title: '退料数量', field: 'returnQuantity', align: 'center',width: '80',},
  {title: '发料单价', field: 'price', align: 'center',width: '100',},
  {title: '发料金额', field: 'totalAmount', align: 'center',width: '80',},
  {title: '备注', field: 'remark', align: 'center',width: '100',},
  {title: '操作', field: 'make', align: 'center', width: '120', fixed: 'right',},
]);


const columnReturnList = ref([
  {title: "序号", type: 'seq', field: 'index',fixed: "left", align: 'center', width: '60',},
  {title: '排产单号', field: 'productionCode',fixed: "left", align: 'center',width: '100', filterType: 'input',},
  {title: '合同编码', field: 'orderCode',fixed: "left", align: 'center',width: '100',filterType: 'input',},
  {title: '产品编码', field: 'commodityCode',fixed: "left", align: 'center',width: '180',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: '产品名称', field: 'commodityName', align: 'center',width: '480',
    filterType: 'input',
    filterParam: {placeholder: ''},
  },
  {title: '退料人', field: 'inOutUserName', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: ''}},
  {title: '退料日期', field: 'inOutTime', align: 'center',width: '130',

    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
      endParams: {placeholder: '请输入结束时间', type: 'date', valueFormat: 'YYYY-MM-DD'},
    }
  },
  {title: '物料编码', field: 'materialCode', width: '80', align: 'center',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '物料名称', field: 'materialName', width: '80', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '材质牌号', field: 'materialQuality', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '板厚', field: 'boardThickness', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '铜厚', field: 'copperThickness', width: '50', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '颜色', field: 'color', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '级别', field: 'level', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '长(mm)', field: 'length', width: '70', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '宽(mm)', field: 'width', width: '70', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '品牌', field: 'manufacturer', width: '60', align: 'center',filterType: 'input', filterParam: {placeholder: ''},},
  {title: '库位', field: 'storageName', align: 'center',},
  { title: '厚度', field: 'thickness',width: '80', align: 'center', showOverflow: false },
  { title: '规格型号', field: 'specification',width: '120', align: 'center' },
  { title: '直径', field: 'diameter',width: '80', align: 'center' },
 /* {title: '生产日期', field: 'productionDate', width: '100', align: 'center',},
  {title: '保质期天数', field: 'expirationDays', align: 'center',width: '80',},
  {title: '过期日期', field: 'expirationDate', width: '80',align: 'center',},*/
  {title: '库存单位', field: 'unit', align: 'center', width: '80',},
  {title: '库存数', field: 'inventoryQuantity', align: 'center',},
  // {title: '可用库存数', field: 'inventoryQuantity', align: 'center',width: '80',},
  {title: '操作前库存数', field: 'beforeQuantity', align: 'center',width: '100',},
  {title: '在途数', field: 'inTransitNumber', align: 'center',width: '100',},
  {title: '退料数量', field: 'quantity', align: 'center',width: '80',},
  {title: '退料单价', field: 'price', align: 'center',width: '80', },
  {title: '退料金额', field: 'totalAmount', align: 'center',width: '80',},
  {title: '备注', field: 'remark', align: 'center', width: '120',},
]);

const checkedMaterialProductionInOutList = ref<MaterialProductionInOutVO[]>([]);
const materialInventoryList = ref<MaterialInventoryVO[]>([]);
const {queryParams, queryParamsRecord, queryParamsReturn, form, rules} = toRefs(data);

const selectChangeEvent: VxeTableEvents.CheckboxAll<MaterialProductionInOutVO> = () => {
  const tableRef = XTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    checkedMaterialProductionInOutList.value = selectRecords.map(item => item);
  }
}

const queryParamsCommodity = ref({
  pageNum: 1,
  pageSize: 20,
  params: {}
});

/**
 * 物料退料
 * @param row
 * @param index
 */
const handleMaterialReturn = (row: MaterialProductionInOutVO) => {
  formInlineReturn.materialName = row.materialName;
  formInlineReturn.id=row.id;
  formInlineReturn.inventoryQuantity=row.quantity;
  dialogMaterialReturn.visible = true;
}

/**
 * 生产物料退料
 */
let initFormInlineReturn = {
  remark: undefined,
  materialName: undefined,
  returnQuanTity: undefined,
  inventoryQuantity:undefined,
  id:undefined,
}
let formInlineReturn = reactive({
  ...initFormInlineReturn
});

// 物料退料取消
const cancelReturn = () => {
  dialogMaterialReturn.visible=false;
  nextTick(() => {
    for (let key in initFormInlineReturn) {
      formInlineReturn[key] = initFormInlineReturn[key]
    }
  })
}
/**
 * 物料退料确定
 */
const submitMaterialRerturn = async () => {
  if (Number(formInlineReturn.returnQuanTity) > Number(formInlineReturn.inventoryQuantity)){
    proxy?.$modal.msgError("退料数量不能大于发料数量");
    return;
  }
  buttonLoading.value = true;
  await saveMaterialRerturn(formInlineReturn).finally(() => buttonLoading.value = false);
  dialogMaterialReturn.visible = false;
  proxy?.$modal.msgSuccess("退料成功");
  queryParams.value.statusType = editableTabsValue.value
  getList();
}

let formInline = reactive({
  inOutUser: undefined,
  createTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  productionId: undefined,
});



// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  queryParams.value.statusType = editableTabsValue.value
  // if (1 == editableTabsValue.value) {
    getProductionOutList();
  // } else {
  //   getList();
  // }
}
const searchChangeRecord = (params: any) => {
  queryParamsRecord.value = params
  queryParamsRecord.value.statusType = editableTabsValue.value
  // if (1 == editableTabsValue.value) {
  //   getProductionOutList();
  // } else {
  getList();
  // }
}
const searchChangeReturn = (params: any) => {
  queryParamsReturn.value = params
  queryParamsReturn.value.statusType = editableTabsValue.value
  // if (1 == editableTabsValue.value) {
  //   getProductionOutList();
  // } else {
  getListReturn();
  // }
}

/**
 * 生产物料发料确认
 * @param params
 */
const submitProductionInOut = async () => {
  if (!tableData.value.length>0){
    proxy?.$modal.msgError("请至少选择一条需要发料的物料");
    return;
  }
  const flag = tableData.value.some(v => Number(v.quantity) < Number(v.producedQuantity));
  if (flag) {
    proxy?.$modal.msgError("发料数量不能大于库存数量");
    return;
  }
  const flag1 = tableData.value.some(v => !v.producedQuantity);
  if (flag1) {
    proxy?.$modal.msgError("发料数量不能为空");
    return;
  }
  const feedQuantityTotal = otherProductionList.value.reduce((total, item)=> total + parseFloat(item.feedQuantity as string), 0);
  const producedQuantityTotal = tableData.value.reduce((total, item)=> total + Number(item.producedQuantity), 0);
  //实投数向上取整
 /* if (Math.ceil(feedQuantityTotal) < producedQuantityTotal){
    proxy?.$modal.msgError("发料数量不能大于投料数");
    return;
  }*/
  const directProductInout: DirectProductInout = {
    tableDataProductionList: [],
    productionId: "",
  };
  directProductInout.productionId = formInline.productionId;
  directProductInout.tableDataProductionList = tableData.value;
  if (Math.ceil(feedQuantityTotal) < producedQuantityTotal) {
   // let msg = res.join(',');
    ElMessageBox.confirm(
        ' 发料数量大于投料数，是否仍然发料？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          buttonLoading.value = true;
          saveProductionInout(directProductInout).then(() => {
            proxy?.$modal.msgSuccess("保存成功");
            dialog.visible = false;
            getProductionOutList();
          }).finally(() => buttonLoading.value = false);
        })
  }else{
    buttonLoading.value = true;
    saveProductionInout(directProductInout).then(() => {
      proxy?.$modal.msgSuccess("保存成功");
      dialog.visible = false;
      getProductionOutList();
    }).finally(() => buttonLoading.value = false);
  }

 /* queryProductInout(directProductInout).then(res => {
    if (res.length > 0) {
      let msg = res.join(',');
      ElMessageBox.confirm(
          msg + ' 这些物料有临期时间更近的，是否仍然发料？',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            saveProductionInout(directProductInout).finally(() => buttonLoading.value = false);
            proxy?.$modal.msgSuccess("保存成功");
            dialog.visible = false;
            getProductionOutList();
          })
    }else{
      saveProductionInout(directProductInout).finally(() => buttonLoading.value = false);
      proxy?.$modal.msgSuccess("保存成功");
      dialog.visible = false;
      getProductionOutList();
    }
  });*/
}

//当前系统登录用户
const userStore = useUserStore().nickname;

/**
 * 排产列表发料
 * @param row
 */
const handleIssuance = async (row?: MaterialProductionInOutVO) => {
  formInline.inOutUser = userStore;
  //排产单号
  dialog.visible = true;
  dialog.title = "生产物料发料";
  const productionId = row?.id;
  formInline.productionId = productionId;
  dialogTableLoading.value = true
  const res = await queryMiByProductionIds(productionId);
  otherProductionList.value = res.data[0].productionPlanSchemeVoList;
  //外面列表
  tableData.value=[];
  // purchaseTable.value=[];
  alreadySelectPurchase.value.length = 0
  dialogTableLoading.value = false
}

const quantityTotal = ref(0)
const issuanceQuantityTotal = ref(0)
/**
 * 发料/退料记录
 * @param row
 */
const handleSelect = async (row?: MaterialProductionInOutVO) => {
  quantityTotal.value=0;
  issuanceQuantityTotal.value=0;

  formInline.inOutUser = userStore;
  //排产单号
  dialogRecord.visible = true;
  dialogRecord.title = "发料/退料记录";
  const productionId = row?.id;
  formInline.productionId = productionId;
  dialogTableLoading.value = true
  const res = await getMaterialProductionInOut(productionId);
  materialProductInoutList.value=res.data.issuanceList;
  materialProductReturnList.value=res.data.returnList;

  materialProductReturnList.value.forEach(v=> {
    quantityTotal.value += Number(v.quantity)
  });
  materialProductInoutList.value.forEach(v=> {
    issuanceQuantityTotal.value += Number(v.quantity)
  });


 /* otherProductionList.value = res.data[0].productionPlanSchemeVoList;
  //外面列表
  tableData.value=[];
  purchaseTable.value=[];*/
  dialogTableLoading.value = false
}



/**
 * 选择物料删除
 * @param row
 * @param index
 */
const deleteRowEvent = (row: MaterialInventoryVO, index: number) => {
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
        tableData.value.splice(index, 1);//删除该行记录
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};

//选择物料确认
const submitPurchase = () => {
  let tempList = []
  const tempOldList = deepClone(tableData.value || [])
  const list = alreadySelectPurchase.value.map((item) => {
    const materialInventoryVO: MaterialInventoryVO = {
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
      unit: "",
      inTransitNumber: "",
      rawMaterialId: "",
      storageId: "",
      categoryName:"",
      supplierId:"",
      purchaseDialog:"",
      diameter:"",
      thickness:"",
      specification:""
    };
    Object.keys(materialInventoryVO).forEach((info) => {
      materialInventoryVO[info] = item[info] ? item[info] : materialInventoryVO[info];
    })
    tempList.push(materialInventoryVO)
  })
  tableData.value = tempList
  tableData.value.map((item) => {
    const crtObj = tempOldList.find((v: any) => v.id == item.id)
    if (crtObj) {
      for (let key in crtObj) {
        item[key] = crtObj[key]
      }
    }
  })
  cancelPurchase();
}

//订单返单取消
const cancelPurchase = () => {
  materialInventoryList.value = [];
  purchaseDialog.visible = false;
}
const purchaseTable = ref<ElFormInstance>();
const materialInventorySearchChange = (params :any) => {
  queryParamsCommodity.value = params;
  getMaterialInventorySelectList()
}
// 获取物料接口
const getMaterialInventorySelectList = async () => {
  const res = await materialInventorySelectList(queryParamsCommodity.value);
  materialInventoryList.value = res.rows;
  // console.log(materialInventoryList.value);
  total.value = res.total;
  materialInventoryList.value.forEach((item: any) => {
    const crtTemp = alreadySelectPurchase.value.find((v: any) => v.id == item.id)
    if (crtTemp) {
      setTimeout(() => {
        purchaseTable.value.xTableRef.setCheckboxRow(item, true)
      }, 100)
    }
  })
}
/**
 * 选择物料
 */
const choosePurchase = async () => {
  // const res = await materialInventorySelectList(queryParamsCommodity.value);
  // materialInventoryList.value = res.rows;
  // // console.log(materialInventoryList.value);
  // total.value = res.total;
  alreadySelectPurchase.value = alreadySelectPurchase.value.filter((item: any) => {
    return tableData.value.some((v: any) => v.id == item.id)
  })
  queryParamsCommodity.value = {
    pageNum: 1,
    pageSize: 20,
  }
  await getMaterialInventorySelectList()
  purchaseDialog.visible = true;
  loading.value = false;
  // tableData.value
}
//移除已选订单
const removeDataOrder = (data: MaterialInventoryVO) => {
  var index = alreadySelectPurchase.value.indexOf(data);
  if (index > -1) {
    alreadySelectPurchase.value.splice(index, 1);
  }
  nextTick(() => {
    const crtTemp = materialInventoryList.value.find((v: any) => v.id == data.id)
    purchaseTable.value.xTableRef.setCheckboxRow(crtTemp, false);
  })
}

/** 查询发料列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMaterialProductionInOut(queryParamsRecord.value);
  materialProductionInOutList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 查询退料列表 */
const getListReturn = async () => {
  loading.value = true;
  const res = await listMaterialProductionInOut(queryParamsReturn.value);
  materialProductionInOutListReturn.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  materialProductionInOutFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: MaterialProductionInOutVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加发料退料";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MaterialProductionInOutVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getMaterialProductionInOut(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改发料退料";
}

/** 提交按钮 */
const submitForm = () => {
  materialProductionInOutFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateMaterialProductionInOut(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMaterialProductionInOut(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MaterialProductionInOutVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除发料退料编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delMaterialProductionInOut(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('purchase/materialProductionInOut/export', {
    ...queryParams.value
  }, `materialProductionInOut_${new Date().getTime()}.xlsx`)
}

// 新增属性
const editableTabsValue = ref(1);
const getVoidedList = async () => {
  queryParams.value.statusType = editableTabsValue.value
  if (1 == editableTabsValue.value) {
    getProductionOutList();
  } else if (3 == editableTabsValue.value) {
    queryParamsRecord.value.statusType = editableTabsValue.value
    getList();
  } else if (2 == editableTabsValue.value) {
    queryParamsReturn.value.statusType = editableTabsValue.value
    getListReturn();
  }
}

const exportVisible = ref(false);
const mainTableToolIdReturn = ref('purchaseMaterialProductionInOutReturn');
const mainTableToolId = ref('purchaseMaterialProductionInOutSend');
/** 导出操作 */
const exportExcel = async () => {
  exportVisible.value = false;
  if(3==editableTabsValue.value){
    proxy?.download('purchase/materialProductionInOut/export', {
      ...queryParams.value, tableName: mainTableToolId.value
    }, `发料记录_${new Date().getTime()}.xlsx`);
  }else {
    proxy?.download('purchase/materialProductionInOut/export', {
      ...queryParams.value, tableName: mainTableToolIdReturn.value
    }, `退料记录_${new Date().getTime()}.xlsx`);
  }
}

/** 导出前操作 */
const exportExcelBefore = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!queryParamsRecord.value.inOutTimeStart) {
    exportVisible.value = true;
  } else {
    proxy?.download('purchase/materialProductionInOut/export', {
      ...queryParamsRecord.value, tableName: mainTableToolId.value
    }, `发料记录_${new Date().getTime()}.xlsx`);
  }
}

/** 导出前操作 */
const exportExcelBeforeReturn = async () => {
  //先看看有没有给起始时间，没有要给出提示
  if (!queryParamsReturn.value.inOutTimeStart) {
    exportVisible.value = true;
  } else {
    proxy?.download('purchase/materialProductionInOut/export', {
      ...queryParamsReturn.value, tableName: mainTableToolIdReturn.value
    }, `退料记录_${new Date().getTime()}.xlsx`);
  }
}



/**
 * 查询排产列表
 * */
const getProductionOutList = async () => {
  loading.value = true;
  const res = await getProductionList(queryParams.value);
  getProductionInOutList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}


onMounted(() => {
  getProductionOutList();
});
</script>
