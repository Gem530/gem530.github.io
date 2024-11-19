<template>
    <div class="producible-products main-width">
        <!-- <div class="producible-products-title text-center">{{$t('producible.factoryCapacity')}}</div>
        <div class="form-table border head-bg">
            <div class="form-table-item">{{$t('producible.typeOfCircuitBoard')}}</div>
            <div class="form-table-item">{{$t('producible.capacity')}}</div>
            <div class="form-table-item">{{$t('producible.currentProduction')}}</div>
        </div>
        <div class="form-table border hover producible">
            <div class="form-table-item">{{$t('producible.doubleSidedBoard')}}</div>
            <div class="form-table-item">20,000</div>
            <div class="form-table-item">67%</div>
        </div>
        <div class="form-table border hover producible">
            <div class="form-table-item">{{$t('producible.fourLayerBoard')}}</div>
            <div class="form-table-item">8,000</div>
            <div class="form-table-item">27%</div>
        </div>
        <div class="form-table border hover producible">
            <div class="form-table-item">{{$t('producible.eightLayerBoard')}}</div>
            <div class="form-table-item">2,000</div>
            <div class="form-table-item">6%</div>
        </div> -->

        <div class="producible-products-title margin-top text-center">{{$t('producible.outputValueAndDeliveryTime')}}</div>
        <div class="form-table border head-bg">
            <div class="form-table-item">{{$t('producible.productType')}}</div>
            <div class="form-table-item">{{$t('producible.quickBoard')}}</div>
            <div class="form-table-item">{{$t('producible.sampleDeliveryTime')}}</div>
            <div class="form-table-item">{{$t('producible.batchDeliveryTime')}}</div>
        </div>
        <div class="form-table border hover producible">
            <div class="form-table-item">{{$t('producible.doubleSidedBoard')}}</div>
            <div class="form-table-item">48h</div>
            <div class="form-table-item">2-3{{$t('producible.day')}}</div>
            <div class="form-table-item">5-7{{$t('producible.day')}}</div>
        </div>
        <div class="form-table border hover producible">
            <div class="form-table-item">{{$t('producible.multiLayerBoard')}}</div>
            <div class="form-table-item">72h</div>
            <div class="form-table-item">5-6{{$t('producible.day')}}</div>
            <div class="form-table-item">7-10{{$t('producible.day')}}</div>
        </div>
        <div class="form-table border hover producible">
            <div class="form-table-item" style="width: 100%;">{{$t('producible.urgentOrdersTip')}}</div>
        </div>
        <!-- <div class="products-value text-center">
            <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/prducible1.png" class="products-value-img"/>
        </div> -->

        <div class="producible-products-title margin-top text-center">{{$t('producible.teamAdvantages')}}</div>
        <div class="products-value text-center">
            <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/prducible2.png" class="products-value-img"/>
        </div>
    </div>
</template>

<script setup lang="ts" name="ProducibleProducts">
const { t } = useI18n()
definePageMeta({ layout: 'default' })
useHead({ title: () => t('producibleProducts') })
</script>

<style lang="scss" scoped>
.producible-products {
    padding: 60px 0;

    .producible-products-title {
        margin-bottom: 40px;
        font-size: 36px;
        font-weight: 600;

        &.margin-top {
            margin-top: 40px;
        }
    }

    .products-value {
        .products-value-img {
            max-width: 100%;
        }
    }
}
</style>