<template>
    <div class="bg">
        <div class="help-document main-width">
            <el-card shadow="never" class="el-card-help">
                <div class="help-box flex fles-start">
                    <div class="help-nav">
                        <div
                            :key="item.value"
                            v-for="(item, index) in state.list"
                            :class="{'help-nav-item pointer hover-blue overflow-omit': true, 'nav-active': state.activeIndex == item.value}"
                            @click="chooseHelp(item)"
                        >{{index + 1}}. {{ item.label() }}</div>
                    </div>
                    <div class="help-content">
                        <div class="help-content-title">{{ state.activeTitle() }}</div>
                        <!-- <el-image :src="importImage('help/help1.png')"></el-image> -->

                        <!-- <div class="help-content-html" v-html="relpaceImg(state.activeHtmlValue())"></div> -->

                        <template v-if="state.activeIndex == 1">
                            <p>{{$t('helpPage.tip1')}}</p>
                            <el-image :src="importImage(`help/help1-${useLang().value}.png`)"></el-image>
                            <table class="show-table" border>
                                <tbody>
                                    <tr>
                                        <th width="140.87">{{$t('helpPage.tip2')}}</th>
                                        <th width="283.92">{{$t('helpPage.tip3')}}</th>
                                        <th width="276.85">{{$t('helpPage.tip4')}}</th>
                                        <th width="295">{{$t('helpPage.tip5')}}</th>
                                    </tr>
                                    <tr>
                                        <td width="105"><strong>{{$t('helpPage.tip6')}}</strong></td>
                                        <td width="261"><el-image :src="importImage('help/help2.png')"></el-image></td>
                                        <td width="256"><el-image :src="importImage('help/help3.png')"></el-image></td>
                                        <td width="295"><el-image :src="importImage('help/help4.png')"></el-image></td>
                                    </tr>
                                    <tr>
                                        <td width="105"><strong>{{$t('helpPage.tip7')}}</strong></td>
                                        <td width="261">{{$t('helpPage.tip8')}}</td>
                                        <td width="256">{{$t('helpPage.tip9')}}</td>
                                        <td width="295">{{$t('helpPage.tip10')}}</td>
                                    </tr>
                                    <tr>
                                        <td width="105"><strong>{{$t('helpPage.tip11')}}</strong></td>
                                        <td width="261">{{$t('helpPage.tip12')}}</td>
                                        <td width="256">{{$t('helpPage.tip13')}}</td>
                                        <td width="295">{{$t('helpPage.tip14')}}</td>
                                    </tr>
                                    <tr>
                                        <td width="105"><strong>{{$t('helpPage.tip15')}}</strong></td>
                                        <td width="261">{{$t('helpPage.tip16')}}</td>
                                        <td width="256">{{$t('helpPage.tip17')}}</td>
                                        <td width="295">{{$t('helpPage.tip18')}}</td>
                                    </tr>
                                    <tr>
                                        <td width="105"><strong>{{$t('helpPage.tip19')}}</strong></td>
                                        <td width="261">{{$t('helpPage.tip20')}}</td>
                                        <td width="256">{{$t('helpPage.tip21')}}</td>
                                        <td width="295">{{$t('helpPage.tip22')}}<br><br></td></tr>
                                    </tbody>
                                </table>
                                <table class="show-table" border>
                                    <tbody>
                                        <tr>
                                            <th width="117.87">{{$t('helpPage.tip23')}}</th>
                                            <th width="385.29">{{$t('helpPage.tip24')}}</th>
                                            <th width="360.21">{{$t('helpPage.tip25')}}</th>
                                        </tr>
                                        <tr>
                                            <td width="105"><strong>{{$t('helpPage.tip26')}}</strong></td>
                                            <td width="324"><el-image :src="importImage('help/help5.png')"></el-image></td>
                                            <td width="494"><el-image :src="importImage('help/help6.png')"></el-image></td>
                                        </tr>
                                        <tr>
                                            <td width="105"><strong>{{$t('helpPage.tip27')}}</strong></td>
                                            <td width="324"> {{$t('helpPage.tip28')}}</td>
                                            <td width="494"> {{$t('helpPage.tip29')}}</td>
                                        </tr>
                                        <tr>
                                            <td width="105"><strong>{{$t('helpPage.tip30')}}</strong></td>
                                            <td width="324">{{$t('helpPage.tip31')}}</td>
                                            <td width="494">{{$t('helpPage.tip32')}}</td>
                                        </tr>
                                        <tr>
                                            <td width="105"><strong>{{$t('helpPage.tip33')}}</strong></td>
                                            <td width="324">{{$t('helpPage.tip34')}}</td>
                                            <td width="494">{{$t('helpPage.tip35')}}<br><br></td>
                                        </tr>
                                    </tbody>
                            </table>
                            <h2>{{$t('helpPage.tip36')}}</h2>
                            <p>{{$t('helpPage.tip37')}}</p>
                            <p>{{$t('helpPage.tip38')}}</p>
                            <h4><strong>{{$t('helpPage.tip39')}}</strong></h4>
                            <p>{{$t('helpPage.tip40')}}</p>
                            <p>{{$t('helpPage.tip41')}}</p>
                            <h2><strong>{{$t('helpPage.tip42')}}</strong></h2>
                            <p>{{$t('helpPage.tip43')}}</p>
                            <p>{{$t('helpPage.tip44')}}</p>
                            <h4><strong>{{$t('helpPage.tip45')}}</strong></h4>
                            <p>{{$t('helpPage.tip46')}}</p>
                            <p>{{$t('helpPage.tip47')}}</p>
                            <h2><strong>{{$t('helpPage.tip48')}}</strong></h2>
                            <p>{{$t('helpPage.tip49')}}</p>
                            <p>{{$t('helpPage.tip50')}}</p>
                            <h2><strong>{{$t('helpPage.tip51')}}</strong></h2>
                            <p>{{$t('helpPage.tip52')}}</p>
                            <p>{{$t('helpPage.tip53')}}</p>
                            <h2><strong>{{$t('helpPage.tip54')}}</strong></h2>
                            <p>{{$t('helpPage.tip55')}}</p>
                            <p>{{$t('helpPage.tip56')}}</p>
                            <p><strong>{{$t('helpPage.tip57')}}</strong></p>
                            <p>{{$t('helpPage.tip58')}}</p>
                            <p>{{$t('helpPage.tip59')}}</p>
                            <p>{{$t('helpPage.tip60')}}</p>
                        </template>
                        <template v-if="state.activeIndex == 2">
                            <p><span>{{$t('helpPage.tip61')}}</span></p>
                            <h2><span>{{$t('helpPage.tip62')}}</span></h2>
                            <p><span>{{$t('helpPage.tip63')}}</span></p>
                            <p><span>{{$t('helpPage.tip64')}}</span></p>
                            <p><span>{{$t('helpPage.tip65')}}</span></p>
                            <p><span>{{$t('helpPage.tip66')}}</span></p>
                            <p><span>{{$t('helpPage.tip67')}}</span></p>
                            <p><span>{{$t('helpPage.tip68')}}</span></p>
                            <p><span>{{$t('helpPage.tip69')}}</span></p>
                            <p><span>{{$t('helpPage.tip70')}}</span></p>
                            <p><span>{{$t('helpPage.tip71')}}</span></p>
                            <p><el-image :src="importImage('help/help7.png')"></el-image></p>
                            <p><span>{{$t('helpPage.tip72')}}</span></p>
                            <p><el-image :src="importImage('help/help8.png')"></el-image></p>
                            <p><span>{{$t('helpPage.tip73')}}</span></p>
                        </template>
                        <template v-if="state.activeIndex == 3">
                            <p><span><strong>{{$t('helpPage.tip74')}}</strong></span><span>{{$t('helpPage.tip75')}}</span></p>
                            <p><span>{{$t('helpPage.tip76')}}</span></p>
                            <p><el-image :src="importImage('help/help9.png')"></el-image></p>
                            <p><span>{{$t('helpPage.tip77')}}</span></p>
                            <p><span>{{$t('helpPage.tip78')}}</span></p>
                            <p><span>{{$t('helpPage.tip79')}}</span></p>
                            <p><span>{{$t('helpPage.tip80')}}</span></p>
                            <p><span>{{$t('helpPage.tip81')}}</span></p>
                            <p><el-image :src="importImage('help/help10.png')"></el-image></p>
                        </template>
                        <template v-if="state.activeIndex == 4">
                            <p>{{$t('helpPage.tip82')}}</p>
                            <h2 style="font-size:24px;">{{$t('helpPage.tip83')}}</h2>
                            <p>{{$t('helpPage.tip84')}}</p>
                            <p>{{$t('helpPage.tip85')}}</p>
                            <p>{{$t('helpPage.tip86')}}</p>
                            <p>{{$t('helpPage.tip87')}}</p>
                            <p>{{$t('helpPage.tip88')}}</p>
                            <p>{{$t('helpPage.tip89')}}</p>
                            <h2 style="font-size:24px;">{{$t('helpPage.tip90')}}</h2>
                            <p>{{$t('helpPage.tip91')}}</p>
                            <p>{{$t('helpPage.tip92')}}</p>
                            <p>{{$t('helpPage.tip93')}}</p>
                            <p>{{$t('helpPage.tip94')}}<br>{{$t('helpPage.tip95')}}<br>{{$t('helpPage.tip96')}}</p>
                            <p>{{$t('helpPage.tip97')}}</p>
                            <p>{{$t('helpPage.tip98')}}</p>
                            <p>{{$t('helpPage.tip99')}}</p>
                            <p>{{$t('helpPage.tip100')}}</p>
                            <table class="show-table" border>
                                <tbody>
                                    <tr><td width="248.31">{{$t('helpPage.tip101')}}</td><td width="275">{{$t('helpPage.tip102')}}</td><td width="320.54">{{$t('helpPage.tip103')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip104')}}</td><td width="auto">{{$t('helpPage.tip105')}}</td><td width="auto">{{$t('helpPage.tip106')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip107')}}</td><td width="auto">{{$t('helpPage.tip108')}}</td><td width="auto">{{$t('helpPage.tip109')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip110')}}</td><td width="auto">{{$t('helpPage.tip111')}}</td><td width="auto">{{$t('helpPage.tip112')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip113')}}</td><td width="auto">{{$t('helpPage.tip114')}}</td><td width="auto">{{$t('helpPage.tip115')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip116')}}</td><td width="auto">{{$t('helpPage.tip117')}}</td><td width="auto">{{$t('helpPage.tip118')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip119')}}</td><td width="auto">{{$t('helpPage.tip120')}}</td><td width="auto">{{$t('helpPage.tip121')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip122')}}</td><td width="auto">{{$t('helpPage.tip123')}}</td><td width="auto">{{$t('helpPage.tip124')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip125')}}</td><td width="auto">{{$t('helpPage.tip126')}}</td><td width="auto">{{$t('helpPage.tip127')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip128')}}</td><td width="auto">{{$t('helpPage.tip129')}}</td><td width="auto">{{$t('helpPage.tip130')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip131')}}</td><td width="auto">{{$t('helpPage.tip132')}}</td><td width="auto">{{$t('helpPage.tip133')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip134')}}</td><td width="auto">{{$t('helpPage.tip135')}}</td><td width="auto">{{$t('helpPage.tip136')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip137')}}</td><td width="auto">{{$t('helpPage.tip138')}}</td><td width="auto">{{$t('helpPage.tip139')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip140')}}</td><td width="auto">{{$t('helpPage.tip141')}}</td><td width="auto">{{$t('helpPage.tip142')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip143')}}</td><td width="auto">{{$t('helpPage.tip144')}}</td><td width="auto">{{$t('helpPage.tip145')}}</td></tr>
                                    <tr><td width="auto">{{$t('helpPage.tip146')}}</td><td width="auto">{{$t('helpPage.tip147')}}</td><td width="auto">{{$t('helpPage.tip148')}}</td></tr>
                                </tbody>
                            </table>
                            <h2 style="font-size:24px;"><strong>{{$t('helpPage.tip149')}}</strong></h2>
                            <p><br>
                                <strong>{{$t('helpPage.tip150')}}</strong><br><br>
                                {{$t('helpPage.tip151')}}<br>
                                {{$t('helpPage.tip152')}}<br>
                                {{$t('helpPage.tip153')}}<br><br><br>
                                <strong>{{$t('helpPage.tip154')}}</strong><br><br>
                                {{$t('helpPage.tip155')}}<br>
                                {{$t('helpPage.tip156')}}<br>
                                {{$t('helpPage.tip157')}}<br><br><br>
                                <strong>{{$t('helpPage.tip158')}}</strong><br><br>
                                {{$t('helpPage.tip159')}}<br>
                                {{$t('helpPage.tip160')}}
                            </p>
                        </template>
                        <template v-if="state.activeIndex == 5">
                            <p style="text-align:start;">{{$t('helpPage.tip161')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip162')}}</p>
                            <table class="show-table" border>
                                <tbody>
                                    <tr><td width="882" style="text-align:left;"><span style="color:rgb(73, 73, 73);"><strong>{{$t('helpPage.tip163')}}</strong></span></td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip164')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip165')}}</td></tr>
                                    <tr>
                                        <td width="auto" style="text-align:left;">
                                            {{$t('helpPage.tip166')}}<br>
                                            {{$t('helpPage.tip167')}}<br>
                                            {{$t('helpPage.tip168')}}<br>
                                            {{$t('helpPage.tip169')}}<br>
                                            {{$t('helpPage.tip170')}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="auto" style="text-align:left;">
                                            {{$t('helpPage.tip171')}}<br>
                                            {{$t('helpPage.tip172')}}<br>
                                            {{$t('helpPage.tip173')}}<br>
                                            {{$t('helpPage.tip174')}}<br>
                                            {{$t('helpPage.tip175')}}<br>
                                        </td>
                                    </tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip176')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip177')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip178')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip179')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip180')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip181')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip182')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip183')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip184')}}</td></tr>
                                    <tr><td width="auto" style="text-align:left;">{{$t('helpPage.tip185')}}</td></tr>
                                </tbody>
                            </table>
                            <p style="text-align:start;">{{$t('helpPage.tip186')}}</p>
                            <p style="text-align:start;"><span style="background-color:initial;"><strong><br>{{$t('helpPage.tip187')}}</strong></span></p>
                            <ul>
                                <li style="text-align:start;">{{$t('helpPage.tip188')}}</li>
                            </ul>
                            <ul>
                                <li style="text-align:start;">{{$t('helpPage.tip189')}}</li>
                            </ul>
                            <ul>
                                <li style="text-align:start;">{{$t('helpPage.tip190')}} <a href="http://www.dhlindia-kyc.com/">www.dhlindia-kyc.com</a>.</li>
                            </ul>
                        </template>
                        <template v-if="state.activeIndex == 6">
                            <p style="text-align:start;"><span style="color:rgb(73, 73, 73); background-color:initial;"><strong>{{$t('helpPage.tip191')}}</strong></span></p>
                            <p style="text-align:start;">{{$t('helpPage.tip192')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip193')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip194')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip195')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip196')}}</p>
                            <p style="text-align:start;"><el-image :src="importImage('help/help11.png')"></el-image></p>
                            <p style="text-align:start;">{{$t('helpPage.tip197')}}</p>
                            <p style="text-align:start;"><span style="color:rgb(73, 73, 73);"><strong>{{$t('helpPage.tip198')}}</strong></span></p>
                            <p style="text-align:start;">{{$t('helpPage.tip199')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip200')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip201')}}</p>
                            <p style="text-align:start;"><span style="color:rgb(73, 73, 73);"><strong>{{$t('helpPage.tip202')}}</strong></span></p>
                            <p style="text-align:start;">{{$t('helpPage.tip203')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip204')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip205')}}</p>
                        </template>
                        <template v-if="state.activeIndex == 7">
                            <p style="text-align:start;">{{$t('helpPage.tip206')}}</p>
                            <h4 style="text-align:start;">{{$t('helpPage.tip207')}}</h4>
                            <p style="text-align:start;">{{$t('helpPage.tip208')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip209')}}</p>
                            <h5 style="text-align:start;"><span style="color:rgb(73, 73, 73);"><strong>{{$t('helpPage.tip210')}}</strong></span></h5>
                            <p style="text-align:start;">{{$t('helpPage.tip211')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip212')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip213')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip214')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip215')}}</p>
                            <p style="text-align:start;">{{$t('helpPage.tip216')}}</p>
                        </template>
                        <template v-if="state.activeIndex == 8">
                            <p><span style="color:rgb(88, 88, 88); background-color:rgb(255, 255, 255); font-size:14px;">{{$t('helpPage.tip217')}}</span></p>
                        </template>
                        <template v-if="state.activeIndex == 9">
                            <h4 style="text-align:start;">{{$t('helpPage.tip218')}}</h4>
                            <p>{{$t('helpPage.tip219')}}</p>
                            <h4 style="text-align:start;">{{$t('helpPage.tip220')}}</h4>
                            <p>{{$t('helpPage.tip221')}}</p>
                            <p>{{$t('helpPage.tip222')}}</p>
                            <p>{{$t('helpPage.tip223')}}</p>
                            <p>{{$t('helpPage.tip224')}} <a href="#">market@pcbsuper.com</a> . </p>
                            <h4 style="text-align:start;">{{$t('helpPage.tip225')}}</h4>
                            <p>{{$t('helpPage.tip226')}}</p>
                            <p>{{$t('helpPage.tip227')}}</p>
                            <p>{{$t('helpPage.tip228')}}</p>
                            <p>{{$t('helpPage.tip229')}}</p>
                        </template>
                        <template v-if="state.activeIndex == 10">
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);">{{$t('helpPage.tip230')}}</span></p>
                            <p style="font-size:16px; text-align:center;"><el-image :src="importImage(`help/help12-${useLang().value}.png`)"></el-image></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);"><strong>{{$t('helpPage.tip231')}}</strong></span></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);">{{$t('helpPage.tip232')}}</span></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);"><strong>{{$t('helpPage.tip233')}}</strong></span></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);">{{$t('helpPage.tip234')}}</span></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);"><strong>{{$t('helpPage.tip235')}}</strong></span></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);">{{$t('helpPage.tip236')}}</span></p>
                            <p style="font-size:16px; text-align:start;"><span style="color:rgb(0, 0, 0);">{{$t('helpPage.tip237')}}</span></p>
                        </template>
                        <template v-if="state.activeIndex == 11">
                            <p style="text-align:left;">{{$t('helpPage.tip238')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip239')}}</p>
                            <p style="text-align:left;"><strong>{{$t('helpPage.tip240')}}</strong> {{$t('helpPage.tip241')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip242')}}</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">I. </span><strong>{{$t('helpPage.tip243')}}</strong></h3>
                            <p style="text-align:left;">1. <strong>{{$t('helpPage.tip244')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip245')}}</p>
                            <p style="text-align:left;">2. <strong>{{$t('helpPage.tip246')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip247')}}</p>
                            <p style="text-align:left;"><span style="font-family:宋体;">3. </span><strong>{{$t('helpPage.tip248')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip249')}}</p>
                            <p style="text-align:left;"><span style="font-family:宋体;">4. </span><strong>{{$t('helpPage.tip250')}}</strong></p>
                            <p style="text-align:left;"><strong>{{$t('helpPage.tip251')}} </strong>{{$t('helpPage.tip252')}}</p>
                            <p style="text-align:left;">5. <strong>{{$t('helpPage.tip253')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip254')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip255')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip256')}}</p>
                            <p style="text-align:left;">6. <strong>{{$t('helpPage.tip257')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip258')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip259')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip260')}}</p>
                            <p style="text-align:left;"><u><strong>{{$t('helpPage.tip261')}}</strong></u></p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">II. </span><strong>{{$t('helpPage.tip262')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip263')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip264')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip265')}}</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">III. </span><strong>{{$t('helpPage.tip266')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip267')}}</p>
                            <p style="text-align:left;"><span style="font-family:宋体;">1. </span><strong>{{$t('helpPage.tip268')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip269')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip270')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip271')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip272')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip273')}}</p>
                            <p style="text-align:left;"><span style="font-family:宋体;">2. </span><strong>{{$t('helpPage.tip274')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip275')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip276')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip277')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip278')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip279')}}</p>
                            <p style="text-align:left;"><span style="font-family:宋体;">3. </span><strong>{{$t('helpPage.tip280')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip281')}}</p>
                            <p style="text-align:left;"><span style="font-family:宋体;">4. </span><strong>{{$t('helpPage.tip282')}}</strong></p>
                            <p style="text-align:left;">{{$t('helpPage.tip283')}}<span style="font-family:宋体;">;</span></p>
                            <p style="text-align:left;">{{$t('helpPage.tip284')}}<span style="font-family:宋体;">.</span></p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">IV. </span><strong>{{$t('helpPage.tip285')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip286')}}</p>
                            <p style="text-align:left;">1) <strong>{{$t('helpPage.tip287')}} </strong>{{$t('helpPage.tip288')}}</p>
                            <p style="text-align:left;">2) <strong>{{$t('helpPage.tip289')}} </strong>{{$t('helpPage.tip290')}}</p>
                            <p style="text-align:left;">3) <strong>{{$t('helpPage.tip291')}} </strong>{{$t('helpPage.tip292')}}</p>
                            <p style="text-align:left;">4) <strong>{{$t('helpPage.tip293')}} </strong>{{$t('helpPage.tip294')}}</p>
                            <p style="text-align:left;">5) <strong>{{$t('helpPage.tip295')}} </strong>{{$t('helpPage.tip296')}}</p>
                            <p style="text-align:left;">6) <strong>{{$t('helpPage.tip297')}} </strong>{{$t('helpPage.tip298')}}</p>
                            <p style="text-align:left;">7) <strong>{{$t('helpPage.tip299')}} </strong>{{$t('helpPage.tip300')}}</p>
                            <p style="text-align:left;">8) <strong>{{$t('helpPage.tip301')}} </strong>{{$t('helpPage.tip302')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip303')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip304')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip305')}}</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">V. </span><strong>{{$t('helpPage.tip306')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip307')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip308')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip309')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip310')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip311')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip312')}}</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">VI. </span><strong>{{$t('helpPage.tip313')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip314')}}<span style="font-family:宋体;"> </span>{{$t('helpPage.tip315')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip316')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip317')}}</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">VII. </span><strong>{{$t('helpPage.tip318')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip319')}}. {{$t('helpPage.tip320')}} .</p>
                            <p style="text-align:left;">{{$t('helpPage.tip321')}} , {{$t('helpPage.tip322')}} .</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">VIII. </span><strong>{{$t('helpPage.tip323')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip324')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip325')}} </p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">IX. </span><strong>{{$t('helpPage.tip326')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip327')}} </p>
                            <p style="text-align:left;">{{$t('helpPage.tip328')}} </p>
                            <p style="text-align:left;">{{$t('helpPage.tip329')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip330')}}</p>
                            <h4 style="text-align:left;"><span style="font-family:宋体;">X. </span><strong>{{$t('helpPage.tip331')}}</strong></h4>
                            <p style="text-align:left;">{{$t('helpPage.tip332')}}</p>
                            <h3 style="text-align:left;"><span style="font-family:宋体;">XI. </span><strong>{{$t('helpPage.tip333')}}</strong></h3>
                            <p style="text-align:left;">{{$t('helpPage.tip334')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip335')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip336')}}</p>
                            <p style="text-align:left;">{{$t('helpPage.tip337')}}</p>
                        </template>
                        <template v-if="state.activeIndex == 12">
                            <div class="terms-service-box">
                                <dl class="service-nav">
                                    <dd>
                                        {{$t('helpPage.tip338')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip339')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip340')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip341')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip342')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip343')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip344')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip345')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip346')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip347')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip348')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip349')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip350')}}
                                    </dd>
                                    <dd>
                                        {{$t('helpPage.tip351')}}
                                    </dd>
                                </dl>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip352')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip353')}}
                                            <a href="https://www.PCBSUPER.com" target="_blank">PCBSUPER.com.</a>
                                            {{$t('helpPage.tip354')}}
                                            <a href="https://www.PCBSUPER.com" target="_blank">PCBSUPER.com</a>. 
                                            {{$t('helpPage.tip355')}}
                                            <a href="https://www.PCBSUPER.com" target="_blank">PCBSUPER.com</a> , 
                                            {{$t('helpPage.tip356')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip357')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip358')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip359')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip360')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip361')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip362')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip363')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip364')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip365')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip366')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip367')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip368')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip369')}}
                                            <a href="mailto:market@pcbsuper.com">market@pcbsuper.com.</a>
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip370')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip371')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip372')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip373')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip374')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip375')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip376')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip377')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip378')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip379')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip380')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip381')}}
                                            <br>
                                            {{$t('helpPage.tip382')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip383')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip384')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip385')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip386')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip387')}}
                                        </p>
                                        <p>
                                            {{$t('helpPage.tip388')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip389')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip390')}}
                                            <br>
                                            {{$t('helpPage.tip391')}}
                                            <br>
                                            {{$t('helpPage.tip392')}}
                                            <br>
                                            {{$t('helpPage.tip393')}}
                                            <br>
                                            {{$t('helpPage.tip394')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip395')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip396')}}
                                        </p>
                                    </div>
                                </div>
                                <div class="terms-item">
                                    <div class="terms-title">
                                        {{$t('helpPage.tip397')}}
                                    </div>
                                    <div class="terms-des">
                                        <p>
                                            {{$t('helpPage.tip398')}}
                                            <a href="mailto:market@pcbsuper.com">market@pcbsuper.com.</a>
                                        </p>
                                        <br>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-if="state.activeIndex == 13">
                            <h2 style="font-size:24px;"><strong>{{$t('helpPage.tip399')}}</strong></h2>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip400')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip401')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip402')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip403')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip404')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip405')}}</p>
                            <h2 style="font-size:24px;"><strong>{{$t('helpPage.tip406')}}</strong></h2>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip407')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip408')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip409')}}</p>
                            <h2 style="font-size:24px;"><strong>{{$t('helpPage.tip410')}}</strong></h2>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip411')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip412')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip413')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip414')}}</p>
                            <h2 style="font-size:24px;"><strong>{{$t('helpPage.tip415')}}</strong></h2>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip416')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip417')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip418')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip419')}}</p>
                            <p style="font-size:16px; font-size:16px;"><span></span><span>{{$t('helpPage.tip420')}}</span></p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip421')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip422')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip423')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip424')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip425')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip426')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip427')}}</p>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip428')}}</p>
                            <h3 style="font-size:22px;">{{$t('helpPage.tip429')}}</h3>
                            <p style="font-size:16px; font-size:16px;">{{$t('helpPage.tip430')}}</p>
                        </template>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts" name="HelpDocument">
const { t } = useI18n()
useHead({ title: () => t('helpDocument') })
const state = reactive<Record<string, any>>({
    activeIndex: 1,
    activeTitle: '',
    list: [
        { value: 1,  label: () => t('helpPage.tip431') },
        { value: 2,  label: () => t('helpPage.tip432') },
        { value: 3,  label: () => t('helpPage.tip433') },
        { value: 4,  label: () => t('helpPage.tip434') },
        { value: 5,  label: () => t('helpPage.tip435') },
        // { value: 6,  label: () => t('helpPage.tip436') },
        { value: 7,  label: () => t('helpPage.tip437') },
        { value: 8,  label: () => t('helpPage.tip438') },
        { value: 9,  label: () => t('helpPage.tip439') },
        { value: 10, label: () => t('helpPage.tip440') },
        { value: 11, label: () => t('helpPage.tip441') },
        { value: 12, label: () => t('helpPage.tip442') },
        { value: 13, label: () => t('helpPage.tip443') },
    ]
})

const chooseHelp = (item: Record<string, any>) => {
    state.activeIndex = item.value
    state.activeTitle = item.label
}
chooseHelp(state.list[0])
onMounted(() => {
    // const help1 = importImage('help/help1.png')
    // console.log(help1)
    // state.activeHtmlValue().replace("importImage('help/help1.png')", help1)
})

// const relpaceImg = (txt: string) => {
//     let res = txt
//     const help1 = importImage('help/help1.png')
//     console.log(help1)
//     res = res.replace("importImage('help/help1.png')", help1)
//     const help2 = importImage('help/help2.png')
//     console.log(help2)
//     res = res.replace("importImage('help/help2.png')", help2)
//     console.log(txt)
//     return res
// }
</script>

<style lang="scss" scoped>
.bg {
    background: #f1f3f6;
}
.help-document {
    min-height: calc(100vh - 60px - 227px);
    padding: 60px 0;
    // .help-document-title {
    //     margin-bottom: 40px;
    //     font-size: 36px;
    //     font-weight: 600;
    // }

    .el-card-help {
        :deep(.el-card__body) {
            padding: 0;
        }
    }
    .help-box {
        align-items: stretch;

        .help-nav {
            flex: none;
            width: 250px;
            border-right: 1px solid #dedede;
            padding: 10px 0;
            
            .help-nav-item {
                width: 100%;
                padding: 10px;
                font-size: 14px;

                &.nav-active {
                    color: var(--el-color-primary);
                }
            }
        }

        .help-content {
            flex: 1;
            padding: 20px;
            box-sizing: border-box;

            .help-content-title {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
            }

            a {
                color: var(--el-color-primary) !important;
                text-decoration: underline !important;
            }

            .show-table {
                tr {
                    td {
                        height: 30px !important;
                    }
                }
            }
        }
    }

    // :deep(.help-card) {
    //     margin-bottom: 30px;

    //     .el-card__body {
    //         display: flex;
    //         justify-content: flex-start;
    //         align-items: center;
    //         border-radius: 10px;
    //         .help-card-img {
    //             flex: none;
    //             width: 350px;
    //         }
    //         .help-card-content {
    //             width: 100%;
    //             margin-left: 30px;
    //             overflow: hidden;

    //             .help-card-title {
    //                 margin-bottom: 10px;
    //                 font-size: 18px;
    //                 font-weight: 600;
    //             }

    //             .help-card-list {
    //                 padding: 15px 10px;
    //                 border: 1px solid #ebeef5;
    //                 border-radius: 5px;

    //                 .help-card-item {
    //                     &:not(:last-child) {
    //                         margin-bottom: 10px;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    .terms-service-box {
        .service-nav {
            font-family: NunitoSans-Bold;
            font-size: 16px;
            line-height: 36px;
            padding: 40px 0;
        }
        .service-nav {
            font-family: NunitoSans-Bold;
            font-size: 16px;
            font-weight: 600;
            line-height: 36px;
            padding: 40px 0;

            dd {
                margin: 0;
            }
        }
        .terms-item {
            border-top: 1px solid #e0e0e0;
            padding: 35px 0;
        }
        .terms-item .terms-title {
            font-size: 24px;
            font-family: NunitoSans-Bold;
            color: #313131;
        }
        .terms-item .terms-des p {
            margin-top: 20px;
            font-size: 16px;
            line-height: 24px;
        }
        .terms-item .terms-des a {
            color: #b21f1f;
            text-decoration: underline;
        }
    }
}
</style>