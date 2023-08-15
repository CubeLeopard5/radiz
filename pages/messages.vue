<template>
    <div class="msg-service-container">
        MESSAGE
        <a-alert message="Your message has been successfully posted." type="success" closable v-if="validate == 1"/>
        <client-only>
        <div class="form-container">
            <a-select
                v-model:value="form.sr"
                mode="multiple"
                style="width: 100%"
                placeholder="multiple Mode"
                :options="options"
                @change="handleChange"
                @inputKeyDown="handleInput"
            />
            <a-input v-model:value="form.title" placeholder="Basic usage" />
            <a-textarea v-model:value="form.text" placeholder="Basic usage" :rows="8" />
            <a-button @click="createPost">
                <span> Send </span>
            </a-button>
        </div>
        </client-only>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';

interface IFormState {
    title: string,
    text: string,
    sr: Array<string>,
};

const form = ref<IFormState>({
    title: '',
    text: '',
    sr: [''],
});

const redditName = ref('');
const options = ref<SelectProps['options']>([]);
const research = ref('');

onBeforeMount(() => {
    setSelectOptions();
});

const request = useRequest();
let validate = ref<Number>(0);

const setSelectOptions = async() => {
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `reddit/me`,
        accessToken: true,
    });
    redditName.value = response.subreddit.display_name;
    form.value.sr = [redditName.value];
    options.value.push({ value: redditName.value, label: redditName.value });
}

const createPost = async() => {
    form.value.sr = form.value.sr.map(el => el.toLowerCase());
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/create_publication",
        accessToken: true,
        body: JSON.stringify({
            sr: form.value.sr,
            title: form.value.title,
            text: form.value.text,
        }),
    });
    resetForm();
    validate.value = 1;
    setTimeout(function(){ 
        validate.value = 0; 
    }, 5000);
};

const resetForm = () => {
    form.value.title = '';
    form.value.text = '';
    form.value.sr = [];
};

const handleChange = () => {
    research.value = "";
    options.value = [{ value: redditName.value, label: redditName.value }];
};

const handleInput = (value: KeyboardEvent) => {
    if (value.key == "Backspace") {
        research.value = research.value.slice(0, -1);
    } else {
        research.value += value.key;
    }
    searchRedditsAuto(research.value);
};

const searchRedditsAuto = async(research: string) => {
    let tab: Array<object> = [{ value: redditName.value, label: redditName.value }];
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
};

</script>

<style scoped>
.msg-service-container {
    height: 93.4vh;
    background-image: url("@/assets/plage_background.jpg");
    background-size: cover;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-container {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: white;
    border-radius: 12px;
    padding: 12px;
}
</style>