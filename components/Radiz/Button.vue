<template>
    <a-button type="primary" html-type="submit" @click="$emit('onClick', $event)" class="radiz-button" :disabled="disabled">
        <span> {{ text }} </span>
    </a-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        text: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    setup() {
        return {

        }
    }
});
</script>

<style scoped>
.radiz-button {
    background: var(--color-primary);
    border-color: var(--color-primary);
    border-radius: 6px;
    color: black;
}

.radiz-button:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.radiz-button:focus {
    background: var(--color-primary);
    border-color: var(--color-primary);
}
</style>