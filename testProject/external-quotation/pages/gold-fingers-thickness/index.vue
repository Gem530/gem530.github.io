<template>
    <div class="gold-fingers-thickness main-width">
        <p class="font-semibold text-222222 mt-20 mb-10">{{$t('helpPage.tip444')}}</p>
        <table class="show-table" border style="width: 800px;">
            <tr>
                <td>{{$t('helpPage.tip445')}}</td>
                <td>{{$t('helpPage.tip446')}}</td>
                <td>{{$t('helpPage.tip447')}}</td>
                <td>{{$t('helpPage.tip448')}}</td>
            </tr>
            <tr>
                <td rowspan="3">{{$t('helpPage.tip449')}}</td>
                <td>0.11</td>
                <td>
                    <p>0.0275 {{$t('helpPage.tip450')}}</p>
                    <p>0.0405 {{$t('helpPage.tip451')}}</p>
                </td>
                <td>0.012</td>
            </tr>
            <tr>
                <td>0.12</td>
                <td>
                    <p>0.0275 {{$t('helpPage.tip450')}}</p>
                    <p>0.0405 {{$t('helpPage.tip451')}}</p>
                </td>
                <td>0.018</td>
            </tr>
            <tr>
                <td>0.2</td>
                <td>
                    <p>0.0275 {{$t('helpPage.tip450')}}</p>
                    <p>0.0405 {{$t('helpPage.tip451')}}</p>
                </td>
                <td>0.035</td>
            </tr>
            <tr>
                <td rowspan="2">{{$t('helpPage.tip452')}}</td>
                <td>0.07</td>
                <td>
                    <p>0.0275 {{$t('helpPage.tip450')}}</p>
                    <p>0.0405 {{$t('helpPage.tip451')}}</p>
                </td>
                <td>0.018</td>
            </tr>
            <tr>
                <td>0.11</td>
                <td>
                    <p>0.05 {{$t('helpPage.tip450')}}</p>
                    <p>0.068 {{$t('helpPage.tip451')}}</p>
                </td>
                <td>0.035</td>
            </tr>
        </table>
        <p class="text-14 text-999999 mt-10">{{$t('helpPage.tip453')}}</p>
        <p class="font-semibold text-222222 mt-20 mb-13">{{$t('helpPage.tip454')}}</p>
        <p class="text-999999">{{$t('helpPage.tip455')}}</p>
        <p class="text-222222 mt-20">{{$t('helpPage.tip456')}}</p>
        <p class="text-222222 mt-20">{{$t('helpPage.tip457')}}</p>
        <p class="text-999999 mt-20">{{$t('helpPage.tip458')}}</p>
        <p class="text-222222 mt-20">{{$t('helpPage.tip459')}}</p>
        <p class="text-222222 mt-20">{{$t('helpPage.tip460')}}</p>
    </div>
</template>

<script setup lang="ts" name="GoldFingersThickness">
const dataList = ref([

])
</script>

<style lang="scss" scoped>
.gold-fingers-thickness {
    min-height: calc(100vh - 60px - 227px);
    padding: 20px 0 30px;
    font-size: 14px;

    .show-table {
        font-size: 14px;
        tr td {
            height: 30px !important;
            p {
                margin: 10px 0;
            }
        }
    }

    .font-semibold {
        font-weight: 600;
    }

    .text-222222 {
        color: #222222;
    }
    .text-999999 {
        color: #999999;
    }
    .mt-20 {
        margin-top: 20px;
    }
    .mt-10 {
        margin-top: 10px;
    }
    .mb-10 {
        margin-bottom: 10px;
    }
    .mb-13 {
        margin-bottom: 13px;
    }
    .text-14 {
        font-size: 14px;
    }
}
</style>