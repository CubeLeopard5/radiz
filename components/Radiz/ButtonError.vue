<template>
    <a-button type="primary" html-type="submit" @click="$emit('onClick', $event)" class="radiz-button-cancel">
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
    },
    setup() {
        return {

        }
    }
});
</script>

<style scoped>
.radiz-button-cancel {
    background: var(--error);
    border-color: var(--error);
    border-radius: 6px;
    color: black
}

.radiz-button-cancel:hover {
    background: var(--error);
    border-color: var(--error);
}

.radiz-button-cancel:focus {
    background: var(--error);
    border-color: var(--error);
}
</style>