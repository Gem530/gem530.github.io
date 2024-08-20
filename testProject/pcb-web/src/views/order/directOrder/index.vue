<template>
  <div class="p-2">
    <div>
      <el-form :model="formInline" ref="addCustomerFormRef" :disabled="isDisabled"
               :rules="rules" label-width="80px" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="下单客户" prop="customerId">
              <el-select v-model="formInline.customerId"
                         style="width: calc(100%)"
                         placeholder="请选择客户"
                         @change="getCustomerInfo"
                         filterable
                         default-first-option
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.customerCode +'-'+ item.customerName"
                  :value="item.id"
                >
                  <span style="float: left">{{ item.customerCode }}</span>
                  <span
                    style="
                          float: right;
                          padding-left: 20px;
                        "
                  >{{ item.customerName }}</span
                  >
                </el-option>
              </el-select>
<!--              <el-button @click="handleAdd" style="width: 60px;margin-left: 3px" text="plain">-->
<!--                <el-icon>-->
<!--                  <Plus/>-->
<!--                </el-icon>-->
<!--                添加客户-->
<!--              </el-button>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="负责人">
              <el-input v-model="formInline.companyPrincipal" placeholder="" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="电话">
              <el-input v-model="formInline.companyPrincipalPhone" placeholder="" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="传真">
              <el-input v-model="formInline.faxes" placeholder="" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="下单时间" prop="placeOrderTime">
              <el-date-picker
                style="width: 100%;"
                v-model="formInline.placeOrderTime"
                :disabled-date="disabledDateEnd"
                type="datetime"
                placeholder="选择日期时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="付款方式" prop="paymentMethod">
              <el-select v-model="formInline.paymentMethod" clearable filterable placeholder="请选择付款方式">
                <el-option
                  v-for="item in resDictData.payment_method"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="月结方式" prop="monthlyMethod">
              <el-select v-model="formInline.monthlyMethod" clearable filterable placeholder="请选择月结方式">
                <el-option
                  v-for="item in resDictData.monthly_method"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="small" label-width="80px" label="币种" prop="currency">
              <el-select style="width: 145px;" v-model="formInline.currency" clearable filterable
                         @change="changeCurrency"
                         placeholder="请选择币种">
                <el-option
                  v-for="item in resDictData.currency_type"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item size="small" label-width="60px" label="汇率"
                          :prop="formInline.currency=='人民币'?'unreq':'exchangeRate'">
              <el-input :disabled="formInline.currency=='人民币'" style="width: 145px;" v-model="formInline.exchangeRate"
                        placeholder="" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="运输方式">
              <el-select v-model="formInline.shippingType" clearable filterable placeholder="请选择运输方式">
                <el-option
                  v-for="item in resDictData.shipping_type"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="检验标准">
              <el-select v-model="formInline.checkStandard" clearable filterable placeholder="请选择检验标准">
                <el-option
                  v-for="item in resDictData.check_standard"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="客户资料">
              <el-select v-model="formInline.customerData" multiple filterable placeholder="请选择客户资料">
                <el-option
                  v-for="item in resDictData.customer_data"
                  :key="item.dictCode"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="邮件">
              <el-input v-model="formInline.email" placeholder="" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="收货地址" prop="addressId">
              <el-select v-model="formInline.addressId"
                         style="width: calc(100% - 63px)"
                         clearable
                         filterable
                         placeholder="请选择收货地址">
                <el-option
                  v-for="item in customerAddressList"
                  :key="item.id"
                  :label="`${item.status==0?'(已禁用)-':''}${item.name},${item.phone},${item.address}`"
                  :value="item.id"
                  :disabled="item.status==0"
                />
              </el-select>
              <el-button style="width: 60px;margin-left: 3px" text="plain" @click="handleAddAddress">
                <el-icon>
                  <Plus/>
                </el-icon>
                添加地址
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="业务员" prop="cusSaleUserId">
              <el-select v-model="formInline.cusSaleUserId" clearable :collapse-tags="true" filterable
                         @change="changeSaler"
                         placeholder="请选择业务员"
                         default-first-option>
                <el-option
                  v-for="item in salerOptions"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="是否含税">
              <el-switch v-model="formInline.isTax" active-value="1" inactive-value="0" active-text="含税"
                         inactive-text="不含税" @change="changeIsTax"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="small" label="备注" prop="remark">
              <el-input v-model="formInline.remark" style="padding-top: -10px;" type="textarea" rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-button text="plain" @click="chooseOrder">
        <el-icon>
          <FolderDelete/>
        </el-icon>
        订单返单
      </el-button>
      <el-button text="plain" @click="addCommodity">
        <el-icon>
          <FolderAdd/>
        </el-icon>
        新增产品
      </el-button>
      <el-button text="plain" @click="chooseCommodity">
        <el-icon>
          <Checked/>
        </el-icon>
        选择产品
      </el-button>
    </div>
    <vxe-table
      border
      keep-source
      size="small"
      align="center"
      :height="props.isComp ? '455px' : '545px'"
      :row-config="{height: 50}"
      max-height="100%"
      :show-footer="true"
      :footer-method="footerMethod"
      :edit-rules="validRules"
      show-overflow
      :valid-config="{
          showMessage: false,
      }"
      ref="xTable" class="direct-table"
      :column-config="{resizable: true}"
      @cell-click="handleCellClick"
      :data="tableData"
      :edit-config="{trigger: 'click', mode: 'cell',autoClear:true, showStatus: true,beforeEditMethod:beforeEditMethod}">
      <vxe-column type="seq" fixed="left" title="序号" width="50"></vxe-column>
      <vxe-column width="70" title="订单类型" :edit-render="{placeholder: '请点击输入'}" field="orderType">
        <template #edit="{ row }">
          <vxe-select v-model="row.orderType">
            <vxe-option v-for="item in resDictData.order_type" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
        <template #default="{row}">
          <div v-for="item in resDictData.order_type">
            <span v-if="item.dictValue==row.orderType">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="60" title="批/样" :edit-render="{placeholder: '请点击输入'}" field="model">
        <template #edit="{ row }">
          <vxe-select v-model="row.model">
            <vxe-option v-for="item in resDictData.order_model" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
        <template #default="{ row }">
          <div v-for="item in resDictData.order_model">
            <span v-if="item.dictValue==row.model">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="80" title="客户PO" :edit-render="{placeholder: '请点击输入'}" field="customerPo">
        <template #edit="{ row }">
          <el-input v-model="row.customerPo"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="150" title="产品编码" field="commodityCode">
        <template #default="{ row }">
          {{showCommodityCode(row)}}
        </template>
      </vxe-column>
      <vxe-column width="80" title="流水号" :edit-render="{placeholder: '请点击输入'}" field="serialNumber">
        <template #edit="{ row }">
          <el-input v-model="row.serialNumber" maxlength="5" @change="serialChange(row)" @focus="serialNumberOld = row.serialNumber"></el-input>
          <el-button type="primary" link @click="getNextNumber(row)">设置流水</el-button>
        </template>
      </vxe-column>
      <vxe-column width="120" title="产品名称" :edit-render="{placeholder: '请点击输入'}" field="commodityName">
        <template #edit="{ row }">
          <el-input v-model="row.commodityName" :disabled="['2'].includes(row.orderType)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="50" title="版本号" :edit-render="{placeholder: '请点击输入'}" field="version">
        <template #edit="{ row }">
          <el-input v-model="row.version" :disabled="['2'].includes(row.orderType)" @focus="versionOld = row.version" @change="(value) => versionChange(value, row)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="产品类型" :edit-render="{placeholder: '请点击输入'}" field="commodityType">
        <template #edit="{ row }">
          <vxe-select v-model="row.commodityType" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.sys_commodity_type" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="加急" :edit-render="{placeholder: '请点击输入'}" field="urgent">
        <template #edit="{ row }">
          <vxe-select v-model="row.urgent">
            <vxe-option v-for="item in resDictData.order_urgent" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
        <template #default="{ row }">
          <div v-for="item in resDictData.order_urgent">
            <span v-if="item.dictValue==row.urgent">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="80" title="订购数量(pcs)" :edit-render="{placeholder: '请点击输入'}" field="quantity">
        <template #edit="{ row, column }">
          <el-input style="width: 100%" v-model="row.quantity" type="number"
                    @change="countQuantity(row, column)"></el-input>

        </template>
      </vxe-column>
      <vxe-column width="80" title="单价(元/pcs)" :edit-render="{placeholder: '请点击输入'}" field="price">
        <template #edit="{ row }">
          <el-input style="width: 100%" v-model="row.price" type="number"
                    @change="countTotalPrice(row)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="面积(㎡)" field="area" :edit-render="{placeholder: ''}">
        <template #edit="{ row }">
          <el-input style="width: 100%" disabled v-model="row.area" type="number" @change="countPriceByArea(row)"
                    :model-value="countArea(row)"></el-input>
        </template>
        <template #default="{ row }">
          <el-input style="width: 100%" disabled v-model="row.area" type="number" @change="countPriceByArea(row)"
                    :model-value="countArea(row)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="平米价(元/㎡)" :edit-render="{placeholder: '请点击输入'}" field="areaPrice">
        <template #edit="{ row }">
          <el-input style="width: 100%" v-model="row.areaPrice" type="number"
                    @change="countPrice(row)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="总金额" field="totalPrice">
        <template #default="{ row }">
          <el-input style="width: 100%" v-model="row.totalPrice" type="number" disabled></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="总价" field="totalOrderPrice">
        <template #default="{ row }">
          <el-input v-model="row.totalOrderPrice" disabled></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="税金" field="tax">
        <template #default="{ row }">
          <el-input v-model="row.tax" :model-value="countTax(row)"
                    disabled></el-input>
        </template>
      </vxe-column>
      <vxe-column width="110" title="客户交期" :edit-render="{placeholder: '请点击输入'}" field="deliveryTime">
        <template #edit="{ row }">
          <el-date-picker style="width: 100%"
                          size="small" v-model="row.deliveryTime" type="date"
                          placeholder="选择日期时间"
                          :disabled-date="disabledDateEndOrder"
                          value-format="YYYY-MM-DD" format="YYYY-MM-DD"
                          clearable @change="dispatchTimeChange(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="提前发货(h)" :edit-render="{placeholder: '请点击输入'}" field="preDeliveryHour">
        <template #edit="{ row }">
          <el-input v-model="row.preDeliveryHour" type="number" @change="dispatchTimeChange(row)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="110" title="最迟发货" :edit-render="{placeholder: '请点击输入'}" field="dispatchTime">
        <template #edit="{ row }">
          <el-date-picker style="width: 100%" size="small" v-model="row.dispatchTime" type="datetime"
                          placeholder="选择日期时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
                          disabled clearable/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="表面处理" :edit-render="{placeholder: '请点击输入'}" field="surfaceTreatment">
        <template #edit="{ row }">
          <vxe-select v-model="row.surfaceTreatment" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_surface_treatment" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictLabel"/>
          </vxe-select>
        </template>
        <template #default="{ row }">
          <!-- <div v-for="item in resDictData.order_surface_treatment">
            <span v-if="item.dictValue==row.surfaceTreatment">{{item.dictLabel}}</span>
          </div> -->
          <span>{{row.surfaceTreatment}}</span>
        </template>
      </vxe-column>
      <vxe-column width="50" title="层数" :edit-render="{placeholder: '请点击输入'}" field="materialLayer">
        <template #edit="{ row }">
          <el-input style="width: 100%" v-model="row.materialLayer" :disabled="['2'].includes(row.orderType)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="板材" :edit-render="{placeholder: '请点击输入'}" field="materialQuality">
        <template #edit="{ row }">
          <vxe-select v-model="row.materialQuality" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_material_quality" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="板材品牌" :edit-render="{placeholder: '请点击输入'}" field="materialBrand">
        <template #edit="{ row }">
          <vxe-select v-model="row.materialBrand" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_plate_brand" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="板材级别" :edit-render="{placeholder: '请点击输入'}" field="materialLevel">
        <template #edit="{ row }">
          <vxe-select v-model="row.materialLevel" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_material_level" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="阻焊颜色" :edit-render="{placeholder: '请点击输入'}" field="commoditySolder">
        <template #edit="{ row }">
          <vxe-select v-model="row.commoditySolder" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_commodity_solder" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="阻焊面数" :edit-render="{placeholder: '请点击输入'}" field="commoditySolderCount">
        <template #edit="{ row }">
          <vxe-select v-model="row.commoditySolderCount" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_commodity_solder_count" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="金厚(u'')" :edit-render="{placeholder: '请点击输入'}" field="goldenThickness">
        <template #edit="{ row }">
          <el-input style="width: 100%" v-model="row.goldenThickness" :disabled="['2'].includes(row.orderType)"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="字符" :edit-render="{placeholder: '请点击输入'}" field="characterColor">
        <template #edit="{ row }">
          <vxe-select v-model="row.characterColor" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_character" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="字符面数" :edit-render="{placeholder: '请点击输入'}" field="characterCount">
        <template #edit="{ row }">
          <vxe-select v-model="row.characterCount" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_character_count" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="成形方式" :edit-render="{placeholder: '请点击输入'}" field="commodityForm">
        <template #edit="{ row }">
          <vxe-select v-model="row.commodityForm" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_commodity_form" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="测试方式" :edit-render="{placeholder: '请点击输入'}" field="commodityTestWay">
        <template #edit="{ row }">
          <vxe-select v-model="row.commodityTestWay">
            <vxe-option v-for="item in resDictData.order_commodity_testway" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="测试架" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-select v-model="row.testFrame">
            <vxe-option v-for="item in resDictData.order_test_stand" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="测试点(个)" :edit-render="{placeholder: '请点击输入'}" field="testPoint">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.testPoint" :disabled="['2'].includes(row.orderType)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="过孔要求" :edit-render="{placeholder: '请点击输入'}" field="holeRequirement">
        <template #edit="{ row }">
          <vxe-select v-model="row.holeRequirement" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_hole_requirement" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="检验标准" :edit-render="{placeholder: '请选择'}" field="inspectionStandard">
        <template #edit="{ row }">
          <vxe-select v-model="row.inspectionStandard" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_inspection_standard" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="金面积" :edit-render="{placeholder: '请点击输入'}" field="goldArea">
        <template #edit="{ row }">
          <el-input :controls="false" style="width: 100%" v-model="row.goldArea" :maxlength="100" :disabled="['2'].includes(row.orderType)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="客户物料编码" :edit-render="{placeholder: '请点击输入'}" field="materialNumber">
        <template #edit="{ row }">
          <el-input v-model="row.materialNumber"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="120" title="客户物料名称" :edit-render="{placeholder: '请点击输入'}" field="materialName">
        <template #edit="{ row }">
          <el-input v-model="row.materialName"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="最小线宽(mm)" :edit-render="{placeholder: '请点击输入'}" field="minLineWidth">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.minLineWidth"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="最小线距(mm)" :edit-render="{placeholder: '请点击输入'}" field="minLineSpace">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.minLineSpace"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="最小孔径(mm)" :edit-render="{placeholder: '请点击输入'}" field="minAperture">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.minAperture"/>
        </template>
      </vxe-column>
      <vxe-column width="90" title="总孔数(/连板(SLOT))" :edit-render="{placeholder: '请点击输入'}" field="holeCount">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.holeCount" :min="0" @change="holeTableCountnumber(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="孔密度(万/m²)" :edit-render="{placeholder: '请点击输入'}" field="holeDensity">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.holeDensity"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="模具费" :edit-render="{placeholder: '请点击输入'}" field="mouldCost">
        <template #edit="{ row }">
          <el-input class="number-left" style="width: 100%;" v-model="row.mouldCost" @change="countPriceOther(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="测试架费" :edit-render="{placeholder: '请点击输入'}" field="testFrameCost">
        <template #edit="{ row }">
          <el-input class="number-left" style="width: 100%;" v-model="row.testFrameCost" @change="countPriceOther(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="飞针费" :edit-render="{placeholder: '请点击输入'}" field="flyProbeCost">
        <template #edit="{ row }">
          <el-input class="number-left" style="width: 100%;" v-model="row.flyProbeCost" @change="countPriceOther(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="工程费" :edit-render="{placeholder: '请点击输入'}" field="engineeringCost">
        <template #edit="{ row }">
          <el-input class="number-left" style="width: 100%;" v-model="row.engineeringCost" @change="countPriceOther(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="样板费" :edit-render="{placeholder: '请点击输入'}" field="sampleCost">
        <template #edit="{ row }">
          <el-input class="number-left" style="width: 100%;" v-model="row.sampleCost" @change="countPriceOther(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="加急费" :edit-render="{placeholder: '请点击输入'}" field="expeditedCost">
        <template #edit="{ row }">
          <el-input class="number-left" style="width: 100%;" v-model="row.expeditedCost" @change="countPriceOther(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="60" title="其他费" field="otherCost">
        <template #default="{ row }">
          <el-button link type='primary' v-model="row.otherCost" @click="openOtherCostDialog(row)">{{row.otherCost}}
          </el-button>
        </template>
      </vxe-column>
      <vxe-column width="80" title="包装要求" :edit-render="{placeholder: '请点击输入'}" field="packRequirement">
        <template #edit="{ row }">
          <vxe-select v-model="row.packRequirement">
            <vxe-option v-for="item in resDictData.order_packaging_requirements" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictLabel"/>
          </vxe-select>
        </template>
        <template #default="{ row }">
          <div v-for="item in resDictData.order_packaging_requirements">
            <span v-if="item.dictLabel==row.packRequirement">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="120" title="订单特殊要求" :edit-render="{placeholder: '请点击输入'}" field="specialRequirement">
        <template #edit="{ row }">
          <el-input type="textarea" v-model="row.specialRequirement"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="80" title="成品板厚" :edit-render="{placeholder: '请点击输入'}" field="commodityThickness">
        <template #edit="{ row }">
          <vxe-select v-model="row.commodityThickness" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.finish_plate_thickness" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="外层铜厚" :edit-render="{placeholder: '请点击输入'}" field="materialCopperOutside">
        <template #edit="{ row }">
          <vxe-select v-model="row.materialCopperOutside" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_material_copperoutside" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="内层铜厚" :edit-render="{placeholder: '请点击输入'}" field="materialCopperInside">
        <template #edit="{ row }">
          <vxe-select v-model="row.materialCopperInside" :disabled="['2'].includes(row.orderType)">
            <vxe-option v-for="item in resDictData.order_material_copperinside" :key="item.dictValue"
                        :label="item.dictLabel"
                        :value="item.dictValue"/>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column width="80" title="单片长(mm)" :edit-render="{placeholder: '请点击输入'}" field="singleLength">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.singleLength" :disabled="['2'].includes(row.orderType)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="单片宽(mm)" :edit-render="{placeholder: '请点击输入'}" field="singleWidth">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.singleWidth" :disabled="['2'].includes(row.orderType)"/>
        </template>
      </vxe-column>

      <vxe-column width="80" title="联片长(mm)" :edit-render="{placeholder: '请点击输入'}" field="unitedLength">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.unitedLength" :disabled="['2'].includes(row.orderType)"
                           @input="countPriceAndArea(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="联片宽(mm)" :edit-render="{placeholder: '请点击输入'}" field="unitedWidth">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.unitedWidth" :disabled="['2'].includes(row.orderType)"
                           @input="countPriceAndArea(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="联片数量(pcs)" field="unitedNumber">
        <template #default="{ row }">
          <el-input-number :controls="false" style="width: 100%" disabled v-model="row.unitedNumber" :disabled="['2'].includes(row.orderType)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="连片方式长(个)" :edit-render="{placeholder: '请点击输入'}" field="unitedWayLength">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.unitedWayLength" :min="0" :precision="0" :disabled="['2'].includes(row.orderType)"
                           @change="countPriceAndArea(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="80" title="连片方式宽(个)" :edit-render="{placeholder: '请点击输入'}" field="unitedWayWidth">
        <template #edit="{ row }">
          <el-input-number :controls="false" style="width: 100%" v-model="row.unitedWayWidth" :min="0" :precision="0" :disabled="['2'].includes(row.orderType)"
                           @change="countPriceAndArea(row)"/>
        </template>
      </vxe-column>
      <vxe-column width="120" title="产品备注" :edit-render="{placeholder: '请点击输入'}" field="commodityRemark">
        <template #edit="{ row }">
          <el-input type="textarea" v-model="row.commodityRemark"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="120" title="订单备注" :edit-render="{placeholder: '请点击输入'}" field="remark">
        <template #edit="{ row }">
          <el-input type="textarea" v-model="row.remark"></el-input>
        </template>
      </vxe-column>

      <vxe-column width="60" title="承认书/出货报告"  field="hasAcknowledgment">
        <template #default="{ row }"><el-icon v-if="row.hasAcknowledgment=='1'"><Check /></el-icon></template>
      </vxe-column>
      <vxe-column width="60" title="阻抗报告"  field="hasImpedanceReport">
        <template #default="{ row }"><el-icon v-if="row.hasImpedanceReport=='1'"><Check /></el-icon></template>
      </vxe-column>
      <vxe-column width="60" title="切片"   field="hasSection">
        <template #default="{ row }"><el-icon v-if="row.hasSection=='1'"><Check /></el-icon></template>
      </vxe-column>
      <vxe-column width="60" title="阻抗条" field="hasImpedanceBar">
        <template #default="{ row }"><el-icon v-if="row.hasImpedanceBar=='1'"><Check /></el-icon></template>
      </vxe-column>
      <vxe-column width="60" title="菲林"  field="hasFilm">
        <template #default="{ row }"><el-icon v-if="row.hasFilm=='1'"><Check /></el-icon></template>
      </vxe-column>
      <vxe-column width="60" title="封样"  field="hasSealedSample">
        <template #default="{ row }"><el-icon v-if="row.hasSealedSample=='1'"><Check /></el-icon></template>
      </vxe-column>

      <vxe-column fixed="right" title="操作" width="220">
        <template #default="{ row,rowIndex}">
          <!--          <template v-if="isActiveStatus(row)">
                      <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                      <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
                    </template>
                    <template v-else>
                      <el-button size="small" text="plain" @click="copyRowEvent(row)">复制</el-button>
                      <el-button size="small" text="plain" @click="editRowEvent(row)">编辑</el-button>
                      <el-button size="small" text="plain" @click="deleteRowEvent(row,rowIndex)">删除</el-button>
                    </template>-->
          <el-button size="small" type="primary" link @click="copyRowEvent(row)">复制</el-button>
          <template v-if="!(isSale && (row.status ? !['1','3'].includes(row.status) : false))">
            <el-button size="small" type="primary" link @click="openDrawer(2, row, rowIndex)">编辑</el-button>
            <el-button size="small" type="primary" link @click="deleteRowEvent(row,rowIndex)">删除</el-button>
            <el-button v-if="props.isComp && props.code" size="small" type="primary" link @click="submitRowEvent(row,rowIndex)" :loading="buttonLoading">提交审核</el-button>
          </template>
          <template v-else-if="!(['6','7'].includes(row.flowStatus) || ['3'].includes(row.status))">
            <el-button size="small" type="danger" link @click="backOrderEvent(row,rowIndex)">撤回</el-button>
          </template>
        </template>
      </vxe-column>
    </vxe-table>

    <div class="text-center mt-1">
      <el-button type="danger" @click="deleteContract()" :loading="buttonLoading">删除合同</el-button>
      <el-button v-if="props.isComp" :loading="buttonLoading" @click="closePage(false)">取消</el-button>
      <el-button @click="preViewOrder('1')" :loading="buttonLoading">预览</el-button>
      <el-button @click="onSubmitCheckBtnClick('1')" :loading="buttonLoading">暂存</el-button>
      <el-button type="primary" @click="onSubmitCheckBtnClick('2')" :loading="buttonLoading">提交审核</el-button>
    </div>

    <el-dialog v-model="otherCostDialog.visible" :title="otherCostDialog.title" :destroy-on-close="true" width="550px">
      <vxe-table border show-overflow keep-source ref="_tableRef" :data="currentRow.otherCostList" size="small"
                 :edit-rules="costRules" :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }">
        <vxe-column field="make" title="操作" width="60" align="center">
          <template #header>
            <el-icon @click="addChangeRow" style="color: rgb(64, 158, 255);font-size:19px">
              <CirclePlusFilled/>
            </el-icon>
          </template>
<!--          <template #edit="scope">-->
<!--            <el-icon @click="removeChange(scope.row)" color="red" size="19px">-->
<!--              <RemoveFilled/>-->
<!--            </el-icon>-->
<!--          </template>-->
          <template #default="scope">
            <el-icon @click="removeChange(scope.row)" color="red" size="19px">
              <RemoveFilled/>
            </el-icon>
          </template>
        </vxe-column>
        <vxe-column field="title" title="费用名称" align="center" :edit-render="{}">
          <template #edit="scope">
            <el-input v-model="scope.row.title" type="text" @change="changeCellEvent(scope)"></el-input>
          </template>
        </vxe-column>
        <vxe-column field="price" title="金额" align="center" :edit-render="{}">
          <template #edit="scope">
            <el-input-number :controls="false" :precision="2" class="number-left" style="width: 100%;" v-model="scope.row.price" type="number" @change="changeCellEvent(scope)"></el-input-number>
            <!-- <el-input-number :controls="false" :precision="2" class="number-left" style="width: 100%;" v-model="other.price" @change="countPriceOther(editInfo.form)"></el-input-number> -->
          </template>
        </vxe-column>
      </vxe-table>
<!--      <div class="text-center pt-5">
        <el-button @click="cancelOtherCost">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitOtherCost">确 定</el-button>
      </div>-->

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
      <div class="text-center">
        <el-button @click="cancelAddress">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="submitAddress">确 定</el-button>
      </div>
    </el-dialog>
    <!--    <vxe-pager
              align="center"
              size="small"
              background
              :current-page="queryParams.pageNum"
              :page-size="queryParams.pageSize"
              :total="total"
              :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
              @page-change="getList"
            ></vxe-pager> -->


    <!-- 客户新增 -->
    <el-drawer
      v-model="drawer.visible"
      :title="drawer.title"
      size="50%"
      :direction="drawer.direction"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <el-form ref="customerFormRef" :model="form" :rules="customerRules" label-width="130px">
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="客户编码" prop="customerCode">
            <el-input v-model="form.customerCode" placeholder="请输入客户编码"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户名称" prop="customerName">
            <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户级别" prop="customerLevel">
            <el-select v-model="form.customerLevel" clearable filterable placeholder="请选择客户级别">
              <el-option
                v-for="item in resDictData.customer_level"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="对账时间" prop="reconciliationTime">
            <el-select v-model="form.reconciliationTime" clearable filterable placeholder="请选择对账时间">
              <el-option
                v-for="item in resDictData.reconciliation_time"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="付款方式" prop="paymentMethod">
            <el-select v-model="form.paymentMethod" clearable filterable placeholder="请选择付款方式">
              <el-option
                v-for="item in resDictData.payment_method"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="营业执照号">
            <el-input v-model="form.businessLicenseNumber" placeholder="请输入营业执照号"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="币种" prop="currency">
            <el-select v-model="form.currency" clearable filterable placeholder="请选择币种">
              <el-option
                v-for="item in resDictData.currency_type"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="汇率(%)">
            <el-input v-model="form.exchangeRate" :min="0" controls-position="right" style="width:100%"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户电话">
            <el-input v-model="form.customerPhone" placeholder="请输入客户电话"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="客户地址">
            <el-input v-model="form.companyAddress" placeholder="请输入客户地址"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="公司负责人" prop="companyPrincipal">
            <el-input v-model="form.companyPrincipal" placeholder="请输入公司负责人"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="负责人电话" prop="companyPrincipalPhone">
            <el-input v-model="form.companyPrincipalPhone" placeholder="请输入负责人电话"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="月结方式">
            <el-select v-model="form.monthlyMethod" clearable filterable placeholder="请选择月结方式">
              <el-option
                v-for="item in resDictData.monthly_method"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="天数限制">
            <el-input v-model="form.dayNumberLimit" :min="0" controls-position="right" style="width:100%"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="运输方式">
            <el-select v-model="form.shippingType" clearable filterable placeholder="请选择运输方式">
              <el-option
                v-for="item in resDictData.shipping_type"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="采购负责人">
            <el-input v-model="form.purchasingManager" placeholder="请输入采购负责人"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="采购联系电话">
            <el-input v-model="form.purchasingPhone" placeholder="请输入采购联系电话"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="采购联系Email">
            <el-input v-model="form.purchasingEmail" placeholder="请输入采购联系Email"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="财务联系人">
            <el-input v-model="form.financeManager" placeholder="请输入财务联系人"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="财务联系电话">
            <el-input v-model="form.financePhone" placeholder="请输入财务联系电话"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="财务联系Email">
            <el-input v-model="form.financeEmail" placeholder="请输入财务联系Email"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="仓库联系人">
            <el-input v-model="form.warehouseKeeper" placeholder="请输入仓库联系人"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="仓库联系电话">
            <el-input v-model="form.warehousePhone" placeholder="请输入仓库联系电话"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="仓库联系Email">
            <el-input v-model="form.warehouseEmail" placeholder="请输入仓库联系Email"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="工程联系人">
            <el-input v-model="form.projectManager" placeholder="请输入工程联系人"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="工程联系电话">
            <el-input v-model="form.projectPhone" placeholder="请输入工程联系电话"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="工程联系Email">
            <el-input v-model="form.projectEmail" placeholder="请输入工程联系Email"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="其他联系人">
            <el-input v-model="form.otherManager" placeholder="请输入其他联系人"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="其他联系电话">
            <el-input v-model="form.otherPhone" placeholder="请输入其他联系电话"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="其他联系Email">
            <el-input v-model="form.otherEmail" placeholder="请输入其他联系Email"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="联系人QQ">
            <el-input v-model="form.contactsQq" placeholder="请输入联系人QQ"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="开户银行">
            <el-input v-model="form.depositBank" placeholder="请输入开户银行"/>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="银行账号">
            <el-input v-model="form.bankAccount" placeholder="请输入银行账号"/>
          </el-form-item>
        </div>
        <div style="display: flex;">
          <el-form-item size="small" style="flex: 1;" label="检验标准">
            <el-select v-model="form.checkStandard" clearable filterable placeholder="请选择检验标准">
              <el-option
                v-for="item in resDictData.check_standard"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="客户资料">
            <el-select v-model="form.customerData" clearable filterable placeholder="请选择客户资料">
              <el-option
                v-for="item in resDictData.customer_data"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item size="small" style="flex: 1;" label="是否含税">
            <el-switch v-model="form.isTax" active-value="1" inactive-value="0"/>
          </el-form-item>
        </div>
        <el-form-item size="small" label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item size="small" label="传真">
          <el-input v-model="form.faxes" placeholder="请输入传真"/>
        </el-form-item>
        <el-form-item size="small" label="销售人员">
          <el-select v-model="form.salerList" clearable :collapse-tags="true" filterable multiple
                     placeholder="请选择销售人员">
            <el-option
              v-for="item in salerOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="客户要求">
          <el-input v-model="form.customerDemand" type="textarea" :rows="3" placeholder="请输入客户要求"/>
        </el-form-item>
        <el-form-item size="small" label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>

    <!--选择产品弹窗-->
    <el-dialog v-model="commodityDialog.visible" :title="commodityDialog.title" :destroy-on-close="true"
               :close-on-click-modal="false" width="1300px">
      <el-container>
        <el-aside width="220px" style="background-color: rgb(238, 241, 246)">
          <div style=" font-size:medium; font-weight:600">已选产品</div>
          <el-table :data="alreadySelectCommodity"
                    tooltip-effect="dark"
                    style="width: 100%;height: calc(100% - 40px);"
                    :show-header="false">
            <el-table-column prop="code"
                             label="产品编码"
                             align="left">
            </el-table-column>
            <el-table-column label="操作"
                             width="50">
              <template #default="scope">
                <div style="text-align:center">
                  <el-button @click="removeData(scope.row)" type="text" size="small">X</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main style="padding:0px;overflow-x:hidden;">
          <XTable :pageShow="true" v-model:page-size="queryParamsCommodity.pageSize"
                  v-model:current-page="queryParamsCommodity.pageNum"
                  :page-params="{ perfect: true, total: commodityTotal }"
                  :data="commodityList"
                  height="576px" :loading="dialogTableLoading"
                  :columnList="columnCommodityList"
                  ref="commodityVxeTableRef" border
                  @searchChange="searchChangeCommodity"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{ reserve: true }"
                  :row-config="{ keyField: 'id' }"
                  @checkbox-all="handleSelectionChange"
                  @checkbox-change="handleSelectionChange">
            <template #default-model="scope">
              <div v-for="item in resDictData.order_model">
                <span v-if="item.dictValue==scope.row.model">{{item.dictLabel}}</span>
              </div>
            </template>
          </XTable>
        </el-main>
      </el-container>

      <template #footer>
        <div class="text-center">
          <el-button @click="cancelCommodity">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitCommodity">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!--订单返单弹窗-->
    <el-dialog v-model="orderDialog.visible" :title="orderDialog.title" :destroy-on-close="true"
               :close-on-click-modal="false" width="98%">
      <el-container>
        <el-aside width="310px" style="background-color: rgb(238, 241, 246)">
          <div style=" font-size:medium; font-weight:600">已选产品</div>
          <el-table :data="alreadySelectOrder"
                    tooltip-effect="dark"
                    style="width: 100%;height: calc(100% - 40px);"
                    :show-header="false">
            <el-table-column prop="commodityCode"
                             label="产品编码">
              <template #default="scope">
                {{scope.row.commodityCode}} - {{scope.row.code}}
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="50">
              <template #default="scope">
                <div style="text-align:center">
                  <el-button @click="removeDataOrder(scope.row)" type="text" size="small">X</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main style="padding:0px;overflow-x:hidden;">
          <XTable :pageShow="true" v-model:page-size="queryParams.pageSize"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="orderList"
                  :columnList="columnOrderList"
                  ref="orderVxeTableRef" border
                  height="576px" :loading="dialogTableLoading"
                  @searchChange="searchChangeOrder"
                  :column-config="{ resizable: true }"
                  :checkbox-config="{ reserve: true }"
                  :row-config="{ keyField: 'id' }"
                  @checkbox-all="handleSelectionChangeOrder"
                  @checkbox-change="handleSelectionChangeOrder">
            <template #default-orderType="scope">
              <div v-for="item in resDictData.order_type">
                <span v-if="item.dictValue==scope.row.orderType">{{item.dictLabel}}</span>
              </div>
            </template>
            <template #default-model="scope">
              <div v-for="item in resDictData.order_model">
                <span v-if="item.dictValue==scope.row.model">{{item.dictLabel}}</span>
              </div>
            </template>
          </XTable>
        </el-main>
      </el-container>

      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" @click="cancelOrder">取 消</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="submitOrder">确 定</el-button>
        </div>
      </template>
    </el-dialog>


    <!--直接下单预览 -->
<!--    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="60%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
      destroy-on-close
    </el-drawer>-->

    <!-- 销售合同预览新增 -->
    <el-drawer
        v-model="previewDrawer.visible"
        :title="previewDrawer.title"
        size="75%"
        :direction="previewDrawer.direction"
        visible.sync="false"
        draggable
        destroy-on-close
    >
      <template #header="{}">
        <span class="text-center">销售合同预览</span>
      </template>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>

    <!-- 直接下单新增、编辑产品弹框 -->
    <el-drawer
      v-model="editInfo.show"
      :title="editInfo.type == 1 ? '新增产品' : '编辑产品'"
      size="45%"
      modal-class="add-prod-drawder"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="addProdRef" :model="editInfo.form" :rules="editInfo.rules" label-width="60px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户" prop="cusId">
              <el-select v-model="formInline.customerId"
                         style="width: 100%;"
                         placeholder=" "
                         disabled
                         suffix-icon="">
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.customerCode +'-'+ item.customerName"
                  :value="item.id">
                  <span style="float: left">{{ item.customerCode }}</span>
                  <span style="float: right;padding-left: 20px;">{{ item.customerName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="表面处理" prop="surfaceTreatment">
              <el-select suffix-icon="" class="height-light"  v-model="editInfo.form.surfaceTreatment"
                         placeholder=" " @change="changeCommodityCode" :disabled="['2'].includes(editInfo.form.orderType)">
                <el-option v-for="item in resDictData.order_surface_treatment" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="批量/样品" prop="model">
              <el-select suffix-icon=""  v-model="editInfo.form.model" @change="changeCommodityCode" placeholder=" ">
                <el-option v-for="item in resDictData.order_model" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!-- 板层 == 层数 -->
            <el-form-item label="层数" prop="materialLayer">
              <el-input class="height-light font-14" type="number" v-model="editInfo.form.materialLayer" :disabled="['2'].includes(editInfo.form.orderType)"
                        @input="changeCommodityCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="版本号" prop="version">
              <el-input type="text" v-model="editInfo.form.version" @input="changeCommodityCode" :disabled="['2'].includes(editInfo.form.orderType)" @focus="versionOld = editInfo.form.version" @change="(value) => versionChange(value, editInfo.form)"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="产品名称" prop="commodityName">
              <el-input type="text" v-model="editInfo.form.commodityName" :maxlength="1000" :disabled="['2'].includes(editInfo.form.orderType)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="产品编码" prop="commodityCode">
              <el-input type="text" v-model="editInfo.form.commodityCode" style="display: none;"></el-input>
              <el-row style="width: 100%;">
                <el-col :span="9">
                  <el-form-item prop="serialNumber" class="error-right">
                    <el-input type="text" v-model="editInfo.form.serialNumber" @input="changeCommodityCode" @focus="serialNumberOld = editInfo.form.serialNumber" maxlength="5"  @change="serialChange(editInfo.form)">
                      <template #prepend>
                        {{(formInline.customerCode || '') +
                        (resDictData.order_model.find(item => item.dictValue == editInfo.form.model)?.remark || '') +
                        (editInfo.form.materialLayer || '') +
                        (resDictData.order_surface_treatment.find((v: any) => v.dictLabel == editInfo.form.surfaceTreatment)?.dictValue || '')}}
                      </template>
                      <template #append>{{editInfo.form.version || ''}}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="15">
                  <el-button size="small" type="text" v-clipboard="() => editInfo.form.commodityCode"
                  >复制
                  </el-button>
                  <el-button size="small" type="text" @click="getNextNumber(editInfo.form)">设置流水</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>


          <el-col :span="4">
            <el-form-item label="订单类型" prop="orderType">
              <el-select suffix-icon="" v-model="editInfo.form.orderType" placeholder=" ">
                <el-option v-for="item in resDictData.order_type" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="包装要求" prop="packRequirement">
              <el-select suffix-icon="" v-model="editInfo.form.packRequirement" placeholder=" ">
                <el-option v-for="item in resDictData.order_packaging_requirements" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料编码" prop="materialNumber">
              <el-input type="text" v-model="editInfo.form.materialNumber" :maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="materialName">
              <el-input type="text" v-model="editInfo.form.materialName" :maxlength="100"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="订单特殊要求" prop="specialRequirement" label-width="75px">
              <el-input type="textarea" rows="1" v-model="editInfo.form.specialRequirement"
                        placeholder=" " :maxlength="2000"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="板材" prop="materialQuality">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.materialQuality"
                placeholder=" "
                @change="saveDict(editInfo.form.materialQuality,'order_material_quality')"
                filterable :disabled="['2'].includes(editInfo.form.orderType)"
                allow-create
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_material_quality" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="板材品牌" prop="materialBrand">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.materialBrand"
                placeholder=" "
                @change="saveDict(editInfo.form.materialBrand,'order_plate_brand')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_plate_brand" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="板材级别" prop="materialLevel">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.materialLevel"
                placeholder=" "
                @change="saveDict(editInfo.form.materialLevel,'order_material_level')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_material_level" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="成品板厚" prop="commodityThickness">
              <el-select
                suffix-icon="" class="height-light font-14"
                v-model="editInfo.form.commodityThickness"
                placeholder=" "
                @change="saveDict(editInfo.form.commodityThickness,'finish_plate_thickness')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.finish_plate_thickness" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="外层铜厚" prop="materialCopperOutside">
              <el-select
                suffix-icon="" class="height-light font-14"
                v-model="editInfo.form.materialCopperOutside"
                placeholder=" "
                @change="saveDict(editInfo.form.materialCopperOutside,'order_material_copperoutside')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_material_copperoutside" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="内层铜厚" prop="materialCopperInside">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.materialCopperInside"
                placeholder=" "
                @change="saveDict(editInfo.form.materialCopperInside,'order_material_copperinside')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_material_copperinside" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="单片尺寸" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="singleLength" class="flex-start">
                    <el-input type="number" v-model="editInfo.form.singleLength" placeholder=" " :disabled="['2'].includes(editInfo.form.orderType)">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="1">X</el-col>
                <el-col :span="12">
                  <el-form-item prop="singleWidth" class="flex-start">
                    <el-input type="number" v-model="editInfo.form.singleWidth" placeholder=" " :disabled="['2'].includes(editInfo.form.orderType)">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联片尺寸" required>
              <el-row>
                <el-col :span="9">
                  <el-form-item prop="unitedLength" class="flex-start">
                    <el-input type="number" v-model="editInfo.form.unitedLength" placeholder=" " :disabled="['2'].includes(editInfo.form.orderType)"
                              @input="countPriceAndArea(editInfo.form)">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="1">X</el-col>
                <el-col :span="9">
                  <el-form-item prop="unitedWidth" class="flex-start">
                    <el-input type="number" v-model="editInfo.form.unitedWidth" placeholder=" " :disabled="['2'].includes(editInfo.form.orderType)"
                              @input="countPriceAndArea(editInfo.form)">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item prop="unitedNumber" class="flex-start">
                    <el-input type="number" v-model="editInfo.form.unitedNumber" disabled>
                      <template #append>pcs</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="连片方式" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="unitedWayLength" class="error-left-one">
                    <el-input type="number" v-model="editInfo.form.unitedWayLength" :disabled="['2'].includes(editInfo.form.orderType)"
                              @input="countPriceAndArea(editInfo.form)"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="2">X</el-col>
                <el-col :span="11">
                  <el-form-item prop="unitedWayWidth" class="error-left">
                    <el-input type="number" v-model="editInfo.form.unitedWayWidth" :disabled="['2'].includes(editInfo.form.orderType)"
                              @input="countPriceAndArea(editInfo.form)"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="产品备注" prop="commodityRemark">
              <el-input type="textarea" rows="1" v-model="editInfo.form.commodityRemark" placeholder=" " :maxlength="2000"></el-input>
            </el-form-item>
          </el-col>
          <el-divider/>

          <el-col :span="4">
            <el-form-item label="阻焊颜色" prop="commoditySolder">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.commoditySolder"
                placeholder=" "
                @change="saveDict(editInfo.form.commoditySolder,'order_commodity_solder')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_commodity_solder" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="阻焊面数" prop="commoditySolderCount">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.commoditySolderCount"
                placeholder=" "
                @change="saveDict(editInfo.form.commoditySolderCount,'order_commodity_solder_count')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_commodity_solder_count" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="金厚" prop="goldenThickness">
              <el-input v-model="editInfo.form.goldenThickness" :disabled="['2'].includes(editInfo.form.orderType)">
                <template #append>u''</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="字符" prop="characterColor">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.characterColor"
                placeholder=" "
                @change="saveDict(editInfo.form.characterColor,'order_character')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_character" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="字符面数" prop="characterCount">
              <el-select
                suffix-icon=""
                v-model="editInfo.form.characterCount"
                placeholder=" "
                @change="saveDict(editInfo.form.characterCount,'order_character_count')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_character_count" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="成形方式" prop="commodityForm" class="error-left">
              <el-select
                suffix-icon=""
                v-model="editInfo.form.commodityForm"
                placeholder=" "
                @change="saveDict(editInfo.form.commodityForm,'order_commodity_form')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_commodity_form" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="测试方式" prop="commodityTestWay">
              <el-select
                suffix-icon="" class="height-light"
                v-model="editInfo.form.commodityTestWay"
                placeholder=" "
                @change="saveDict(editInfo.form.commodityTestWay,'order_commodity_testway')"
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_commodity_testway" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试架" prop="testFrame">
              <el-select suffix-icon=""
                         v-model="editInfo.form.testFrame"
                         placeholder=" "
                         @change="saveDict(editInfo.form.testFrame,'order_test_stand')"
                         filterable
                         allow-create
                         default-first-option
                         :reserve-keyword="false"

                         style="width: 440px"
              >
                <el-option v-for="dict in resDictData.order_test_stand" :key="dict.dictValue" :label="dict.dictLabel"
                           :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="测试点" prop="testPoint">
              <el-input class="height-light" v-model="editInfo.form.testPoint" :disabled="['2'].includes(editInfo.form.orderType)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="过孔要求" prop="holeRequirement">
              <el-select
                suffix-icon=""
                v-model="editInfo.form.holeRequirement"
                placeholder=" "
                @change="saveDict(editInfo.form.holeRequirement,'order_hole_requirement')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_hole_requirement" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="检验标准" prop="inspectionStandard">
              <el-select
                suffix-icon=""
                v-model="editInfo.form.inspectionStandard"
                placeholder=" "
                @change="saveDict(editInfo.form.inspectionStandard,'order_inspection_standard')"
                filterable
                allow-create :disabled="['2'].includes(editInfo.form.orderType)"
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.order_inspection_standard" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="金面积" prop="goldArea">
              <el-input v-model="editInfo.form.goldArea" maxlength="100" :disabled="['2'].includes(editInfo.form.orderType)"></el-input>
            </el-form-item>
          </el-col>
          <el-divider/>

          <el-col :span="6">
            <el-form-item label="客户PO" prop="customerPo">
              <el-input class="height-light" v-model="editInfo.form.customerPo" :maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户交期" prop="deliveryTime">
              <el-date-picker class="height-light" style="width: 100%" size="small" v-model="editInfo.form.deliveryTime"
                              type="date" :clearable="false" :disabled-date="disabledDateEndOrder"
                              placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD"
                              @change="dispatchTimeChange(editInfo.form)"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提前发货" prop="preDeliveryHour">
              <el-input type="number" v-model="editInfo.form.preDeliveryHour"
                        @change="dispatchTimeChange(editInfo.form)">
                <template #append>小时</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 最迟发货 == 发货日期 -->
            <el-form-item label="最迟发货" prop="dispatchTime">
              <el-date-picker style="width: 100%" size="small" v-model="editInfo.form.dispatchTime" type="datetime"
                              placeholder=" " value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
                              disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <!-- 订单数量 == 订购数量 -->
            <el-form-item label="订购数量" prop="quantity">
              <el-input class="height-light font-14" type="number" v-model="editInfo.form.quantity"
                        @blur="countQuantity(editInfo.form)">
                <template #append>pcs</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加急" prop="urgent">
              <el-select suffix-icon="" class="height-light" v-model="editInfo.form.urgent" placeholder=" ">
                <el-option v-for="item in resDictData.order_urgent" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否含税" prop="isTax">
              <el-select suffix-icon="" class="height-light font-14" v-model="editInfo.form.isTax" disabled placeholder=" ">
                <el-option label="含税" value="1"/>
                <el-option label="不含税" value="0"/>
              </el-select>
<!--           <el-switch v-model="editInfo.form.isTax" active-value="1" inactive-value="0" active-text="含税"-->
<!--                         inactive-text="不含税" disabled/>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="产品库存">
              <div class="global-flex flex-start append-btn">
                <el-input v-model="editInfo.form.productInventory" disabled>
                  <template #append>
                    <el-button :loading="productLoading" icon="Refresh" @click="queryInventoryByCommodityHandle(editInfo.form.commodityCode, editInfo.form)"></el-button>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="订单面积" prop="area">
              <el-input class="height-light font-14" type="number" v-model="editInfo.form.area"
                        @change="countPriceByArea(editInfo.form)" :model-value="countArea(editInfo.form)" disabled>
                <template #append>㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平米价" prop="areaPrice">
              <el-input class="height-light font-14" type="number" v-model="editInfo.form.areaPrice"
                        @blur="countPrice(editInfo.form)">
                <template #append>元/㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单价" prop="price">
              <el-input class="height-light font-14" type="number" v-model="editInfo.form.price"
                        @blur="countPriceOther(editInfo.form)">
                <template #append>元/pcs</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品类型" prop="commodityType">
              <el-select
                suffix-icon="" :disabled="['2'].includes(editInfo.form.orderType)"
                v-model="editInfo.form.commodityType"
                placeholder=" "
                @change="saveDict(editInfo.form.commodityType,'sys_commodity_type')"
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"

                style="width: 440px"
              >
                <el-option v-for="item in resDictData.sys_commodity_type" :key="item.dictValue"
                           :label="item.dictLabel"
                           :value="item.dictValue"

                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="订单备注" prop="remark">
              <el-input type="textarea" rows="1" v-model="editInfo.form.remark" placeholder=" " :maxlength="1000"></el-input>
            </el-form-item>
          </el-col>
          <el-divider/>

          <el-col :span="4">
            <el-form-item label="模具费" prop="mouldCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="editInfo.form.mouldCost" @change="countPriceOther(editInfo.form)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="测试架费" prop="testFrameCost">
              <el-input class="number-left height-light font-14" style="width: 100%;" v-model="editInfo.form.testFrameCost" @change="countPriceOther(editInfo.form)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="飞针费" prop="flyProbeCost">
              <el-input class="number-left height-light font-14" style="width: 100%;" v-model="editInfo.form.flyProbeCost" @change="countPriceOther(editInfo.form)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="工程费" prop="engineeringCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="editInfo.form.engineeringCost" @change="countPriceOther(editInfo.form)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="样板费" prop="sampleCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="editInfo.form.sampleCost" @change="countPriceOther(editInfo.form)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="加急费" prop="expeditedCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="editInfo.form.expeditedCost" @change="countPriceOther(editInfo.form)"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="其他费用" prop="otherCostList" label-width="75px">
              <template #label>
                <el-row>
                  <el-col :span="20">
                    <div style="line-height:28px;">其他费用</div>
                  </el-col>
                  <el-col :span="4" class="pointer" @click="addOtherCostList">
                    <el-button icon="Plus" link type="primary"></el-button>
                  </el-col>
                </el-row>
              </template>
              <el-row style="width: 100%;">
                <template v-for="(other, index) in editInfo.form.otherCostList" :key="index">
                  <el-col :span="6">
                    <el-row>
                      <el-col :span="10">
                        <el-input v-model="other.title"></el-input>
                      </el-col>
                      <el-col :span="10">
                        <el-form-item :prop="`otherCostList.${index}.price`" :rules="[{required: false, validator: towFloadNegativeHandle, trigger: 'blur'}]">
                          <el-input class="number-left font-14" style="width: 100%;" v-model="other.price" @change="countPriceOther(editInfo.form)"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4" style="text-align: center;" class="pointer" @click="delOtherCostList(index)">
                        <el-button icon="Close" link type="primary"></el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </template>
              </el-row>
            </el-form-item>
          </el-col>

          <el-divider content-position="left"></el-divider>
          <!-- <el-col :span="8">
            <el-form-item label="含税要求" prop="minLineWidth">
              <el-input class="height-light" type="number" v-model="editInfo.form.minLineWidth"><template #append>mm</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="EQ确认后，样品交货天数" prop="minLineWidth">
              <el-input class="height-light" type="number" v-model="editInfo.form.minLineWidth"><template #append>mm</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="EQ确认后，产量交货天数" prop="minLineWidth">
              <el-input class="height-light" type="number" v-model="editInfo.form.minLineWidth"><template #append>mm</template></el-input>
            </el-form-item>
          </el-col>
          <el-divider/> -->

          <el-col :span="6">
            <el-form-item label="最小线宽" prop="minLineWidth">
              <el-input class="height-light" type="number" v-model="editInfo.form.minLineWidth">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最小线距" prop="minLineSpace">
              <el-input class="height-light" type="number" v-model="editInfo.form.minLineSpace">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最小孔径" prop="minAperture">
              <el-input class="height-light" type="number" v-model="editInfo.form.minAperture">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总孔数" prop="holeCount">
              <el-input class="font-14" type="number" v-model="editInfo.form.holeCount"  :min="0" @change="holeCountnumber()">
                <template #append>/连扳(SLOT)</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="孔密度" prop="holeDensity">
              <el-input class="height-light" type="number" v-model="editInfo.form.holeDensity">
                <template #append>万/m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18" class="checkbox-disable-normal">
            <el-checkbox false-label="0" true-label="1"  style="margin-left:10px" v-model="editInfo.form.hasAcknowledgment" label="承认书/出货报告" />
            <el-checkbox false-label="0" true-label="1"  v-model="editInfo.form.hasImpedanceReport" label="阻抗报告" />
            <el-checkbox false-label="0" true-label="1"  v-model="editInfo.form.hasSection" label="切片" />
            <el-checkbox false-label="0" true-label="1"  v-model="editInfo.form.hasImpedanceBar" label="阻抗条" />
            <el-checkbox false-label="0" true-label="1"  v-model="editInfo.form.hasSealedSample" label="封样" />
            <el-checkbox false-label="0" true-label="1"  v-model="editInfo.form.hasFilm" label="菲林" />
          </el-col>

          <el-col :span="24" style="margin-bottom: 5px;">
            <XUpload v-model:model-value="editInfo.form.saleOrderFileList" model="download"></XUpload>
          </el-col>
          <el-col :span="24" style="margin-bottom: 5px;"
                  v-if="editInfo.form.popoverFileList?.filter((v: any) => v.delFlag == 0).length">
            <XTable ref="popFileRef" :data="editInfo.form.popoverFileList?.filter((v: any) => v.delFlag == 0)" border
                    :columnList="quotionFileList" :pageShow="false">
              <template #default-make="{row}">
                <el-button link type="primary" @click="deleteDirectOrderEvent(row)">删除</el-button>
                <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
              </template>
            </XTable>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <el-row>
          <el-col :span="8" style="text-align: left;">
            总价：{{ totalOrderPriceShow }}元
          </el-col>
          <el-col :span="8" style="text-align: center;">
            税金：{{ countTax(editInfo.form) }}元
          </el-col>
          <el-col :span="8" style="text-align: right;">
            总金额：{{ totalPriceShow }}元
          </el-col>
        </el-row>
        <div style="display: flex;justify-content:center;width: 100%;margin-top: 5px;">
          <el-button @click="cancelProdDrawer">取消</el-button>
          <el-button type="primary" @click="saveProdDrawer">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="DirectOrder" lang="ts">
  import fileSaver from "file-saver";
  import {ref} from "vue";
  import dayjs from "dayjs";
  import {VXETable, VxeTableInstance} from "vxe-table";
  import {VxeTablePropTypes} from "vxe-table";

  import {getListCustomer, getCustomer, addCustomer} from "@/api/basedata/customer";
  import {CustomerForm, CustomerVO} from "@/api/basedata/customer/types";
  import {getDicts, saveDictData} from "@/api/system/dict/data";
  import {listUserByRoleKey} from "@/api/system/user";
  import {UserVO} from "@/api/system/user/types";
  import {CustomerAddressForm, CustomerAddressQuery, CustomerAddressVO} from "@/api/basedata/customerAddress/types";
  import {
    addCustomerAddress,
    listCustomerAddress,
    listCustomerAddressByCusId,
    updateCustomerAddress
  } from "@/api/basedata/customerAddress";
  import {DirectOrder, OrderVO} from "@/api/order/directOrder/types";
  import {
    listOrder,
    saveOrder,
    getOrderList,
    getSerialNumber,
    getOrder,
    queryOrderStatus,
    delOrder,
    setRecall
  } from "@/api/order/directOrder";
  import { queryInventoryByCommodity } from '@/api/inventory/inventory/index'
  import {deepClone} from "@/utils";
  import {listCommodity} from "@/api/order/commodity";
  import {CommodityForm, CommodityQuery, CommodityVO} from "@/api/order/commodity/types";
  import {getQuotation, getQuotationList} from "@/api/order/quotation";
  import {sortBy} from "@/utils/dict";
  import {getToken} from "@/utils/auth";
  import {changeItemVO} from "@/api/project/ecn/types";
  // import {useClipboard} from '@vueuse/core'
  import {downloadUrl} from "@/api/upload";
  import {DirectMaterialBorrow} from "@/api/purchase/materialBorrow/types";
  import {getReportUrl} from "@/utils/report";
  import useTagsViewStore from '@/store/modules/tagsView';
  import { Decimal } from 'decimal.js'
  //copy是复制的函数  copied 是boolean值 是否已复制完成  isSupported 检查浏览器是否支持
  // const {copy, copied} = useClipboard()
  // watch(() => copied.value, (val) => {
  //   if (val) {
  //     ElMessage.success('复制成功')
  //   }
  // })
  const productLoading = ref(false)
  const isSale = ref(false)
  const isQuot = ref(false)
  const isDisabled = ref(false)
  const addProdRef = ref()
  const route = useRouter()
  const dialogTableLoading = ref(false)
  const tempRouteQuery = ref<any>()

  const emits = defineEmits(['save', 'finish', 'close'])
  const props = withDefaults(defineProps<{
    isComp?: boolea,
    code?: string,
    id?: string,
    cusId?: string
  }>(), {
    isComp: false,
  })

  const totalPriceShow = computed(() => {
    return (editInfo.form.totalPrice == 'NaN' ? 0 : editInfo.form.totalPrice) || 0
  })
  const totalOrderPriceShow = computed(() => {
    return (editInfo.form.totalOrderPrice == 'NaN' ? 0 : editInfo.form.totalOrderPrice) || 0
  })
  /**
   * 查看弹框，文件列表
   */
  const quotionFileList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60'},
    {title: '文件名', field: 'name', align: 'center', minWidth: '200'},
    {title: '上传人', field: 'createByName', align: 'center', width: '70'},
    {title: '文件大小', field: 'size', align: 'center', width: '80'},
    {title: '上传日期', field: 'createTime', align: 'center', width: '120'},
    {title: '操作', field: 'make', align: 'center', width: '120'},
  ])
  //一般产品参数，用于保存时无参异常替换
  const commonCommodityOrderVo: OrderVO = reactive({
    id: "",
    code: "",
    placeOrderTime: "",
    cusId: "",
    cusPrincipal: "",
    cusPrincipalPhone: "",
    cusFax: "",
    cusPaymentMethod: "",
    cusMonthlyStatementWay: "",
    cusCurrency: "",
    cusExchangeRate: 0,
    cusTransStyle: "",
    cusAddress: "",
    cusQualityStand: "",
    cusAddressId: "",
    cusEmail: "",
    cusCustomerData: undefined,
    cusSaleUserId: "",
    cusIsTaxRate: "1",
    cusRemark: "",
    commodityName: "",
    commodityType: "",
    commodityId: "",
    commodityCode: "",
    surfaceTreatment: "",
    model: "",
    materialLayer: "1",
    version: "A0",
    serialNumber: "",
    materialNumber: "",
    materialName: "",
    specialRequirement: "",
    packRequirement: "",
    materialQuality: "",
    materialBrand: "",
    materialLevel: "",
    commodityThickness: "",
    materialCopperOutside: "",
    materialCopperInside: "",
    remark: "",
    commodityRemark: "",
    singleWidth: 0,
    singleLength: 0,
    unitedWidth: 0,
    unitedLength: 0,
    unitedNumber: 0,
    unitedWayLength: 0,
    unitedWayWidth: 0,
    commoditySolder: "",
    commoditySolderCount: "",
    goldenThickness: "",
    commoditySolderGloss: "",
    commoditySolderRequirement: "",
    poreCopper: "",
    characterColor: "",
    characterCount: "",
    commodityForm: "",
    characterRequirement: "",
    setCross: "",
    warpagePlate: "",
    commodityTestWay: "",
    testPoint: 0,
    spareQuantity: 0,
    copperFoil: "",
    vCut: "",
    holeRequirement: "",
    inspectionStandard: "",
    goldArea: 0,
    pp: "",
    nickelThickness: 0,
    tinThickness: 0,
    minLineWidth: 0,
    minLineSpace: 0,
    minAperture: 0,
    holeCount: 0,
    holeDensity: 0,
    submitUserId: "",
    submitTime: "",
    auditUserId: "",
    auditTime: "",
    auditComment: "",
    customerPo: "",
    deliveryTime: "",
    dispatchTime: "",
    quantity: 0,
    urgent: "",
    area: 0,
    price: 0,
    areaPrice: 0,
    orderType: "1",
    totalPrice: 0,
    totalOrderPrice: 0,
    tax: 0,
    engineeringCost: 0,
    testFrameCost: 0,
    flyProbeCost: 0,
    mouldCost: 0,
    expeditedCost: 0,
    otherCost: 0,
    sampleCost: 0,
    flowStatus: undefined,
    status: "",
    preDeliveryHour: 48
  });
    const getRouterData = () => {
      if (props.code) {
        isSale.value = true
        // if (tempRouteQuery.value == JSON.stringify(route.currentRoute.value.query)) return
        const code: any = props.code;
        const orderVo = {
          code: code
        }
        // console.log('-----', code);
        getOrderList(orderVo).then(res => {
          // console.log(orderVo);
          isDisabled.value = res.data.some((item: any) => !['1','3'].includes(item.status))
          // const orderRes: OrderVO[] = res.data;
          const rules = [['id', 'asc']];
          console.log(res.data)
          console.log(sortBy(res.data,rules))
          const orderRes: OrderVO[] = sortBy(res.data,rules);
          formInline.customerId = orderRes[0].cusId
          formInline.placeOrderTime = orderRes[0].placeOrderTime
          formInline.companyPrincipal=orderRes[0].cusPrincipal;
          formInline.companyPrincipalPhone=orderRes[0].cusPrincipalPhone;
          formInline.faxes=orderRes[0].cusFax;
          formInline.paymentMethod=orderRes[0].cusPaymentMethod;
          formInline.monthlyMethod=orderRes[0].cusMonthlyStatementWay;
          formInline.currency=orderRes[0].cusCurrency;
          formInline.shippingType=orderRes[0].cusTransStyle;
          formInline.checkStandard=orderRes[0].cusQualityStand;
          formInline.customerData=orderRes[0].cusCustomerData;
          formInline.email=orderRes[0].cusEmail;
          formInline.addressId=orderRes[0].cusAddressId;
          formInline.cusSaleUserId=orderRes[0].cusSaleUserId;
          if (formInline.currency == '人民币') {
            formInline.exchangeRate = 1;
          }else{
            formInline.exchangeRate=orderRes[0].cusExchangeRate;
          }
          formInline.isTax=orderRes[0].cusIsTaxRate;
          formInline.remark=orderRes[0].cusRemark;
          // getCustomerInfo();
          getCustomer(orderRes[0].cusId).then(res => {
              const info = res.data;
              /*Object.keys(info).forEach((item) => {
                formInline[item] = info[item] ? info[item] : formInline[item];
              })*/
              formInline.customerCode=res.data.customerCode;
              queryParamsAddress.value.customerId = info.id;
             /* let salerList = info.salerList
              if (salerList) {
                formInline.cusSaleUserId = salerList[0];
              }*/
              changeIsTax(info.isTax);
              getAddressList(formInline.customerId);
              isDisabledUser(info.sysUserList)
            });
          orderRes.forEach(item => {
            const dayjs1 = dayjs(item.deliveryTime);
            const dayjs2 = dayjs(item.dispatchTime);
            // 提前发货时间
            let preDeliveryHour = Math.abs(dayjs1 - dayjs2) / (60 * 60 * 1000); // 将毫秒转换为小时并取绝对值*/
            item.preDeliveryHour=preDeliveryHour;
           // item.code=undefined;
            item.singleLength = Number(item.singleLength || 0).toFixed(2)
            item.singleWidth = Number(item.singleWidth || 0).toFixed(2)
            item.unitedLength = Number(item.unitedLength || 0).toFixed(2)
            item.unitedWidth = Number(item.unitedWidth || 0).toFixed(2)

            item.engineeringCost = Number(item.engineeringCost || 0).toFixed(2)
            item.testFrameCost = Number(item.testFrameCost || 0).toFixed(2)
            item.flyProbeCost = Number(item.flyProbeCost || 0).toFixed(2)
            item.mouldCost = Number(item.mouldCost || 0).toFixed(2)
            item.expeditedCost = Number(item.expeditedCost || 0).toFixed(2)
            item.sampleCost = Number(item.sampleCost || 0).toFixed(2)
            item.otherCost = Number(item.otherCost || 0).toFixed(2)
            if (item.otherCostList?.length) {
              item.otherCostList.map((v: any) => {
                v.price = Number(v.price || 0).toFixed(2)
              })
            }
          })
          tableData.value = orderRes;
          //tableData.value.some()
          // tableData.value = tableData.value.concat(orderRes);
        });

        // tempRouteQuery.value = JSON.stringify(route.currentRoute.value.query)
      }
    }
  /**
   *生成销售合同路由数据
   */
  const getQuotationRouterData = async () => {
    if (props.id) {
      isQuot.value = true
      // if (tempRouteQuery.value == JSON.stringify(route.currentRoute.value.query)) return
      formInline.placeOrderTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      //报价表的主键 批量
      const id: any = props.id;
      var idList = id.split(",");
      const directOrder: DirectOrder = {
        idList: undefined,
      }
      directOrder.idList = idList;
      //查询报价表详情
      const res = await getQuotationList(directOrder);
      // Object.assign(tableData.value, res.data);
      tableData.value = res.data
      // console.log(tableData.value);
      tableData.value.forEach(info => {
        info.preDeliveryHour = 48;
        info.saleQuotationId = info.id;
        info.id = "";
        info.code="";
        info.createByName = null;
      /*  const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => accumulator + Number(currentValue.price), 0);
        currentRow.value.otherCost = sum;*/
        if (info.otherCostQuotationList?.length > 0){
          info.otherCost  =info.otherCostQuotationList.reduce((accumulator, currentValue) => accumulator + Number(currentValue.price), 0).toFixed(2);
          info.otherCostQuotationList.forEach(item => {
            item.id="";
            item.price = Number(item.price || 0).toFixed(2)
          })
        }
        info.engineeringCost = Number(info.engineeringCost || 0).toFixed(2)
        info.testFrameCost = Number(info.testFrameCost || 0).toFixed(2)
        info.flyProbeCost = Number(info.flyProbeCost || 0).toFixed(2)
        info.mouldCost = Number(info.mouldCost || 0).toFixed(2)
        info.expeditedCost = Number(info.expeditedCost || 0).toFixed(2)
        info.sampleCost = Number(info.sampleCost || 0).toFixed(2)

        info.otherCostList=info.otherCostQuotationList;
        info.quotationFileList?.length && info.quotationFileList.forEach(info=>{
          info.id="";
        })
        info.popoverFileList=info.quotationFileList;
        info.singleLength = Number(info.singleLength || 0).toFixed(2)
        info.singleWidth = Number(info.singleWidth || 0).toFixed(2)
        info.unitedLength = Number(info.unitedLength || 0).toFixed(2)
        info.unitedWidth = Number(info.unitedWidth || 0).toFixed(2)
      })
      // console.log('666---',tableData.value);
      //获取客户表主键
      const cusId: any = props.cusId;
      getCustomer(cusId).then(resd => {
        const info = resd.data;
        // console.log(info);
       /* Object.keys(info).forEach((item) => {
          formInline[item] = info[item] ? info[item] : formInline[item];
        });*/

        formInline.customerCode=info.customerCode;
        formInline.customerName=info.customerName;
        formInline.paymentMethod=info.paymentMethod;
        formInline.monthlyMethod=info.monthlyMethod;
        formInline.shippingType=info.shippingType;
        formInline.checkStandard=info.checkStandard;
        formInline.customerData=info.customerData;
        isDisabledUser(info.sysUserList)

      });
      //客户数据 客户数据从报价表中获取
      formInline.customerId = res.data[0].cusId;
      formInline.companyPrincipal=res.data[0].companyPrincipal;
      formInline.companyPrincipalPhone=res.data[0].companyPrincipalPhone;
      formInline.faxes=res.data[0].faxes;
      formInline.currency=res.data[0].currency;
      formInline.exchangeRate=res.data[0].exchangeRate;
      formInline.email=res.data[0].email;
      formInline.addressId=res.data[0].addressId;
      formInline.cusSaleUserId=res.data[0].saleUserId;
      formInline.isTax=res.data[0].cusIsTaxRate;
      formInline.remark=res.data[0].cusRemark;
      queryParamsAddress.value.customerId = formInline.customerId;
      getAddressList(formInline.customerId);

      // tempRouteQuery.value = JSON.stringify(route.currentRoute.value.query
    }
  }

  const queryInventoryByCommodityHandle = (value: any, row: any) => {
    productLoading.value = true
    queryInventoryByCommodity({code: value}).then((res) => {
      // console.log(res)
      row.productInventory = res?.data || 0
      productLoading.value = false
    }).catch(() => {
      productLoading.value = false
    })
  }

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const addCustomerFormRef = ref<ElFormInstance>();

  const dispatchTimeChange = (row: OrderVO) => {
    if (row.preDeliveryHour != 0 && row.preDeliveryHour!=undefined) {
      const dayjs1 = dayjs(row.deliveryTime);
      const dayjs2 = dayjs1.subtract(row.preDeliveryHour, 'hour');
      row.dispatchTime = dayjs2.format("YYYY-MM-DD HH:mm:ss");
    }else{
      row.dispatchTime= dayjs(row.deliveryTime).format("YYYY-MM-DD HH:mm:ss");
    }
  }

  const getAddressList = (value: any, flag: boolean = false) => {
    loading.value = true;
    listCustomerAddressByCusId(value).then(res => {
      customerAddressList.value = res;
      if (flag) {
        formInline.addressId = undefined
      }
      if (customerAddressList.value.length > 0 && !formInline.addressId) {
        const info = customerAddressList.value.find(item => item.isDefault == 1&&item.status==1);
        if (info) {
          formInline.addressId = info.id
        } else {
          let select = customerAddressList.value.find(item => item.status==1);
          formInline.addressId = select?.id
        }
      }
    });


    loading.value = false;
  }

  //查询地址列表
/*  const getAddressList = async () => {
    loading.value = true;
    listCustomerAddress(queryParamsAddress.value).then(res => {
      customerAddressList.value = res.rows;
      if (customerAddressList.value.length > 0) {
        const info = customerAddressList.value.find(item => item.isDefault == 2)
        if (info) {
          formInline.addressId = info.id
        } else {
          formInline.addressId = customerAddressList.value[0].id
        }
      }
    });
    loading.value = false;
  };*/

  const changeIsTax = (value: number) => {
    tableData.value.forEach(row => {
      if (formInline.isTax == 1) {
        // console.log(taxRate.value)
        row.totalOrderPrice = Number(((row.totalPrice || 0) / (1 + taxRate.value)).toFixed(2))
      } else {
        row.totalOrderPrice = Number(row.totalPrice || 0).toFixed(2) || 0;
      }
    })
    nextTick(() => {
      if (xTable.value) {
        xTable.value.reloadData(tableData.value)
      }
    })
  }

  const changeCurrency = (value: number) => {
    if (value == '人民币') {
      formInline.exchangeRate = 1;
    }
  }
  const cusIsTaxRateValue = (row: OrderVO) => {
    row.cusIsTaxRate = String(formInline.isTax);
  }

  const countArea = (row: OrderVO) => {
    const area = Number(row.quantity / (row.unitedWayLength * row.unitedWayWidth) * (row.unitedLength * row.unitedWidth) / 1000000);
    if (isNaN(area)) {
      row.area = 0;
    } else {
      row.area = Number(area.toFixed(4));
    }
    return row.area;
  }

  const countTax = (row: OrderVO) => {
    const tax = (row.totalPrice - row.totalOrderPrice) || 0;
    row.tax = formInline.isTax == 1 ? Number(tax.toFixed(2)) : 0;
    return row.tax;
  }

  const countPrice = (row: OrderVO) => {
    row.price = (returnNumber(row.areaPrice) * (returnNumber(row.unitedLength) * returnNumber(row.unitedWidth)) / returnNumber(row.unitedNumber) / 1000000).toFixed(4)
    countAreaPrice(row)
    countTotalPrice(row)
  }

  const returnNumber = (val: any) => {
    return Number(val || 0)
  }
  const countAreaPrice = (row: OrderVO) => {
    const areaPrice = (returnNumber(row.price) * returnNumber(row.unitedNumber) / (returnNumber(row.unitedLength) * returnNumber(row.unitedWidth)) * 1000000).toFixed(4)
    // console.log(row.price, row.unitedNumber, row.unitedLength, row.unitedWidth, (returnNumber(row.price) * returnNumber(row.unitedNumber) / (returnNumber(row.unitedLength) * returnNumber(row.unitedWidth)) * 1000000))
    if (isNaN(areaPrice)) {
      row.areaPrice = 0;
    } else {
      row.areaPrice = Number(areaPrice).toFixed(4);
      //总金额
      row.totalPrice = Number(parseFloat(row.price) * parseFloat(row.quantity)).toFixed(2);
      if (formInline.isTax == 1) {
        //不含税总价
        row.totalOrderPrice = Number(parseFloat(row.totalPrice) / (1 + taxRate.value)).toFixed(2);
        //税金
        row.tax = Number(parseFloat(row.totalPrice) - parseFloat(row.totalOrderPrice)).toFixed(2);
      } else {
        row.totalOrderPrice = Number(parseFloat(row.totalPrice)).toFixed(2);
      }
    }
  }

  const countQuantity = (row: OrderVO, column?: any) => {
    //计算面积
    row.area = Number(parseFloat(row.quantity) / parseFloat(row.unitedNumber) * parseFloat(row.unitedLength) * parseFloat(row.unitedWidth) / 1000000).toFixed(4);
    //总金额
    row.totalPrice = Number(parseFloat(row.price) * parseFloat(row.quantity)).toFixed(2);
    countTotalPrice(row)

    if (row && column) {
      xTable.value?.updateStatus({row,column});
    }
  }

  const countPriceAndArea = (row: OrderVO) => {
    //计算联片数量
    row.unitedNumber = parseFloat(row.unitedWayLength) * parseFloat(row.unitedWayWidth);
    //计算订单面积 (订单面积（㎡）=订购数量/连片方式（长+宽）*连片尺寸（长*宽）/1000000）
    row.area = Number(parseFloat(row.quantity) / parseFloat(row.unitedNumber) * parseFloat(row.unitedLength) * parseFloat(row.unitedWidth) / 1000000).toFixed(4);
    countPriceOther(row)
    // holeCountnumber()
    holeTableCountnumber(row)
  }

  // 计算膜具费 得到 总金额
  const countTotalPrice = (row: any) => {
    row.totalPrice = Number(parseFloat(row.price) * parseFloat(row.quantity));
    row.totalPrice = returnNumber(row.totalPrice) + returnNumber(row.mouldCost) + returnNumber(row.testFrameCost) + returnNumber(row.flyProbeCost) + returnNumber(row.engineeringCost) + returnNumber(row.sampleCost) + returnNumber(row.expeditedCost)
    if (row.otherCostList?.length) {
      row.otherCostList.forEach((item: any) => {
        row.totalPrice += returnNumber(item.price)
      })
    }
    row.totalPrice = returnNumber(row.totalPrice).toFixed(2)
    if (formInline.isTax == 1) {
      //不含税总价
      row.totalOrderPrice = Number(parseFloat(row.totalPrice) / (1 + taxRate.value)).toFixed(2);
      //税金
      row.tax = Number(parseFloat(row.totalPrice) - parseFloat(row.totalOrderPrice)).toFixed(2);
    } else {
      //不含税总价
      row.totalOrderPrice = Number(parseFloat(row.totalPrice)).toFixed(2);
    }
  }

  // 计算膜具费 得到 总金额
  const countPriceOther = (row: any) => {
    countAreaPrice(row)
    countTotalPrice(row)
  }

  const countPriceByArea = (row: OrderVO) => {
    const price = Number(row.area * row.areaPrice / row.quantity);
    if (isNaN(price)) {
      row.price = 0;
    } else {
      row.price = Number(price.toFixed(4));
    }
    const totalOrderPrice = Number(row.area * row.areaPrice);
    row.totalOrderPrice = Number(totalOrderPrice.toFixed(2));
    if (formInline.isTax == 1) {
      row.totalPrice = Number((row.totalOrderPrice / (1 + taxRate.value)).toFixed(2))
    } else {
      row.totalPrice = row.totalOrderPrice;
    }

  }

  const total = ref(0);
  const buttonLoading = ref(false);
  //地址
  const customerAddressList = ref<CustomerAddressVO[]>([]);
  //客户
  const customerList = ref<CustomerVO[]>([]);


  let resDictData = ref<Record<string, any>>({
    //客户级别
    customer_level: [],
    //付款方式
    payment_method: [],
    //月结方式
    monthly_method: [],
    //币种
    currency_type: [],
    //运输方式
    shipping_type: [],
    //检验标准
    check_standard: [],
    //客户资料
    customer_data: [],
    //对账日期
    reconciliation_time: [],
    //表面处理
    order_surface_treatment: [],
    //批量/样品
    order_model: [],
    //产品类型
    sys_commodity_type: [],
    //订单类型
    order_type: [],
    //包装要求
    order_packaging_requirements: [],
    //板材
    order_material_quality: [],
    //板材品牌
    order_plate_brand: [],
    //板材级别
    order_material_level: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //阻焊颜色
    order_commodity_solder: [],
    //阻焊面数
    order_commodity_solder_count: [],
    //字符颜色
    order_character: [],
    //字符面数
    order_character_count: [],
    //成型方式
    order_commodity_form: [],
    //测试方式
    order_commodity_testway: [],
    //过孔要求
    order_hole_requirement: [],
    //检验标准
    order_inspection_standard: [],
    //加急
    order_urgent: [],
    //成品板厚
    finish_plate_thickness: [],
    // 测试架
    order_test_stand: []
  })

  //销售人员
  const salerOptions = ref<UserVO[]>([]);

  //税率
  const taxRate = ref(0);


  const customerAddressFormRef = ref<ElFormInstance>();

  const customerFormRef = ref<ElFormInstance>();

  const validRules = ref<VxeTablePropTypes.EditRules<OrderVO>>({
    code: [
      {required: true, message: "订单编号不能为空"}
    ],
    placeOrderTime: [
      {required: true, message: "下单时间不能为空"}
    ],
    cusId: [
      {required: true, message: "客户ID不能为空"}
    ],
    commodityName: [
      {required: true, message: "产品名称不能为空"}
    ],
    commodityId: [
      {required: true, message: "产品id不能为空"}
    ],
    commodityCode: [
      {required: true, validator: 'noOverEighteen', message: "产品编码不能为空"}
    ],
    surfaceTreatment: [
      {required: true, message: "表面处理不能为空"}
    ],
    model: [
      {required: true, message: "批量/样品不能为空"}
    ],
    materialLayer: [
      {required: true, message: "板层不能为空"}
    ],
    version: [
      {required: true, message: "版本号不能为空"}
    ],
    serialNumber: [
      {required: true, message: "流水号不能为空"}
    ],
    materialQuality: [
      {required: true, message: "板材不能为空"}
    ],
    singleWidth: [
      {required: true, validator: 'twoPositiveNumberWithTwoDecimals', message: "单片宽不能为空"}
    ],
    singleLength: [
      {required: true, validator: 'twoPositiveNumberWithTwoDecimals', message: "单片长不能为空"}
    ],
    unitedWidth: [
      {required: true, validator: 'twoPositiveNumberWithTwoDecimals', message: "联片宽不能为空"}
    ],
    unitedLength: [
      {required: true, validator: 'twoPositiveNumberWithTwoDecimals', message: "联片长不能为空"}
    ],
    unitedNumber: [
      {required: true, validator: 'positiveIntValid', message: "联片数量不能为空"}
    ],
    unitedWayLength: [
      {required: true, validator: 'positiveIntValid', message: "连片方式长不能为空"}
    ],
    unitedWayWidth: [
      {required: true, validator: 'positiveIntValid', message: "连片方式宽不能为空"}
    ],
    commoditySolder: [
      {required: true, message: "阻焊颜色不能为空"}
    ],
    characterColor: [
      {required: true, message: "字符颜色不能为空"}
    ],
    commodityForm: [
      {required: true, message: "成形方式不能为空"}
    ],
    commodityTestWay: [
      {required: true, message: "测试方式不能为空"}
    ],
    testPoint: [
      {required: false, validator: 'nullOrZeroAndPositiveIntValid'}
    ],
/*    goldArea: [
      {required: true, validator: 'nullOrPositiveNumberWithTwoDecimals'}
    ],*/
    mouldCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    testFrameCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    flyProbeCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    engineeringCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    sampleCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    expeditedCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    otherCost: [
      {required: false, validator: 'towFloadNegative'}
    ],
    minLineWidth: [
      {required: false, validator: 'nullOrPositiveNumberWithTwoDecimals'}
    ],
    minLineSpace: [
      {required: false, validator: 'nullOrPositiveNumberWithTwoDecimals'}
    ],
    minAperture: [
      {required: false, validator: 'nullOrPositiveNumberWithTwoDecimals'}
    ],
    holeCount: [
      {required: false, validator: 'nullOrZeroAndPositiveIntValid'}
    ],
    // holeDensity: [
    //   {required: false, validator: 'nullOrPositiveNumberWithSixDecimals'}
    // ],
    deliveryTime: [
      {required: true, message: "客户交期不能为空"}
    ],
    quantity: [
      {required: true, message: "订单数量不能为空"},
      {validator: 'nullOrZeroAndPositiveIntValid'},
    ],
    urgent: [
      {required: true, message: "加急不能为空"}
    ],
    area: [
      {required: true,message: "面积不能为空"},
      {validator: 'areaValid',message: "面积只能输入数字"}
    ],
    price: [
      {required: true, message: "单价不能为空"},
      {validator: 'nullOrPositiveNumberWithTwoDecimals',message: "单价只能输入小数"}
    ],
    areaPrice: [
      {required: true,  message: "平米价不能为空", trigger: 'change'},
      // {validator: 'numberValid', message: "平米价不能为空"}
    ],
    orderType: [
      {required: true, message: "订单类型不能为空"}
    ],
    totalPrice: [
      {required: true, message: "含税总价不能为空"},
      // {validator: 'numberValid', message: "含税总价不能为空"}
    ],
    totalOrderPrice: [
      {required: true,  message: "不含税总价不能为空"},
      // {validator: 'numberValid', message: "不含税总价只能输入数字"}
    ],
    tax: [
      {required: true, message: "税金不能为空"}
    ],
    status: [
      {required: true, message: "订单状态不能为空"}
    ]
  })
  // 产品编码不能超过18位
  const noOverEighteen = (cellValue: any) => {
    if (cellValue.length > 18) {
      return new Error('产品编码不能超过18位')
    }
  }
  const disabledDateEndOrder = (data: any) => {
    let res = false
    if (new Date(dayjs(formInline.placeOrderTime).format('YYYY-MM-DD') + ' 00:00:00').getTime() > new Date(data).getTime()) {
      res = true
    }
    return res
  }
  const disabledDateEnd = (data: any) => {
    let res = false
    if (new Date(dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00:00').getTime() > new Date(data).getTime()) {
      res = true
    }
    return res
  }
  VXETable.validators.add('noOverEighteen', {
    cellValidatorMethod({cellValue}) {
      return noOverEighteen(cellValue)
    }
  })
  const noOverEighteenHandle = (rule: any, value: any, callback: any) => {
    callback(noOverEighteen(value))
  }
  // number类型校验
  const areaValid = (cellValue: any) => {
    if (!cellValue || Number(cellValue) <= 0) {
      return new Error('面积不合法，请检查长宽等信息')
    }
  }
  VXETable.validators.add('areaValid', {
    cellValidatorMethod({cellValue}) {
      return areaValid(cellValue)
    }
  })
  const areaValidHandle = (rule: any, value: any, callback: any) => {
    callback(areaValid(value))
  }
  // number类型校验
  const numberValid = (cellValue: any) => {
    if (!/^(([1-9]\d*)|([0][.]{1}[0-9]{0,2}[1-9]+)|([1-9]\d*[.]{1}[0-9]+))$/g.test(cellValue)) {
      return new Error('请输入整数')
    }
  }
  VXETable.validators.add('numberValid', {
    cellValidatorMethod({cellValue}) {
      return numberValid(cellValue)
    }
  })
  const numberValidHandle = (rule: any, value: any, callback: any) => {
    callback(numberValid(value))
  }
  //正整数校验
  const positiveIntValid = (cellValue: any) => {
    if (!/^[1-9]\d*$/.test(cellValue)) {
      return new Error('请输入正整数')
    }
  }
  VXETable.validators.add('positiveIntValid', {
    cellValidatorMethod({cellValue}) {
      return positiveIntValid(cellValue)
    }
  })
  const positiveIntValidHandle = (rule: any, value: any, callback: any) => {
    callback(positiveIntValid(value))
  }
  // 0和正整数校验
  const zeroAndPositiveIntValid = (cellValue: any) => {
    if (!/^[0-9]\d*$/.test(cellValue)) {
      return new Error('请输入数字')
    }
  }
  VXETable.validators.add('zeroAndPositiveIntValid', {
    cellValidatorMethod({cellValue}) {
      return zeroAndPositiveIntValid(cellValue)
    }
  })
  const zeroAndPositiveIntValidHandle = (rule: any, value: any, callback: any) => {
    callback(zeroAndPositiveIntValid(value))
  }
  // 0+正数且小数点后最多4位校验
  const positiveNumberWithTwoDecimals = (cellValue: any) => {
    if (!/^(0|[1-9]\d*)(\.\d{1,4})?$/.test(cellValue)) {
      return new Error('请输入数字、最多四位小数点')
    }
  }
  VXETable.validators.add('positiveNumberWithTwoDecimals', {
    cellValidatorMethod({cellValue}) {
      return positiveNumberWithTwoDecimals(cellValue)
    }
  })
  const positiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
    callback(positiveNumberWithTwoDecimals(value))
  }
  // 0+正数且小数点后最多2位校验
  const twoPositiveNumberWithTwoDecimals = (cellValue: any) => {
    if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
      return new Error('请输入数字、最多两位小数点')
    }
  }
  VXETable.validators.add('twoPositiveNumberWithTwoDecimals', {
    cellValidatorMethod({cellValue}) {
      return twoPositiveNumberWithTwoDecimals(cellValue)
    }
  })
  const twoPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
    callback(twoPositiveNumberWithTwoDecimals(value))
  }
  // 小数点后最多2位校验，允许负数
  const towFloadNegative = (cellValue: any) => {
    if (!/^-?(0|[1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
      return new Error('请输入数字、最多两位小数点')
    }
  }
  VXETable.validators.add('towFloadNegative', {
    cellValidatorMethod({cellValue}) {
      if (!cellValue) {
        return ''
      }
      return towFloadNegative(cellValue)
    }
  })
  const towFloadNegativeHandle = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback()
    }
    callback(towFloadNegative(value))
  }

  // 非空 0+正数且小数点后最多4位校验
  const nullOrZeroAndPositiveIntValid = (cellValue: any) => {
    if (cellValue && !/^[0-9]\d*$/.test(cellValue)) {
      return new Error('请输入数字')
    }
  }
  VXETable.validators.add('nullOrZeroAndPositiveIntValid', {
    cellValidatorMethod({cellValue}) {
      return nullOrZeroAndPositiveIntValid(cellValue)
    }
  })
  const nullOrZeroAndPositiveIntValidHandle = (rule: any, value: any, callback: any) => {
    callback(nullOrZeroAndPositiveIntValid(value))
  }

  // 0+正数且小数点后最多4位校验
  const nullOrPositiveNumberWithTwoDecimals = (cellValue: any) => {
    // console.log('cellValue----', cellValue)
    if (cellValue && !/^(0|[1-9]\d*)(\.\d{1,4})?$/.test(cellValue)) {
      return new Error('请输入数字、最多四位小数点')
    }
  }
  VXETable.validators.add('nullOrPositiveNumberWithTwoDecimals', {
    cellValidatorMethod({cellValue}) {
      return nullOrPositiveNumberWithTwoDecimals(cellValue)
    }
  })
  const nullOrPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
    callback(nullOrPositiveNumberWithTwoDecimals(value))
  }
  // 0+正数且小数点后最多6位校验
  const nullOrPositiveNumberWithSixDecimals = (cellValue: any) => {
    if (cellValue && !/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(cellValue)) {
      return new Error('请输入数字、最多六位小数点')
    }
  }
  VXETable.validators.add('nullOrPositiveNumberWithSixDecimals', {
    cellValidatorMethod({cellValue}) {
      return nullOrPositiveNumberWithSixDecimals(cellValue)
    }
  })
  const nullOrPositiveNumberWithSixDecimalsHandle = (rule: any, value: any, callback: any) => {
    callback(nullOrPositiveNumberWithSixDecimals(value))
  }

  const costRules = ref<VxeTablePropTypes.EditRules<changeItemVO>>({
    title: [
      {required: true, message: '费用名称必须填写'},
    ],
    price: [
      {required: true, validator: 'numberValid', message: '金额必须填写'},
    ],
  })

  const commodityDialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  const orderDialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  const addressDialog = reactive<DialogOption>({
    visible: false,
    title: ""
  });

  const otherCostDialog = reactive<DialogOption>({
    visible: false,
    title: "其他费"
  })

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const previewDrawer = reactive<DrawerOption>({
    visible: false,
    title: "",
    direction: "rtl"
  });

  const queryParamsCommodity = ref({
    pageNum: 1,
    pageSize: 20,
    params: {}
  });

  const initFormData: CustomerForm = {
    id: undefined,
    customerCode: undefined,
    customerName: undefined,
    customerLevel: undefined,
    salesman: undefined,
    reconciliationTime: undefined,
    paymentMethod: undefined,
    businessLicenseNumber: undefined,
    currency: undefined,
    exchangeRate: undefined,
    customerPhone: undefined,
    companyAddress: undefined,
    companyPrincipal: undefined,
    companyPrincipalPhone: undefined,
    monthlyMethod: undefined,
    dayNumberLimit: undefined,
    shippingType: undefined,
    purchasingManager: undefined,
    purchasingPhone: undefined,
    purchasingEmail: undefined,
    financeManager: undefined,
    financePhone: undefined,
    financeEmail: undefined,
    warehouseKeeper: undefined,
    warehousePhone: undefined,
    warehouseEmail: undefined,
    projectManager: undefined,
    projectPhone: undefined,
    projectEmail: undefined,
    otherManager: undefined,
    otherPhone: undefined,
    otherEmail: undefined,
    contactsQq: undefined,
    depositBank: undefined,
    bankAccount: undefined,
    checkStandard: undefined,
    customerData: undefined,
    isTax: undefined,
    email: undefined,
    faxes: undefined,
    customerDemand: undefined,
    remark: undefined,
    salerList: undefined
  };

  const form = reactive({...initFormData});

  const customerRules = {
    customerCode: [
      {required: true, message: "客户编码不能为空", trigger: "blur"}
    ],
    customerName: [
      {required: true, message: "客户名称不能为空", trigger: "blur"}
    ],
    customerLevel: [
      {required: true, message: "客户级别不能为空", trigger: "blur"}
    ],
    reconciliationTime: [
      {required: true, message: "对账时间不能为空", trigger: "blur"}
    ],
    paymentMethod: [
      {required: true, message: "付款方式不能为空", trigger: "blur"}
    ],
    currency: [
      {required: true, message: "币种不能为空", trigger: "blur"}
    ],
    companyPrincipal: [
      {required: true, message: "公司负责人不能为空", trigger: "blur"}
    ],
    companyPrincipalPhone: [
      {required: true, message: "公司负责人电话不能为空", trigger: "blur"}
    ],
  }

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


  let formInline = reactive({
    customerId: undefined,
    customerName: undefined,
    companyPrincipal: undefined,
    companyPrincipalPhone: undefined,
    faxes: undefined,
    placeOrderTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    paymentMethod: undefined,
    monthlyMethod: undefined,
    currency: undefined,
    exchangeRate: undefined,
    shippingType: undefined,
    checkStandard: undefined,
    customerData: undefined,
    email: undefined,
    userId: undefined,
    addressId: undefined,
    isTax: undefined,
    remark: undefined,
    cusSaleUserId: undefined,
    exchangeRate:undefined,
    customerCode:undefined
  });

  const queryParams = ref({
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc,desc",
    orderByColumn: "createTime,commodityCode",
    templateName: undefined,
    params: {}
  });
  const versionOld = ref('')
  const serialNumberOld = ref('')

  const xTable = ref<VxeTableInstance<OrderVO>>();

  const loading = ref(false);
  const comLoading = ref(false);
  const tableData = ref<OrderVO[]>([]);
  const editInfo = reactive<Record<string, any>>({
    type: 1, // 1新增产品 2编辑产品
    show: false,
    index: 1,
    // title: '新增产品',
    autoCode: false,
    form: {
      otherCostList: [],
      saleOrderFileList: [],
      popoverFileList: []
    },
    rules: {
      cusId: [
        {required: true, message: "客户ID不能为空", trigger: 'change'}
      ],
      commodityName: [
        {required: true, message: "产品名称不能为空", trigger: 'change'}
      ],
      commodityCode: [
        {required: true, message: "产品编码不能为空", trigger: 'change'},
        {validator: noOverEighteenHandle, trigger: 'change'}
      ],
      surfaceTreatment: [
        {required: true, message: "表面处理不能为空", trigger: 'change'}
      ],
      model: [
        {required: true, message: "批量/样品不能为空", trigger: 'change'}
      ],
      materialLayer: [
        {required: true, message: "板层不能为空", trigger: 'change'}
      ],
      version: [
        {required: true, message: "版本号不能为空", trigger: 'change'}
      ],
      serialNumber: [
        {required: true, message: "流水号不能为空", trigger: 'change'}
      ],
      materialQuality: [
        {required: true, message: "板材不能为空", trigger: 'change'}
      ],
      singleWidth: [
        {required: true, message: "单片宽不能为空", trigger: 'change'},
        {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      singleLength: [
        {required: true, message: "单片长不能为空", trigger: 'change'},
        {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      unitedWidth: [
        {required: true, message: "联片宽不能为空", trigger: 'change'},
        {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      unitedLength: [
        {required: true, message: "联片长不能为空", trigger: 'change'},
        {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      unitedNumber: [
        {required: true, validator: positiveIntValidHandle, message: "联片数量不能为空", trigger: 'change'}
      ],
      unitedWayLength: [
        {required: true, validator: positiveIntValidHandle, message: "连片方式长不能为空", trigger: 'change'}
      ],
      unitedWayWidth: [
        {required: true, validator: positiveIntValidHandle, message: "连片方式宽不能为空", trigger: 'change'}
      ],
      commoditySolder: [
        {required: true, message: "阻焊颜色不能为空", trigger: 'change'}
      ],
      characterColor: [
        {required: true, message: "字符颜色不能为空", trigger: 'change'}
      ],
      commodityForm: [
        {required: true, message: "成形方式不能为空", trigger: 'change'}
      ],
      commodityTestWay: [
        {required: true, message: "测试方式不能为空", trigger: 'change'}
      ],
      testPoint: [
        {required: false, validator: nullOrZeroAndPositiveIntValidHandle, trigger: 'change'}
      ],
/*      goldArea: [
        {required: false, validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'}
      ],*/
      mouldCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      testFrameCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      flyProbeCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      engineeringCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      sampleCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      expeditedCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      otherCost: [
        {required: false, validator: towFloadNegativeHandle, trigger: 'change'}
      ],
      minLineWidth: [
        {required: false, validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'}
      ],
      minLineSpace: [
        {required: false, validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'}
      ],
      minAperture: [
        {required: false, validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'}
      ],
      holeCount: [
        {required: false, validator: nullOrZeroAndPositiveIntValidHandle, trigger: 'change'}
      ],
      // holeDensity: [
      //   {required: true, validator: nullOrPositiveNumberWithSixDecimalsHandle, trigger: 'change'}
      // ],
      deliveryTime: [
        {required: true, message: "客户交期不能为空", trigger: 'change'}
      ],
      quantity: [
        {required: true, message: "订单数量不能为空", trigger: 'change'},
        {validator: nullOrZeroAndPositiveIntValidHandle, trigger: 'change'},
      ],
      urgent: [
        {required: true, message: "加急不能为空", trigger: 'change'}
      ],
      area: [
        {required: true, message: "面积不能为空", trigger: 'change'},
        {validator: areaValidHandle, trigger: 'change'},
      ],
      price: [
        {required: true,message: "单价不能为空", trigger: 'change'},
        { validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      areaPrice: [
        {required: true, message: "平米价不能为空", trigger: 'change'},
        {validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      orderType: [
        {required: true, message: "订单类型不能为空", trigger: 'change'}
      ],
      totalPrice: [
        {required: true, message: "含税总价不能为空", trigger: 'change'},
        {validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      totalOrderPrice: [
        {required: true, message: "不含税总价不能为空", trigger: 'change'},
        {validator: nullOrPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
      ],
      tax: [
        {required: true, message: "税金不能为空", trigger: 'change'}
      ],
      status: [
        {required: true, message: "订单状态不能为空", trigger: 'change'}
      ]
    }
  })

  const showCommodityCode = (row: any) => {
    /*客户编码+批量/样品+版层+表面处理+流水号+版本号*/
    const model = resDictData.value.order_model.find(item => item.dictValue == row.model);
    const surfaceTreatment = resDictData.value.order_surface_treatment.find(item => item.dictLabel == row.surfaceTreatment)
    const code = formInline.customerCode + (model ? model.remark : "") + row.materialLayer + (surfaceTreatment ? surfaceTreatment.dictValue : "") + (row.serialNumber ? row.serialNumber : 'xxxx') + row.version;
    // console.log(surfaceTreatment);
    row.commodityCode = code;
    return code;
  }

  const delOrderIds = ref([] as any[]);

  // 客户交期校验
  const checkDeliveryTime = (type: string, fn: any) => {
    return new Promise((resolve, reject) => {
      try {
        let codeArr = []
        let msg = ''
        tableData.value.map((m: any) => {
          // Remark: 由于客户交期只选到日，所以只对年月日校验，不校验时分秒
          if (new Date(m.deliveryTime).getTime() < new Date(dayjs(formInline.placeOrderTime).format('YYYY-MM-DD')).getTime()) {
            // msg += `${m.commodityCode}`
            // open = true
            codeArr.push(m.commodityCode)
          }
        })
        if (!codeArr?.length) {
          resolve(true)
          return
        }
        let buttonText = "修改";
        if (type == '1') {
          buttonText = "暂存";
        } else if (type == '2') {
          buttonText = "提交审核";
        }
        // codeArr = [...new Set(codeArr)]
        msg += `${codeArr.join(',')}: 客户交期小于下单时间<br/>确定${buttonText}吗?`
        // formInline.placeOrderTime
        // deliveryTime
        ElMessageBox.confirm(msg, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          resolve(true)
        }).catch(() => {
          resolve(false)
        })
      } catch (err) {
        reject(false)
      }
    })
  }

  /** 提交审核 */
  const onSubmitCheckBtnClick = async (type: string, fn?: any,isRow?:boolean,index?:number) => {
    let msg = "修改成功";
    if (type == '1') {
      msg = "暂存成功";
    } else if (type == '2') {
      msg = "提交审核成功";
    }
    const data = deepClone(tableData.value)
    if (data.length <= 0) {
      ElMessage.error("请选择产品");
      return;
    }
    const errMap = await validAllEvent();
    if (errMap) {
      return;
    }
    const deliveryFlag = await checkDeliveryTime(type, fn)
    if (!deliveryFlag) {
      return;
    }
    buttonLoading.value = true;
    data.forEach(info => {
      info.placeOrderTime = formInline.placeOrderTime;
      if((!info.id || type == '2') && isRow == null){
        info.status = type;
      }
      info.flowStatus='';
     // info.code='';
      info.taxRate = taxRate.value;
      if (info.popoverFileList?.length) {
        info.saleOrderFileList = [...(info.saleOrderFileList || []), ...info.popoverFileList]
      }
      info.cusNameIdList=undefined;
      info.customerCodeList=undefined;
    })
    const directOrder: DirectOrder = {
      orderList: [],
      baseCustomerBo: {},
      delOrderIds:delOrderIds.value,
    };
    directOrder.orderList = data;
    directOrder.baseCustomerBo = formInline;
    // console.log('----',formInline);
    directOrder.baseCustomerBo.id = formInline.customerId;
    // console.log("directOrder", directOrder);
    // console.log("formInline", formInline);
    //设置orderList上的客户地址，切换地址时，需要重新设置
    const addressInfo = customerAddressList.value.find(item => item.id == String(formInline.addressId));
    directOrder.orderList.map(order => {
      order.cusAddressId = formInline.addressId;
      order.cusAddress = addressInfo?.address;
      Object.keys(order).forEach((fieldName) => {
        order[fieldName] = order[fieldName] ? order[fieldName] : commonCommodityOrderVo[fieldName];
      })
    })
    console.log('directOrder---',directOrder)
    if(type == '2' && isRow){
      const info = deepClone(directOrder.orderList[index]);
      info.status = '2'
      info.code = props.code;
      directOrder.orderList = [info];
    }
    const res = await saveOrder(directOrder).finally(() => buttonLoading.value = false);
    proxy?.$modal.msgSuccess(msg);
    if (type == '2' && !isRow) {
      tableData.value = [];
      emits('finish')
    } else {
      emits('save')
      // tableData.value.map((v: any) => {
      //   v.isAssignment = false
      // })
      // res.data.map((item: any) => {
      //   // commodityCode
      //   tableData.value.map((v: any) => {
      //     // if (v.commodityCode == item.commodityCode && v.isAssignment) {
      //     if (v.commodityCode == item.commodityCode) {
      //       // v.isAssignment = true
      //       v.id = item.id
      //       v.code = item.code
      //       for (let key in v) {
      //         if (item[key]) {
      //           v[key] = item[key]
      //         }
      //       }
      //       // v.popoverFileList = deepClone(v.saleOrderFileList)
      //       v.saleOrderFileList = []
      //     }
      //   })
      // })
      if(type == '2' && isRow){
        const item = res.data[0];
        const v:any = tableData.value[index];
        if (v) {
          v.commodityId = item.commodityId
          v.isAssignment = false
          v.status = item.status
          v.id = item.id
          v.code = item.code
          for (let key in v) {
            if (item[key]) {
              v[key] = item[key]
            }
          }
          v.saleOrderFileList = []
        }
      } else {
        // 解决复制后，暂存问题
        tableData.value.map((v: any) => {
          v.isAssignment = true
        })
        res.data.map((item: any) => {
          // commodityCode
          const v: any = tableData.value?.length && tableData.value.find((f: any) => f.commodityCode == item.commodityCode && f.isAssignment)
          if (v) {
            v.commodityId = item.commodityId
            v.isAssignment = false
            v.id = item.id
            v.code = item.code
            for (let key in v) {
              if (item[key]) {
                v[key] = item[key]
              }
            }
            // v.popoverFileList = deepClone(v.saleOrderFileList)
            v.saleOrderFileList = []
          }
        })
      }
    }
    fn && fn(res)
    if ((isSale.value || isQuot.value) && type == '2' && !isRow) {
      closePage(true)
    }
  };

  /*数据校验*/
  const validAllEvent = async () => {
    const $table = xTable.value;
    let formValidate = await addCustomerFormRef.value?.validate((valid: boolean) => {
      if (valid) {
        return true;
      } else {
        return false;
      }
    });
    // console.log("formValidate", formValidate);
    if ($table) {
      let errMap = await $table.validate(true);
      // let errMsg = "请填写下单信息！";
      // if (errMap) {
      //   VXETable.modal.message({status: 'error', message: errMsg})
      // }
      if (!formValidate) {
        errMap = true;
      }
      return errMap;
    }
  }

  const changeSaler = (parms: any) => {
    // console.log(parms);
    // console.log("formInline.cusSaleUserId", formInline.cusSaleUserId);
    // console.log("salerOptions", salerOptions);
    //防止销售人员为undefined
    if (!formInline.cusSaleUserId) {
      formInline.cusSaleUserId = parms.value;
    }
  };

  const reportUrl = ref("");
  const reportDrawer = reactive<DrawerOption>({
    direction: 'left',
    visible: false,
    title: '直接下单'
  });

  /*预览*/
  const preViewOrder = async (type: string) => {
    onSubmitCheckBtnClick('1', (res) => {
      // console.log('---', res)
      var ids = res.data.map(o => o.id).join(',');
      reportUrl.value = getReportUrl()+ `&_n=PCB加工单&_u=file:directOrder.ureport.xml&url=order/saleOrder/getPreviewInfo&ids=${ids}&listUrl=order/saleOrder/getPreviewList&ids=${ids}`;
      reportUrl.value = reportUrl.value.replace("1,4,6","2,4,6");
      previewDrawer.visible = true;
    })
  }

  const deleteContract = async ()=>{
    ElMessageBox.confirm(
      "确定要删除此合同及其所属的" + tableData.value.length + "个产品吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        const list = tableData.value.filter(vo => vo.id != null && vo.id !="");
        const ids:any[] = [];
        list.forEach(vo => {
          ids.push(vo.id);
        })
        if(ids.length == 0){
          ElMessage({
            type: "warning",
            message: "暂无可删除合同"
          });
          return;
        }
        proxy?.$modal.loading('加载中...')
        delOrder(ids).then(res =>{
          if(res.code == 200){
            ElMessage({
              type: "success",
              message: "删除成功"
            });
            tableData.value = [];
            isSale.value = true;
            emits('save')
            closePage(true);
          }
        }).finally(() => proxy?.$modal.closeLoading());

      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
  }

  const commodityList = ref<CommodityVO[]>([]);
  const orderList = ref<OrderVO[]>([]);

  const commodityTotal = ref(0);


  //选择产品
  const chooseCommodity = async () => {
    if (formInline.customerId == undefined) {
      ElMessage.error("请先选择客户");
      return;
    }
    queryParamsCommodity.value = {
      pageNum: 1,
      pageSize: 20,
    }
    commodityDialog.title = "选择产品";
    commodityDialog.visible = true;
    dialogTableLoading.value = true
    // nextTick(()=>{
    //   proxy?.$modal.loading('加载中...')
    // })
    await getCommodityList();
    dialogTableLoading.value = false
    // proxy?.$modal.closeLoading()
    alreadySelectCommodity.value = [];
  }

  const columnCommodityList = ref([
    {type: 'checkbox', width: '60', align: "center"},
    {
      width: '80',
      title: '客户',
      field: 'customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户'}
    },
    {
      width: '150',
      title: '产品编码',
      field: 'code',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: '150',
      title: '产品名称',
      field: 'name',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: '60',
      title: '版本',
      field: 'version',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入版本'}
    },
    {
      width: '80',
      title: '批/样',
      field: 'model',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择批/样',
      },
      filterData: () => resDictData.value.order_model,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '90',
      title: '产品类型',
      field: 'type',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {
        placeholder: '请选择产品类型',
      },
      filterData: () => resDictData.value.sys_commodity_type,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: '客户物料编码',
      field: 'materialNumber',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户物料编码'}
    },
    {
      title: '客户物料名称',
      field: 'materialName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户物料名称'}
    },
  ]);

  const columnOrderList = ref([
    {type: 'checkbox', width: '60', align: "center"},
    {
      width: '100',
      title: '客户',
      field: 'customerCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户编码'}
    },
    {width: '150', title: '下单时间', field: 'placeOrderTime', align: 'center'},
    {
      width: '90',
      title: '新/返',
      field: 'orderType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择新/返'},
      filterData: () => resDictData.value.order_type,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '70',
      title: '批/样',
      field: 'model',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择批/样'},
      filterData: () => resDictData.value.order_model,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '100',
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      width: '100',
      title: '产品PO',
      field: 'customerPo',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品PO'}
    },
    {
      width: '150',
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      width: '110',
      title: '客户物料编码',
      field: 'materialNumber',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入客户物料编码'}
    },
    {
      width: '80',
      title: '板材',
      field: 'materialQuality',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择板材'},
      filterData: () => resDictData.value.order_material_quality,
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      width: '110',
      title: '平米价(元/㎡)',
      field: 'areaPrice',
      align: 'center'
    },
    {
      width: '120',
      title: '订货数量（pcs)',
      field: 'quantity',
      align: 'center'
    },
    {
      width: '100',
      title: '单价(元/pcs)',
      field: 'price',
      align: 'center',
      filterType: 'input'
    },
    {title: '销售单号', field: 'code', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入销售单号'}},
  ]);

  // 获取 搜索条件
  const searchChangeCommodity = (params: any) => {
    queryParamsCommodity.value = params;
    getCommodityList();
  }

  // 获取 搜索条件
  const searchChangeOrder = (params: any) => {
    queryParams.value = params;
    getList();
  }

  //产品列表
  const getCommodityList = async () => {
    comLoading.value = true;
    const res = await listCommodity(queryParamsCommodity.value);
    commodityList.value = res.rows;
    commodityTotal.value = res.total;
    comLoading.value = false;
  }

  let alreadySelectOrder = ref<OrderVO[]>([]);

  //订单返单
  const chooseOrder = async () => {
    if (formInline.customerId == undefined) {
      ElMessage.error("请先选择客户");
      return;
    }
    queryParams.value = {
      pageNum: 1,
      pageSize: 20,
      isAsc: "desc,desc",
      orderByColumn: "createTime,commodityCode",
    }
    orderDialog.title = "订单返单";
    orderDialog.visible = true;
    dialogTableLoading.value = true
    // nextTick(()=>{
    //   proxy?.$modal.loading('加载中...')
    // })
    await getList();
    dialogTableLoading.value = false
    // proxy?.$modal.closeLoading()
    alreadySelectOrder.value = [];
  }

  let alreadySelectCommodity = ref<CommodityVO[]>([]);

  const commodityVxeTableRef = ref();

  const orderVxeTableRef = ref();

  //选择产品
  const handleSelectionChange = () => {
    const $table = commodityVxeTableRef.value.xTableRef
    if ($table) {
      // 获取翻页保留的列表数据和选择的行数据列表
      const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
      alreadySelectCommodity.value = selectRecords.map(item => item);
    }
  }

  //选择订单
  const handleSelectionChangeOrder = (val: OrderVO[]) => {
    const $table = orderVxeTableRef.value.xTableRef
    if ($table) {
      // 获取翻页保留的列表数据和选择的行数据列表
      const selectRecords = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords())
      alreadySelectOrder.value = selectRecords.map(item => item);
    }
  }

  //移除已选产品
  const removeData = (data: CommodityVO) => {
    var index = alreadySelectCommodity.value.indexOf(data);
    if (index > -1) {
      alreadySelectCommodity.value.splice(index, 1);
    }
    commodityVxeTableRef.value.xTableRef.setCheckboxRow(data, false);
  }

  //移除已选订单
  const removeDataOrder = (data: OrderVO) => {
    var index = alreadySelectOrder.value.indexOf(data);
    if (index > -1) {
      alreadySelectOrder.value.splice(index, 1);
    }
    orderVxeTableRef.value.xTableRef.setCheckboxRow(data, false);
  }

  //新增产品
  const addCommodity = () => {
    if (formInline.customerId == undefined) {
      ElMessage.error("请先选择客户");
      return;
    }
    const info: Record<string, any> = {
      id: "",
      code: "",
      placeOrderTime: "",
      cusId: "",
      cusPrincipal: "",
      cusPrincipalPhone: "",
      cusFax: "",
      cusPaymentMethod: "",
      cusMonthlyStatementWay: "",
      cusCurrency: "",
      cusExchangeRate: 0,
      cusTransStyle: "",
      cusAddress: "",
      cusQualityStand: "",
      cusAddressId: "",
      cusEmail: "",
      cusCustomerData: [],
      cusSaleUserId: "",
      cusIsTaxRate: "1",
      cusRemark: "",
      commodityName: "",
      commodityType: "",
      commodityCode: "",
      surfaceTreatment: "",
      model: "1",
      materialLayer: "1",
      version: "A0",
      serialNumber: "",
      materialNumber: "",
      materialName: "",
      specialRequirement: "",
      packRequirement: "",
      materialQuality: "",
      materialBrand: "",
      materialLevel: "",
      commodityThickness: "",
      materialCopperOutside: "",
      materialCopperInside: "",
      remark: "",
      commodityRemark: "",
      singleWidth: 0,
      singleLength: 0,
      unitedWidth: 0,
      unitedLength: 0,
      unitedNumber: 0,
      unitedWayLength: 0,
      unitedWayWidth: 0,
      commoditySolder: "",
      commoditySolderCount: "",
      goldenThickness: "",
      commoditySolderGloss: "",
      commoditySolderRequirement: "",
      poreCopper: "",
      characterColor: "",
      characterCount: "",
      commodityForm: "",
      characterRequirement: "",
      setCross: "",
      warpagePlate: "",
      commodityTestWay: "",
      testPoint: 0,
      spareQuantity: 0,
      copperFoil: "",
      vCut: "",
      holeRequirement: "",
      inspectionStandard: "",
      goldArea: 0,
      pp: "",
      nickelThickness: 0,
      tinThickness: 0,
      minLineWidth: 0,
      minLineSpace: 0,
      minAperture: 0,
      holeCount: 0,
      holeDensity: 0,
      submitUserId: "",
      submitTime: "",
      auditUserId: "",
      auditTime: "",
      auditComment: "",
      customerPo: "",
      deliveryTime: "",
      dispatchTime: "",
      quantity: 0,
      urgent: "",
      area: 0,
      price: 0,
      areaPrice: 0,
      orderType: "1",
      totalPrice: 0,
      totalOrderPrice: 0,
      tax: 0,
      engineeringCost: 0,
      testFrameCost: 0,
      flyProbeCost: 0,
      mouldCost: 0,
      expeditedCost: 0,
      otherCost: 0,
      sampleCost: 0,
      flowStatus: undefined,
      status: "",
      preDeliveryHour: 48
    };
    Object.keys(formInline).forEach((item) => {
      info[item] = info[item] ? info[item] : formInline[item];
      // info[item] = formInline[item] ? formInline[item] : info[item];
    })
    info.id = undefined;
    info.code = undefined;
    info.createBy = undefined;
    info.updateBy = undefined;
    info.createTime = undefined;
    info.updatetime = undefined;
    info.cusId = formInline.customerId;
    // info.cusName = customerList.value.find((item: any) => item.id == formInline.customerId)?.customerName;
    info.cusCurrency = String(formInline.currency);
    info.cusIsTaxRate = String(formInline.isTax);
    info.cusPaymentMethod = String(formInline.paymentMethod);
    info.cusAddressId = formInline.addressId
    info.cusTransStyle = String(formInline.shippingType);
    info.isTax = formInline.isTax;
    info.otherCostList = info.otherCostList || []
    info.commodityCode = (info.customerCode || '') + (info.model || '') + (info.materialLayer || '') + (info.surfaceTreatment || '') + (info.serialNumber || '') + (info.version || '')
    // console.log("新增产品 salerOptions", salerOptions);
    let salerOptionsList = [];
    salerOptionsList = JSON.parse(JSON.stringify(salerOptions.value));
    const userInfo = salerOptionsList.find(item =>
      item.userId = String(formInline.cusSaleUserId)
    )
    if (userInfo != undefined && userInfo != null) {
      info.cusSaleUserName = userInfo.userName;
    }
    const addressInfo = customerAddressList.value.find(item => item.id == formInline.addressId);
    if (addressInfo != undefined && addressInfo != null) {
      info.cusAddress = addressInfo.address;
    }
    tableData.value.push(info);
    openDrawer(1, info)
  }

  /** 查询订单列表 */
  const getList = async () => {
    loading.value = true;
    queryParams.value.isAsc = "desc,desc";
    queryParams.value.orderByColumn = "createTime,commodityCode";
    const res = await listOrder(queryParams.value);
    orderList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }

  /** 新增客户按钮操作 */
  const handleAdd = () => {
    reset();
    drawer.title = "添加客户";
    drawer.visible = true;
  };

  //其他费用取消
  const cancelOtherCost = () => {
    //currentRow.value.otherCostList = [];
    otherCostDialog.visible = false;
  }

  const submitOtherCost = async () => {
    // const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => accumulator + Number(currentValue.price), 0);
    const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => Decimal(accumulator).add(Decimal(currentValue.price)).toNumber(), 0);
    currentRow.value.otherCost = sum;
    const errMap = await validOtherCostEvent();
    if (errMap) {
      return;
    }
    otherCostDialog.visible = false;
  }

  /*其他费用数据校验*/
  const validOtherCostEvent = async () => {
    const $table = _tableRef.value
    if ($table) {
      const errMap = await $table.validate(true)
      if (errMap) {
        VXETable.modal.message({status: 'error', message: '请填写费用信息！'})
      } else {
        VXETable.modal.message({status: 'success', message: '校验成功！'})
      }
      return errMap;
    }
  }

  /** 客户取消按钮 */
  const cancel = () => {
    reset();
    drawer.visible = false;
  };

  //选择产品取消
  const cancelCommodity = () => {
    alreadySelectCommodity.value = [];
    commodityDialog.visible = false;
  }

  //订单返单取消
  const cancelOrder = () => {
    alreadySelectOrder.value = [];
    orderDialog.visible = false;
  }

  //选择产品确认
  const submitCommodity = () => {
    const list = alreadySelectCommodity.value.map((item) => {
      const orderVo: OrderVO = reactive({
        id: "",
        code: "",
        customerCode: '',
        placeOrderTime: "",
        cusId: "",
        cusPrincipal: "",
        cusPrincipalPhone: "",
        cusFax: "",
        cusPaymentMethod: "",
        cusMonthlyStatementWay: "",
        cusCurrency: "",
        cusExchangeRate: 0,
        cusTransStyle: "",
        cusAddress: "",
        cusQualityStand: "",
        cusAddressId: "",
        cusEmail: "",
        cusCustomerData: [],
        cusSaleUserId: "",
        cusIsTaxRate: "1",
        cusRemark: "",
        commodityName: "",
        commodityType: "",
        commodityId: "",
        commodityCode: "",
        surfaceTreatment: "",
        model: "",
        materialLayer: "",
        version: "",
        serialNumber: "",
        materialNumber: "",
        materialName: "",
        specialRequirement: "",
        packRequirement: "",
        materialQuality: "",
        materialBrand: "",
        materialLevel: "",
        commodityThickness: "",
        materialCopperOutside: "",
        materialCopperInside: "",
        remark: "",
        commodityRemark: "",
        singleWidth: 0,
        singleLength: 0,
        unitedWidth: 0,
        unitedLength: 0,
        unitedNumber: 0,
        unitedWayLength: 0,
        unitedWayWidth: 0,
        commoditySolder: "",
        commoditySolderCount: "",
        goldenThickness: "",
        commoditySolderGloss: "",
        commoditySolderRequirement: "",
        poreCopper: "",
        characterColor: "",
        characterCount: "",
        commodityForm: "",
        characterRequirement: "",
        setCross: "",
        warpagePlate: "",
        commodityTestWay: "",
        testPoint: 0,
        spareQuantity: 0,
        copperFoil: "",
        vCut: "",
        holeRequirement: "",
        inspectionStandard: "",
        goldArea: 0,
        pp: "",
        nickelThickness: 0,
        tinThickness: 0,
        minLineWidth: 0,
        minLineSpace: 0,
        minAperture: 0,
        holeCount: 0,
        holeDensity: 0,
        submitUserId: "",
        submitTime: "",
        auditUserId: "",
        auditTime: "",
        auditComment: "",
        customerPo: "",
        deliveryTime: "",
        dispatchTime: "",
        quantity: 0,
        urgent: "",
        area: 0,
        price: 0,
        areaPrice: 0,
        orderType: "1",
        totalPrice: 0,
        totalOrderPrice: 0,
        tax: 0,
        engineeringCost: 0,
        testFrameCost: 0,
        testFrame: '',
        flyProbeCost: 0,
        mouldCost: 0,
        expeditedCost: 0,
        otherCost: 0,
        sampleCost: 0,
        flowStatus: undefined,
        status: "",
        preDeliveryHour: 48
      });
      Object.keys(orderVo).forEach((info) => {
        orderVo[info] = orderVo[info] ? orderVo[info] : item[info];
        // orderVo[info] = item[info] ? item[info] : orderVo[info];
      })
      orderVo.id = undefined;
      orderVo.code = undefined;
      orderVo.createBy = undefined;
      orderVo.updateBy = undefined;
      orderVo.createTime = undefined;
      orderVo.updatetime = undefined;
      // orderVo.cusName = customerList.value.find((item: any) => item.id == formInline.customerId)?.customerName;
      orderVo.cusId = formInline.customerId;
      orderVo.cusCurrency = String(formInline.currency);
      orderVo.cusIsTaxRate = String(formInline.isTax);
      orderVo.cusPaymentMethod = String(formInline.paymentMethod);
      orderVo.cusAddressId = formInline.addressId
      orderVo.cusTransStyle = String(formInline.shippingType);
      orderVo.commodityCode = item.code;
      orderVo.commodityName = item.name;
      orderVo.otherCost = Number(item.otherCost || 0).toFixed(2)
      if (orderVo.otherCostList?.length) {
        orderVo.otherCostList.map((v: any) => {
          v.price = Number(v.price || 0).toFixed(2)
        })
      }
      const userInfo = salerOptions.value.find(item => item.userId = String(formInline.cusSaleUserId))
      if (userInfo != undefined && userInfo != null) {
        orderVo.cusSaleUserName = userInfo.userName;
      }
      const addressInfo = customerAddressList.value.find(item => item.id == formInline.addressId);
      if (addressInfo != undefined && addressInfo != null) {
        orderVo.cusAddress = addressInfo.address;
      }
      tableData.value.push(orderVo);
    })
    cancelCommodity();
  }

  //订单返单确认
  const submitOrder = () => {
    console.log("alreadySelectOrder.value",alreadySelectOrder.value)
    const list = alreadySelectOrder.value.map((item) => {
      const orderVo: OrderVO = reactive({
       // id: "",
        code: "",
        customerCode: '',
        placeOrderTime: "",
        cusId: "",
        cusPrincipal: "",
        cusPrincipalPhone: "",
        cusFax: "",
        cusPaymentMethod: "",
        cusMonthlyStatementWay: "",
        appearanceRequirements:"",
        cusCurrency: "",
        cusExchangeRate: 0,
        cusTransStyle: "",
        cusAddress: "",
        cusQualityStand: "",
        cusAddressId: "",
        cusEmail: "",
        cusCustomerData: undefined,
        cusSaleUserId: "",
        cusIsTaxRate: "1",
        cusRemark: "",
        commodityName: "",
        commodityType: "",
        commodityCode: "",
        surfaceTreatment: "",
        model: "",
        materialLayer: "",
        version: "",
        serialNumber: "",
        materialNumber: "",
        materialName: "",
        specialRequirement: "",
        packRequirement: "",
        materialQuality: "",
        materialBrand: "",
        materialLevel: "",
        commodityThickness: "",
        materialCopperOutside: "",
        materialCopperInside: "",
        remark: "",
        commodityRemark: "",
        singleWidth: 0,
        singleLength: 0,
        unitedWidth: 0,
        unitedLength: 0,
        unitedNumber: 0,
        unitedWayLength: 0,
        unitedWayWidth: 0,
        commoditySolder: "",
        commoditySolderCount: "",
        goldenThickness: "",
        commoditySolderGloss: "",
        commoditySolderRequirement: "",
        poreCopper: "",
        characterColor: "",
        characterCount: "",
        commodityForm: "",
        characterRequirement: "",
        setCross: "",
        warpagePlate: "",
        commodityTestWay: "",
        testPoint: 0,
        spareQuantity: 0,
        copperFoil: "",
        vCut: "",
        holeRequirement: "",
        inspectionStandard: "",
        goldArea: 0,
        pp: "",
        nickelThickness: 0,
        tinThickness: 0,
        minLineWidth: 0,
        minLineSpace: 0,
        minAperture: 0,
        holeCount: 0,
        holeDensity: 0,
        submitUserId: "",
        submitTime: "",
        auditUserId: "",
        auditTime: "",
        auditComment: "",
        deliveryTime: "",
        dispatchTime: "",
        urgent: "",
        orderType: "2",
        testFrame: '',
        // engineeringCost: 0,
        // testFrameCost: 0,
        // flyProbeCost: 0,
        // mouldCost: 0,
        commodityId: "",
        // expeditedCost: 0,
        otherCost: 0,
        // sampleCost: 0,
        flowStatus: undefined,
        status: "",
        preDeliveryHour: 0,
        popoverFileList: undefined,
        otherCostList:undefined,
        price: undefined,
        areaPrice: undefined,
        hasAcknowledgment:undefined,
        hasFilm:undefined,
        hasImpedanceBar: undefined,
        hasImpedanceReport:undefined,
        hasSealedSample: undefined,
        hasSection:undefined
      });
      Object.keys(orderVo).forEach((info) => {
        let itemInfo: any;
        if (item[info]) {
          itemInfo = item[info];
        } else {
          itemInfo = orderVo[info];
        }
        orderVo[info] = orderVo[info] ? orderVo[info] : itemInfo;

        // orderVo[info] = item[info] ? item[info] : orderVo[info];
      })
      orderVo.id = undefined;
      orderVo.code = undefined;
      if (isSale.value) {
        // 订单返单不保留status
        orderVo.status = undefined;
      }
      // orderVo.cusName = customerList.value.find((item: any) => item.id == orderVo.cusId)?.customerName;
      orderVo.createBy = undefined;
      orderVo.updateBy = undefined;
      orderVo.createTime = undefined;
      orderVo.updatetime = undefined;
      orderVo.otherCost = Number(item.otherCost || 0).toFixed(2)
      // orderVo.otherCostList = []
      if (orderVo.otherCostList?.length) {
        orderVo.otherCostList.map((v: any) => {
          v.price = Number(v.price || 0).toFixed(2)
        })
      }
      // orderVo.preDeliveryHour = ((new Date(orderVo.deliveryTime).getTime() - new Date(orderVo.dispatchTime).getTime()) / 1000 / 60 / 60).toFixed(0)
      orderVo.preDeliveryHour = ((new Date(orderVo.deliveryTime).getTime() - new Date(orderVo.dispatchTime).getTime()) / 1000 / 60 / 60).toFixed(0)
      orderVo.deliveryTime = undefined; // 订单返单时不带出来，但是需要计算出提前发货时间，所以再置空
      orderVo.dispatchTime = undefined; // 与上同理
      //orderVo.cusId=formInline.customerId;
      orderVo.returnOrderId = item.id;
      //订单返单需清除附件id
      orderVo.popoverFileList && orderVo.popoverFileList.forEach((v:any) =>{
        v.id = "";
      })
      tableData.value.push(orderVo);
    })
    cancelOrder();
  }

  /** 客户提交 */
  const submitForm = () => {
    customerFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        await addCustomer(form).finally(() => buttonLoading.value = false);
        proxy?.$modal.msgSuccess("添加成功");
        getCustomerList();
        drawer.visible = false;
      }
    });
  };

  const handleClose = (done: () => void) => {
    ElMessageBox.confirm("你确定关闭该窗口吗?")
      .then(() => {
        done();
      })
      .catch(() => {
        // catch error
      });
  };

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    customerFormRef.value?.resetFields();
  };

  //客户下拉数据
  const getCustomerList = async () => {
    const res = await getListCustomer();
    customerList.value = res.data;
    // let allCustomerList = res.data;
    // customerList.value = allCustomerList.filter((item: any) => item.isDisabled != '1');
  };

  //选择客户
  const getCustomerInfo = (value: string) => {
    getCustomer(value).then(res => {
      const info = res.data;
      console.log("getCustomer",res);
      if(info.isDisabled=='1'){
        proxy?.$modal.msgError("该客户已被禁用");
      }
      Object.keys(info).forEach((item) => {
        formInline[item] = info[item]
      })
      queryParamsAddress.value.customerId = info.id;
      let salerList = info.salerList
      if (salerList) {
        formInline.cusSaleUserId = salerList[0];
      }
      if (formInline.currency == '人民币') {
        formInline.exchangeRate = 1;
      }
      changeIsTax(info.isTax);
      getAddressList(formInline.customerId, true);
      isDisabledUser(info.sysUserList)
    });
  };

  //新增地址按钮操作
  const handleAddAddress = () => {
    resetAddress();
    if (queryParamsAddress.value.customerId == undefined) {
      ElMessage.error("请先选择客户再为其添加地址")
      return;
    }
    addressDialog.title = "添加地址";
    addressDialog.visible = true;
  };

  //地址提交
  const submitAddress = () => {
    customerAddressFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        formAddress.value.type = '1';
        if (formAddress.value.id) {
          await updateCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
        } else {
          formAddress.value.customerId = queryParamsAddress.value.customerId;
          if (customerAddressList.value.length == 0) {
            formAddress.value.isDefault = 2;
          } else {
            formAddress.value.isDefault = 1;
          }
          await addCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("修改成功");
        addressDialog.visible = false;
        getAddressList(formInline.customerId);
      }
    });
  };

  const inputPrice = (value: any) => {
    console.log(value, editInfo.form)
    if (!value) {
      value = 0
      return
    }
    value = value && value.toString().includes('--') ? value.toString().replace('--', '-') : value
  }

  const resetAddress = () => {
    formAddress.value = {...initAddressFormData};
    customerAddressFormRef.value?.resetFields();
  };

  const cancelAddress = () => {
    resetAddress();
    addressDialog.visible = false;
  };

  const currentRow = ref({});

  /*打开其他费用弹窗*/
  const openOtherCostDialog = (row: any) => {
    otherCostDialog.visible = true;
    currentRow.value = row;
  }

  const _tableRef = ref<VxeTableInstance<changeItemVO>>();

  const addChangeRow = async () => {
    const $table = _tableRef.value
    if ($table) {
      currentRow.value.otherCostList = currentRow.value.otherCostList ? currentRow.value.otherCostList : [];
      const index = currentRow.value.otherCostList.length + 1;
      const {row: newRow} = await $table.insert(
        {title: "其他费用" + index, price: "0"}
      )
      currentRow.value.otherCostList.push(newRow);
    }
  }

  //删除变更行
  const removeChange = async (_row: any) => {
    // console.log(_row);
    const $table = _tableRef.value
    if ($table) {
      const {row: newRow} = await $table.remove(_row)
      if (_row.id) {
        // currentRow.value.delCostIdList = currentRow.value.delCostIdList ? currentRow.value.delCostIdList : [];
        // currentRow.value.delCostIdList.push(_row.id);
        currentRow.value.otherCostList.splice(_row.rowIndex, 1);
        // Decimal(minDistance.defaultValue).add(Decimal(compensation.defaultValue)).toNumber()
        // const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => accumulator + Number(currentValue.price), 0);
        const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => Decimal(accumulator).add(Decimal(currentValue.price)).toNumber(), 0);
        currentRow.value.otherCost = sum;
      }
    }
  }

  const handleCellClick = (params: any) => {
    if (params.column.field == "otherCost") {
      openOtherCostDialog(params.row);
    }
  }

  const changeCellEvent = (params: any) => {
    currentRow.value.otherCostList = params.data;
    // const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => accumulator + Number(currentValue.price), 0);
    const sum = currentRow.value.otherCostList.reduce((accumulator, currentValue) => Decimal(accumulator).add(Decimal(currentValue.price)).toNumber(), 0);
    currentRow.value.otherCost = sum;
    countPriceOther(currentRow.value)
  }

  /**
   * 获取字典数据
   */
  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "customer_level,monthly_method,shipping_type,order_urgent,customer_data,reconciliation_time,check_standard,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type,order_test_stand";
    getDicts(string)
      .then(res => {
        const dictData = res.data;
        string.split(",").forEach(item => {
          Object.keys(resDictData.value).forEach(dictItem => {
            if (item == dictItem) {
              resDictData.value[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });

    const salerResponse: any = await listUserByRoleKey("saler");
    salerOptions.value = salerResponse.data;
  };

  const rules = {
    customerId: [
      {required: true, message: "客户不能为空", trigger: "change"}
    ],
    placeOrderTime: [
      {required: true, message: "下单时间不能为空", trigger: "change"}
    ],
    // paymentMethod: [
    //   {required: true, message: "付款方式不能为空", trigger: "change"}
    // ],
    // monthlyMethod: [
    //   {required: true, message: "月结方式不能为空", trigger: "change"}
    // ],
    currency: [
      {required: true, message: "币种不能为空", trigger: "change"}
    ],
    exchangeRate: [
      {required: true, message: "汇率不能为空", trigger: "change"}
    ],
    unreq: [{required: false, message: "", trigger: "change"}],
    addressId: [
      {required: true, message: "收货地址不能为空", trigger: "change"}
    ],
    cusSaleUserId: [
      {required: true, message: "业务员不能为空", trigger: "change"}
    ],
    salerList: [
      {required: true, message: "业务员不能为空", trigger: "change"}
    ]
  };


  const isActiveStatus = (row: OrderVO) => {
    const $table = xTable.value;
    if ($table) {
      return $table.isEditByRow(row);
    }
  };

  //编辑
  const editRowEvent = (row: OrderVO) => {
    const $table = xTable.value;
    if ($table) {
      $table.setEditRow(row);
    }
  };

  //复制
  const copyRowEvent = (row: OrderVO) => {
    const $table = deepClone(row);
    if ($table) {
      $table._X_ROW_KEY = tableData.value.length + 1;
      $table.id = null;
      console.log(row)
      if (isSale.value && !['1','3'].includes($table.status)) {
        $table.status = undefined
      }
      tableData.value.push($table);
      // console.log(xTable.value)
    }
    // console.log(tableData.value)
    // const record = {}
    // const {row: newRow} =  xTable.value.insertNextAt(record,row);
    // console.log(tableData.value)
    // console.log(xTable.value)
  };

  //删除
  const deleteRowEvent = (row: OrderVO, index: number) => {
    ElMessageBox.confirm(
      '确定要把产品编号为' + row.commodityCode + '的产品删除吗?',
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        if (row.id == null || row.id == undefined || row.id == "") {
          tableData.value.splice(index, 1); // 删除该行记录
          ElMessage({
            type: "success",
            message: "删除成功"
          });
        } else {
          proxy?.$modal.loading('加载中...')
          queryOrderStatus(row.id).then((res: any) => {
            if (!res.data) {
              tableData.value.splice(index, 1); // 删除该行记录
              delOrderIds.value.push(row.id);
              ElMessage({
                type: "success",
                message: "删除成功"
              });
            } else {
              ElMessage({
                type: "error",
                message: "此订单已有对账单生成，无法删除"
              });
            }
          }).finally(() => proxy?.$modal.closeLoading());
        }
      })
      .catch(() => {
        // 取消操作的处理
      });
  };

  // 撤回订单
  const backOrderEvent = (row: OrderVO, index: number) => {
    console.log(row, index)
    ElMessageBox.confirm(
        '确定要把产品编号为' + row.commodityCode + '的产品撤回吗?',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
        }
    ).then(() => {
      setRecall(row.id).then(res => {
        if(res.code == 200){
          row.status = '3';
          // getRouterData()
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
        }
      })
    }).catch(() => {})
  }

  const submitRowEvent = (row: OrderVO, index: number) => {
    console.log(row, index)
    ElMessageBox.confirm(
      '确定要把产品编号为' + row.commodityCode + '的产品提交审核吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      // row.status = '2';
      onSubmitCheckBtnClick('2',() => {},true,index);
    }).catch(() => {})
  }

  const saveRowEvent = (row: OrderVO) => {
    // row.unitedNumber = row.unitedWayLength * row.unitedWayWidth;
    // console.log(row)
    const $table = xTable.value;
    if ($table) {
      $table.clearEdit().then(() => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          VXETable.modal.message({content: `保存成功！name=${row.commodityName}`, status: "success"});
        }, 300);
      });
    }
  };

  const cancelRowEvent = (row: OrderVO) => {
    const $table = xTable.value;
    if ($table) {
      $table.clearEdit().then(() => {
        // 还原行数据
        $table.revertData(row);
      });
    }
  };

  const sumNum = (list: OrderVO[], field: string) => {
    let count = 0;
    list.forEach(item => {
      // console.log(field + ': --' + item[field])
      count += Number(item[field] || 0);
    });
    return Number(count.toFixed(4));
  };

  const footerMethod: VxeTablePropTypes.FooterMethod<OrderVO> = ({columns, data}) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return "合计";
        }
        if (column.field == "area") {
          return `${sumNum(data, "area")} `;
        }
        if (column.field == "totalPrice") {
          return `${sumNum(data, "totalPrice")} `;
        }
        if (column.field == "totalOrderPrice") {
          return `${sumNum(data, "totalOrderPrice")} `;
        }
        if (column.field == "tax") {
          return `${sumNum(data, "tax")} `;
        }
        return "";
      })
    ];
  };

  const onSubmit = () => {
    console.log("submit!");
  };

  //税率
  const getTaxRate = async () => {
    const res = await proxy?.getConfigKey("taxRate");
    if (res != undefined) {
      taxRate.value = Number(res.data);
      // console.log(taxRate.value)
    }
  }

  /**
   * 获取流水号
   */
  const getNextNumber = async (row: any) => {
    serialNumberOld.value = row.serialNumber
    const res = await getSerialNumber();
    row.serialNumber = res.data
    serialChange(row)
    serialByCommityCode(row)
    queryInventoryByCommodityHandle(row.commodityCode, row)
  }
  const serialByCommityCode = (row) => {
    row.commodityCode = (formInline.customerCode || '') + (resDictData.value.order_model.find(item => item.dictValue == row.model)?.remark || '') + (row.materialLayer || '') + (resDictData.value.order_surface_treatment.find((v: any) => v.dictLabel == row.surfaceTreatment)?.dictValue || '') + (row.serialNumber || '') + (row.version || '')
  }

  const serialChange = (row: any) => {
    if (serialNumberOld.value == '' || serialNumberOld.value == null || serialNumberOld.value == undefined) return
    // row.saleOrderFileList = []
    // row.popoverFileList = []
    row.saleOrderFileList.map((m) => {
      m.delFlag = 2
    })
    row.popoverFileList.map((m) => {
      m.delFlag = 2
    })
  }

  const versionChange = (value: any, row: any) => {
    serialNumberOld.value = row.serialNumber
    if (value) {
      const oldTemp = versionOld.value.slice(0,1)
      const newTemp = value.slice(0,1)
      if (newTemp != oldTemp) {
        serialChange(row)
      }
    }
  }

  const returnNumberOrEmpty = (val: any) => {
    if (val == undefined) {
      return ''
    }
    return Number(val) ? Number(val) : ''
  }
  // 打开新增、编辑产品弹框
  const openDrawer = (type: number, row: Record<string, any>, index?: number) => {
    editInfo.type = type
    editInfo.show = true;

    console.log("=============================");
    // editInfo.form = undefined;
    editInfo.form.hasAcknowledgment = '0';
    editInfo.form.hasImpedanceReport = '0';
    editInfo.form.hasSection = '0';
    editInfo.form.hasImpedanceBar = '0';
    editInfo.form.hasSealedSample = '0';
    editInfo.form.hasFilm = '0';

    editInfo.form = deepClone(row)
    console.log('open----', editInfo.form, row)
    // console.log(row)
    if (type == 1) {
      editInfo.index = tableData.value.length - 1
    } else {
      editInfo.index = index
    }
    editInfo.form.otherCostList = row.otherCostList || []
    editInfo.form.engineeringCost = returnNumberOrEmpty(editInfo.form.engineeringCost)
    editInfo.form.testFrameCost = returnNumberOrEmpty(editInfo.form.testFrameCost)
    editInfo.form.flyProbeCost = returnNumberOrEmpty(editInfo.form.flyProbeCost)
    editInfo.form.mouldCost = returnNumberOrEmpty(editInfo.form.mouldCost)
    editInfo.form.expeditedCost = returnNumberOrEmpty(editInfo.form.expeditedCost)
    editInfo.form.sampleCost = returnNumberOrEmpty(editInfo.form.sampleCost)
    editInfo.form.otherCostList.map((item: any) => {
      item.price = returnNumberOrEmpty(item.price)
    })

    editInfo.form.saleOrderFileList = editInfo.form.saleOrderFileList || [];
    //editInfo.form.saleOrderFileList=[];
    editInfo.form.popoverFileList = editInfo.form.popoverFileList || [];
    editInfo.form.isTax = formInline.isTax;
    // console.log('---------',customerList.value, editInfo.form);
    queryInventoryByCommodityHandle(editInfo.form.commodityCode, editInfo.form)
    setTimeout(() => {
      addProdRef.value.clearValidate()
    }, 0)
  }

  const changeCommodityCode = () => {
    editInfo.form.commodityCode = (formInline.customerCode || '') + (resDictData.value.order_model.find(item => item.dictValue == editInfo.form.model)?.remark || '') + (editInfo.form.materialLayer || '') + (resDictData.value.order_surface_treatment.find((v: any) => v.dictLabel == editInfo.form.surfaceTreatment)?.dictValue || '') + (editInfo.form.serialNumber || '') + (editInfo.form.version || '')
    queryInventoryByCommodityHandle(editInfo.form.commodityCode, editInfo.form)
  }

  /** 复制代码成功 */
  const copyTextSuccess = (value) => {
    proxy?.$modal.msgSuccess('复制成功');
    return value
  }

  // 新增其他费用
  const addOtherCostList = () => {
    if (editInfo.form.otherCostList.length >= 8) {
      // 最多添加8条其他费用
      ElMessage.warning('最多添加8条其他费用')
      return
    }
    editInfo.form.otherCostList.push({
      title: '其他费用' + (editInfo.form?.otherCostList?.length + 1),
      price: '',
    })
  }

  /**
   * 新增数据字典
   * @param row
   */
  const saveDict = async (dictLabel: string, dictType: string) => {
    if (dictLabel != "" && dictType != null) {
      await saveDictData(dictLabel, dictType);
    }
  }

  // 删除其他费用
  const delOtherCostList = (index: number) => {
    editInfo.form.otherCostList.splice(index, 1)
  }


  /**
   * 计算孔密度
   */
  const holeCountnumber = async () => {
    return editInfo.form.holeDensity = Number(parseFloat(editInfo.form.holeCount) / parseFloat(editInfo.form.unitedLength) / parseFloat(editInfo.form.unitedWidth) * 100).toFixed(6);
  }

  /**
   * 表格孔密度
   */
  const holeTableCountnumber = (row: any) => {
    return row.holeDensity = Number(parseFloat(row.holeCount) / parseFloat(row.unitedLength) / parseFloat(row.unitedWidth) * 100).toFixed(6);
  }

  // 关闭产品弹框
  const cancelProdDrawer = () => {
    editInfo.show = false
    for (let key in editInfo.form) {
      editInfo.form[key] = undefined
    }
  }
  // 保存产品弹框
  const saveProdDrawer = () => {
    addProdRef.value.validate((val: boolean) => {
      if (val) {
        // if (editInfo.type == 1) {
        editInfo.form.cusId = formInline.customerId
        editInfo.form.customerCode = formInline.customerCode
        let params = deepClone(editInfo.form);
        // params.saleOrderFileList = [...(params.saleOrderFileList || []), ...(editInfo.form.popoverFileList || [])] as any
        params.saleOrderFileList.map((v: any) => {
          if (v?.delFlag == undefined || v?.delFlag == '' || v?.delFlag == null) {
            v.delFlag = 0
          }
        })
        params.otherCost=params.otherCostList.reduce((accumulator, currentValue) => Decimal(accumulator).add(Decimal(currentValue.price)).toNumber(), 0);
         console.log('saveProdDrawersave-----', params, tableData.value)
        tableData.value[editInfo.index] = deepClone(params);




        // 文件
        // console.log('3333----',tableData.value)
        const $table = xTable.value;
        if ($table) {
          getDictOptions()
          $table.reloadData(tableData.value)
          cancelProdDrawer()
        }
        // }
      }
    })
  }

  // 判断业务员是否禁用
  const isDisabledUser = (list: any[]) => {
    // console.log(val)
    if (!formInline.cusSaleUserId) return
    if (!list?.length) return
    const name = list.find((item: any) => item.userId == formInline.cusSaleUserId && item.status == '1')?.nickName
    const name1 = salerOptions.value.find((item: any) => item.userId == formInline.cusSaleUserId)
    if (!name && !name1) {
      const name2 = list.find((item: any) => item.userId == formInline.cusSaleUserId)?.nickName
      ElMessage.error(`【${name2}】已不是业务员，请重新选择业务员。`)
      formInline.cusSaleUserId = undefined
      return
    }
    if (name) {
      ElMessage.error(`业务员【${name}】已禁用，请重新选择业务员。`)
      formInline.cusSaleUserId = undefined
    }
  }

  /**
   * 报价下单文件
   */
    // 文件下载
  const downLoadHandle = (key: string) => {
      let loadingBox = ElLoading.service({text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)'});
      downloadUrl(key).then(res => {
        loadingBox.close()
        if (res.code == 200) {
          const {data} = res
          // window.open(data[key])
          fileSaver.saveAs(data[key])
        }
      }).catch((err) => {
        loadingBox.close()
      })
    }

  //删除已经上传的文件
  const deleteDirectOrderEvent = (row: any) => {
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
        row.delFlag = 2;//删除该行记录
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });

  }

  // 禁用某一列的编辑
  const beforeEditMethod = ({row, rowIndex, column, columnIndex}) => {
    return isSale.value ? (['1','3'].includes(row.status) || !row.status) : true
  }

  // 关闭当前页，跳转到销售合同
  const closePage = (refresh: boolean = false) => {
    // useTagsViewStore().delView(route.currentRoute.value)
    // if (refresh) {
    //   useTagsViewStore().setRefreshSale(true)
    // }
    // if (isSale.value) {
    //   route.push('/order/saleContract')
    // }
    // if (isQuot.value) {
    //   route.push('/order/quotation')
    // }
    emits('close')
  }

  // const fisrtEnter = ref(false)
  // onActivated(() => {
  //   // onMounted执行后再执行 http://www.codebaoku.com/question/question-sd-1010000043593478.html
  //   if(!fisrtEnter.value) return
  //   isSale.value = false
  //   isQuot.value = false
  //   isDisabled.value = false
  //   getRouterData();
  //   getQuotationRouterData();
  // })

  onMounted(async () => {
    getRouterData();
    getDictOptions();
    getCustomerList();
    getQuotationRouterData();
    await getTaxRate();
    // fisrtEnter.value = true
  });
</script>

<style lang="scss" scoped>
  :deep(.direct-table) {
    .vxe-select {
      .vxe-input--inner {
        padding-right: 2px;
      }
      .vxe-input--suffix {
        display: none;
      }
    }
  }
  :deep(.el-form-item--small) {
    margin-bottom: 15px
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    width: 100%;
  }

  :deep(.vxe-icon-edit) {
    display: none;
  }

  :deep(input::-webkit-inner-spin-button) {
    -webkit-appearance: none !important;
  }

  :deep(.el-pagination) {
    justify-content: center !important;
    float: none !important;
    margin-top: -20px !important;
  }


  :deep(.add-prod-drawder) {
    .el-drawer__header {
      padding: 5px !important;
      margin-bottom: 5px !important;
    }

    .el-drawer__body {
      padding: 5px 5px !important;

      .el-divider {
        margin: 0 0 6px 0 !important;
      }

      .error-left {
        .el-form-item__error {
          left: -20px;
        }
      }

      .error-left-one {
        .el-form-item__error {
          left: -30px;
        }
      }

      .el-form-item {
        margin-bottom: 6px !important;

        .el-form-item__label {
          padding-right: 3px !important;
        }

        .el-form-item__content {
          .el-form-item {
            margin-bottom: 0 !important;
          }

          .el-textarea,
          .el-input__wrapper,
          .el-textarea__inner {
            background-color: #FDFFE1 !important;
            color: #000000 !important;
          }

          .el-input__inner {
            -webkit-text-fill-color: #000000;
            color: #000000 !important;
          }

          .height-light .el-input__wrapper {
            background-color: #FED547 !important;
          }
          .font-14 .el-input__inner {
            font-size: 14px;
          }

          .el-input-group__prepend,
          .el-input-group__append {
            padding: 0 2px !important;
          }

          .append-btn {
            .el-input-group__append {
              padding: 0 20px !important;
            }
          }
        }

        &.is-error .el-input__wrapper {
          box-shadow: 0 0 0 2px var(--el-color-danger) inset;
        }

        .el-form-item__error {
          display: none;
          // margin-top: -2px;
          // white-space: nowrap !important;
          // font-size: 12px !important;
          // transform: scale(0.9) !important;
          // z-index: 10 !important;
        }

        .error-right {
          .el-form-item__error {
            /* text-align: right; */
            left: 105px !important;
          }

          z-index: 10 !important;
        }
      }
    }

    /* .el-drawer__footer {
      padding: 5px;
    } */
    .flex-start {
      .el-form-item__content {
        justify-content: flex-start !important;
        align-items: center;

        .el-input-number {
          flex: 1 !important;
          width: auto;
        }
      }
    }
  }
  :deep(.number-left) {
    .el-input__wrapper {
      padding-left: 7px;
      padding-right: 7px;
    }
    .el-input__inner {
      text-align: left;
    }
  }
  .checkbox-disable-normal {
    :deep(.el-checkbox) {
      .el-checkbox__input.is-disabled.is-checked {
        .el-checkbox__inner {
          background-color: var(--el-checkbox-checked-bg-color);
          border-color: var(--el-checkbox-checked-input-border-color);

          &::after {
            border-color: var(--el-checkbox-checked-icon-color);
          }
        }
      }

      .el-checkbox__label {
          color: #000000 !important;
      }

    }
  }
</style>

<style>
  .el-table__header .el-checkbox {
    display: none !important;
  }
</style>
