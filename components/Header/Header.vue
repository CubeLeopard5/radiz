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
            <HeaderLogin v-if="!store.connectedUser.id"/>
            <HeaderRegister v-if="!store.connectedUser.id"/>
            <RadizButton text="Home" @onClick="goToHome" v-if="store.connectedUser.id"/>
            <RadizButton text="Comptes" @onClick="goToComptes" v-if="store.connectedUser.id"/>
            <RadizButton text="Logout" @onClick="logout" v-if="store.connectedUser.id"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useMainStore } from '~/store/main';

const store = useMainStore();
const router = useRouter();

const state = reactive({
    checkedT: true,
    checkedL: true,
});

const logout = () => {
    localStorage.setItem('authToken', '');
    store.setConnectedUser({});
    router.push({ path: '/' });
};

const goToComptes = () => {
    router.push({ path: '/comptes' });
};

const goToHome = () => {
    router.push({ path: '/home' });
};
</script>

<style scoped>
.buttons-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24px;
}

.header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
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