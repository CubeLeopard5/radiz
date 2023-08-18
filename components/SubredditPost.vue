<template>
    <div class="card">
        <div class="card-header">
            <div class="card-header-left">
                <span> {{ data.subreddit }} </span>
                <span> {{ data.subreddit_subscribers }} subscribers </span>
            </div>
            <div class="card-header-center">
                <span> {{ data.title }} </span>
            </div>
            <div class="card-header-right">
                <span> {{ data.author }} </span>
                <span> {{ showDate(data.created_utc) }} </span>
            </div>
        </div>
        <div v-html="data.selftext_html" style="padding: 18px; text-align: justify;"/>
        <div v-if="data.preview" style="padding: 24px;">
            <div v-if="data.preview.images[0].source.width < 300">
                <img :src="data.preview.images[0].source.url" alt="" :style="{ 'width': `${data.preview.images[0].source.width}px`, 'border-radius': '12px' }">
            </div>
            <div v-else>
                <img :src="data.preview.images[0].source.url" alt="" style="width: 100%; border-radius: 12px;">
            </div>
        </div>
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
        const showDate = (val: number) => {
            let date = new Date(val * 1000);
            let stringDate = date.toLocaleString();
            return stringDate;
        };
        return {
            showDate,
        }
    }
});
</script>

<style scoped>
.card {
    background: var(--bg);
    width: 80%;
    border-radius: 12px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.card-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 64px;
    justify-content: space-between;
    align-items: center;
    font-weight: bold
}

.card-header-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    font-size: 24px;
    text-align: center;
    height: 100%;
}

.card-header-left {
    height: 100%;
    background: linear-gradient(90deg, rgba(59,59,59,1) 0%, rgba(59,59,59,1) 50%, rgba(105,105,105,1) 100%);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    width: 25%;
    align-items: center;
    border-bottom-right-radius: 12px;
    border-top-left-radius: 12px;
}

.card-header-right {
    display: flex;
    flex-direction: column;
    gap: 6px;
    height: 100%;
    background: linear-gradient(90deg, rgba(105,105,105,1) 0%, rgba(59,59,59,1) 50%, rgba(59,59,59,1) 100%);
    color: white;
    justify-content: center;
    width: 25%;
    align-items: center;
    border-bottom-left-radius: 12px;
    border-top-right-radius: 12px;
}
</style>