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
        <div v-if="store.connectedUser.id" class="search-bar">
            <a-select
                v-model:value="sr"
                mode="multiple"
                style="width: 50%; border-color: red;"
                placeholder="Research"
                :options="options"
                @change="handleChange"
                @inputKeyDown="handleInput"
                :notFoundContent="null"
                @blur="research = ''"
            />
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
import type { SelectProps } from 'ant-design-vue';

const store = useMainStore();
const router = useRouter();

const state = reactive({
    checkedT: true,
    checkedL: true,
});

const request = useRequest();
const options = ref<SelectProps['options']>([]);
const research = ref('');
const sr = ref([]);

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

const handleChange = () => {
    research.value = "";
    store.research = sr.value;
};

const handleInput = (value: KeyboardEvent) => {
    if (value.key == "Backspace") {
        research.value = research.value.slice(0, -1);
    } else if (value.key != "Shift") {
        research.value += value.key;
    }
    searchRedditsAuto(research.value);
};

const searchRedditsAuto = async(research: string) => {
    let tab: Array<object> = [];
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/search_subreddits_autocomplete",
        accessToken: true,
        body: JSON.stringify({
            search: research,
        }),
    });
    response.data.children.forEach(el => {
        tab.push({
            value: el.data.display_name,
            label: el.data.display_name
        });
    });
    options.value = tab;
    //searchRedditUsers(research);
};

const searchRedditUsers = async(research: string) => {
    let tab: Array<object> = [];
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/search_user",
        accessToken: true,
        body: JSON.stringify({
            search: research,
        }),
    });
    response.data.children.forEach(el => {
        tab.push({
            value: el.data.name,
            label: el.data.name
        });
    });
    options.value = options.value?.concat(tab);
};
</script>

<style>
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

.search-bar {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
}

.switch-group {
    display: flex;
    flex-direction: row;
    gap: 24px;
}

.switch-theme {
    background: var(--color-primary);
}

.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-selectcustomize-input) .ant-select-selector {
    border-color: var(--border-color);
    box-shadow: none !important;
}

.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: var(--border-color) !important;
}
</style>