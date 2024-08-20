<template>
    <div style="display:none;width: 600pt !important;  font-family: 仿宋, sans-serif;" ref="cardRef">
    <!--工艺单信息、钻孔信息、开料信息、压合信息-->
        <div style="width: 100%; position: relative; page-break-before: always; box-sizing: border-box"
            v-if="printType === 'all' || printType === 'noOutsideImages'">

            <div style="position: sticky; top: 0; text-align: center; width: 100%; box-sizing: border-box">
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody style=" font-weight: bold;">
                <tr>
                    <td style="width: 80pt; text-align: left">
                    <div style="font-size: 18px;">{{ props.allData?.isRemediation == '1' ? '补料' : '' }}</div>
                    <div style="font-size: 18px;">{{ props.allData?.orderTypeDesc }}</div>
                    <div style="font-size: 18px;">{{ props.allData?.model }}</div>
                    </td>
                    <td style="width: 80pt">
                    <img :src="_logn" alt="logo" style="width: 60px; height: 60px"  />

                    </td>
                    <td style="text-align: center">
                    <span style="font-size: 25px;">{{ props.allData?.enterpriseName }}</span>
                    </td>
                    <td style="width: 80pt; text-align: left">
                    <div>
                        <span style="font-size: 18px;">本卡：</span><span style="font-size: 18px;">{{ props.allData?.bundlePnlQuantity
                        }}</span>
                    </div>
                    <div>
                        <span style="font-size: 18px;">扎号：</span><span style="font-size: 18px;">{{ props.allData?.no }}</span>
                    </div>
                    </td>
                    <td style="width: 80pt; text-align: right">
                        <span style="font-size: 30px; font-weight: 1000">{{ (props.allData?.timeSpanDays?props.allData?.timeSpanDays:'') }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody style=" font-weight: bold;">
                <tr>
                    <td style="width: 200pt; text-align: left">
                    <div>
                        <span style="font-size: 18px;">总数：</span><span style="font-size: 18px;">
                        {{ (props.allData?.totalNum?Number(props.allData?.totalNum).toFixed(0):'') +"块"}}</span>
                        <span>&nbsp;&nbsp;</span>
                        <span style="font-size: 18px;">
                            {{ 
                                (props.allData?.cardPnlName?props.allData?.cardPnlName:'')
                                +":  "
                            + (props.allData?.pnlTotal?Number(props.allData?.pnlTotal).toFixed(0):'') }}
                        </span>
                    </div>
                    <div>
                        <span style="font-size: 18px;">投料日期：</span><span style="font-size: 18px;">{{
                        parseTime(props.allData?.productionStartTime, '{y}-{m}-{d}')
                        }}</span>
                    </div>
                    </td>
                    <td style="width: 200pt; text-align: center">
                    <span style="font-size: 25px;">{{ props.allData?.miName }}</span>
                    </td>
                    <td style="width: 200pt; text-align: center">
                    <img :src="props.qcCodeImage" alt="条形码" style="height: 60px" v-if="props.qcCodeImage" />
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody style=" font-weight: bold;">
                <tr>
                    <td style="width: 250pt; text-align: left; font-weight: bold">
                    <span style="font-size: 22px;">产品编号：</span><span style="font-size: 22px;">{{
                        props.allData?.commodityCode
                    }}</span>
                    </td>
                    <td style="width: 175pt; text-align: center">
                    <span style="font-size: 16px;">生产编号：</span><span style="font-size: 16px;">
                        {{ props.allData?.productionCardNo}}</span>
                    </td>
                    <td style="width: 175pt; text-align: right">
                    <span style="font-size: 16px;">MI单号：</span><span style="font-size: 16px;">{{ props.allData?.productionPlanNo
                    }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <!--工艺单信息-->
            <div style="width: 100%; box-sizing: border-box; page-break-after: auto">
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody v-if="props.commodityInfos?.length === 1" style="font-weight: bold">
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 250pt;"><span
                        style="font-size: 14px;">产品编号：</span><span style="font-size: 14px;">{{
                        props.allData?.commodityCode
                        }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">客户P/O：</span><span style="font-size: 14px;">{{
                        props.allData?.customerPo
                        }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 500pt" colspan="2"><span
                        style="font-size: 14px;">客户型号：</span><span style="font-size: 14px;">{{
                        props.allData?.commodityName }}</span></td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">成形方式：</span><span style="font-size: 14px;">{{
                        props.publicCommodityInfo?.commodityForm
                        }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">测试方式：</span><span style="font-size: 14px;">{{
                        props.publicCommodityInfo?.commodityTestWay }}</span></td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">订单数量：</span><span style="font-size: 14px;">{{ props.allData?.quantity }}</span><span
                        style="font-size: 14px;">pcs</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">本卡数量：</span><span style="font-size: 14px;">{{ props.allData?.quantityPerCard
                        }}</span><span style="font-size: 14px;">pcs</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">阻焊颜色：</span><span style="font-size: 14px;">{{
                        props.publicCommodityInfo?.commoditySolder
                        }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">字符颜色：</span><span style="font-size: 14px;">{{
                        props.publicCommodityInfo?.characterColor }}</span></td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">连片方式：</span><span style="font-size: 14px;">{{ props.publicCommodityInfo?.unitedWay
                        }}</span></td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">本卡净面积：</span><span style="font-size: 14px;">{{ props.allData?.cardArea
                        }}</span><span style="font-size: 14px;">㎡</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">PCS尺寸：</span><span style="font-size: 14px;">{{ props.publicCommodityInfo?.pcS_Size
                        }}</span><span style="font-size: 14px;">mm</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">SET尺寸：</span><span style="font-size: 14px;">{{ props.publicCommodityInfo?.seT_Size
                        }}</span><span style="font-size: 14px;">mm</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">交货日期：</span>
                    <span style="font-size: 14px;">{{ parseTime(props.allData?.dispatchTime, '{y}-{m}-{d}') }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">投料毛面积：</span><span style="font-size: 14px;">{{ props.allData?.productionArea
                        }}</span><span style="font-size: 14px;">㎡</span>
                    </td>
                </tr>
                <tr v-if="props.allData?.pnlInfos " v-for="_pnl in props.allData?.pnlInfos">
                    <td style="border: 1px solid black; text-align: left; width: 500pt" colspan="2"><span
                         style="font-size: 14px;">{{ (_pnl.name?_pnl.name:'')+'：开料尺寸：' + _pnl.pnlLength
                        + '*' + (_pnl.pnlWidth) + 'mm' + " " + _pnl.unitedNumber }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 500pt" colspan="2"></td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">板厚：</span><span style="font-size: 14px;">{{
                        props.publicCommodityInfo?.commodityThickness }}</span><span style="font-size: 14px;">mm</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">成品铜厚：</span><span style="font-size: 14px;">{{
                        props.publicCommodityInfo?.copperThickness }}</span><span style="font-size: 14px;">&nbsp;&nbsp;OZ</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">下单时间：</span><span style="font-size: 14px;">{{
                        parseTime(props.allData?.placeOrderTime, '{y}-{m}-{d}') }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px;">订单净面积：</span><span style="font-size: 14px;">{{ props.allData?.area }}</span><span
                        style="font-size: 14px;">㎡</span>
                    </td>
                </tr>
                </tbody>
                <tbody v-if="props.commodityInfos?.length > 1">
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 250pt;"><span
                        style="font-size: 14px; font-weight: bold">成形方式：</span><span
                        style="font-size: 14px; font-weight: bold">{{
                        props.publicCommodityInfo?.commodityForm
                        }}</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px; font-weight: bold">测试方式：</span><span
                        style="font-size: 14px; font-weight: bold">{{ props.publicCommodityInfo?.commodityTestWay }}</span></td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px; font-weight: bold">板厚：</span><span
                        style="font-size: 14px; font-weight: bold">{{ props.publicCommodityInfo?.commodityThickness }}</span><span
                        style="font-size: 14px; font-weight: bold">mm</span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px; font-weight: bold">成品铜厚：</span><span
                        style="font-size: 14px; font-weight: bold">{{ props.publicCommodityInfo?.copperThickness }}</span><span
                        style="font-size: 14px; font-weight: bold">&nbsp;&nbsp;OZ</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; text-align: left; width: 500pt" colspan="2">
                        <span v-if="props.allData?.pnlInfos&&props.allData?.pnlInfos[0]" style="font-size: 14px; font-weight: bold">
                            {{ props.allData?.pnlInfos[0].name+'：' + props.allData?.pnlInfos[0].pnlLength+"*"+props.allData?.pnlInfos[0].pnlWidth+"mm" + " " + props.allData?.pnlInfos[0].unitedNumber }}
                        </span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 250pt"><span
                        style="font-size: 14px; font-weight: bold">投料毛面积：</span><span
                        style="font-size: 14px; font-weight: bold">{{ props.allData?.productionArea }}</span><span
                        style="font-size: 14px; font-weight: bold">㎡</span>
                    </td>
                </tr>
                <tr v-if="props.allData?.pnlInfos&&props.allData?.pnlInfos[1]">
                    <td style="border: 1px solid black; text-align: left; width: 500pt" colspan="2">
                        <span v-if="props.allData?.pnlInfos[1]" style="font-size: 14px; font-weight: bold">
                            {{ props.allData?.pnlInfos[1].name+'：' + props.allData?.pnlInfos[1].pnlLength+"*"+props.allData?.pnlInfos[1].pnlWidth+"mm" + " " + props.allData?.pnlInfos[1].unitedNumber }}
                        </span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 500pt" colspan="2"></td>
                </tr>
                </tbody>
            </table>
            <table v-if="props.commodityInfos?.length > 1"
                style="border-collapse: collapse; border: none;width:100%; margin-top: 5px">
                <tbody>
                <tr>
                    <td style="border: 1px solid black; text-align: center; max-width: 90pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">产品编号</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 80pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">产品名称</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">类型</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">阻焊颜色</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">字符颜色</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">订单数量</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">本卡数量</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 40pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">PCS尺寸</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 35pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">连片方式</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 40pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">SET尺寸</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 50pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">本卡净面积(㎡)</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 50pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">订单净面积(㎡)</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 35pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">下单日期</span></td>
                    <td style="border: 1px solid black; text-align: center; max-width: 35pt; white-space: normal"><span
                        style="font-size: 14px; font-weight: bold">交货日期</span></td>
                </tr>
                <tr v-for="commodity in props.commodityInfos">
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 90pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.commodityCode }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 80pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.commodityName }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.orderTypeDesc }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.commoditySolder }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.characterColor }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.quantity }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 30pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.cardQuantity }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 40pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ Number(commodity.singleLength).toFixed(2) + "*" + Number(commodity.singleWidth).toFixed(2)}}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 35pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.unitedWayLength+"*"+commodity.unitedWayWidth}}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 40pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ Number(commodity.unitedLength).toFixed(2) + "*" + Number(commodity.unitedWidth).toFixed(2)}}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 50pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.cardArea }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 50pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ commodity.area }}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 35pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{  parseTime(commodity.placeOrderTime, '{y}-{m}-{d}')}}</span>
                    </td>
                    <td
                    style="border: 1px solid black; text-align: center; max-width: 35pt; white-space: normal; word-wrap: break-word">
                    <span style="font-size: 14px; font-weight: bold">{{ parseTime(commodity.dispatchTime, '{y}-{m}-{d}') }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="border-collapse: collapse; border: none;width:100%; margin-top: 5px">
                <tbody>
                <tr>
                    <td style="border: 1px solid black; text-align: left; font-weight: bold; width: 600pt" colspan="10"><span
                        style="font-size: 20px">工程备注：</span><span style="font-size: 20px">{{ props.allData?.engineeringNote }}</span>
                    </td>
                </tr>
                <tr>
                    <td style="border: 1px solid black; text-align: center; width: 70pt" colspan="2"><span
                        style="font-size: 14px; font-weight: bold">生产工序</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 330pt"><span
                        style="font-size: 14px; font-weight: bold">工艺参数</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 25pt"><span
                        style="font-size: 14px; font-weight: bold">数量</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 30pt"><span
                        style="font-size: 14px; font-weight: bold">日期</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 30pt"><span
                        style="font-size: 14px; font-weight: bold">收板时间</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 30pt"><span
                        style="font-size: 14px; font-weight: bold">收板员</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 30pt"><span
                        style="font-size: 14px; font-weight: bold">操作员</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 30pt"><span
                        style="font-size: 14px; font-weight: bold">交板时间</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 25pt"><span
                        style="font-size: 14px; font-weight: bold">报废数量</span></td>
                </tr>
                <tr v-for="detail in props.productionDetails">
                    <td style="border: 1px solid black; text-align: center; width: 20pt"><span
                        style="font-size: 14px; line-height: 1.2; font-weight: bold">{{ detail?.index }}</span></td>
                    <td style="border: 1px solid black; text-align: center; width: 50pt"><span
                        style="font-size: 14px; line-height: 1.2; font-weight: bold">{{ detail?.productionCraft }}</span></td>
                    <td style="border: 1px solid black; text-align: left; width: 330pt">
                    <span style="font-size: 14px; line-height: 1.2" v-for="para in detail?.params">
                        <span style="font-size: 14px; line-height: 1.2;"
                        v-if="para.name !== '备注' && para.para !== null && para.para !== ''">{{
                            replaceParamName(para.name)
                        }}</span>
                        <span style="font-size: 14px; line-height: 1.2; font-weight: bold"
                        v-if="para.name !== '备注' && (para.para == null || para.para === '')">{{
                            replaceParamName(para.name)
                        }}</span>
                        <span style="font-size: 14px; line-height: 1.2; font-weight: bold">{{ replaceParamValue(para.para)
                        }}</span>
                        <span style="font-size: 14px; line-height: 1.2">&nbsp;</span>
                    </span>
                    </td>
                    <td style="border: 1px solid black; text-align: left; width: 25pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 30pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 30pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 30pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 30pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 30pt"></td>
                    <td style="border: 1px solid black; text-align: left; width: 25pt"></td>
                </tr>
                </tbody>
            </table>
            </div>
            <!--钻孔信息-->
            <div style="width: 100%; box-sizing: border-box; page-break-after: auto">
            <div style="width: 100%; font-size: 14px" v-for="(drill, index) in props.drillTitles" :key="index">
                <div style="width: 100%; text-align: left">
                {{ drill + '金属钻表' }}
                </div>
                <div style="width: 100%; text-align: center; display: flex">
                <div style="display: inline-block; border: 1px solid black; flex: 1" v-for="header in props.drillHeaders[index]">
                    {{ header }}
                </div>
                </div>
                <div style="width: 100%; text-align: center; display: flex" v-for="info in props.drillInfos[index]">
                <div style="display: inline-block; border: 1px solid black; flex: 1" v-for="val in info">
                    {{ val }}
                </div>
                </div>
            </div>
            <div style="width: 100%; font-size: 14px" v-for="(drill, index) in props.n_drillTitles" :key="index">
                <div style="width: 100%; text-align: left">
                {{ drill + '非金属钻表' }}
                </div>
                <div style="width: 100%; text-align: center; display: flex">
                <div style="display: inline-block; border: 1px solid black; flex: 1"
                    v-for="header in props.n_drillHeaders[index]">
                    {{ header }}
                </div>
                </div>
                <div style="width: 100%; text-align: center; display: flex" v-for="info in props.n_drillInfos[index]">
                <div style="display: inline-block; border: 1px solid black; flex: 1" v-for="val in info">
                    {{ val }}
                </div>
                </div>
            </div>
            </div>
            <!--开料信息-->
            <div style="width: 100%; box-sizing: border-box; page-break-after: auto">
            <div style="width: 100%;">
                <div style="font-size: 20px; font-weight: bold">开料</div>
                <div style="width: 100%;" v-for="(schema, index) in props.allData?.schemeInfos">
                <table style="border-collapse: collapse; border: none; width: 100%; font-size: 14px">
                    <tbody>
                    <tr v-if="props.allData?.pnlInfos.length>0"  v-for="(plItem, index2) in props.allData?.pnlInfos">
                        <td style="width: 180pt; border: 1px solid black;">
                            <span>{{ plItem.name + " " + plItem.pnlLength
                                + '*' + plItem.pnlWidth + 'mm' }}</span>
                        </td>
                        <td style="width: 120pt; border: 1px solid black;">
                        <span>{{ '开料件数' + props.allData?.pnlInfos[index2].name + ":" + props.allData?.pnlInfos[index2].feedQuantity }}</span>
                        </td>
                        <td style="width: 180pt; border: 1px solid black;">
                        <span></span>
                        </td>
                        <td style="width: 120pt; border: 1px solid black;">
                        <span></span>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 300pt; border: 1px solid black;" colspan="2">
                        <span>{{ '方案名称：' + schema.name }}</span>
                        </td>
                        <td style="width: 180pt; border: 1px solid black;"><span>{{ '开料率' + schema.cuttingRate }}</span></td>
                        <td style="width: 120pt; border: 1px solid black;"><span>{{ '投料数' + (schema.feedQuantity?schema.feedQuantity:0) }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 180pt; border: 1px solid black;"><span>{{ '每张大料总PCS数：' }}</span></td>
                        <td style="width: 320pt; border: 1px solid black;" colspan="3">
                        <span>{{ schema.schemeCommodityInfo}}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table style="border-collapse: collapse; border: none; width: 100%; font-size: 14px">
                    <tbody>
                    <tr>
                        <td style="width: 300pt; height: 200pt; border: 1px solid black;">
                        <div style="width: 100%; height: 100%">
                            <img v-if="schema.schemeFileList&&schema.schemeFileList[0]" :src="schema.schemeFileList[0].url" alt="开料图"
                            style="width: 100%; height: 100%" />
                        </div>
                        </td>
                        <td style="width: 300pt; height: 200pt; border: 1px solid black;">
                        <div style="width: 100%; height: 100%">
                            <img v-if="schema.schemeFileList&&schema.schemeFileList[1]" :src="schema.schemeFileList[1].url" alt="开料图"
                            style="width: 100%; height: 100%" />
                        </div>
                        </td>
                    </tr>
                    <tr v-if="schema.schemeFileList&&schema.schemeFileList[2]">
                        <td style="width: 300pt; height: 200pt; border: 1px solid black;">
                        <div style="width: 100%; height: 100%">
                            <img v-if="schema.schemeFileList[2]" :src="schema.schemeFileList[2].url" alt="开料图"
                            style="width: 100%; height: 100%" />
                        </div>
                        </td>
                        <td style="width: 300pt; height: 200pt; border: 1px solid black;">
                        <div style="width: 100%; height: 100%">
                            <img v-if="schema.schemeFileList[3]" :src="schema.schemeFileList[3].url" alt="开料图"
                            style="width: 100%; height: 100%" />
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            <!--压合信息-->
            <div style="width: 100%; box-sizing: border-box;"
            v-if="props.allData?.laminatedStructureVoList && props.allData?.laminatedStructureVoList.length > 0">
            <div style="width: 100%;">
                <div style="font-size: 20px; font-weight: bold">压合信息</div>
                <div style="width: 100%;">
                <table style="border-collapse: collapse; border: none; width: 100%; font-size: 14px">
                    <tbody>
                    <tr>
                        <td style="width: 200pt; border: 1px solid black;"><span>{{ '工序名称：' + props.laminateInfo?.craftName }}</span>
                        </td>
                        <td style="width: 200pt; border: 1px solid black;"><span>{{ '压合板厚：' 
                            + (props.laminateInfo?.pressedThickness?props.laminateInfo?.pressedThickness:'')
                        }}</span>
                        </td>
                        <td style="width: 200pt; border: 1px solid black;"><span>{{ '公差：' 
                            + (props.laminateInfo?.pressedTolerance?props.laminateInfo?.pressedTolerance:'')
                        }}</span></td>
                        <td style="width: 200pt; border: 1px solid black;">
                        <span>{{ '层叠状态：' +  (props.laminateInfo?.pressedLayeredStatus?props.laminateInfo?.pressedLayeredStatus:'')  }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 600pt; border: 1px solid black;" colspan="4">
                        <span>{{ '层压备注：' +  (props.laminateInfo?.remark?props.laminateInfo?.remark:'') }}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table style="border-collapse: collapse; border: none; width: 100%; font-size: 14px">
                    <tbody>
                    <tr>
                        <td style="width: 60pt; border: 1px solid black; text-align: center"><span
                            style="font-weight: bold;">层号</span></td>
                        <td style="width: 180pt; border: 1px solid black; text-align: center"><span
                            style="font-weight: bold;">图示</span>
                        </td>
                        <td style="width: 50pt; border: 1px solid black; text-align: center"><span
                            style="font-weight: bold;">类型</span></td>
                        <td style="width: 50pt; border: 1px solid black; text-align: center"><span
                            style="font-weight: bold;">板层参数</span>
                        </td>
                        <td style="width: 60pt; border: 1px solid black; text-align: center"><span
                            style="font-weight: bold;">PP片</span>
                        </td>
                        <td style="width: 200pt; border: 1px solid black; text-align: center"><span
                            style="font-weight: bold;">备注</span>
                        </td>
                    </tr>
                    <tr v-for="(detail, detailIndex) in props.allData?.laminatedStructureVoList">
                        <td style="width: 60pt; border: 1px solid black; text-align: center"><span>{{ detail?.layerIndex
                        }}</span>
                        </td>
                        <td style="width: 180pt; border: 1px solid black; text-align: center">
                        <div style="width: 100%; height: 14px">
                            <img :src="detail?.url" alt="压合图" style="width: 100%; height: 100%" v-if="detail?.url" />
                        </div>
                        </td>
                        <td style="width: 50pt; border: 1px solid black; text-align: center"><span>{{ detail?.rawMaterialType
                        }}</span></td>
                        <td style="width: 50pt; border: 1px solid black; text-align: center">
                        <span>{{ detail?.boardThickness }}</span>
                        </td>
                        <td style="width: 60pt; border: 1px solid black; text-align: center"><span>{{ detail?.pp }}</span></td>
                        <td style="width: 200pt; border: 1px solid black; text-align: left">
                            <span>
                                {{'材质:'+(detail.material?detail.material:'')+'；连铜:'+(detail.linkCopper?(detail.linkCopper=='1'?'是':'否'):'')
                                +'；铜厚:'+(detail.copperThickness?detail.copperThickness:'')+'。  '
                                + (detail.remark?detail.remark:'') }}
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
            <!--报废空白表-->
            <div style="width: 100%; box-sizing: border-box; page-break-after: auto; margin-top: 10px">
            <div style="width: 100%">
                <table style="border-collapse: collapse; border: none; width: 100%; font-size: 14px;">
                <tbody>
                    <tr>
                    <td style="width: 200pt; border: 1px solid black; font-weight: bold; text-align: center" colspan="10">
                        <span>{{ '品质问题统计表' }}</span>
                    </td>
                    </tr>
                    <tr>
                    <td style="width: 50pt; border: 1px solid black; text-align: center"><span>{{ '序号' }}</span></td>
                    <td style="width: 150pt; border: 1px solid black; text-align: center"><span>{{ '工序' }}</span></td>
                    <td style="width: 250pt; border: 1px solid black; text-align: center"><span>{{ '原因' }}</span></td>
                    <td style="width: 75pt; border: 1px solid black; text-align: center"><span>{{ '负责人' }}</span></td>
                    <td style="width: 75pt; border: 1px solid black; text-align: center"><span>{{ '数量' }}</span></td>
                    <td style="width: 50pt; border: 1px solid black; text-align: center"><span>{{ '序号' }}</span></td>
                    <td style="width: 150pt; border: 1px solid black; text-align: center"><span>{{ '工序' }}</span></td>
                    <td style="width: 250pt; border: 1px solid black; text-align: center"><span>{{ '原因' }}</span></td>
                    <td style="width: 75pt; border: 1px solid black; text-align: center"><span>{{ '负责人' }}</span></td>
                    <td style="width: 75pt; border: 1px solid black; text-align: center"><span>{{ '数量' }}</span></td>
                    </tr>
                    <tr v-for="item in props.scrapped">
                    <td style="width: 50pt; border: 1px solid black; text-align: center"><span>{{ item }}</span></td>
                    <td style="width: 150pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 250pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 75pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 75pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 50pt; border: 1px solid black; text-align: center"><span>{{ item + 7 }}</span></td>
                    <td style="width: 150pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 250pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 75pt; border: 1px solid black;"><span></span></td>
                    <td style="width: 75pt; border: 1px solid black;"><span></span></td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
            <div style="position: sticky; top: 0; text-align: center; width: 100%; box-sizing: border-box">
            <table style="border-collapse: collapse; border: none;width:100%; margin-top: 5px">
                <tbody>
                <tr>
                    <td style="width: 250pt; text-align: left"><span style="font-size: 12px">MI制作：</span><span
                        style="font-size: 12px">{{ props.allData?.miMaker }}</span></td>
                    <td style="width: 250pt; text-align: center"><span style="font-size: 12px">MI审核：</span><span
                        style="font-size: 12px">{{ props.allData?.miAudit }}</span></td>
                    <td style="width: 250pt; text-align: center"><span style="font-size: 12px">打印人员：</span><span
                        style="font-size: 12px">{{ props.allData?.personnel }}</span></td>
                    <td style="width: 250pt; text-align: right"><span style="font-size: 12px">打印时间：</span><span
                        style="font-size: 12px">{{ props.allData?.printTime }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>

        </div>


        <div style="width: 100%; position: relative; page-break-before: always; box-sizing: border-box"
            v-if="props.currentPdfList?.length !== 0 && (props.printType === 'all' || props.printType === 'outsideImages')"
            v-for="outside in props.currentPdfList">
            <div style="position: sticky; top: 0; text-align: center; width: 100%; box-sizing: border-box">
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody style=" font-weight: bold;">
                <tr>
                    <td style="width: 80pt; text-align: left">
                    <div style="font-size: 18px;">{{ props.allData?.isRemediation  == '1'? '补料' : '' }}</div>
                    <div style="font-size: 18px;">{{ props.allData?.orderTypeDesc }}</div>
                    <div style="font-size: 18px;">{{ props.allData?.model }}</div>
                    </td>
                    <td style="width: 80pt">
                    <img :src="_logn" alt="logo" style="width: 60px; height: 60px" />
                    </td>
                    <td style="text-align: center">
                    <span style="font-size: 25px;">{{ props.allData?.enterpriseName }}</span>
                    </td>
                    <td style="width: 80pt; text-align: left">
                    <div>
                        <span style="font-size: 18px;">本卡：</span><span style="font-size: 18px;">{{ props.allData?.bundlePnlQuantity
                        }}</span>
                    </div>
                    <div>
                        <span style="font-size: 18px;">扎号：</span><span style="font-size: 18px;">{{ props.allData?.no }}</span>
                    </div>
                    </td>
                    <td style="width: 80pt; text-align: right">
                        <span style="font-size: 30px; font-weight: 1000">{{ (props.allData?.timeSpanDays ?props.allData?.timeSpanDays:'')}}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody style=" font-weight: bold;">
                <tr>
                    <td style="width: 200pt; text-align: left">
                    <div>
                        <span style="font-size: 18px;">总数：</span><span style="font-size: 18px;">
                        {{ props.allData?.totalNum +'块'}}</span>
                        <span>&nbsp;&nbsp;</span>
                        <span style="font-size: 18px;">{{ (props.allData?.pnlInfos && props.allData?.pnlInfos[0].name)+":  "
                            + (props.allData?.pnlTotal?Number(props.allData?.pnlTotal).toFixed(0):'') 
                        }}
                        </span>
                    </div>
                    <div>
                        <span style="font-size: 18px;">投料日期：</span><span style="font-size: 18px;">
                        {{ parseTime(props.allData?.feedTime, '{y}-{m}-{d}') }}</span>
                    </div>
                    </td>
                    <td style="width: 200pt; text-align: center">
                    <span style="font-size: 25px;">{{ props.allData?.miName }}</span>
                    </td>
                    <td style="width: 200pt; text-align: center">
                    <img :src="props.qcCodeImage" alt="条形码" style="height: 60px" v-if="props.qcCodeImage" />
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="border-collapse: collapse; border: none;width:100%;">
                <tbody style=" font-weight: bold;">
                <tr>
                    <td style="width: 250pt; text-align: left; font-weight: bold">
                    <span style="font-size: 22px;">产品编号：</span><span style="font-size: 22px;">
                        {{ props.allData?.commodityCode }}</span>
                    </td>
                    <td style="width: 175pt; text-align: center">
                    <span style="font-size: 16px;">生产编号：</span><span style="font-size: 16px;">
                        {{ props.allData?.productionCardNo }}</span>
                    </td>
                    <td style="width: 175pt; text-align: right">
                    <span style="font-size: 16px;">MI单号：</span><span style="font-size: 16px;">
                        {{ props.allData?.productionPlanNo }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <!--外形图信息-->
            <div style="width: 100%; box-sizing: border-box; min-height: 715pt;">
            <div style="width: 100%; height: 650pt;padding:1px;border: 2px solid black;overflow: hidden;" class="global-flex">
                <!-- {{ outside }} -->
                <img v-if="outside" :src="outside" alt="外形图" style="width: 100%;height: 100%;object-fit: contain;" />
            </div>
            </div>
            <div style="position: sticky; top: 0; text-align: center; width: 100%; box-sizing: border-box">
            <table style="border-collapse: collapse; border: none;width:100%; margin-top: 5px">
                <tbody>
                <tr>
                    <td style="width: 250pt; text-align: left">
                    <span style="font-size: 12px">MI制作：</span>
                    <span style="font-size: 12px">{{ props.allData?.miMaker }}</span>
                    </td>
                    <td style="width: 250pt; text-align: center">
                    <span style="font-size: 12px">MI审核：</span>
                    <span style="font-size: 12px">{{ props.allData?.miAudit }}</span>
                    </td>
                    <td style="width: 250pt; text-align: center">
                    <span style="font-size: 12px">打印人员：</span>
                    <span style="font-size: 12px">{{ props.allData?.personnel }}</span>
                    </td>
                    <td style="width: 250pt; text-align: right">
                    <span style="font-size: 12px">打印时间：</span>
                    <span style="font-size: 12px">{{ props.allData?.printTime }}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="PrintPdf">
const cardRef = ref()
const props = defineProps({
    allData: {
        type: Object,
        default: undefined
    },
    currentPdfList: {
        type: Array,
        default: () => []
    },
    printType: {
        type: String,
        default: 'outsideImages'
    },
    qcCodeImage: {
        type: String,
    },
    publicCommodityInfo: {
        type: Object,
        default: undefined
    },
    commodityInfos: {
        type: Object,
        default: undefined
    },
    productionDetails: {
        type: Array,
        default: () => []
    },
    drillHeaders: {
        type: Array,
        default: () => []
    },
    n_drillHeaders: {
        type: Array,
        default: () => []
    },
    drillTitles: {
        type: Array,
        default: () => []
    },
    drillInfos: {
        type: Array,
        default: () => []
    },
    n_drillInfos: {
        type: Array,
        default: () => []
    },
    n_drillTitles: {
        type: Array,
        default: () => []
    },
    laminateInfo: {
        type: Object,
        default: undefined
    },
    scrapped: {
        type: Array,
        default: () => []
    }
})
const _logn="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAGFxSURBVHhe7b0HYBzXfef/m9legV30DqKx994psYhqVCVlW3KNLSeOHdvnc5z/XXI0759L4uQUn6zEiXROcZEtkaq0ZFGVvfcGEATR6y6wvZeZud9vdkGRFECiLwC+jwQudmawM/vmve/7/t68AgwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYjNTBJV8Zo8y87/xbVmdPYEokFs+SRE6V3Dyu4TmIWNJ03RVpioYPfvoNZ3Izg5EymGCNAo/99et5Z+psJR5/NFOSJCVti/O6orgoLo/GhRkAkkE+cPwTUSoV14wa1WExEqhLbpPheClm0GgdZVmm5oP/55ku3CIldzEYowYTrGGwfft2/lisIqeu1V3gjwppChAVtF1vtlb1eMOrvcFoFSaxTj6Yk1Qgcen4apHfTxQkCADHdeNrNLklAQcxpYJrtJq0h8Vo4LxSEkQBeMGqVbunF5g63vwbJmKMkYcJ1iAggXq/a0pem9dbEBVFk4KXlCpd2my7N7wyEhWm4CEa+UAJMOSTMjF1zfL7m+AmYJpLfQuPxIXxXxt+T3ol4kqebyuw6g77g6GzaMLCBg3vm1Fobl+kauzcsWOHmDyOwRgSTLD6Ye327cqe5uy8cDSULXK8XpI4Lga8IqbQL3D6w2uFuFSEyadGE6FGgcrFlOwjzJuI4jRYbhUzLorp0YnbQ/gmruC5znyr8RBq1zGVEAhxPB+cVmK16ev0Xbt2bRMSf8NgDAwmWLeALkq5L1SQe6UlWuAT+HtC4fhqTKY8LIBK1B9ML0mLh+Wju6DXBJyE2+8GcRooSRGT5JAwjumDAgZ+TCP8HboLrcZjvBg5rIj6/XGOl1QchPJz0run+2NdL730zZj8twxGH7BCluTZF19Ueezm3GNXPYWSUrOhzRFYKYFUhqWuCAueOnlYAiZQgwQFLCFelONEdGBdmIYefBUxGem9M8OkOa4AOKwBv0sFYnhKpqm7LAydTMAYN3LXFrqt27erm53WbJ9HSJME0KhMRoNGZ151vrF7VVyESjykGAuSionTaHCDgBGyiKEL4zgSsRi+d2WYtCe1KmmvMe5pL7WkuXOsqp5f7vhqb1sZ4y7lriuIX97+H9pOXzCrvlss9InaDd3e0DJMhSzcpUBZMmNRKkwIFfBMqMYQcluJXyRMdhQzyYbp34MbHFkmzRm9TvnR3Byonqfkuncw4bpruWsKZK9QtfmVJTFJs+mazbcUC0k57irCwiF3R5AFijmqcUKvC8NX4Ox4QxrzM4zHrSb13qjT1i5JUsyarvEWaCL21376A2rgZ9wFTOqCSSJV1+O3+r0Ro8KUmRsB5T017c5lWAyqsBjQUz4FE6iJAIkXtXdBN9YoNnwXwd/9Zp36stWsfn+eIXLGnKZxsZBx8jMpC+qT339OZ/Nz6V0xY4UzCvc5fZF5mOkzOY7LxOoaQz564sdCvolHr3Al278kyYn3tC4rTXuqNNt4IGRvv5Rt1vjLMtXul3Z8Mygfw5hUTKoCS0LlCYmm+oi1yhcVN/T4QkvRQE3D3J0vC5SEbooJ1SRCDhcFWbh4aMN3DoNaWZ1jNe7LjDjOGdK4kFUheFnIOHmYFAWXhMopKMwtPtM0R0S41+2PLMYvVoXVcUGiAR1DP8bkJREuUvcIEd+4UbxasG7qNmhV9ZW5pn1C0HEmUxKD+kKd7x3mvCY0E1qwZKHyKsx2tWWazRfd1OMJLeR4jtqn8rHWpY6eTKjuOnpdlyxePo7nmyVR7FYp+cacNP2+dM59UivGgwqrwnOMOa8Jx4QUrM3feV4jBuOGq3zmbIc3dJ8/FJvHgTQDa1Xqka5gQsVIcD1klDCn+zngGvDXHswfdWoF9+59FdrDu//h677kwYwJwIQTLHJVp70Zs7s9wU2BSHw5x8FMzJU5LPRj3B4ULYmGCXHU38uNjuujokzj7/Ol0IHp+ZznpR8/G8J9mJUY45kJI1jUM93VqdO5DVPmNdg9D7t9kfswB1ZMeKGSJEF2AWgRk1tGBkni8TOV+NkTOuwfHUi8OA/qU41apTy7uDL7gOBzH9THegIFeaHIL3fsYN0jxikTIjNTf6oDbdycTldgczQuLsKLnoPVZC7uSkznMr6Iy+0nAxEgPI7nJSeGso0YqgRGTrQ4XsmDJS5AOX7mwCYLpKAJUODkp6h3A3K4GMUXP01SGBeELp7jmnPSjUdz1ZH9s/M7XUy4xh/jWrCorSrEi7oQnze/rsuzxeOP3i9xyWldqHCNC3rbSUikpLhCoWgTRLENN9884V2fcMEMk+barALrJ7yn+RKvjI+MYCnSlZw5Z8nR2s41gXCsBO/yzYO3+4DneJMkicV4AVl4XTfnC1nMJmvboOy2aIA1ulwpzHFcLQaG5zPStAcKVOF9c4p6nEy4xg/jVrAoBDzZUjy/wxPaLAqwCAvTXFGedypV86H3ChO93gAHAiZiC27twt+7F5Znn841qj4K2ps6kkf0CwlULKaITs0zBUe6o+P3n3tVd6HBro9GPWoVr7uza7KWzrjS4V7X6QzMwjQ2JrfK4PfT4j95+B3p6esNn4UCNqkc2XXxCnI8XJFE6ZxJoz5YYQnuXalVOF944buRxHGMVDEuBYtCwKs+44LLbY7H/OHYQ6gRhViIaP6pMXJVt4oT1rkcxDhOapJEcOCG5EBduZHWkZ+hPWNWCZ+kC76ughx1cKY6z7Njx7YBOKzxw3eef17T06w1tfhd+piouNlJGXMLewLxdY02/wJ0W2mYPmjBZJebI3HyyIFbRYuf2G5Mvv80EWEA73ktftezxVmGw3lacd9CPuBgwpU6xpVgPfvsi6paZUyjyyleevxK1xZPILxZkrhSvMo7hjQjw3WhotCgCatbtzwAlwMRS6StPNt8VKsM7FdHPJ7kH4BGxcUtRmUw32/yTNa5m2hSw8tQaG5q9hiAi8kON6DMzvLHuHvbHP7F+DYD003OS1jAlfhLBip6Mb5TYlpieZ+o4pUULpCCPM9d5SU4U1loOZSvD+8r8wjdbK6usWfcCBa5qn2t/PxOp38d2vHFgigtxJ8c3DVKDeuYGeV2p5seZWPNKdWrFXzNorKsQ76A47AqFJQ7F3I8Hy3NTfNZHXE3y6gYsm/dqQgVuSxdroA5giKmFhRyXlKZMs1xpWbNucae5YIk5ZF4oWYVYU5LhPISua+JFkb2Oi7Jr1LytfjubHl+2uEcIxyc6g7aWH4YO8aFYJFYnXKoFjZ2eZ8IR4QHMHfQ2D9abWbkQ8DEEzwK6YKcJDVj/e9Pbo/xPN+RZdYezFD79i4ot9rDFTr3rm1s3vHBQAt1tEFh+sV2d1pcY7KAIm31hWbHSkES8zCNVejDzGhZ0X1hRSS7LxKvidL1goQLKzWJCyoV3FXgpLN56fojuUZh37yIxIRrDEh5RiGxOodiVW/zPRmMxB/GLEG18ciEgCROiV8+dVEcF8D319RKRU1JhnkfF3Mf13FhgYsLkkKpjqTpVZ5VmT0utsLLCICC9Cd/99v00/Ud6bGIoBVUOm1UbVnR0OVdHROlEsx86XhjivC4T+fHJ/Ea9w4s6biSoSJuOG0xaPaXZ3D7j//sG7bEMYzRIKWCRWLVHDUtPFPf84Q/HH0Qa94S3Dz8EFAWKrn69uA/Hfg+0UjKSVEFxzWlG1WfWPjQ4alZ+u53/vFZB+2Q9zNGGYl79C9+ZW1o784IK3RpnNq4rKnbvyoqiNeno0b0kggFeLBhYgiXnLf8Co4/WZJtfCPXqv8gvwHa2YpAo0PKBGs7itVFdfbCvZfbt3r90YdEkApx8/DEKhnuYajnwZzUmJWuuzSz2PJJZ1t7NaCD4pWcqBSFYG5mWs8HP/26iwlVKpG4J7f/wlLfFrFG4jGjGJd4hUqjKCjKn3/ymm2VJxCbg3JAi4Do8T5h3YNVz3gOHeUOqHw1XuGpDJP2SH6a6mBZp44J1wiTkgxAzipkQLG60PGk0xveIkoShoHD6V+FWTsxnS6KEDSmG7UXijPNn6hF78kHKrLsO77/mDtxHGO8s/35X5uPNoWze0Tjqqsdng2BSIymsU7HW5yH2dUkHzR+xSuClWaA56Ge57gTWg1/PD9dd/BzuU0trIlhZBjzm05i5VZmLThytYvE6iFRFEuHJla9IiX/Tm6pyaRXXrAatHvTJe/pJcWZ9pd2PE2LGDAmIH+0/VXrxS5nbrs/atbr0md3ekOrA6HYVLzX6Xivs/GQxKra4068esNEzsdxUoOC445rFKr9aRb+RPsvnm1LHMMYKmN6o6lzYmtgyoLD1bZtKFYPo7MqHrxYyRmCcKBgOfAbuAxaxRWTVvlBvjZ8dkqezv7ajm84k8cwJgFYyaVftoVyetyRdKUxY5bdF1rtC0Zm4i4z3n8aSmRJHDnOkCCKgurFPH4u26R9uyTH/O6J555qTO5lDIExEyxyVk6Vdd6JWvsTPZ4IhoHilMGJ1Q1CBdCSZdJd0GvV+0K+nhazQeWckq5r/eCnTKgmO1t/tDOtOegraOl0Z1kysiqcweh6uye4BnflJ44Yh6FiYoD1ZSXPH1KrFIenFmecPPH3TzC3NQTG5Ob2NrAfrOl43OmNPDRwsUqKVKJ9CsM7rjXTrD1nUMGHBk38yrJca+u/7XiKidRdyg9/8pZpb2d4aXWr6/FQNL4E3Uwa5hUrvqLjGnfCRU8T3QoeqouyTG8sLM5797W/2tSE19lbETMGwKjfVBqEe6lHseBCq+vJHh+1WUklAxarXqHioC0nTX9Kp4IPTOpo7dTSzNZdf7Ht+vAYxt3Lxh/8ytDpCxX1uIPZvMFcHgoLq9z+8ALM2sUJ4SLGVRtXUKXga/Ra1UEsC8cqstNOnXnh8/XJnYw7MKo3UhYrt2LBuUbnY04fOitRKruzWN3gqjipITfdcEDBCZ9YdXz1slJzw0tMqBj9sHX7PxlbXMayhp743IgQW+8LxuZifkPXBWnjzHXR00Qnz3NNOrXiiCDCwfxszZn6f/laa3I/ox9G7QY++dxzuvb24vnX7O6tDl/4QUmUBvY0MNGXqht/aTdoVftm5BvfmperucCEijFQnt3+ov5Uj6q8qcuXpzGYiiVRWG7zhhdinqIOqdcHaqecRKO8E6/marpO+9qU7PS3T/9sW0tyL6MPRuXGUYa54E2fdc3mfdIZCG9Bz0R9aW4/LjDRO53Cvy6TTn1KEqN7LXpdzbxs7ipbKIAxVCgv1odNU8+2+GdzPHeP0xtC4aIGes6CeW2c9KSXgnhtp7KM+p1FmWnvnfo/TzTi9bG2rT4YccF6CDNITYdunicYftzpjzw0MLGSBA64axaz+pAQi+21GrW1VYbA1T0vfNebPILBGBb0lLo1aqw60+yYpeb59d2eyFrcPGU8iRbP8ZdMOuUBISbuL8wxX6z5+dPotphw3ciICtbab/2TsS6on+MNRLYGIvEHcdMU/OlfrGgBBjn8gw6tUvlhWY5297xs1aWXd3yRCRVjVKC+gGc78+edb+h5zB+K3YfRIS22mzEuhItCRACHHCIa1W/nZZh3X37hcw1MtD5lRCdWS5u7uaDTK30uGIk9hG8rMDPczlnF0QY3opv6RBDFXUal4pPZGvHS6//4tcR0LwzGKHBizx5h6foZ3e5YRkcwEm/RKBXRmCBiPpWnRo7jjwbFKzVtXByWRw5MqFy5kahoUSm42JpHGux1+151w44dyYPubkbsxmz54S9MFx2wpqk7+Of4dvltGtjj6KycuL9Tr1G8P7vAunt5UfuZn/6ArcLLGFtohttDSsPM2jZXpVatzDfr1fPs7sAKEbgy3H37ZozRJ8Lz3MU8i+7jQFjYW5alqXnI0tB2t49JHBHBeujZF/VXRG6OMyA94/JHHsOPzcVP/qzFlqQYz0GjWa857A9FDuelm88tsTqqX2NLhjNSzLMvvqjyOgoWfHS54xGnL/KAvI5Aqhvmsbzgv10YiVzLNOt3l2Wq3rnPXN9wN4vWiISEhrmb8xs98AV/OEbtVsWJm3zTo2Oy2g7c0KTXqd6dXmB95QmL64P3//VbLdXHPqB9DEZKOf3OO+KK8rV2Mdva4fKFW/UaZSQiiEYUDTNm5dTMSU/npX5kIOWFIkJ2WJDMx+1aKFj+aOw7Dy/w79+//65r2xr2jaBQsCmsWODwRp9BoZqLP/iZN4kVWltozE7TfhSOSq8VZJg+Wsd3n3v++e+ztd4Y44rTp98RWw/v6v7/ti66FE+rbHX6Q7FITEwHTlJhnqZZcFPktuTFPLKDkXh5OA5zwnFO0RjLsn/n4bmeu020hiVYT37/Od0lr26WLyw9hom5AjdRbXTjTY3wHFefYdbuvndmwc41VT179vyvZ9tOnNjDJjVjjFtQBMSFuY/bgpmSLRCO2TRqZViIC0ZJ4kyJCjkF9LotCfLjgmCReC7ulLK7vn7/HO/dJFqDasNagW7K4YjmOwMx1CCIRESt0REUHgjH4g9iQk67JRSUxcpq0Ly1qDLrzQpr88UXvsvWc2NMLNZu366E4Kx5F1odD3sC0S2oDDTZJIZpKW2Uj3CSdC473bCrKle7O6dJ1XC3zGw6qNpCWXHftM4A92VPCL7qiypWCsDNRWdFHfCqbhYrWtePb0jTqd6aMSXj9XJ794V/+V9/OqEWFmUwiGZ0W1/ZOKOrVczu8oSFDo1KERIEUY/CRRMIpkq06Lw5wWgsJxzjTc28P162dFN8+sNLg3S9iUMmJ4MSLK7yvvm+CHwVf11G0xpHBaEEt9KSXDc5K47jGgwa5e6yPPMbcz3uC2z5I8ZEhkKu7lNv9fzltkUXvbqSFm8wKkTjYiZWzBqMLNSY9ce+bUt+EMBlBSLR0kBUnBWMq1Wi32RbX/Ulb3X1rkkbIg5YsCgc7PYIiyMCbAJOysAEo35WWhQrFKobnRXXoFMp3yrN1r8x1Xrtwq//8b8ysWJMCqht6+ubZthahVybJxjpUqn4kCBKBkhd2xYJJc0BVojmISss8GI0Q7TfU/a0Z7KK1oATmcJBX4x/LCaIc/GtMSFSvT8ycfy9i+e59/Ithl3rpMg5JlaMyYbstk6/2f347K+c1xXqmv2RmBCJi9notNJTI1pY/ui8EmTHBcnKKRTxcHqsc+2UZyal0xpwAnPlG+f5YvA0qnklptFnLbBEgiXZJAmqVRruSk6RFraum+u7m55gMO4eSAz+6L6Ztk5Vgc0fiElxUbBiGdDjLnqaN/bClThnVigczwjHQeDzlV3fuG82lb9J1aY14ITVTN88OyIqHpbDwU9d1ack+l8Z8TVfjMNS0BhMqnjk1IWjHzKXxZiUUGX8x/fNctSGrfZQRLCr1IqIKEnalDXIy2VQyo7GxQyJ4yW3Is/+1U2zqK/WpBGtAQkWzSlU7YQ5kbi0Ht/2P3NjYtCoJi6IotMXvlShdR+rPrmfPR1kTFpItDzn3u5Z9dQfzk+xVNb7I9FoMByjlXysCQEZY8hpSVJ2IByzCsAJflVe5+KCpyZNeDigpxtnXIoytVqzFH8ly9s3EkR5kNrVSn6vQsG9nKbTfAJZ8nQZDMYkh5P279gRX6E6dyHLoN1p1Kl2YpVegztS0++Q41SSJM3vcPm3NbjCj7qm8mVbd+4ce/EcBQb0JcKF6+c5w/FnUJT6ab+SYniD2vRa1e/nFGe8PD+z+3VzrqPpDzt2sHCQcddAbst+6g1n7rLqnmgszmGkkWKnBdneQCxDEDnBEoHOL6ybPeGH8gzIYQmSqJfk5ZNuOZ4m4AMI4PZmtUr5+5Js084iqe3Q7n/4kY9qnMRBDMbdBCd9pbChNlOreV2jUuzEDZfxJ4A/Y18eyGmBNL/F4d1W1xl/9CLMLp3oTmtAF6+dvnlaRODvQ2H6tP2KQkCe7+R57ijPce9nmNXvrM6H07/7u2+xQc2MuxpyMd97fL7jXI/RHgXwYhmJchKnkSQY+/5aSaflCkYyQaES8sMq+/Q/edJTvWtitmndMfFoStlqm3ZWKCquvy5YFALyXGOaTvXOwvKMX82xdr++MK5p/vd//Dprs2IwEBKtP9+6yFUcDp43FpXUxkUp7AvFMrCmz5RFZCxJipbDH8oMi7yYH9N1Prlm2oQMD++YcFXrvzE9EFU8YPcEF+AX1+MXj3DANem1it/nZ5pfK4OOU28+98MATc2R/BMGg4GQIJw/vz++tGCbPWgROyJxSYrGBCvuykqNaHFZrmA0U+QUcVN+edcjyyonnGjdMdG6MteuaHeGviBKUMpzkh147qRKyX9oTdfvnqp2nd3N5rViMG4LdSlYU/oFd8was0UlLh6OUmO8lALRwvIuSVkOXyQjEJYElaXINtGc1h0TTKja9GBU4J7keGjPMOp2zyq2/qpC1/lWnlpq2fMCmy6GwRgIJFprpzzjDqYLtkiMg1hcyMbNNCZ37J0WQKYrEM4QOaWoRqc17Y8e9U6UNq07JhY/7YHFkshVGbXKd3Ktul1LLP5Tr/3D973X2CR8DMagINH604fmue2CtSsscWIkmqLwkHrhy21a4UxfIC5ovYruRX/2lHsiiNYdE0o9fTOn16jtBWmGD5bkCuf/fcfX2YIRDMYQofDrmyhaHVKWLSaCGIoJWSgeKWiIl8PDbE8omimCQswW9J1PTYDw8I6JtHLp0p4SHV9dZAq2sy4LDMbwIVH44wfmehrDWTZBBCmSyoZ44DK9oVhmOArxmLmw6wvrpo9r0ep7TCCDwRh1tm7dqaiz+stafdEtLn/0KUmCeSgi/a3nOXpIEOV47kJRpuGVsjzLO2sUZ+vG61JiY6voDAbjOtSmtbrsaU8oW+qSRE4KRTA85IAa4wc0AmXEkMNDQKcVzXT7I1Izn2frOf66C2D8rTbNBIvBSCEkWutKvuDlsxW2GKpGMBxLUXgoa0FmJB7PFONivHJjXY/t6GvO8SZaTLAYjBRDorWi+HMeKU+ySaAQAqF4apyWPIcXlxGOCZnBUEwqWHzR5jr3NorW+IEJFoMxDiDR+samuR6fIrcHeIXRE4qUgsSZUbjGup2ZujxYYzRHvCjFcxdttXnPv+keL06LCRaDMU7Yv3+/eN9X7vN0dUjB7kB8JrqdkmSoNrZwQA3/ViEuZkckIW5ZcN4evPD7ceG0xtpyMhiM2/DSN78ZM0Lgmlmj/gBAuoCbUjRNE6eVOJgVicafcAciS/FaxkWPAuawGIxxRsWWpRFNLK0bVCoIhuX2rCzcnAJzwVF4qDHpVMENn++8dvWT3/Ukd6QMJlgMxjiDVm9eU/5FtzpPssU5peQPxjJTJ1qgjgmiPhQWwgse+LKt6eCrruT2lMAEi8EYh1Aj/ObZ93u5jPQe9Dk6jz9agpvHvhGe4xQSSGZ/KGZy+mK2Hz2x4FIqe8KzNiwGY5zy0kvfjFWWO6+m6zW7UThoUYuUtWeJkjQNQFrblbsaX1MHc1gMxjjm9DvviAsWrA/2CEpzOBbPx03UqXTsjYYEqrgo6T2BaHjtE3/UWfPxb1MSGjLBYjDGOfOmfDkWt4gd9mC0HSSuLCXtWRQaSqLZ7Y+k+8Px6NR7v2BvP7rLM9b9s5hgMRjjHGrPsp1+271o6T32jrCqDN1OMW42jHl7FnBKCaRMXyhu9UXizr94/PfUnjWmg6T7/8KPPr8QBH4WHmFMbmEwGKlEkrQcx63C1xX4buxnK+1Fkhx6jfKt9XPy/2H3Xz1yFa9jzBrh+xesh1/4MgfSn+AhBcktDAYjlXBy500NOixLysSKkCCqUHK1JZmmXxZaza/v/8mjzXRxyb2jSv+CteWFP0bB+gs8hB6nMhgMxg1IYZ7jz1pMmlf0Wun3Lb/4RtNYiBbr1sBgMIYAdXUQ5zu94cd73PFVW7f/eEwmHmSCxWAwhginlSSYGxWke5t6ykrRdY36QwAmWAwGYxhIBlEUF7f64w9P/eZ/lmzfvn1UNYUJFoPBGDocp5JEKLO7gg93eSP3NAGok3tGBSZYDAZjeHCgkyRpnj8Qu+eUvWzKaLosJlgMBmME4HQSB3Pdgeia0XRZTLAYDMbw4UCNoeGULm94xYXuwsLRaoBngsVgMEYIiZ4azusK8Pd+efuPNcmNIwoTLAaDMTJQA7wEpd2e0LIemJ0/Gm1ZTLAYDMbIIUk6nuPmd3qjD52KzcgbadFigsVgMEYOdFkxQai60Oh8uLYndM9lr3lEQ0MmWAwGY4Th9IIgLW2y+zZ2Sekj6rKYYDEYjJGH+mYBNcAr7jsb1BuSW4fNuJ+tIVengAWFaaBVK5Nb7kw0LkCPJwR1jjA4YoObX2xhlg5Kc0yg0ybGcsYFEaIxAWNz+W2/SJIEvmAUDrd6ISSM/KD1KpMKpuabIc2kTW5JQOes6/DCFXcExnQmtdswxaCEEqsOzAYNKBU8iJg2oXAMOlwhuOzq/zpNCg6mWrT4dyrwBGJw1RUG3wDSclW+ETLTtMDzqa9/w9E4XGj3Qlvws9OvL87RQ75VD4phXuft8ppRycGK4jTITNdjeiSKdzgSB1EcXJ6MCwI0dQfgApahISNJfryGtxeVGHYc/9lXr6GWDLtgjHvBWltshr/+4lIoyrdevwG3A+8lBEMRuHy1A945XA+/r3UOSrR+uKYUvvLwPCjMzwAFFjYBBcvjDeKe26d1PC5CXaMNvvcfx6AGC+VwmG5WQwEWeKtZC+qkUE/PNsKm5RUwvTJfviaC0sON17b3SC3sr7FBICqAyxuCTncILjnHTsCmopgWYkG0mDSgRaGvyNTDshn5UFqYATqdGkQsVC5PAKqvdcHeS53gCsbkQkeFu8cTxkIRAjXHwXIUnieWl0JlaRY0tzvhXz6ohRPdoeRZ+oYmhfrXz8+F1YvLQY/nSiWU91zuAPzrW2fgX0+0J7d+ynNbpsGmVVOx0tEltwyN2+W1QhT7n391CSyZX4bpoZHzsNcXhFhscOtX+Pxh2Hu0Dr77xmXA6npoSFKM47mashzzv8zP8/1m145v+5N7hsxtBOtn38CdJFhlyS0pYWmuAf7HUwtg5tQCMBm06HzUyULc/6VTYbB1u+H0hSZ4fW8t7L7qBHd8YOL+7MI8eGr9NMjONEOGxQSWNIN80xNi+ek56RxUC8XQfYUjMbzBIbhQ3Qr//dWzUO0cXK1E9e20NDVko0sgZ7euIgOWzS2GqvJcMBl1mEEFdHlx2emFw1FZQOnbGPUayMlOl2tsuj46rqHZDudr2uAPZ9vBEYiCwxvBTB2G6MC+/qCoRKHKt+hgZZkV1i0qhalluZBhNcmCSj+RaAxieE0EuR893julSgFuFC8BC50HC9KlWqxYTjSj2MbhkcXFsGJRORTmWaG5rQf+4v8ehHfrbr9COpoyeOUby2DT2plg0N/sPik9wpEourvo9evoRa1SysdrMC/dem8JCf+jexsMRuS/p/cEh8Kq06hBo1GCSqkEhZLHv0z8LR3jcPrgH18+DH//SYO87UZ+vH4KPLB2OhQXoJBjWqgwLZRKBfB3WFNCFBNpGQpFUeQxTfG6+str2VoF/P3WOTCtPAfzrxHzcRroMZ/caTZlSqsQpRWeg/I1Ce+Hh2vhR7+vHbpgyUhBBce9ubxI81cHX/hGEybgsHJiv99C/cg/P4pG8kdYLhfh24HHYyMM1aD5Rqy1sWBsXVYMKxeWQcWUXNBqVHLm6Q+6yV12Nxw/2wD/8u5l+KjVl9xze/RoqXP1KlhVZIZNi0tgKt74InRbdPOp0NE5SawoE3faXFiwHOjmuuD1023Q7otAlz8GgUGEhJRVp6Kj+tziAli1cAo6O4tcsM0mPRYmlSyE7V1OaGx1wNELKERXuiGSdFgLsg3wwNISzJy5ciEnsaBrc3uCmPEi4HT74dLVTth9vBlqbH645sWCOwLCNUWvhLx0Ldw7NQvWLiyBksJMyMrAMBprdCrgHV0uaGrvgVOX2uGNizaIYzhSicdvXV0Oa5ZWYkFXyMfSPXTjNdodXuhx+qEg1wJFBZny/vZOB3z/55/Am5e7k2ftG1mwnl0G962dBUas0HqhAtiNn3vxShvsPdEIf6jtAQHTppfN07Lgiw/MgcopebILvDUvCVhoO/D+fnzoCvz2cCN0+KPydotaAY/Oz4d50/Pl752LFQY5GRI9SvuepGD95ON6+fgbMat4yEYHtKkCBX5+EVRNycH7bYV0rBT7C2fpM/2BMFy51gGHTjfK+cwdESCCotVfXsvVKSEb79HnFhXAGnSecmVv/DREvBUBy4oNy8p5FMGPjjfC+9ccGMYDBEIxaO0jtB0kcRTLyzOLLP80LdP1ynBdVr/TrM645/NSKC7mRuNCOb5N2bzudDu8URFa0Cl0dHrAzAvotBIFmmqn/kSLtlNG0mmV0N7hhCsdPggNII6n6NGFGaKmJwjHrnZDJwpSJgpmptUo14r0uVRbt7Y74MODV+Cn71yGPTV2qEMX0x1Gx3XnU1znRrHasKISZk0rxAJgkV0VfTcqcGcvNcObH1fDzz6+BidbPNDoi4ITz0M/dc4QHK/rgfoGO+gxXfTozijzm4xaMJv1kIUCVpCTDvMrMqHAoACXIwB2DMeGkwVJrJ6clwtf2jgd1i+vhEp0VVSLk+v1+shltsDv91bDT9+/CkcaXdDoieI549CA6XO01g6vH7oGB07WgyoWxYrAIt/HrAyzLHj0Ss6HktCPIcn7JxuhppvC8f6hMvjkwkKoKM2+Hj73itXpi02w5/A1+N3ZLqhHse7G6+j9mZljhHsXTcH7apbv6a35iNp8bHYP/O1rZ+Boqxc6A4m/a8X0v9DihqOXO0EZDqLbUmCa6+XrJoLoUI5ebIXD+N1vJYKfSfftii0ABzHPuG1OyMWKmCpD+vu+8jJ9F6qwPkLh/M9DTXARQ+QuvA7Ko/3lNT+6V1soDlfbvWAUomDWq+VrJDfZ1zmokrl4pRXePXAVfneuC5p8MejBv/cOsv23byRScqMjEAmna/mTLUffccOOoa+0069g/cmDc1yHbOrseJxbhT4sPbk5ZdC9seHNttv9kKYQIc2okQsnhWt93QSCNlPNpeEliGIYcs0RGrCgkA2mG1aLwpUOIswqy5LPR+ci23wJa+6/330JLmCBcuFxA4w4r0NiVYEh1VNYC5JYzagqhDQUmd7vE8BMROf4w6E6eBkLHDXi3lqb9l5jozsM7h4fmJWS3Cgvizl+Dn2WHsMeKhCUXmlKEZw9AehE0RpqVnxmbg48uLoK5s0sgfxcq+ySKI0pLK5vssEfDtTCr060QQPW/n5MlN4rpvP58Fq78dz1KF6dHW5QRsNy5ZNuNsiOq/e7k6sgZzkUwSJn7XD5ZaF/D9Nu10U72LDCu5VlpRbYsKQMjFg58H3kHxIsh9sHvz14DUUqltyagO5DFxbohg4vWDEvFuakyfeO0uF2gtULheceTIvL9iDMzNLBrEp0ecnK8FYotG7pcMDfvHEeajD8G0xo78X0b0RnnYn3vTDHjNeYKC+3QtHC3hP18M/7GsDeR1oND/xSHIdJzEnpxjTHhhP76i7u3zPkRt6+fSiyY8cOUaPk7XgiO+ag4YWxIwQl5UVXBH6NNc3xc03gcHrlDNoflAHIbZAlfmR1BWypxBqdYohBQBnkSrsHauo6wYcOghov7d0euIihVjvWtkNpG6JEn4bO6uklhbBheQXMqCxAkcGCkwwLqA3B7Q3AyeoO2HnedsdMRNdwqMMPrxxogMPoXloxHLuxYZ4KcllJjhyOPb2mDJZm60E1uGSQKUenObs8S05PCj97BYbuAYUtV9HpvXK6A1pDt88udGUn0Sn8el897D9WBw3NNnStI7OoMT1wudZog4+PN8AbGE72m3b4/enah5AM12nASuSXR1vhWrNdPu8NEeeACKMoBqOUVrf/Q/pcB1bWQ8lrrfh3/3GsFbox5L5dWaF9Iy9WvUgKUZAqLre719R367Nl1zVE+hUs4p4ZJfUFGfrjeFe7E8mWeqiuI9HaeaxZfpJBj8xvB4lATlY6LJ5bCk+urYRHplrlx+eD4XC7D/ZeaJcbPqnmdXmDsOtkG7jlzDY4yNKWGZSwdWE+3ItiNXNqwln1ipXsEJw+uFjTBjWNPdCBGW4ghDCv7UfRevVAPZy73AIeFLzepKGCmRCtXFi9tEIWrSUkWondA4Ku7gl0V7On5skh6401dSSKoRK6gOp6O7QGbnYj/UHydLonDC8fbJQrnx4M4Qb76L2XhHAm3Ag9kKDK5BUMbboio1UAP6UDv+/JC61QW9+JTmV4T4dHix4MH6kSTF0BlmsGHd7fOW5Ju2njD/4la6iidVvBUkwLNQT8wXP46+19+RhDYZ0Tb4IsVvQ/vlJmp9e+oAxNbUOL55XBYyRaVVawKAeeXkHM9+5w/LoA0HmoHWGwNR6JFbmUZ5YWwnpyVlXorG4QK/pcCinIIXx4rAE+rh/cauCULiRaH51tkz/n04AsKVoqBZQVk9NC0Vo9BSrTBt4NgAShqiRDbmim8OVGSGRt3T7Yf9k2qDQhaTvdE4LfHWpAwXPKT0L7u4f9QXcxHdOQHlCQ0F9Aob9U3z1goR8uFB7uRFe573i9LJYKdLSUVoxbkRSSCJXXOjwPHW/h1i/5zs9MyR2D4raCtWvbNiEoxOm56ehXVcOACowvELpthifRysuxwBIUrcdRtDaXjX2zHHXq+/ziAti4sgpmTkNnZfpsJ0JqZK1p6Ia3LqFbuUNo1RdkKlpcIbl/lpgMC3u57rRQtJbOK4XKHCNoB1G4KLymR+S9AtuLnLbZZlhamQHqQRZWErirKFonzzdDY4tdvoeDhZwVtfldbeiED47Ww+7q2z9ZHEkoha/6YvDroy3Q1e0FtUYlP/xg3Aq5LEkriOIKXyR2f8QrWpM7BsVtBYtQgdLNSeBABze4qm+MIJdFhbPmarvcFkL9lG4nWhQezp9dAnMqswYdGg4HOlWBQQULZxXAtMoCWaxuLfgEXXs4JkAzOrih4vDSY/BOuR3s1jCLRIv6/+SjeD+5vBSW5xkGHBpS43RfDdTkbqjrx7ypuWBV9/scp186Q3H43ZFmOCG3S/o+I7S3g2711UY7hmQdcAxDs6EK/XCgq6Wnt7s/vgQfHrgMLV3exA7GLciZR4+vxUoQbu40N0DuKFiLp2Y15WYYToyndqxboT5H7+yvlbsZXG3oSnT06+dSqRHamm6EZbOL4MnpGWAcI9GigvzFZcVQVpQp98juT6zIKQTDA2sH6o8aRxh+f7wJwzSP3Mfm1rQg0bJYjLBoTglsWzkFZliGN6CePs9g0ML0ilz48qI8yFDdMVvdBIWyZ9BlvXG8We4acad2yRshafqnj+rgR/9+BH6DLmc4Qj8cwhga/vp4G/zNa+fg4ytj5/AmJBKoBK16SJnujjlrtZq7Fo9GjuFJht2tfrSg/H3VEYRfHWiEvUevQl19Z79OSy5cGNZMLc+Fh1dVwJYKy6DCoqGiwUI8Z1qe3BWAekjfCl0rdZdobO2GVpsnuXVo0Pi7Sx0+dFldycb3zwoWdc4sLcrGELkE8qzDGypCUPeG0qIsuG9VFTy7tABKTGrI1yshfYBthRQaNrnD4PIE5bC4r3vXHzXuCOxv8cpDfFKF7LJQLE93h6DRP7wKZ1KDmY/jpTSFPnvZd7b/2pzcOmDuKFg7dmyLCtF4F/46bsNCgmrlc64IvHy4GfYeq5Odltzw3EfGJ3eTmZEGi+ZOgUfXVMDn0WmNtmgpyNWk6ZP9lvo+GXVIPV9ng09qHcktQ4c6sn5ytk12bH2VfVm0MDQkt6nDaxoItxMR+jx62kn9s770+GL43ffvgX/+8mL4zqpiub/ZQB5y+EMxOFfdKvfq7rS7ITKEp7CM8Y6kkCSu9FKTY+3hjkBWcuOAGZB3L8tJa0szaE5jWIglaRBV3xhDtdxZZxh+c7gp4bQa0GlF+q7tqGNlbo4Fli4og4fWVMITlZbknpGHElmHBTbx+L3/gkuC4MNCW+NNDAMZDgFMjAZ0LLfre4MyIzf6GwYYwvmDUYhG+3+wQRUBiVZZcTbMn10Ka5dPg889OB+eQ+H6s9UlUGVWQ7ZOCZkaRZ/th/Tk9Rd7G+Cv/vMo/M+XT8BFdImMyQYWAEnSxgRxRlipX/P09ucH5bIGlFNLMxuaFFL8KBapcZ+DqHiecyac1uHTDfJ4v1sHvvZCopWXbYEFs0tg4bScIXWmHAhWNQ+fX5AvP2W7nWCNNHSq23aNxF00iPfeWXkw4w5dHEij6lud8jAREq3+SDg3pdwQTz3uy0pzYNXiKngKhes/vrsOdn1vHfzfry2BH6wtkQdP3yhcYTwHVTh76l3w3jUXtAywT9dkh+4jPWEeClTATUr6d2h/PypwwGOlV36ty3fPxXYuI7l1QAxIsHbt2BGVpHgnhoSD6xiUInqd1q8PNsrTcEQi/TsWGrNHszLQYNavzckCzSjcVy2GXgtm5ENuVjqeb2BuZiTQ4Hnl4UT9hKC0lURlzrR8KLDqExv7gdL0jbOdcOFKBzqtcL8u60Yo9CXhSsNrIOFaMHsKLJ5fButWTINtD8yHf/zKUvjRvVNglkUDGei6xuoByESCJnKgJ8pfWlYM09M1kIMOdTA/U0xqeHZFEWRaDH0+4U0N8oXoYnFxlj2iW7P5OwN3WQMuPXkmXbtRrzoF0vh9WngjVMAuOcJw9jJ1d0gMnegPGq1fVZYLm1dWwFNTrSM+NQV1Jsy00qSAfT8dHC3I7dCg2v4yquyGkoJt0N25HYtC1bM1nXC1vlOeY4lEa0DClbwOjUYFWk1i4DoJ2OqlVbAVhevFb6+Ff//GMvjBmmIoN4zNxCDDG5QzdigVCsjLSYdHNs2BX3xnHbz2X+4Z1M9/oqt9bOMcKC7MlNssxw3osvCnvMcXXm8Pw4DbsgZcehYVKhtVXPwj/LVlPDe+30hMlOCdsx1w4MQ1uNZIjfDUAP3ZS6d2nKyMNFizdCp88eG58LlpoyBad2i/Gi3ufKMSbWsDrX3fq+mGj49eg4s1rfL0PdRGOFDh6qVXSGmIT0lhFsybVQqrl1TBfaunwZeXFcF0DBVHGz0KtBnPPxHQYkVH/dzmzCjCtCoZ3M/MYrlyMBk+Has6PpAznF4QocwXig94NpgBS+75/W/HZ9/zBEREZVEoGpuCm/Bup6AEJskzquHxFeXyUy56EtbXyH5yWdSQ63QEwACCPGMBDTKmNpZboUJLDshMkwTibqU/iA4tdL3Az803wYZFU+Rj7D1e2HWkETwDfIqVjuHOtpVlkJOVJp+nP6jwn6pug0+u9iS3DI8pGELct7BE7sbRn1iS0NDMCHtOUPoFklv7pycqQme3H+rbnBD2BUCFYZwCfyi0pjZBYqDCTMdRepDLI/dFoY8Z76tRikOH3S+fa7RYU5EBG5dW9luIqcMtzSf2xpEGed6p0WJ9VSYsmlF429kaujG/nbrQBDs/qYa9p5vg4LnmAf8cu9gCQjiMeUAtn6Ov6ZkjmO8u1HbAe9X25JYxA2+w1J2u17znOv9uZ3LbbRmU5E638g28kjuEWW1CtGURlNWOd4fgtWPNcORMI7R3Om87XSy1t1CHyuWz82CI7ZzjBurkTgO2+zM/CWdE04vE5A6mA+WKLwZv1Drh3z+5Bv/8xml464PzcPlKq/yAg2YT7e24O1jXRQ8laApommfry6uKYeYgxjoOloFfWWqh7jo0t9ev9lyGf/7wKvzdB4P82VMLL7x5Dto6nCh+46ybiCSRROszMjLmfuf5gfXJGpRg/XLHV8OKsLcFz+RObpoQUFE8ag/Bbw82wJX6RE/4/qDaPjPDDHOn5cPTMzIGl0ATEJoWhqYjpkUNBstZVwR+dd4OL7x/FX722il47uUj8Np7Z+BSTQt02hPiRZPDDVS4EqKlgxlTC+Hh9bPhL5+cCwuyRidsI5EmZzkYUU0JeHk0NfahFg90D8Fx0iiCIx1+CAxh+ptRR35aCIVXOlyrz9WFBvS0cNDlsbzAaLMYNGcxIZ0kkcnN4x5ZtGxBOFvTAS1YQG8nWvRka0pxNmxeXg7bKtMHHjdPMOjuBYJhOHyhDdqG0UucGuN/c7EbfnqgCX76hxr4v2+fhX/ddRze/vA8XELnRfOH9bYf3kkgSLRoqmNK/wWziqEwY8RWiLoJWg2J3CcjlcgxsNEXiFV1ucMj77CIcpOqRadSfognQ6c1saCy8t75Lth3vE7uVNqfaFG7CrmsJfOnwGPrquCpKsuwwkOy9TRUSJQGX0OOLjQtjyh30Lx6h3YaEu2BCPcVbwx+cdYGf/1hPfz1mxfhX988A7vQdZ2/3CyHjDQFy51cF4lWoh+XDjZMz5aXOGNMVuSWu3SDNXPet7bvvGPj+6AFi8LCLF30vEGnPIhvKTycUC7rZE8IfnOwET45kugJ359oUWhI4/6WLSiDz983AzbOK0g0Kg9BuKJxEZranPLiEL0zgY4H6MbRmnUDab/60ZoS+PlTs2HrtIH382sIxOE/L9jhf++5Ci+9dRZ+vvMY7Hr3NJyvbk7MynBb0aLpbHSwcFYhFI3AWEfGOIWT6L+8JrtvdZ3DfcfuDUNqoqnQB9vmlVjfyM8wfIxvx/VwnVuhonmiJwyvHGmGI6cboIN6bvfTCE+iRRP/0ZjDZfPKblqVZTDQXOZ7z7aCw+W7rWCRs5takA4rs4dfQMmVrCm3yk/v+oIcDjmdtk7nHWeHoE+YUZ4F96+bCU+vnworBnl9LcE4/BJDxr/5uAH+evdleOujahStFnCSaN0y/U0vVO/SuMvcrDQwpHi9QcZogjdaArMnEJ3e7gukJTf2y5AE67Wf/iC0vsJ90mrQfYQn7Jko/bJu5IQjDL850ADVVzsgEOh/HUESLVrNJS/XIveHGUqHw6AgwUeNbnC6A7d1M/TYmZbsWlGVmdwydLLMWlg+t0he4EE23bdAgkWNzofOtUCn8w7tV/jntOJKepoRZk8rHNb10VxVvzrTAb/fVwtnLvbOy99f9kkM8+ntLsGYrGAG5aS0iNo6+2s//MVtZyIdck7Y8c1vBv2OTlp8bUI9MbyRI/YQnL3SKbuM/gZJE9RXp79lmAYKhYW0hiHNXU7Tp9wKfTa5oaxME+RkDGn22OvQuMB1KCq0YGfvmnm3Qp6YZrM40+KGS56BPyGk6YgXT88blgu0RUR49aINPjhyDarr2sEf7O9pnSS739sP4GZMeDAoRNOT1+0NrqkOhHOSW/tkWFVXjsXsTDOoLmLGciWKwMTjWI0d9h+vg4am20/8N1x8URE+OtEsL+xKj/z7G5BNjk49hFk7byTfqoN7FpXKzrAvsSIBoC4H1J2BpnQZDDRR35xpBYmFLDKGFiITJFq/OdsF+082grsP50n3geYHo0VZA8Oc0JAx3iEnIKX5QrGZNk/8ttOmDEuw5mSJHRajbh+esIkeOCU3Tyj2dAQSjfA3TEczGqIVxLBnZ60T3t5fB8fO1MttZ32JFodurjDLOCwHY9TSlMVWeSn2W10htaHRMuQXalrhw6P10O4Y3Poi5DRpdeZVi8ph/czs5NahQctKfXjVIa+6Iz8BuAG6B9Tmd2QgIStjciCBTpDE2zZYDkuwXtrxzWCOynfCqFOdwaLmoWyW3DWhoEb412g6mlMN8pp+JCSjIVo0fcrrdS74w6F6OHmuEbr6cFrU0ExLmD+2pBjmD2HqYlqVZ25hmrxYxK0RLLkYclaXatvgk+P18Mb5Lqi5ZZHQgUBhZhGGm4tnFsDizKG7rDytApYWpX2mjUp2V+h22zpd8MkV+6BCVsZEhXIrp1bo0kue3f5iv1OHDEuwiDlZqo5Ms/YDjEPrx8pl5WoUsBIzOoVPVCbp6dr8AjMUYAEYKgfsQdh1uFFeJooWTB0tSLR+W+OEt9BpHT+TeErZK1rkhqj/ES2ltW5ZBTy1rGhQokXLyD8wMwvWLSwFEz3RvEGxyFlR6EVLkr9/6Cq8erpDXp15qJBozajMgy9jaLgiRz/ojFSE9+qhaTSebwqkpdGCHJ9eKzXCU7eHExdaoMvF3NVdAbVjgZTjCsbWXejm85NbP8OwBYtcVrbCdUqrUp1H9fCOhctKx4K5dn5RYgFSFCvqbrB0diGUZw6vO8C+riAcvtguT1I3WqEhQTKx66oL3j10TXZaNrv7poZ4CuVoupt7llXC55YVw6wBjKmrRGe1cVom3L+8HKZV5Mlp0isBslh5A3CZnNWxevjd2U5ZrIZTu9DTu8L8DFiL1/gn90+HL8/PhdW5AxOuQhSr9VUZ8OCKCpg1lVYQ+vRJJomVPxCC5nYHvHexCy65xufipIyRRnZYFk8gMsvmCfTbjjVswSLMxozuTLPuQ5C4htHu4iC7q5J0qJySLU9OR6PPqXCWl2bD6spMKNQNr8H6fKMLDp2ql5cMo1Hsoylav0anJbdpnU20aVG/qN5+WkaDDoUnHzasrIJnVhTDAqum35s1zaxCZ5UNj66plOdUp8Z2EgD66RUrmg7mg8N18NtTHdAaiA9LrMgRhiNRuatD5ZRcuG/tTPivTy+HP9syG76+KA9W38Zx0arXm6dnwmNrKmDR3FJ52TVyV5TKNBrA7fFD9dV22H+iHjqdwVGx7NOxAii14jXe4ED7gtrrlhWaIW2UJl1chOE0RifXxbpPcJcW03lpgRF0Q7gMvYKD1QUm/AyVLAl9QZME5loNMH8YD1FGDAmMt2vHGl7pTtJw9M1Y+YINfleML8eTFeEmQ0IxR5YMNQ8byi3w6OoKeVQ/PbHqnR6EwsI0gwrMnIg/EriDMXlV3sHSFIhB2BUAs5JmetTKMwjQZ/dmKhIAW49nUNPL9Add3WVHGDToKIRoFDeI8iRrJML0vajfF83ZZNKrwMgJ0N0TAHv40yXHqb1qXWk63DsjF+5fUQ6zphVBdmZiSBaJSiwaB18gLAvAR0fq4GUUK+rEOVgRoGjtyYWFUIGVAomLw+GFTptbPocaCwK1u2VZzTClKBOmFlmgItcIWRoeVNEYdOB9oOst0inhviorbFlcDPcvw2udWpgUK16ePYP6wjW398D56lY4erYZdp1qhxpP9Pp3HSkozUjcN+I1kEOkhWX7FQw8udWoxPwkgAnfdAei8kK1IwG1/W2enQdrF02RF/iVmzf6uQ56qqtXiBDGkL7ZE4H4ABOFFrVdi2L15KopspOlPnmUl2+FKmU1inI+VibqeAy0eD5bKCVL29MpuzPU8T+4Ln3Q59C/fu7U4Hlo+4v6xh7j6jaH74veYPQB3JQ+EqJVghls/dQsyMQaIE2rhMVTc2Aqhku52TTd8Kc3mRKdZh5wuf1Q32yHY5faoa7LB/vqeqBpCA3LG/IM8OTqKbBqcYW8qALN10TnkucOqmmBbf/7Y2j2jUxjMGUhA9aE26ZnwIo5BTCtPEdux0rDDEYuhsJTGrB98WoHnGpwJMJV/JvSDAMeX4QFzyJnRmpXon5LcncAmwu6HT5wehIDvl850wltKFY0en+w0MzFrzy7DJ3ULBRsAY6drodzVzogHQW9GM+dYTFAHt4PS7pRFjQSXC91Sj1ZB2fwegW8Nxa9GlZh2E6Tyt3oWik9qetCfUs3XLraBb892Q4tfhQGrGyGcq19sRrdycxii1wBFaTpYNH0PHTkOfIssMTthIK+h9Plh9r6LjhyqQOcmLa0GMf7tQ6whwa3BuJ9pWkwDa9Dp1VBRZYR5kzF6yhJRAr9iiZCgk59BS/WtMGR6k7wReLg9IbhvasO8MZuVlCav/1hdLD52eiqaGruskyYUZEri3N/c27R/aD74PEF5fNcqu2EI1ftUN/phf2tPnntxzFBbgOXaosyDf/jnmL+HRoGmNxznf5TaQjQ4MUzfumBE3X2H2AiLMTUGbaDW1tshp98bYUcHvXWDpTofSU8baK2FSqw9JSJwqznXj0JvzlvSx4xOEi0Hl1RAmuXVMoCokCBjKJruHSlDZ7+2X5oGSHB6oW+nQ7V4Ul0IqvmFkBBbrrcUZNcHglXZoZJDlNImAn6XYmZkiZ4o9kQYnERHE4/OLCAXayzwW9RpBwRQR6zNxwBIMH61VcXw70rpsqrbP/uD+fhub0NiX0oUOuLTLBhfiGUFFhkt0XXXJhnlaee7m1Mp2ugxStoPGVrh1MeCE5jwd1YSGrq7fAKuT8UqiheJ61ROJL8+dpS+NojC+SxoYlsQ/mnf6G6ETqG3A/NakHdL6itsQWd4I9/fRzebxhcn+mfPjIdHl4/S57IkZDzMRXBO1wGpTG11dJ9J9dMzra2vhO+/YujUOO8uUwXYpTx4teXwuJ5ZbJAEQM9DxkAWnWbvit1ffnocC18e9fFsRMslE4ysllm3a5pGYrnD/zsa3XJHde58x0bJEu+/nzhBZfyv0ViwmMgcdl4hs960EGwKFsPf/4I3mQMdW58ktQXdGMs6QY5g1GtQQ23L757CV6vGfoMnquzdfDY0mKYXpEjz9xJGZYGMv+3Ny/Js5mOBr3CJWdUymf4ve4tNMG2e6vkKW9vpAdd1O/3VsNvznZCAGMF+t400kXAf8L4M4So+DNQrfPjjWUwFx1BV7cX3jvVAm/Wf7rY643Xi5cKq/KMsBlDyMpSWuVaI2cyuh4S0jM1nfArDPeuOwO6VhKzURCqXr46NxueWFslz/4w2AxPeY5mtaXKki6PmgSuNdrg/+y+CJ+0DG5J+r9cWwIrF5SAEfPRYCAhoXxNbW50DbGYIHdN2f7aBah13/xQIlurgL9+ZAaG71lyORgM1BWGni7TOaj7yyfHrsFfvlc3hoKFJHoaHMs1Cj/q/N33DiU2fspg798dodCww522utHuecbtx9CQkyxU5JK7hwQtk0V9dQbyIdSA2HskFZIA3lz/QIP+fjBjYVSreHkxVIIKmCssjOmNJFEw4zXo++gFH4wKsgDcHByMLLSakEmTOHcUz+W9gxKmKTHNMDy5sWFbdll4L3zoBEfzWm+FrtqC106COhRItG78yzjmKx+meWiQtYF8HSgovfloMPR1DV50z1Qp3Uo65hM1pv/NfzEwetOIPpWGk5FDH1NIsDipJksvft/+yvc+TG69zuC/0QD42k/eMrUFpAc+Pt/2PUzPRbhpbJZCYTAYE5s7CNawwrX++PcfPeqL+7oOadWK83gFPvwZnsVhMBgMZFQEi6gw864ZBRmfcBx3FY3cGPtKBoMxGRk1waIe8JzQdUSp4C+izfMzl8VgMIbLqAkWUaW2uAqtBnRZcBVFa3QeqTEYjLuGURWs3zz3pUAmeA5yPJwCjnPKDWoMBoMxREZVsIhiU9yRZdK+q1Jw+1gDPIPBGA6jLlg0//u89OChkuy0tzmeqwHg2ORGDAZjSIy6YBF7Xviu1yR275Mk6Sy+HZMpaBgMxuRjTASLKDNKbqNO+wcFx30MEjdh54BnMBipY8wEi0LDBRnRfflW3csqBf8BTLCl7hkMRuoZlaE5t2Prt/7JeJlLu7e+0/dMNCZsBE5Kw8sY8+v4DIknmHFMESaiDEbKQBMjwZUsXfyH9p3/5aPkxuukRCi2/ujFtOZY+gNXOtx/7AtGF+JF6lMrWnIiBTA1qFd+D75n3S8YjNTRkqMVf9G183snk++vkxqRkCTu2ed+mxFTZX/7raMN97uDkVm4VZcy0ZIkmuGvEVPjzalp0X/P13OBxA4GgzHmxMNxq1nrpWak5JbrpDQU+9Of/Db/QKv06JV255figjQXLydFk0rLbWk0G9vuGdboX61Um7peeumbg5+mlMFgjCqDm+FrhDn50eu+qSs2tbW4pFJUjEoUjlGZC/7O4Dkljhbyy3dElNlOjS6wYcu89ur9+9mgbQZjHDFmTwn7Y3qQ67HolB/yQD3hyeWk6MkhzYwqQZYowqOtrsADHm+hMbmHwWCME1LqsIjTp98RKxeu73aL6kBclIwoGrkoHqlpz0pM0ahS8JxYWVrYtXHtY20n9+9iPfMZjHFCygWLsJ1/Pzxz8YauGK/1ReOiAS1WAarH8FZFHTKSQhQlk80TUqgNRtfGDeu7Tu9/h7VnMRjjgHEhWASJ1pL167vCkjEQigkmSYR89DspaISXnZ0mEhNze3xhjaRJ96xbucV24eibTLQYjBQzbgSLaD7+fnjZ5gc7eZXR5w/FjIIg5qB+6JO7xw6OlrIAQ1QUChz+iD7AqbwL7nm8ixaMTRzAYDBSwbgSLKLh8DuRe9dv7gzwBl8gHNULCac19uEhtWdJnD4uSvnecFTnj4J76rKHujpPs/CQwUgV406wiGoUrRUbN9rUekvAG4waUTSycLMhsXcMkUUL9KIIuRFB0ESBd6/YtNbecPRDJloMRgoYl4JF1B16N7x580NdvM7s8wRjulhcyEMFSUF4iP+hWKJo5Ufikt4TN/hWblyD4SETLQZjrBm3gkWc3/92eMOmB7vUJovX5YsYooKQm0rRkkBC0RJ1npDBu3jNfbbmk39gXR4YjDFkXAsWQaJ175Oft0u8OoiiZYrHU9UQnxQtScLwUNR4okrPjJUPd7I2LQZj7Bj3gkWcf//V8LqHH7MZTek+pz+ii8YwPEyFaCW6PKBoQX5MFPUxTuW+Z9lDXVeZaDEYY8KEECzi4sdvhB9/9Am7QmsK2L1hcywuJnvEjzUkWpJBErkcaojvFMC1Zt46e8MF1qbFYIw25BgmFM/+3c60xoD63hN1Xdu8gdgm/AbW5K4xhubQ4rp4Ht4zaBQ752eKh/f//Nv+5E4GgzEItm/fzr/cVTGty+Gb+YNHF6qmpAn7v/Lwivbk7utMGIfVy+mPdkW2Pv14p0KT7rF7goZoTExNPy1yWpxklADyBQF07qjas2DpI/bWs7tZQzyDMUBIqC7nf67i/XbtxkAouiUWl55sdwVm+v2+C5f3vd6SPOw6E06wiMPv7Iqsv/9xm85gDNo8IVNcEFPTT+vTNq2cmChoogqVZ/mm1azLA4MxAEisft1VUu70xh7AMvyMIEgrRZCmOHwRV7fLvTdw+YOm5KHXmZCCRZDT2vjgk51qncnvDIR1UWrTSpVoJZ1WJC4Y/ILJvXzDk2wYD4NxG0is3nBXVHb0hB8Kx8QnsdKfj5FSJpYnz5Qc04FSi35/y/G3bMnDr5Py+bCGw0t/sc1TkmY+MKfIskunVh4ASZ41NAXITgtdlrje5Y9srXXEl2754S9MiX0MBuNGtu7cqTgmzKi09UQ2B8Oxx0RRmoNiZQKJo7nwHDnpuoPrZ+e2JY6+mQnrsHq58PGvQ/dv2dYZU2p9Dn/YhLYyFx2PNikiY4h8PpMgSrno9nSeiMo3a9HDrE2LwUiydetOhW/R+rJL5zzLnCF4GCv3LVhe5qJY9U6WiYIldanCrpff+psv1Sa33cSEFyyCwsNVa7Z1ijql3xeIauOClGyIT41oYTyeG47H9WDQedasf8hee4SJFuPu5tlnX1TVWPnydndsSyAqfM0fjK0VRai45YEZOaxui1p413Xpg880uBMTOiS8kV0/wfBQz+8ryTPvVCsV+/Crp2ihVhQtDvJicXFjtyf4ZFtIv3jr9p1sumXGXQuJ1fl0c0WbK/xAMBJ7FEvlIiwmRVhO1MlDbiQogKLftRQmhcPqpe7QG+GVD2zpEiSdzxeO6dBu5uHm1DgttLkoWnmBWFyr1+qD9z+ytZucYPIABmPSQ0LlnfNA6Wm/uNAfkR7p9oYeFiVpHu7qo0ySueDcBq36aL6J+8R25g/dyR03MakEi6jd/3Z4wZrP2eMKLhCMxE2CAHkpa9NC0YrGxJxANJ7e6ZcUWbPvjy7YsDbEuj0w7gaMq9abrzpVj3nD8a8FwvE1kihNxTKh6bMsyg3uUnNuuv6VGdnaU1cOvfWZNQmJSRMS3sgHP33KmZ+p2peVpv2tQsHtTXF4WOj0he9v6PL8sMkX/0GdK2vlMz/4VQq6XzAYY4tO5FVapXImx3EV+JaaRYJYFvtZVV0unxGIuK689XdfwvLaN5POYfXSguHhlLmPdUUUvJ86dUoiZ0HxwO8rqcbcbdHc9Bxki4JUFIkLejAZ3Pc/dr/97EesMZ4xebn3/sdA0qfrbO5QkyCKlxQ855UkzoplQYfCFcGyyGNR7DVNEv7ekq6S9nguLW9NbvsMk1awCNv5t8NTlmyxiQpFdzwuupQKBQiClJ66EJEzxEUxJxSOa3i1xf/ohi32E/vfZO1ajEkJrTbVcnjn5f++7d1DkjJ0rCdiUMZEmIm7qAxewfJAjesYbUhUFn0qheJ4ljq213HxAzv9fV9MasEius/+PhS8sLth42OXLmr1RofLH1GjaKWo24OMIRIT87yhqMXNaRTZs1aHF2x5JnaNCRdjUrIDsrP/lD/sixb4ovy9uGE5/tSjnXqFk6ALhasSvRUZiCtpBs0rRWn82bZT7wbkP+2DSS9YCXbAtUO7g0vWPNAqqoxebyiiEyUpAxMpBSEiOS3JiKJVbPcEZ3ij6jI1pwutf+KJbppCJ3kQgzEpoM6iH0hdxZ6Y4oscSF/DTU2SBP/bpOB2R0TOjgVvI25TG3TqgxVpkd+dePFPW6i89sddIlgJqANn1T0PdAqS1hGOxDwqpYKLC1Ia7tKg4xpb0QJJjU44Oy5JReF43IzXJOXP2Ri49+GNwsX9e5jbYkx4SKyuWh25rT54EET4Nm7qliTuuSVp0seNu77j2fLIPtfVHtW67HR9cFqh5Y2pBsWZC4fmBRN/3Td3lWARrSha398yt9GSYz1jMFl6HL6IKp6YK1435qKVOJ8hEheLbJ7QNEcIZrhiZk3m7Hv861c+FKtmc8YzJigkVo2Z/vyuEH9/IBR7HDdlSJz0N3Otwvtnfv09D7motbO2ShdCovjI8rKmaenSnn/9b9s6YUf/7ooYwwI6/nh6+6/NdX716otNPV8Ix4R70fGkpaZBHqHHvRz48bWeV3Bncoyat2foxQMfvfRNvLkMxsSBxKq1MJjb5hLv73AFt0mitBA3X5mVGfvixf/4fiOWr+tdjOhYywYXn9fRIezYsaOfLg+fclcLFkGzKtT6VCsabP71Sg4Wo3DNxmShLhAp6KOG0X1CuFwKnttn0at3W1XBg3MMqp5dbDZTxgSABKiryJ/f4OA229yBrYIkLsLNjTxIf3tvZfS9D5/7Yb8N6gPhrhcsghI5NCNmCUR1a07W2x5DC7sJkyYzNaJFkHBxfqyI6nieP59t1O5eVSDs3fUT5rYY4xcqR4HiaOFlV+z+9h7/k4Ik0ZhBO8dL/3N1mvDO/l9SKPipuxoKd10bVl9UV++Sru5/I7jqkQdb1Np0n90VMNI0MShYlD74M9YhovwkUY1uKwelqzQqiAa1Ic370GNPdbHxiIzxBgmVde2CdKdWKm2LKB9q7fE9KkiwGMuPX8nz786xBn917D9/0DNcsSKYYN3AhQ/fjC1bv6bTEzO4A6F4QKHgRFEEM+4a46eIBIkWx+M91tIgbl8oZtKb0/npize4N27aJJzc927sTg2UDMZos3b7dmVzkMuvcam3NHuEr7n9kU1YZmZxHBfWqlQfluWlv7k8j79yev+iERk/y0LCPqBR5nZr1GwTs+85X+98LBSNbcCUyhp7p9ULjbPifDwHtWql4sK80oz9yojnkMR1+3VqdfDD5/5rcCRqLwZjMJCzqs7szu9wKu53h6LbMCJYikVEi/k1quS4k/OmZP+8Ki265+Udz/hGKn8yh9UHp0+/I1459F5o04rNraLB7Hb4o7LLwV0qvBmpCRFBUqNsZccFqaLDFZza7Imta/foFobiZmPVsgOuhQsfi7EFXRljxXZ0VueVqoImt/IBVzC6FcVqGVbqBnwlHMDzH5frg79dYGhz7d9/z4hVpsxh3QGaWWG/O76iyxG4XwRukShK03AzhomSeuyFi5CfJMbx1PQIOIL1Vh0GjuezzLo9FencvkMvfG1E2goYjL4gV+XL7TTY4voCb0x9f2O39yHMkUswX+oxX9IT7m6Vgn8/y6R7dXmGe99rP/1Bn9PEDBUmWAOAQsRagLQetWFNfad3nSAK89HpTAOJM6M2jP3sD9dJihdAUMHzB3Mt+rfzlb49S3XQ/cIL32WN84wRhcTqmsle2BRQ3ucORtdyHD8bNaocd9HsC1SBOlRK/oMss/aV2ebAwT0v/NmIhYK9sJBwAFCI2Hz6neDalSubMo36E2XFeW09npBPAElAx2XEm0LTx6RAtFAoOU6BZ9ZIklTgj8RLO4PcVJvKpNqweUt39aHdtx3mwGAMFAoBa3Tawkaf8n5nILIN8946FCl6kq5JiBVnVykUHxdlGXdVZsUOfvCP3xpxsSKYwxoC33/uVV1Nj9/I6zJXH63uesQdiFCjfJ4sICmjN1QEv1LBH1pWkb07lw99AL4GJ2RBdNeOHWyYD2PQkFCd7gS1z1hVbA9Km+o63Y8IkrRUDgEpv0uSgC89CgX3YYZBs3NahvLg/ue/Muz+Vv3BBGsYfGv7TuPFCLfiXH3PVn849gBuysIUVaZeuDi/WsnXov1rwczVXpWbfnB2iWbfa//9qT7nyWYwboXCv5DlsqaNKy7tCsDabm9wiYLn58QEoQrzuOFTsYJutVLxcb5F92qx0YNiNfzOobeDhYTD4OT+XdEli5d1+HizKxCJx0SMy3AzPSlR4Y3kUyNceE5OUgsiZKFyleGGmZ5gLLvAks6tfPgpd8m8BfFNCx/mTpzY0+/KJIy7G3JVH4b4kgte46NtnujnQ9H4g5i3l2Pc9+k8ckmxojar3DTdzsqs+MG9z/2pdzTFimAOawT48vb/0F5p86S1xoxLMb7fGI0JC1G6qCaypka0boRElAuqldwVUeRa4qLYPqfIemZKOn9AGezosAaM8ZdeejY+2hmNMf4hV6WfcVlV759R1u4Kb252eB6RJG4eVsBazB6fPlwisQJwqFXKD4pzTK+UK52j0sDeF0ywRpCHtr+ot7eHrS4+fUmnO/RgIBTdiPc4D+9wCvpu3YgsWlF8idGrSsHV4+U0or3vKM00Xiy16vZXer0tL72IwsUx4brb6BWqK4GpVa3dwRV2T3gJhgfzYoJYifnh5jU1ZbHi7FgB7i3MNL46Sy8dePv5r7qTe0cdJlijAPXdOuQTF3Y6AltiMWGFBPKqIZbUCxcht3GhcElRvPsxnueaFRx/piBDf6Q4y3Q4K9zczJm9wq4dPyZxY+I1iaHQrwlAedo1tarD7l/rDUVpGph5giiVYN6gFZk18oFEoo+ViNnHrlYpPsy3Gl+bYxAPjaVYEUywRonN33leEwgLVpsyc6nNGbrXF4ouliRqU6JZIGjS/VQLVxLZdUGQV3CNSo6vj8aFtsw0XW1VfvqBfN2lOqieKezatY21d00iyFHBjMuKJnfljDqbf40vHJuP+XEhreqEu/WoCjevyJzoY+VG812vVPBnrSbdW7Py4kc+SsHsIUywRplnMUy82B3L8nFpC9Bq39PjCy+WRLkxPANTP0UN830gAXV7iJDz4nm+Tclz1dG42JZuVNeXZ6UdftBSc2XHjh9TOMBc1wRl686dityDncqTipyZV7rcy4OR+HxRkhYLAhRiXqS1Mj91VL0k2qtsFpNmf0VO2h5vT/exwny1LRViRTDBGiNIuOpQuBySeU6XP3pftye0EDPD+HNcBIkXB2FyXxzHdSqV3EmTRnV8Xnn6kVWK6ho8QhzI7JCM1INhH19dPZOzWFy8vTB7zsEa+1JfOL5YFMVFggj5eIgR7/XNjqoXOQyUOk16zcdzi9N3VuXA0X/7wVP9LnI6FjDBGmOe+YdfGVo7Inn1HuWsYDi20eWLLMKcUTouhYtIhIxejuM7tGrFxVAk3mAxKZuWlGSeLHY4a1wuizhjxmWJCdj4g9qo3vVPn3al2bU0EI2XGdTKYnTNs2OCUIj5zNSvUBFJsTJoVR+VZJhfX5atPPxvO1IrVgQTrBRBXSHaPGL+aVtsZjwubgyEhaV4N0owo2SNS+ECiKN4BfAayXXZ9CrFBSwE7Xi9Ea1G1Vqeoz9dyLsvLrU6KYRAB/ZjejLJwscxpNdNYQXCVQPwmdmr5r51rOVBuy/0oCiIxXgIhnzyYiv9CxWRFCusoD7KthheXZmhOvbbv3valdybUphgpZit27erW7py82t9ilnxaHxDIBKnaTpQuLjshHAR4851kSj58boEvEYRBaxHpeAvRONCCwmYQsG3T8kxnp6X23iOPW0cbSRu+/Yfc06nVVVjKpx/uNa2MBwT8vE+qNINqvxgJL4oGpeKMU/RU787IHd8po9sVyjgE5Ne/cqcLPXR/WP8JPB2MMEaJ5DjOtEVLup0wwxRgnt9oTiFijSvvPlT8Rp3rqsXdF8oYOi+8HeRkySnSqk8FxfjdRq1qm3bkopzAb/r/Ay4TDNLyDAHNkwkifvyj/9T0xlPX7C/uh3DPDHXpFWXo+udJ4giTTapwHtCI1n6b6O6Tq9QgROPbcfK56RepXw736Q4XP1v30h5GHgjTLDGGdQdwiboi7p6fDm83pyvVipWNnf7l0qSVJoQrlQtjDEIrjswiKDEui1GzTl/KFYXEaTEAGz8MryC78kx6C8tNMROv/PSN9msEoOABt8HVVkLXj5UO1fB8cv94dgiUZKonx+tA4ACxamShw4AuV+eC/NVq1bJn1OrVPtMishpS5qi7eK/fGtchIE3wgRrHPOd55/XdHpySw9f9U0XONjQ7Q7SFLRFmClpkPX4Fy4i0R5CA2JRrK6HHPTqVSv584IkXhZFsa0iL6O2xCie+/C5Lw1rGajJBC1Bd9HFz2u2+atEgHRMN7m8KpWgyrUYp3Y5/QsFCXIwWa2YLwY5Ljh5LwBazDr1cZWSe18hRi7lZRoaz73wR+N2kDwTrAnA9u3b1Yci00rPtfmnqjh+vd0dXI65rQgzHTquwWbU8QLV7ODF6w/jG69OrbwgCNLlSEzwAS95CjMMV2cZ/Wf3vPBdb+L4u4cfvbgzrc6un/vu6aY5CgW/KhQV5mF60VO9TyspicMwT0obslBR+AfQodcoD6eb1e/MzuFO7Pnb8StUvTDBmkDQY+qjkfLSy+2BKuDV6zvdgZWSiMLFYaiIFW/iqIkIFSLOh7+Eko4shO7rEhbKC5G42Hr/guJrSwo153Z8Y/O4ak8ZDn/0v97OOd4RmHOp1VGOX586bV5Hr1bq04zqWXZXcJ4ocZm4KX1kHLVcScjtVOkG7VmNQviE56SLxZmq5mM/HV9tVf3BBGsCQsJ1TJhRfuyaZ4aSg3WuYHi5JHKFmCEnsOO6ESpYHLWBUUO+P8OouaxRKc63u4Jdif03IEnh2VOyWh9fVlSz4wurOpJbU84j298sPVBrm+YKRvIBa5fk5uuYdcoMFc8vcPqjM/HtTYIlP2CROHqqN3JCRQtDANdlMWgu8JzwiUGhqp5eaLq2528n1hxpTLAmMCRcH/umlZ1ucU3DG7kuHBWWY9YsmTzCRciuIJB0YNSYfzOcFDXr1dcsRs3pJru/Jbk15Vj0qry4KC3xh2MVKD7a5OYbkEiIDFgCzfglRq8cJhxrU7ZZf0QUYx+n6RVX5hWkXX1tHHQCHQpMsCYBNJj1hDlU1ekMzBJEYY0ownLMpAV4eymcmMCh4kCR6CkjPdG63m0i5UhyhZGGJcyU2DCGkEgBuCm0xuvwaNXKQ9MLLW/MTg8d/+WO8dOnaigwwZpEoOPin7uYXxUSojOVSn5VLCqukDgpJ1l46G6rMDNb8PUO/XIYE5KEm3KiX7NZTdqz/mDsbDgm2LOt2mvLsvnLu//h6+RSJzRMsCYhJFy/aC4p7/YEpkfjUhZGHCqe4/kMk7rc448ujYlCYuxiX6PzGRMP6vfGcU4OJLvVqDvti0YPzCuxXKowCjUv7/jipHrKygTrLuLxv32n7OCVrvmRcGwVjV0URakUc4AVdzHhmojIQgUuLMTdJr36TCAcP7ygNOPSojTH2Z/v+DY9tJh0MMG6C1n0vdfKGrqcc0Px+IpoTFiGwkUzTNKc3Rg6SiZ87aORmDFOoGFQ6JqkMMeDS69SncKw7+jcKZmXpiui534zyTveMsG6i5n6zf8o7XBFZvtCURpsrTUb1XnRaHxBJC6WYYFQJwWMHrknVkphpBKaLcPJcZw9Ta8+5QlFavCedVflp9fM0tnPj/SS8OMVlgkZ13nk/3+z6FS9a3G7wz8F9cmQplNnxwRxRigaq8KsosYCw2OOof5BTMBGG5qHjJNnxIjjGwGFykmDkvH346uq8s/NyGs988J3vxtJHn3XwDId42YkSV50n6YsuZa2LKemyb3wTGP3VNxmNGpU1JFxTiAUm4uv42AJs0lIYrZXD89zXTq18nQgFG3BOxJT8Zy9NCvtfLnWdW7PC38WxbTvHQt4V8EyHOP23CBgbZYFWWcaAhvPNToewR0rMPsk2roSU9/Q2LbE8uWMgZGYR5/6kCVna5XiHM/1KHn+hErJnVpamXsyQ3X+3Ixk/zI2JQ9+++QrgzEg8j7/YqbdH1skgLgAlSydtikVYMCQpSIWl7BsAYpWEnmIidyYTyuxTIzZJUYTCaidicI4EdMDXRPfpVZx5wNhwSbvBymqVvHtBZmmkwvzGi6QULGpp2+GCRZjCEjc1q27eJqKl94d9Raa6wPKJY1dvtkS9e/Cf2g7hjVqrVpRHorEZks0T9PN7ovmbKKhKZNXyG4SKBQjpaKF5+FSOCI68HuHs9N0TSum5ZzIau6ozcvrkJ1TdfVMic2R3z9MsBgjxM0iRlRDltYWylt+5GrHIkGA3F5x4kFSaLWq4lA4NgtLqRkL9uQTLY5W2Oab8beamCDSkljBAquhbm5J1rFFcOoKHcLEafAwwWKMKtTrvrMzX6HRhK+LkkttUXrTrQs/utC6BN1XQSJsnGxwvuIsY+3UbP2hqYGuVtoSiWhF1waLuGsbW5h2qDDBYqSEvoRsssEEisFgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYjPEJwP8D9LXK89GP1UsAAAAASUVORK5CYII=";
const replaceParamName = (name: any) => {
  //&&name.endsWith('：')
  if (typeof name === 'string') {
    return '【' + name.replace('：', '') + '】：';
  } else {
    return name;
  }
}

const replaceParamValue = (value: any) => {
  if (typeof value === 'string') {
    if (value && value.startsWith('备注')) {
      return value.replace('备注', '【备注】');
    }
  } else if (value instanceof Array) {
  }
  return value;
}
// console.log(121212121212)
defineExpose({ cardRef })
</script>

<style lang="scss" scoped>
</style>