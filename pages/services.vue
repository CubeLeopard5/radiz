<template>
    <div class="services-container">
        <div class="services">
            <div v-for="item, i in listServices" :key="i" class="list-services">
                <ServicesItem :data="item"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const listServices = ref([
            {
                title: 'Reddit',
                photo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/1200px-Reddit_Logo_Icon.svg.png',
                auth: 'http://localhost:8000/auth/reddit',
            }
        ]);

        return {
            listServices,
        }
    }
});
</script>

<style scoped>
.services-container {
    height: 93.4vh;
    background-image: url("@/assets/plage_background.jpg");
    background-size: cover;
}

.services {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 226px);
}

.list-services {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.services::-webkit-scrollbar {
    display: none;
}
</style>