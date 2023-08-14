<template>
    <div class="service-item">
        <span> {{ data.title }} </span>
        <img :src="data.photo" alt="" style="width: 64px;">
        <div>
            <client-only>
                <div v-if="authValidated" class="connected" @click="disconnectService">
                    <a-tooltip>
                        <template #title>
                            <span> Click to disconnect </span>
                        </template>
                        <div style="display: flex; flex-direction: row; align-items: center; gap: 12px;">
                            <span> connected </span>
                            <CheckOutlined v-if="printIcon" class="conexion-icon"/>
                        </div>
                    </a-tooltip>
                </div>
                <div v-else class="disconnect" @click="authentification">
                    <a-tooltip>
                        <template #title>
                            <span> Click to connect </span>
                        </template>
                        <div style="display: flex; flex-direction: row; align-items: center; gap: 12px;">
                            <span> Disconnected </span>
                            <CloseOutlined v-if="printIcon" class="conexion-icon"/>
                        </div>
                    </a-tooltip>
                </div>
            </client-only>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
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

        let printIcon = ref(false);
        let printIconDuration = ref(650);
    
        const authentification = () => {
            navigateTo(props.data.auth, {
                external: true
            });
        };

        const isServiceConnected = async() => {
            const response = await request.sendRequestToServer({
                method: "POST",
                endpoint: "is_service_connected",
                accessToken: true,
                body: JSON.stringify({
                    serviceName: props.data.title.toLowerCase(),
                }),
            });
            console.log(response);
            if (response.result == true) {
                authValidated.value = true;
                localStorage.setItem(`${props.data.title}Service`, "true");
                printIcon.value = false;
                setTimeout(function(){ 
                    printIcon.value = true; 
                }, printIconDuration.value);
            }
        };

        const disconnectService = async() => {
            const response = await request.sendRequestToServer({
                method: "POST",
                endpoint: "disconnect_service",
                accessToken: true,
                body: JSON.stringify({
                    serviceName: props.data.title.toLowerCase(),
                }),
            });
            console.log(response);
            if (response.result == true) {
                authValidated.value = false;
                localStorage.setItem(`${props.data.title}Service`, "");
                printIcon.value = false;
                setTimeout(function(){ 
                    printIcon.value = true; 
                }, printIconDuration.value);
            }
        };
    
        onBeforeMount(() => {
            const serviceName = localStorage.getItem(`${props.data.title}Service`);
            if (serviceName) {
                authValidated.value = true;
            } else {
                authValidated.value = false;
            }
            isServiceConnected();
            setTimeout(function(){ 
                printIcon.value = true; 
            }, printIconDuration.value);
        })

        return {
            authValidated,
            printIcon,
            authentification,
            onMounted,
            disconnectService,
        }
    }
});
</script>

<style scoped>
.service-item {
    background: var(--bg);
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
    cursor: pointer;
    animation-name: connexion-anim;
  	animation-duration: 1.0s;
    min-width: 115px;
}

.disconnect {
    padding: 4px 15px;
    background: var(--error);
    border-color: var(--error);
    border-radius: 6px;
    color: black;
    cursor: pointer;
    animation-name: disconnexion-anim;
  	animation-duration: 1.0s;
    min-width: 132px;
}

@keyframes connexion-anim {
    0% {
        background: linear-gradient(to right, var(--color-primary) 50%, var(--error) 50%);
        background-size: 200% 100%;
        background-position: right bottom;
        transition: all 1.0s ease-out;
    }
    100% {
        background: linear-gradient(to left, var(--error) 50%, var(--color-primary) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        transition: all 1.0s ease-out;
    }
}

@keyframes disconnexion-anim {
    0% {
        background: linear-gradient(to left, var(--error) 50%, var(--color-primary) 50%);
        background-size: 200% 100%;
        background-position: left bottom;
        transition: all 1.0s ease-out;
    }
    100% {
        background: linear-gradient(to right, var(--color-primary) 50%, var(--error) 50%);
        background-size: 200% 100%;
        background-position: right bottom;
        transition: all 1.0s ease-out;
    }
}

.conexion-icon {
    animation-name: slit-in-vertical;
  	animation-duration: 0.5s;
}

@keyframes slit-in-vertical {
    0% {
        transform: translateZ(-800px) rotateY(90deg);
        opacity: 0;
    }
    54% {
        transform: translateZ(-160px) rotateY(87deg);
        opacity: 1;
    }
    100% {
        transform: translateZ(0) rotateY(0);
    }
}
</style>