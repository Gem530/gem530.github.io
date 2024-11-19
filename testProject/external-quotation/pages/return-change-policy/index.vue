<template>
    <div class="return-change-policy main-width">
        <!-- <div class="return-change-policy-title text-center">退换货政策</div>
        <div class="return-chagne-list">
            <div class="return-chagne-item">
                <div class="return-chagne-item-title">取消订单</div>
                <div class="return-chagne-item-content">我们接受在产品发货或生产之前取消订单。如果订单是 取消，您将获得全额退款。</div>
            </div>
            <div class="return-chagne-item">
                <div class="return-chagne-item-title">退货（如适用）</div>
                <div class="return-chagne-item-content">
                    我们接受退货。客户有权在14日内申请退货 如果产品质量差或有缺陷，则在交货后几天内交货。
                    要获得退货资格，您的商品必须未使用且状况与您相同 收到了。它也必须在原包装中。为了完成您的退货，我们 需要收据或购买证明。请询问我们的客户服务，以确保您 将包裹发送到正确的地址。 
                </div>
            </div>
            <div class="return-chagne-item">
                <div class="return-chagne-item-title">注意</div>
                <div class="return-chagne-item-content">
                    定制或个性化商品无权获得 14 天退款。
                    如果退货是由消费者造成的，消费者应对退货货品付运费，具体费用应根据您选择的快递公司而定。
                    如果由于我们的原因，收到的货物损坏或不正确，消费者因此不需要承担运费，退货不向消费者收取进货费;
                </div>
            </div>
            <div class="return-chagne-item">
                <div class="return-chagne-item-title">退款（如适用）</div>
                <div class="return-chagne-item-content">收到并检查您的退货后，我们将通过电子邮件向您发送收货通知。 我们还将通知您批准或拒绝您的退款。如果你是 获得批准后，将处理您的退款，并自动应用信用额度 在一定天数内发送到您的信用卡或原始付款方式。</div>
            </div>
            <div class="return-chagne-item">
                <div class="return-chagne-item-title">延迟或遗漏退款（如适用）</div>
                <div class="return-chagne-item-content">
                    如果您尚未收到退款，请先再次检查您的银行账户。
                    然后联系您的信用卡公司，您的退款可能需要一些时间才能完成 正式发布。接下来，请联系您的银行。通常有一些处理时间，然后 退款已过账。如果您已经完成了所有这些操作，但仍然没有收到您的 退款 请联系我们service@XXX.com.
                    请联系我们的客户服务service@XXX.com获取退货地址。
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts" name="ReturnChangePolicy">
</script>

<style lang="scss" scoped>
.return-change-policy {
    padding: 60px 0;

    .return-change-policy-title {
        margin-bottom: 40px;
        font-size: 36px;
        font-weight: 600;
    }

    .return-chagne-list {
        .return-chagne-item {
            padding: 30px 45px;
            border-bottom: 1px solid #dadada;
            &:first-child {
                border-top: 1px solid #dadada;
            }

            .return-chagne-item-title {
                margin-bottom: 10px;
                font-size: 18px;
                font-weight: 600;
            }

            .return-chagne-item-content {
                font-size: 14px;
            }
        }
    }
}
</style>