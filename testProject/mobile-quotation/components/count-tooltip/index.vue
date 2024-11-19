<template>
    <div>
        <van-popup v-model:show="show" :style="{ padding: '20px 10px' }" round closeable :lock-scroll="false">
            <div class="count-tooltip">
                <template v-if="props.field == 'profileTolerance'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip1')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'innerCopperThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip2')}}</p>
                        <img :src="importImage('tooltip/innerCopperThickness.png')" alt=""/>
                    </div>
                </template>
                <template v-if="props.field == 'copperType'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip3')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'thermalConductivity'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip4')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'emiShieldingFilm'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip5')}}</p>
                        <img :src="importImage('tooltip/emiShieldingFilm.png')" alt=""/>
                    </div>
                </template>
                <template v-if="props.field == 'reinforcementScreen'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip6')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'copperBased'">
                    <div class="width-four">
                        <img :src="importImage('tooltip/copperBased.png')" alt=""/>
                        <p>{{$t('tooltipPage.tip7')}}</p>
                        <p>{{$t('tooltipPage.tip8')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'cuttingMethod'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip9')}}</p>
                        <img :src="importImage('tooltip/cuttingMethod.png')" alt=""/>
                    </div>
                </template>
                <template v-if="props.field == 'coverFilmThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip10')}}</p>
                        <p>{{$t('tooltipPage.tip11')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'reinforcementMethod'">
                    <div class="width-four"><img :src="importImage('tooltip/reinforcementMethod.png')" alt=""/></div>
                </template>
                <template v-if="props.field == 'packageAsk'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip12')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'fourLineKelvinTest'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip13')}}</p>
                        <p>{{$t('tooltipPage.tip14')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'separationPaper'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip15')}}</p>
                        <img :src="importImage('tooltip/separationPaper.png')" alt=""/>
                    </div>
                </template>
                <template v-if="props.field == 'boardAppearance'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip16')}}</p>
                        <p>{{$t('tooltipPage.tip17')}}</p>
                        <p>{{$t('tooltipPage.tip18')}}</p>
                        <p>{{$t('tooltipPage.tip19')}}</p>
                        <p>{{$t('tooltipPage.tip20')}}</p>
                        <p>{{$t('tooltipPage.tip21')}}</p>
                        <p>{{$t('tooltipPage.tip22')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'screenPrint'">
                    <div class="width-seven">
                        <table class="show-table" border>
                            <tr>
                                <td>{{$t('tooltipPage.tip23')}}</td>
                                <td>{{$t('tooltipPage.tip24')}}</td>
                                <td>{{$t('tooltipPage.tip25')}}</td>
                                <td>{{$t('tooltipPage.tip26')}}</td>
                                <td>{{$t('tooltipPage.tip27')}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('tooltipPage.tip28')}}</td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/screenPrint1.png')"></van-image></td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/screenPrint2.png')"></van-image></td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/screenPrint3.png')"></van-image></td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/screenPrint4.png')"></van-image></td>
                            </tr>
                            <tr>
                                <td>{{$t('tooltipPage.tip29')}}</td>
                                <td>{{$t('tooltipPage.tip30')}}</td>
                                <td>{{$t('tooltipPage.tip31')}}</td>
                                <td>{{$t('tooltipPage.tip32')}}</td>
                                <td>{{$t('tooltipPage.tip33')}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('tooltipPage.tip34')}}</td>
                                <td>{{$t('tooltipPage.tip35')}}</td>
                                <td>{{$t('tooltipPage.tip35')}}</td>
                                <td>{{$t('tooltipPage.tip35')}}</td>
                                <td>{{$t('tooltipPage.tip36')}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('tooltipPage.tip37')}}</td>
                                <td>{{$t('tooltipPage.tip38')}}</td>
                                <td>{{$t('tooltipPage.tip38')}}</td>
                                <td>{{$t('tooltipPage.tip39')}}</td>
                                <td>{{$t('tooltipPage.tip40')}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('tooltipPage.tip41')}}</td>
                                <td>{{$t('tooltipPage.tip42')}}</td>
                                <td>{{$t('tooltipPage.tip43')}}</td>
                                <td>{{$t('tooltipPage.tip43')}}</td>
                                <td>{{$t('tooltipPage.tip43')}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('tooltipPage.tip44')}}</td>
                                <td>{{$t('tooltipPage.tip45')}}</td>
                                <td>{{$t('tooltipPage.tip46')}}</td>
                                <td>{{$t('tooltipPage.tip47')}}</td>
                                <td>{{$t('tooltipPage.tip48')}}</td>
                            </tr>
                        </table>
                    </div>
                </template>
                <template v-if="props.field == 'boardCategory'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip49')}}</p>
                        <p>{{$t('tooltipPage.tip50')}}</p>
                        <p>{{$t('tooltipPage.tip51')}}</p>
                        <p>{{$t('tooltipPage.tip52')}}</p>
                        <p>{{$t('tooltipPage.tip53')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'boardSize'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip54')}}</p>
                        <van-image :src="importImage('tooltip/boardSize.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'boardLayers'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip55')}}</p>
                        <van-image :src="importImage('tooltip/boardLayers.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'boardQuantity'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip56')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'productType'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip57')}}</p>
                        <p>{{$t('tooltipPage.tip58')}}</p>
                        <p>{{$t('tooltipPage.tip59')}}</p>
                        <p>{{$t('tooltipPage.tip60')}}</p>
                    </div>
                </template>

                <template v-if="props.field == 'panelizationCount'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip61')}}</p>
                        <van-image :src="importImage('tooltip/panelizationCount.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'shipmentMethod'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip62')}}</p>
                        <p>{{$t('tooltipPage.tip63')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'boardThickness'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip64')}}</p>
                        <van-image :src="importImage('tooltip/boardThickness.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'solderMaskColor'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip65')}}</p>
                        <van-image :src="importImage('tooltip/solderMaskColor.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'silkScreenColor'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip66')}}</p>
                        <van-image :src="importImage('tooltip/silkScreenColor.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'materialType'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip67')}}</p>
                        <p>{{$t('tooltipPage.tip68')}}</p>
                        <p>{{$t('tooltipPage.tip69')}}</p>
                        <p>{{$t('tooltipPage.tip70')}}</p>
                        <p>{{$t('tooltipPage.tip71')}}</p>
                        <p>{{$t('tooltipPage.tip72')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'surfaceFinish'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip73')}}</p>
                        <p>{{$t('tooltipPage.tip74')}}</p>
                        <van-image :src="importImage('tooltip/surfaceFinish.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'goldThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip75')}}</p>
                    </div>
                </template>

                <template v-if="props.field == 'outerCopperThickness'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip76')}}</p>
                        <p>{{$t('tooltipPage.tip77')}}</p>
                        <van-image :src="importImage('tooltip/outerCopperThickness.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'impedanceRequired'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip78')}}</p>
                        <p>{{$t('tooltipPage.tip79')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'viaCoverage'">
                    <div class="width-seven">
                        <table class="show-table" border>
                            <tr>
                                <td>{{$t('tooltipPage.tip80')}}</td>
                                <td>{{$t('tooltipPage.tip81')}}</td>
                                <td>{{$t('tooltipPage.tip82')}}</td>
                                <td>{{$t('tooltipPage.tip83')}}</td>
                            </tr>
                            <tr>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/viaCoverage1.png')"></van-image></td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/viaCoverage2.png')"></van-image></td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/viaCoverage3.png')"></van-image></td>
                                <td class="text-left"><van-image style="height: 100px;" :src="importImage('tooltip/viaCoverage4.png')"></van-image></td>
                            </tr>
                            <tr>
                                <td class="text-left">{{$t('tooltipPage.tip84')}}</td>
                                <td class="text-left">{{$t('tooltipPage.tip85')}}</td>
                                <td class="text-left">
                                    <p>{{$t('tooltipPage.tip86')}}</p>
                                    <p>{{$t('tooltipPage.tip87')}}</p>
                                    <p>{{$t('tooltipPage.tip88')}}</p>
                                    <p>{{$t('tooltipPage.tip89')}}</p>
                                    <p>{{$t('tooltipPage.tip90')}}</p>
                                </td>
                                <td class="text-left">
                                    <p>{{$t('tooltipPage.tip91')}}</p>
                                    <p>{{$t('tooltipPage.tip92')}}</p>
                                    <p>{{$t('tooltipPage.tip93')}}</p>
                                    <p>{{$t('tooltipPage.tip94')}}</p>
                                    <p>{{$t('tooltipPage.tip95')}}</p>
                                </td>
                            </tr>
                        </table>
                        <p>{{$t('tooltipPage.tip96')}}</p>
                        <p>{{$t('tooltipPage.tip97')}}</p>
                        <p>{{$t('tooltipPage.tip98')}}</p>
                        <p>{{$t('tooltipPage.tip99')}}</p>
                        <p>{{$t('tooltipPage.tip100')}}</p>
                        <p>{{$t('tooltipPage.tip101')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'minHoleOuterDiameter'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip102')}}</p>
                        <p>{{$t('tooltipPage.tip103')}}</p>
                        <p>{{$t('tooltipPage.tip104')}}</p>
                        <p>{{$t('tooltipPage.tip105')}}</p>
                        <p>{{$t('tooltipPage.tip106')}}</p>
                        <van-image :src="importImage('tooltip/minHoleOuterDiameter.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'boardOutlineTolerance'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip107')}}</p>
                        <van-image :src="importImage('tooltip/boardOutlineTolerance.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'confirmProductionFiles'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip108')}}</p>
                        <p>{{$t('tooltipPage.tip109')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'noCodeOnBoard'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip110')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'flyingProbeTest'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip111')}}</p>
                        <van-image :src="importImage('tooltip/flyingProbeTest.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'goldFingers'">
                    <div class="width-three">
                        <p>{{$t('tooltipPage.tip112')}}</p>
                        <van-image :src="importImage('tooltip/goldFingers.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'teethHoles'">
                    <div class="width-two">
                        <p>{{$t('tooltipPage.tip113')}}</p>
                        <p>{{$t('tooltipPage.tip114')}}</p>
                        <van-image :src="importImage('tooltip/teethHoles.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'edgePlating'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip115')}}</p>
                        <van-image :src="importImage('tooltip/edgePlating.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'pcbAType'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip116')}}</p>
                        <p>{{$t('tooltipPage.tip117')}}</p>
                        <p>{{$t('tooltipPage.tip118')}}</p>
                        <p>{{$t('tooltipPage.tip119')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'assemblySide'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip120')}}</p>
                        <p>{{$t('tooltipPage.tip121')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'pcbAQty'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip122')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'toolingholes'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip123')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'confirmPartsPlacement'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip124')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'photoConfirmation'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip125')}}</p>
                        <p>{{$t('tooltipPage.tip126')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'boardCleaning'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip127')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'conformalCoating'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip128')}}</p>
                        <p>{{$t('tooltipPage.tip129')}}</p>
                        <p>{{$t('tooltipPage.tip130')}}</p>
                        <p>{{$t('tooltipPage.tip131')}}</p>
                        <p>{{$t('tooltipPage.tip132')}}</p>
                        <p>{{$t('tooltipPage.tip133')}}</p>
                        <p>{{$t('tooltipPage.tip134')}}</p>
                        <p>{{$t('tooltipPage.tip135')}}</p>
                        <p>{{$t('tooltipPage.tip136')}}</p>
                        <p>{{$t('tooltipPage.tip137')}}</p>
                        <p>{{$t('tooltipPage.tip138')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'bakeComponents'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip139')}}</p>
                        <p>{{$t('tooltipPage.tip140')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'packaging'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip141')}}</p>
                        <van-image :src="importImage('tooltip/packaging1.png')"></van-image>
                        <p>{{$t('tooltipPage.tip142')}}</p>
                        <p>{{$t('tooltipPage.tip143')}}</p>
                        <p>{{$t('tooltipPage.tip144')}}</p>
                        <van-image :src="importImage('tooltip/packaging2.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'depanelBoardRail'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip145')}}</p>
                        <p>{{$t('tooltipPage.tip146')}}</p>
                        <p>{{$t('tooltipPage.tip147')}}</p>
                        <p>{{$t('tooltipPage.tip148')}}</p>
                        <p>{{$t('tooltipPage.tip149')}}</p>
                        <p>{{$t('tooltipPage.tip150')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'solderPaste'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip151')}}</p>
                        <p>{{$t('tooltipPage.tip152')}}</p>
                        <p>{{$t('tooltipPage.tip153')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'pasteUnpopulatedPad'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip154')}}</p>
                        <p>{{$t('tooltipPage.tip155')}}</p>
                        <p>{{$t('tooltipPage.tip156')}}</p>
                        <p>{{$t('tooltipPage.tip157')}}</p>
                        <p>{{$t('tooltipPage.tip158')}}</p>
                        <p>{{$t('tooltipPage.tip159')}}</p>
                        <p>{{$t('tooltipPage.tip160')}}</p>
                        <p>{{$t('tooltipPage.tip161')}}</p>
                        <p>{{$t('tooltipPage.tip162')}}</p>
                        <p>{{$t('tooltipPage.tip163')}}</p>
                        <p>{{$t('tooltipPage.tip164')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'productDescriptionPcbAFile'">
                    <div class="width-four">
                        <p style="font-weight: 600;">{{$t('tooltipPage.tip165')}}</p>
                        <p>{{$t('tooltipPage.tip166')}}</p>
                        <p>{{$t('tooltipPage.tip167')}}</p>
                        <p>{{$t('tooltipPage.tip168')}}</p>
                        <p>{{$t('tooltipPage.tip169')}}</p>
                        <p>{{$t('tooltipPage.tip170')}}</p>
                        <p>{{$t('tooltipPage.tip171')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'forkBoard'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip172')}}</p>
                        <p>{{$t('tooltipPage.tip173')}}</p>
                        <p>{{$t('tooltipPage.tip174')}}</p>
                        <van-image :src="importImage('tooltip/forkBoard.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'stepStencil'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip175')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'dimensions'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip176')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'customizedSize'">
                    <div class="width-four">
                        <div class="size-box">
                            <div class="size-top flex">
                                <div class="size-box-line left"></div>
                                <div class="size-box-text">{{ state.outX }}mm</div>
                                <div class="size-box-line right"></div>
                            </div>
                            <div class="size-content flex">
                                <div class="pull-left flex">
                                    <div class="pull-left-line left"></div>
                                    <div class="pull-left-text">{{ state.outY }}mm</div>
                                    <div class="pull-left-line right"></div>
                                </div>

                                <div class="dash-box">
                                    <div class="size-top flex">
                                        <div class="size-box-line left"></div>
                                        <div class="size-box-text">{{ state.isdX }}mm</div>
                                        <div class="size-box-line right"></div>
                                    </div>

                                    <div class="dash-content flex">
                                        <div class="pull-left flex">
                                            <div class="pull-left-line left"></div>
                                            <div class="pull-left-text">{{ state.isdY }}mm</div>
                                            <div class="pull-left-line right"></div>
                                        </div>

                                        <div class="area-box flex flex-column">
                                            <div class="area-img"></div>
                                            <div class="text-center">{{$t('tooltipPage.tip177')}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="props.field == 'setCustomizedSize'">
                    <div class="width-four">
                        <div class="size-box">
                            <div class="size-top flex">
                                <!-- <div class="size-box-line left"></div>
                                <div class="size-box-text">{{ 380 }}mm</div>
                                <div class="size-box-line right"></div> -->
                            </div>
                            <div class="size-content flex">
                                <!-- <div class="pull-left flex">
                                    <div class="pull-left-line left"></div>
                                    <div class="pull-left-text">{{ 280 }}mm</div>
                                    <div class="pull-left-line right"></div>
                                </div> -->

                                <div class="dash-box">
                                    <div class="size-top flex">
                                        <div class="size-box-line left"></div>
                                        <div class="size-box-text">X</div>
                                        <div class="size-box-line right"></div>
                                    </div>

                                    <div class="dash-content flex">
                                        <div class="pull-left flex">
                                            <div class="pull-left-line left"></div>
                                            <div class="pull-left-text">Y</div>
                                            <div class="pull-left-line right"></div>
                                        </div>

                                        <div class="area-box flex flex-column">
                                            <div class="area-img"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="props.field == 'stencilQty'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip178')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'polishingProcess'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip179')}}</p>
                        <p>{{$t('tooltipPage.tip180')}}</p>
                        <p>{{$t('tooltipPage.tip181')}}</p>
                        <p>{{$t('tooltipPage.tip182')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'fiducials'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip183')}}</p>
                        <van-image :src="importImage('tooltip/fiducials.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'smtConfirmProduction'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip184')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'engraveText'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip185')}}</p>
                        <van-image :src="importImage('tooltip/engraveText.png')"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'packageBox'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip186')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'stepAreasSide'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip187')}}</p>
                        <van-image :src="importImage('tooltip/stepAreasSide1.png')" style="height: 150px;"></van-image>
                        <van-image :src="importImage('tooltip/stepAreasSide2.png')" style="height: 150px;"></van-image>
                    </div>
                </template>
                <template v-if="props.field == 'stepAreasThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip188')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'otherAreasThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip189')}}</p>
                    </div>
                </template>
                <template v-if="props.field == 'stepAreas'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip190')}}</p>
                    </div>
                </template>
                <template v-if="props?.field == 'polyimideThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip191')}}</p>
                        <van-image :src="importImage('tooltip/polyimideThickness.png')"></van-image>
                    </div>
                </template>
                <template v-if="props?.field == 'frThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip192')}}</p>
                        <van-image :src="importImage('tooltip/frThickness.png')"></van-image>
                    </div>
                </template>
                <template v-if="props?.field == 'steelThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip193')}}</p>
                        <van-image :src="importImage('tooltip/steelThickness.png')"></van-image>
                    </div>
                </template>
                <template v-if="props?.field == 'sidedTapeThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip194')}}</p>
                        <van-image :src="importImage('tooltip/sidedTapeThickness.png')"></van-image>
                    </div>
                </template>
                <template v-if="props?.field == 'goldFingersThickness'">
                    <div class="width-four">
                        <p>{{$t('tooltipPage.tip195')}}</p>
                    </div>
                </template>
                <!-- {{ props.field }} -->
            </div>
        </van-popup>
        <van-icon name="question" class="pointer hover-blue" color="#dbdbdb" style="margin-left: 5px;" @click="show = true"/>
    </div>
</template>

<script setup lang="ts" name="CountTooltip">
const props = withDefaults(defineProps<{
    data?: any,
    field: string
}>(), {
    field: ''
})
const show = ref(false)

const state = reactive({
    outX: 0,
    outY: 0,
    isdX: 0,
    isdY: 0,
})
watch(() => props.data, (newVal) => {
    if (newVal?.dimensions && ['customizedSize'].includes(props?.field)) {
        // console.log('---', newVal)
        let temp = newVal?.dimensions.split('-')
        let outArr = temp[0]
        let isdArr = temp[1]
        if (outArr?.length) {
            state.outX = outArr.split('*')[0]
            state.outY = outArr.split('*')[1]
        }

        if (isdArr?.length) {
            state.isdX = isdArr.split('*')[0]
            state.isdY = isdArr.split('*')[1]
        }
    }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.count-tooltip {
    max-width: 343px;
    max-height: 500px;
    overflow-y: auto;

    .show-table {
        td {
            padding: 8px 0 0 8px;
        }
    }
    img {
        max-width: 100%;
    }

    .size-box {
        width: 400px;
        // border: 1px dashed #d0d5d9;

        .size-top {
            padding-left: 65px;
            padding-right: 10px;
            margin-bottom: 10px;
            .size-box-text {
                padding: 0 20px;
            }
            .size-box-line {
                position: relative;
                flex: 1;
                border-top: 1px solid #000;

                &.left {
                    &::after {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: -15px;
                        width: 20px;
                        height: 20px;
                        transform: translate(0, -50%);
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/size-left.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
                &.right {
                    &::after {
                        content: "";
                        position: absolute;
                        top: 50%;
                        right: -15px;
                        width: 20px;
                        height: 20px;
                        transform: translate(0, -50%);
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/size-right.png') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
        }

        .size-content {
            width: 100%;
            height: 200px;
            align-items: stretch;

            .pull-left {
                width: 55px;
                flex-direction: column;
                padding: 10px 0;
                .pull-left-text {
                    width: 100%;
                    padding: 20px 0;
                    text-align: center;
                    word-wrap: break-word;
                }
                .pull-left-line {
                    position: relative;
                    flex: 1;
                    border-left: 1px solid #000;

                    &.left {
                        &::after {
                            content: "";
                            position: absolute;
                            left: 50%;
                            top: -15px;
                            width: 20px;
                            height: 20px;
                            transform: translate(-50%, 0);
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/size-top.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                    &.right {
                        &::after {
                            content: "";
                            position: absolute;
                            right: 50%;
                            bottom: -15px;
                            width: 20px;
                            height: 20px;
                            transform: translate(50%, 0);
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/size-bottom.png') no-repeat;
                            background-size: 100% 100%;
                        }
                    }
                }
            }

            .dash-box {
                flex: 1;
                background: #f5f8fa;
                padding: 20px 30px;
                // border: 1px solid #d0d5d9;

                .dash-content {
                    height: 120px;
                    align-items: stretch;
                    .area-box {
                        flex: 1;
                        background: #fff;

                        .area-img {
                            width: 114px;
                            height: 70px;
                            background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/size-img.png') no-repeat;
                            background-size: 100% 100%;
                            margin-bottom: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.count-popper {
    box-shadow: 0 4px 8px 0 rgba(78,122,194,.24) !important;
}
</style>