<template>
    <div class="component theme">
        <div class="send">
            <textarea class="send-textarea" rows="1" v-model="state.message" @input="resizeTextarea" ref="textareaRef"></textarea>
            <div class="send-btn" @click="sendHandle">发送</div>
        </div>
        
        <div class="bottom-box">
            <div ref="bottomRef"></div>
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'send' }
</script>
<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { toScrollTop } from '@/utils/index'
    import { ref, onMounted, reactive, defineEmits, watch } from 'vue'
    const router = useRouter()
    const emit = defineEmits(['send'])
    const bottomRef = ref()
    const textareaRef = ref()

    const state = reactive({
        message: ''
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    // 发送消息
    const sendHandle = () => {
        emit('send', state.message)
        state.message = ''
    }

    // 监听高度变化
    const resizeTextarea = () => {
        const maxHeight = 100
        const minHeight = undefined
        textareaRef.value.style.height = 'auto' // 初始化textarea高度：用于没有滚动条时，每删一行，就能降低高度
        let height = textareaRef.value.scrollHeight
        if (maxHeight !== undefined) {
            height = Math.min(height, maxHeight)
        }
        if (minHeight !== undefined) {
            height = Math.max(height, minHeight)
        }

        if (height) {
            textareaRef.value.style.height = height + 'px'
            bottomRef.value.style.height = height + 'px'
        }
    }
</script>

<style lang="scss" scoped>
.bottom-box {
    @include wh(100%, 45px, 'w', 'min');
    padding: 10px 15px;
}
.send {
    @include wh(100%, 45px, 'w', 'min');
    @include flex(space-between, center);
    @include pcenter(100%, 0, -100%, 0, fixed);
    padding: 10px 15px;
    background: rgba($color: #eeeeee, $alpha: 0.6);
    color: $black;
    box-shadow: 0 0px 5px rgba($color: #000000, $alpha: 0.2);

    // .send-input {
    //     @include wh(none, 30px, 'w', 'min');
    //     flex: 1;
    //     border: none;
    //     padding: 0 15px;
    //     border-radius: 30px;
    //     resize: none;
    // }
    .send-textarea {
        flex: 1;
        border: none;
        padding: 10px 15px;
        border-radius: 10px;
        resize: none;
    }

    .send-btn {
        @include wh(80px, 30px);
        @include flex(center, center);
        margin-left: 10px;
        background: skyblue;
        color: #ffffff;
        border-radius: 6px;
    }
}
</style>