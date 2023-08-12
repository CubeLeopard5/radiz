<template>
    <div class="index-container">
        INDEX
    </div>
</template>

<script setup>
import { useMainStore } from '~/store/main';

const request = useRequest();
const store = useMainStore();
</script>

<style scoped>
.index-container {
    background: red;
}
</style>