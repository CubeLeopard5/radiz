<template>
    <div style="">
        <div @click="loginR">
            A
        </div>
        <div @click="welcomeR">
            b
        </div>
    </div>
</template>

<script setup>
import { useMainStore } from '~/store/main';

const request = useRequest();
const store = useMainStore();

const loginR = async() => {
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: `login`,
        body: JSON.stringify({
            password: 'aqzsedrf',
            email: 'azert@zer.com'
        })
    });
    console.log(response);
    store.setAccessToken(response.token);
};

const welcomeR = async() => {
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: `welcome`,
        accessToken: true,
    });
    console.log(response);
};

</script>