<template>
    <div class="service-item">
        <span> {{ data.title }} </span>
        <img :src="data.photo" alt="" style="width: 64px;">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        data: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        return {

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
</style>