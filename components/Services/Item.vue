<template>
    <div class="service-item">
        <span> {{ data.title }} </span>
        <img :src="data.photo" alt="" style="width: 64px;">
        <div v-if="authValidated" class="connected">
            <span> connected </span>
            <CheckOutlined/>
        </div>
        <div v-if="authValidated" class="disconnect">
            <span> Disconnect </span>
            <CloseOutlined/>
        </div>
        <RadizButton v-else :text="'Connect'" @onClick="authentification"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    props: {
        data: {
            type: Object,
            required: true,
        }
    },
    components: {
        CheckOutlined,
        CloseOutlined,
    },
    setup(props) {
        const request = useRequest();
        const authValidated = ref(false);
    
        const authentification = () => {
            navigateTo(props.data.auth, {
                external: true
            });
        };
        onMounted(async() => {
            const response = await request.sendRequestToServer({
                method: "POST",
                endpoint: "services_connected",
                accessToken: true,
                body: JSON.stringify({
                    serviceName: props.data.title.toLowerCase(),
                }),
            });
            console.log(response);
            if (response.result == true) {
                authValidated.value = true;
            }
        })

        return {
            authValidated,
            authentification,
            onMounted,
        }
    }
});
</script>

<style scoped>
.service-item {
    background: white;
    display: flex;
    flex-direction: column;
    width: 200px;
    align-items: center;
    padding: 12px;
    gap: 12px;
    border-radius: 12px;
    height: 200px;
    justify-content: center;
}

.service-item:hover {
    border: solid 2px var(--border-color);
}

.connected {
    padding: 4px 15px;
    background: var(--color-primary);
    border-color: var(--color-primary);
    border-radius: 6px;
    color: black;
}

.disconnect {
    padding: 4px 15px;
    background: var(--error);
    border-color: var(--error);
    border-radius: 6px;
    color: black;
}
</style>