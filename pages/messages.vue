<template>
    <div class="msg-service-container">
        MESSAGE
        <a-alert message="Your message has been successfully posted." type="success" closable v-if="validate == 1"/>
        <client-only>
        <div>
            <a-select
                v-model:value="value"
                mode="tags"
                style="width: 100%"
                placeholder="Tags Mode"
                :options="options"
                @change="handleChange"
                @inputKeyDown="handleInput"
            />
            <a-input v-model:value="form.title" placeholder="Basic usage" />
            <a-textarea v-model:value="form.description" placeholder="Basic usage" :rows="4" />
            <a-button @click="createPost">
                <span> Send </span>
            </a-button>
        </div>
        </client-only>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { SelectProps } from 'ant-design-vue';

interface IFormState {
    title: string,
    description: string,
};

const form = ref<IFormState>({
    title: '',
    description: '',
});

const request = useRequest();
let validate = ref<Number>(0);

const createPost = async() => {
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/create_publication",
        accessToken: true,
        body: JSON.stringify({
            sr: changeRedditNames(value.value[0]),
            title: form.value.title,
            description: form.value.description,
        }),
    });
    console.log(response);
    resetForm();
    validate.value = 1;
    setTimeout(function(){ 
        validate.value = 0; 
    }, 5000);
};

const changeRedditNames = (str: string) => {
    str = "u_" + str;
    str = str.toLowerCase();
    return str;
};

const resetForm = () => {
    form.value.title = '';
    form.value.description = '';
    value.value = [];
};

let research = ref('');

const handleChange = () => {
    research.value = "";
    options.value = [];
};

const handleInput = (value: KeyboardEvent) => {
    if (value.key == "Backspace") {
        research.value = research.value.slice(0, -1);
    } else {
        research.value += value.key;
    }
    console.log(`selected ${research.value}`);
    searchRedditsAuto(research.value);
};

const value = ref([]);
const options = ref<SelectProps['options']>([]);

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
};

</script>

<style scoped>
.msg-service-container {
    height: 93.4vh;
    background-image: url("@/assets/plage_background.jpg");
    background-size: cover;
}
</style>