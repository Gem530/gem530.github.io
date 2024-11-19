<template>
    <div class="user-info">
        <nav-bar left-arrow><template #title>{{ $t('login.myAccount') }}</template></nav-bar>

        <div class="user-info-border"></div>
        <van-cell :title="$t('login.username')" :value="userInfo().value?.userName" />
        <van-cell :title="$t('login.email')" :value="userInfo().value?.email" />

        <van-button type="primary" class="sign-out" @click="logOut()">{{ $t('login.signOut') }}</van-button>
    </div>
</template>

<script setup lang="ts" name="UserInfo">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('login.myAccount') })

// const navTitle = computed(() => )
</script>

<style lang="scss" scoped>
.user-info-border {
    height: 10px;
    background: #f1f2f3;
}
.sign-out {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>