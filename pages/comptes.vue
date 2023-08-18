<template>
    <div class="comptes-container">
        <div class="comptes">
            <div v-for="item, i in listcomptes" :key="i" class="list-comptes">
                <ComptesItem :data="item"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const listcomptes = ref([
    {
        title: 'Reddit',
        photo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/1200px-Reddit_Logo_Icon.svg.png',
        auth: 'http://localhost:8000/auth/reddit',
    }
]);
</script>

<style scoped>
.comptes-container {
    height: 93.4vh;
    background-image: url("@/assets/plage_background.jpg");
    background-size: cover;
}

.comptes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 226px);
}

.list-comptes {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.comptes::-webkit-scrollbar {
    display: none;
}
</style>