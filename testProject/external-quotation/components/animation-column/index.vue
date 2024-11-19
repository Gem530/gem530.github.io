<template>
    <div class="animation-column">
        <div
            :key="i"
            v-for="i in 1"
            :class="{
                'animation-list': true,
                'move-left': i % 2
            }"
            :style="{
                'width': (props.list.length ? (props.list.length * (props.itemWidth + 60)) : 0) + 'px',
                'animation-duration': (props.duration ? props.duration : (props.list.length + 20)) + 's'
            }">
            <div :key="i" class="animation-item" v-for="(item, i) in props.list">
                <slot name="default" :row="{...item,index:i}"><img :src="item" /></slot>
            </div>
            <div :key="i" class="animation-item" v-for="(item, i) in props.list">
                <slot name="default" :row="{...item,index:i}"><img :src="item" /></slot>
            </div>
            <div class="animation-item">
                <slot name="default" :row="{...props.list[0],index:0}"><img :src="props.list[0]" /></slot>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup name="AnimationColumn">
const props = withDefaults(defineProps<{
    itemWidth?: number
    duration?: number
    list: any[]
}>(), {
    list: () => [],
    itemWidth: 328
})
</script>
  
<style lang="scss" scoped>
.animation-column {
    position: relative;
    width: 100%;
    padding: 100px 0 120px;
    // overflow: hidden;
    // &::-webkit-scrollbar {
    //     height: 0px;
    // }

    // &::before,
    // &::after {
    //     content: '';
    //     position: absolute;
    //     top: 0;
    //     width: 78px;
    //     height: 100%;
    //     z-index: 1;
    // }

    // &::before {
    //     left: 0;
    //     background: linear-gradient(-90deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
    // }

    // &::after {
    //     right: 0;
    //     background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
    // }

    .animation-list {
        display: flex;
        justify-content: flex-end;
        align-items: stretch;
        width: 100%;
        transform: translateX(-100%);
        animation: moveright 10s linear infinite;
        animation-play-state: running !important;

        &:hover {
            animation-play-state: paused !important;
        }

        &:not(:last-child) {
            margin-bottom: 5px;
        }

        &.move-left {
            justify-content: flex-start;
            animation: moveleft 10s linear infinite;
        }

        .animation-item {
            flex: none;
            // width: 59px;
            // height: 59px;
            // overflow: hidden;
            // border-radius: 13px;

            &:not(:last-child) {
                margin-right: 60px;
            }

            img {
                width: 100%;
            }
        }
    }
}

@keyframes moveright {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(100%);
    }
}

@keyframes moveleft {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
}
</style>