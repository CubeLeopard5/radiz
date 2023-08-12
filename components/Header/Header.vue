<template>
    <div class="header-container">
        <div class="switch-group">
            <a-switch class="switch-theme" v-model:checked="state.checkedL" @change="(e) => { (e == true) ? $i18n.locale = 'fr' : $i18n.locale = 'en'; }">
                <template #checkedChildren>
                    <span> FR </span>
                </template>
                <template #unCheckedChildren>
                    <span> EN </span>
                </template>
            </a-switch>
            <a-switch class="switch-theme" v-model:checked="state.checkedT" @change="(e) => { (e == true) ? $colorMode.preference = 'light' : $colorMode.preference = 'dark'; }">
                <template #checkedChildren>
                    <img style="display: flex;" src="@/assets/sun-svgrepo-com.svg" alt="">
                </template>
                <template #unCheckedChildren>
                    <img style="display: flex;" src="@/assets/moon-svgrepo-com.svg" alt="">
                </template>
            </a-switch>
        </div>
        <div class="buttons-group">
            <HeaderLogin/>
            <HeaderRegister/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
    checkedT: true,
    checkedL: true,
});
</script>

<style scoped>
.buttons-group {
    display: flex;
    flex-direction: row;
    gap: 24px;
}

.header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.switch-group {
    display: flex;
    flex-direction: row;
    gap: 24px;
}

.switch-theme {
    background: var(--color-primary);
}
</style>