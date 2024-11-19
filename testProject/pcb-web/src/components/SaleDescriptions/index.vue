<template>
  <main>
    <el-form ref="addProdRef" class="order-detial-disabled" :model="currentInfo" label-width="55px" size="small"
             disabled>
      <el-row>
        <el-col :span="6">
          <el-form-item label="客户" prop="cusId">
            <el-select v-if="customerList.length > 0" placeholder=" " v-model="currentInfo.cusId"
                       style="width: 100%;"
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
            <el-input v-else type="text" v-model="currentInfo.customerCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="表面处理" prop="surfaceTreatment">
            <el-select placeholder=" " suffix-icon="" class="height-light" clearable
                       v-model="currentInfo.surfaceTreatment">
              <el-option v-for="item in resDictData.order_surface_treatment" :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictLabel"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="批量/样品" prop="model">
            <el-select placeholder=" " suffix-icon="" clearable v-model="currentInfo.model">
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
            <el-input class="height-light font-14" type="number" v-model.number="currentInfo.materialLayer"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="版本号" prop="version">
            <el-input type="text" v-model="currentInfo.version"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="产品名称" prop="commodityName">
            <el-input type="text" v-model="currentInfo.commodityName"></el-input>
          </el-form-item>
        </el-col>
        <template v-if="props.quotationShow">
          <el-col :span="8">
            <el-form-item label="产品编码" prop="commodityCode">
              <el-input type="text" v-model="currentInfo.commodityCode" style="display: none;"></el-input>
              <!-- <el-row style="width: 100%;">
                <el-col :span="9"> -->
              <el-form-item prop="serialNumber" class="error-right">
                <el-input type="text" v-model="currentInfo.serialNumber">
                  <template #prepend>
                    {{(currentInfo.customerCode || '') + (resDictData.order_model.find(item => item.dictValue == currentInfo.model)?.remark || '') + (currentInfo.materialLayer || '') +
                    (resDictData.order_surface_treatment.find(vo => vo.dictLabel==currentInfo.surfaceTreatment)?.dictValue||'')}}
                  </template>
                  <template #append>{{currentInfo.version || ''}}</template>
                </el-input>
              </el-form-item>
              <!-- </el-col>
              <el-col :span="15">
                <el-button size="small" type="text"
                @click="copy(currentInfo.commodityCode)"
                >复制</el-button>
                <el-button size="small" type="text" @click="getNextNumber(currentInfo)">设置流水</el-button>
              </el-col>
            </el-row> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单类型" prop="orderType">
              <el-select placeholder=" " suffix-icon="" v-model="currentInfo.orderType" clearable>
                <el-option v-for="item in resDictData.order_type" :key="item.dictValue"
                          :label="item.dictLabel"
                          :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="8" v-if="!quotationShow">
          <el-form-item label="产品类型" prop="commodityType">
            <el-select placeholder=" "
                       suffix-icon=""
                       v-model="currentInfo.commodityType"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
                       style="width: 440px"
            >
              <el-option v-for="item in resDictData.sys_commodity_type" :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictValue"

              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="包装要求" prop="packRequirement">
            <el-select placeholder=" " suffix-icon="" v-model="currentInfo.packRequirement" clearable>
              <el-option v-for="item in resDictData.order_packaging_requirements" :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="props.quotationShow ? 8 : 12">
          <el-form-item label="物料编码" prop="materialNumber">
            <el-input type="text" v-model="currentInfo.materialNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="props.quotationShow ? 8 : 12">
          <el-form-item label="物料名称" prop="materialName">
            <el-input type="text" v-model="currentInfo.materialName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="订单特殊要求" prop="specialRequirement" label-width="75px">
            <el-input type="textarea" rows="1" v-model="currentInfo.specialRequirement"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="板材" prop="materialQuality">
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.materialQuality"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.materialBrand"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.materialLevel"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light font-14"
                       v-model="currentInfo.commodityThickness"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light font-14"
                       v-model="currentInfo.materialCopperOutside"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.materialCopperInside"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
          <el-form-item label="单片尺寸">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="singleLength" class="flex-start">
                  <el-input type="number" v-model.number="currentInfo.singleLength">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center;" :span="1">X</el-col>
              <el-col :span="12">
                <el-form-item prop="singleWidth" class="flex-start">
                  <el-input type="number" v-model.number="currentInfo.singleWidth">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联片尺寸">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="unitedLength" class="flex-start">
                  <el-input type="number" v-model.number="currentInfo.unitedLength">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center;" :span="1">X</el-col>
              <el-col :span="9">
                <el-form-item prop="unitedWidth" class="flex-start">
                  <el-input type="number" v-model.number="currentInfo.unitedWidth">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="unitedNumber" class="flex-start">
                  <el-input type="number" v-model.number="currentInfo.unitedNumber" disabled>
                    <template #append>pcs</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="连片方式">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="unitedWayLength" class="error-left-one">
                  <el-input type="number" v-model.number="currentInfo.unitedWayLength"></el-input>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center;" :span="2">X</el-col>
              <el-col :span="11">
                <el-form-item prop="unitedWayWidth" class="error-left">
                  <el-input type="number" v-model.number="currentInfo.unitedWayWidth"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="产品备注" prop="commodityRemark">
            <el-input type="textarea" rows="1" v-model="currentInfo.commodityRemark"></el-input>
          </el-form-item>
        </el-col>
        <el-divider/>

        <el-col :span="4">
          <el-form-item label="阻焊颜色" prop="commoditySolder">
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.commoditySolder"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.commoditySolderCount"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-input v-model="currentInfo.goldenThickness">
              <template #append>u''</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="字符" prop="characterColor">
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.characterColor"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon=""
                       v-model="currentInfo.characterCount"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon=""
                       v-model="currentInfo.commodityForm"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon="" class="height-light"
                       v-model="currentInfo.commodityTestWay"
                       filterable
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" " suffix-icon=""
                       v-model="currentInfo.testFrame"
                       filterable
                       default-first-option
                       :reserve-keyword="false"
                       clearable
                       style="width: 440px"
            >
              <el-option v-for="dict in resDictData.order_test_frame" :key="dict.dictValue" :label="dict.dictLabel"
                         :value="dict.dictValue"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="测试点" prop="testPoint">
            <el-input class="height-light" v-model="currentInfo.testPoint"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="过孔要求" prop="holeRequirement">
            <el-select placeholder=" "
                       suffix-icon=""
                       v-model="currentInfo.holeRequirement"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-select placeholder=" "
                       suffix-icon=""
                       v-model="currentInfo.inspectionStandard"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
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
            <el-input v-model="currentInfo.goldArea"></el-input>
          </el-form-item>
        </el-col>
        <el-divider v-if="props.quotationShow"/>

        <template v-if="props.quotationShow">
          <el-col :span="6">
            <el-form-item label="客户PO" prop="customerPo">
              <el-input class="height-light" v-model="currentInfo.customerPo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户交期" prop="deliveryTime">
              <el-date-picker class="height-light" style="width: 100%" size="small" v-model="currentInfo.deliveryTime"
                              type="datetime"
                              value-format="YYYY-MM-DD" format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提前发货" prop="preDeliveryHour">
              <el-input type="number" v-model.number="currentInfo.preDeliveryHour">
                <template #append>小时</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 最迟发货 == 发货日期 -->
            <el-form-item label="最迟发货" prop="dispatchTime">
              <el-date-picker style="width: 100%" size="small" v-model="currentInfo.dispatchTime" type="datetime"
                              value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
                              disabled/>
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="props.quotationShow ? 6 : 5" v-if="props.isShow">
          <!-- 订单数量 == 订购数量 -->
          <el-form-item label="订购数量" prop="quantity">
            <el-input class="height-light font-14" type="number" v-model.number="currentInfo.quantity">
              <template #append>pcs</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="props.quotationShow">
          <el-form-item label="加急" prop="urgent">
            <el-select placeholder=" " suffix-icon="" class="height-light" v-model="currentInfo.urgent" clearable>
              <el-option v-for="item in resDictData.order_urgent" :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="props.quotationShow">
          <el-form-item label="是否含税" prop="isTax">
            <el-select placeholder=" " suffix-icon="" class="height-light font-14" v-model="currentInfo.isTax" disabled>
              <el-option label="含税" value="1"/>
              <el-option label="不含税" value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small" label="产品库存">
            <div class="global-flex flex-start append-btn">
              <el-input v-model="currentInfo.productInventory" disabled>
                <template #append>
                  <el-button :loading="productLoading" icon="Refresh" @click="queryInventoryByCommodityHandle(currentInfo.commodityCode, currentInfo)"></el-button>
                </template>
              </el-input>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="props.quotationShow ? 8 : 5" v-if="props.isShow">
          <el-form-item label="订单面积" prop="area">
            <el-input class="height-light font-14" type="number" v-model.number="currentInfo.area" disabled>
              <template #append>㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="props.quotationShow ? 8 : 5" v-if="props.isShow">
          <el-form-item label="平米价" prop="areaPrice">
            <el-input class="height-light font-14" type="number" v-model.number="currentInfo.areaPrice">
              <template #append>元/㎡</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="props.quotationShow ? 8 : 5" v-if="props.isShow">
          <el-form-item label="单价" prop="price">
            <el-input class="height-light font-14" type="number" v-model.number="currentInfo.price">
              <template #append>元/pcs</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="!props.quotationShow">
          <el-form-item label="加急" prop="urgent">
            <el-select placeholder=" " suffix-icon="" class="height-light" v-model="currentInfo.urgent" clearable>
              <el-option v-for="item in resDictData.order_urgent" :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="quotationShow">
          <el-form-item label="产品类型" prop="commodityType">
            <el-select placeholder=" "
                       suffix-icon=""
                       v-model="currentInfo.commodityType"
                       filterable
                       allow-create
                       default-first-option
                       :reserve-keyword="false"
                       clearable
                       style="width: 440px"
            >
              <el-option v-for="item in resDictData.sys_commodity_type" :key="item.dictValue"
                         :label="item.dictLabel"
                         :value="item.dictValue"

              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="props.isShow">
          <el-form-item label="订单备注" prop="remark">
            <el-input type="textarea" rows="1" v-model="currentInfo.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-divider/>

        <template v-if="props.isShow">
          <el-col :span="4">
            <el-form-item label="模具费" prop="mouldCost">
              <el-input class="font-14" type="number" :model-value="returnNumberOrEmpty(currentInfo.mouldCost)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="测试架费" prop="testFrameCost">
              <el-input class="height-light font-14" type="number" :model-value="returnNumberOrEmpty(currentInfo.testFrameCost)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="飞针费" prop="flyProbeCost">
              <el-input class="height-light font-14" type="number" :model-value="returnNumberOrEmpty(currentInfo.flyProbeCost)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="工程费" prop="engineeringCost">
              <el-input class="font-14" type="number" :model-value="returnNumberOrEmpty(currentInfo.engineeringCost)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="样板费" prop="sampleCost">
              <el-input class="font-14" type="number" :model-value="returnNumberOrEmpty(currentInfo.sampleCost)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="加急费" prop="expeditedCost">
              <el-input class="font-14" type="number" :model-value="returnNumberOrEmpty(currentInfo.expeditedCost)"></el-input>
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="24" v-if="props.isShow && currentInfo.otherCostList?.length">
          <el-form-item label="其他费用" prop="otherCostList">
            <el-row style="width: 100%;">
              <template v-for="(other, index) in currentInfo.otherCostList" :key="index">
                <el-col :span="6">
                  <el-row>
                    <el-col :span="12">
                      <el-input v-model="other.title"></el-input>
                    </el-col>
                    <el-col :span="12">
                      <el-input class="font-14" type="number" style="width: 100%;" :model-value="returnNumberOrEmpty(other.price)"></el-input>
                    </el-col>
                  </el-row>
                </el-col>
              </template>
            </el-row>
          </el-form-item>
        </el-col>
        <el-divider v-if="!props.quotationShow"/>

        <!-- <el-col :span="24">
          <el-form-item label="其他费用" prop="otherCostList">
            <template #label>
              <el-row>
                <el-col :span="20"><div style="line-height:28px;">其他费用</div></el-col>
                <el-col :span="4" class="pointer" @click="addOtherCostList">
                  <el-button icon="Plus" link type="primary"></el-button>
                </el-col>
              </el-row>
            </template>
            <el-row style="width: 100%;">
              <template v-for="(other, index) in currentInfo.otherCostList" :key="index">
                <el-col :span="6">
                  <el-row>
                    <el-col :span="10"><el-input v-model="other.title"></el-input></el-col>
                    <el-col :span="10"><el-input type="number" style="width: 100%;" v-model.number="other.price"></el-input></el-col>
                    <el-col :span="4" style="text-align: center;" class="pointer" @click="delOtherCostList(index)">
                      <el-button icon="Close" link type="primary"></el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </template>
            </el-row>
          </el-form-item>
        </el-col> -->

        <!-- <el-divider content-position="left">交货信息</el-divider> -->
        <!-- <el-col :span="8">
          <el-form-item label="含税要求" prop="minLineWidth">
            <el-input class="height-light" type="number" v-model.number="currentInfo.minLineWidth"><template #append>mm</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="EQ确认后，样品交货天数" prop="minLineWidth">
            <el-input class="height-light" type="number" v-model.number="currentInfo.minLineWidth"><template #append>mm</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="EQ确认后，产量交货天数" prop="minLineWidth">
            <el-input class="height-light" type="number" v-model.number="currentInfo.minLineWidth"><template #append>mm</template></el-input>
          </el-form-item>
        </el-col>
        <el-divider/> -->

        <el-col :span="6">
          <el-form-item label="最小线宽" prop="minLineWidth">
            <el-input class="height-light" type="number" v-model.number="currentInfo.minLineWidth">
              <template #append>mm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最小线距" prop="minLineSpace">
            <el-input class="height-light" type="number" v-model.number="currentInfo.minLineSpace">
              <template #append>mm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最小孔径" prop="minAperture">
            <el-input class="height-light" type="number" v-model.number="currentInfo.minAperture">
              <template #append>mm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总孔数" prop="holeCount">
            <el-input class="font-14" type="number" v-model.number="currentInfo.holeCount">
              <template #append>/连扳(SLOT)</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="孔密度" prop="holeDensity">
            <el-input class="height-light" type="number" v-model.number="currentInfo.holeDensity">
              <template #append>万/m²</template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18" v-if="props.orderEtrShow" class="checkbox-disable-normal">
          <el-checkbox false-label="0" true-label="1" value="1" :checked="currentInfo.hasAcknowledgment=='1'" style="margin-left:10px" v-model="currentInfo.hasAcknowledgment" label="承认书/出货报告" />
          <el-checkbox false-label="0" true-label="1" value="1" :checked="currentInfo.hasImpedanceReport=='1'" v-model="currentInfo.hasImpedanceReport" label="阻抗报告" />
          <el-checkbox false-label="0" true-label="1" value="1" :checked="currentInfo.hasSection=='1'" v-model="currentInfo.hasSection" label="切片" />
          <el-checkbox false-label="0" true-label="1" value="1" :checked="currentInfo.hasImpedanceBar=='1'" v-model="currentInfo.hasImpedanceBar" label="阻抗条" />
          <el-checkbox false-label="0" true-label="1" value="1" :checked="currentInfo.hasSealedSample=='1'" v-model="currentInfo.hasSealedSample" label="封样" />
          <el-checkbox false-label="0" true-label="1" value="1" :checked="currentInfo.hasFilm=='1'" v-model="currentInfo.hasFilm" label="菲林" />
        </el-col>

      </el-row>
      <el-row v-if="customerList.length > 0 && props.isShow" >
        <el-col :span="8" style="text-align: left;">
          总价：{{ currentInfo.totalOrderPrice }}元
        </el-col>
        <el-col :span="8" style="text-align: center;">
          税金：{{ currentInfo.tax }}元
        </el-col>
        <el-col :span="8" style="text-align: right;">
          总金额：{{ currentInfo.totalPrice }}元
        </el-col>
      </el-row>
    </el-form>
    <XTable ref="popFileRef" :data="currentInfo?.fileList"  border :columnList="quotionFileList" :pageShow="false">
      <template #default-make="{row}">
        <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
      </template>
    </XTable>
    <!-- <TotalTitle :list="[
      { title: `总价：${ currentInfo.totalOrderPrice }元` },
      { title: `税金：${ currentInfo.tax }元` },
      { title: `总金额：${ currentInfo.totalPrice }元` },
    ]"></TotalTitle> -->
  </main>
</template>

<script setup name="SaleDescriptions" lang="ts">
  import fileSaver from "file-saver";
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {listUserByRoleKey} from "@/api/system/user";
  import {downloadUrl} from '@/api/upload/index'
  import {ref} from "vue";
  import dayjs from "dayjs";
  import { queryInventoryByCommodity } from '@/api/inventory/inventory/index'
  import useUserStore from '@/store/modules/user';

  // const { ownerId } = useUserStore();
  // const ownerId = 1001;
  const productLoading = ref(false)
  let resDictData = ref({
    //加急
    order_urgent: [],
    //订单类型
    order_type: [],
    //批量/样品
    order_model: [],
    //板材
    order_material_quality: [],
    //成品板厚
    finish_plate_thickness: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //表面处理
    order_surface_treatment: [],
    //阻焊颜色
    order_commodity_solder: [],
    //字符颜色
    order_character: [],
    //币种
    currency_type: [],
    //包装要求
    order_packaging_requirements: [],
    //付款方式
    payment_method: [],
    //运输方式
    shipping_type: [],
    //板材品牌
    order_plate_brand: [],
    //板材级别
    order_material_level: [],
    //阻焊面数
    order_commodity_solder_count: [],
    //阻焊光泽
    order_commodity_solder_gloss: [],
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
    //产品类型
    sys_commodity_type: [],
    //流程状态
    order_flow_status: [],
    //测试架
    order_test_frame: [],
  })

  const props = withDefaults(defineProps<{
    // resDictData: any
    currentInfo: any
    customerList: any[]
    isShow: boolean,
    quotationShow: boolean,
    orderEtrShow: boolean
  }>(), {
    // resDictData: () => {},
    currentInfo: () => {
    },
    customerList: () => [],
    isShow: true,
    quotationShow: true,
    orderEtrShow: true
  })

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

  const getDictOptions = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_urgent,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_plate_brand,order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type,order_flow_status,order_test_frame";
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
  };
  const quotionFileList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60'},
    {title: '文件名', field: 'name', align: 'center',minWidth: '200'},
    {title: '上传人', field: 'createByName', align: 'center',width: '70'},
    {title: '文件大小(kb)', field: 'size', align: 'center',width: '80'},
    {title: '上传时间', field: 'createTime', align: 'center',width: '120'},
    {title: '操作', field: 'make', align: 'center',width: '120'},
  ])

  // 文件下载
  const downLoadHandle = (key: string) => {
    let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
    downloadUrl(key).then(res => {
      loadingBox.close()
      if (res.code == 200) {
        const { data } = res
        // window.open(data[key])
        fileSaver.saveAs(data[key])
      }
    }).catch((err) => {
      loadingBox.close()
    })
  }

  watch(() => props.currentInfo,(row) => {
    const dayjs1 = dayjs(row.deliveryTime);
    const dayjs2 = dayjs(row.dispatchTime);
    // 提前发货时间
    let preDeliveryHour = Math.abs(dayjs1 - dayjs2) / (60 * 60 * 1000); // 将毫秒转换为小时并取绝对值*/
    row.preDeliveryHour=preDeliveryHour;
    props.currentInfo.preDeliveryHour=row.preDeliveryHour;
    //是否含税
    props.currentInfo.isTax=row.cusIsTaxRate;
    props.currentInfo.fileList=row.popoverFileList;
  }, { immediate: true, deep: true })
  const returnNumberOrEmpty = (val: any) => {
    if (val == undefined) {
      return ''
    }
    return Number(val) ? Number(val) : ''
  }

  onMounted(() => {
    getDictOptions();
    if (props?.currentInfo?.commodityCode) {
      queryInventoryByCommodityHandle(props.currentInfo.commodityCode, props.currentInfo)
    }
  });
</script>

<style lang="scss" scoped>
  :deep(.order-detial-disabled) {
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
          // 去除 数字表单 上下按钮
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }

          &[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
          }

          border: none;
        }

        .el-date-editor {
          .el-input__prefix {
            display: none;
          }
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

      .el-form-item__error {
        margin-top: -2px;
        white-space: nowrap !important;
        font-size: 12px !important;
        transform: scale(0.9) !important;
        z-index: 10 !important;
      }

      .error-right {
        .el-form-item__error {
          /* text-align: right; */
          left: 105px !important;
        }

        z-index: 10 !important;
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
  :deep(.normal-detail-sale) {
    .prod-card {
      padding: 8px 16px 0;
      background: #fff;
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }

    .el-form-item {

      .el-form-item__content {
        .el-form-item {
          margin-bottom: 0 !important;
        }

        .el-textarea,
        .el-input__wrapper,
        .el-textarea__inner {
          background-color: transparent !important;
        }
        .el-input {
          &.input-append-bg {
            .el-input-group__append, .el-input-group__prepend {
              background: var(--el-fill-color-light) !important;
            }
          }
          &.height-light {
            .el-input__wrapper, .el-input-group__append, .el-input-group__prepend {
              background: #F8E3C5 !important;
              border-radius: 0;
              box-shadow: none;
            }
          }
          box-shadow: 0 0 0 1px #E9E9E9;
          border-radius: 2px;
          .el-input__wrapper {
            box-shadow: none;
          }
          .el-input-group__append, .el-input-group__prepend {
            background: transparent !important;
            border-radius: 0;
            padding: 0 2px !important;
            color: var(--el-color-primary);
            box-shadow: none;
          }
        }
        .height-light {
          box-shadow: 0 0 0 1px #E9E9E9;
          border-radius: 2px;
          .el-input__wrapper, .el-input-group__append, .el-input-group__prepend {
            background: #F8E3C5 !important;
            border-radius: 0;
            box-shadow: none;
          }
        }
        .el-input__inner {
          -webkit-text-fill-color: #000000;
          color: #000000 !important;
          // 去除 数字表单 上下按钮
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }

          &[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
          }

          border: none;
        }
      }
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
