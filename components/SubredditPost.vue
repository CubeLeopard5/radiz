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
        <a-row>
            <a-col :span="6" >
                <div class="card-col" style="margin-top: 24px;">
                    <div v-if="data.link_flair_richtext.length > 0">
                        <div v-for="el, i in data.link_flair_richtext" :key="i">
                            <a-tag color="#13850a"> {{ el.t }} </a-tag>
                        </div>
                    </div>
                    <span> {{ data.ups }} up vote(s) </span>
                    <span> {{ nbComment }} comment(s) </span>
                </div>
            </a-col>
            <a-col :span="12">
                <div class="card-col">
                    <div v-if="data.selftext_html || data?.preview?.images" v-html="data.selftext_html" style="padding: 18px; text-align: justify;"/>
                    <div v-else-if="data.crosspost_parent_list">
                        <div v-for="cross, i in data.crosspost_parent_list" :key="i" style="display: flex; flex-direction: row; justify-content: center;">
                            <SubredditPost :data="cross"/>
                        </div>
                    </div>
                    <div v-if="data.preview" style="padding: 24px;">
                        <div v-if="data.preview.images[0].source.width < 1000">
                            <img :src="data.preview.images[0].source.url" alt="" :style="{ 'width': `${data.preview.images[0].source.width}px`, 'border-radius': '12px' }">
                        </div>
                        <div v-else>
                            <img :src="data.preview.images[0].source.url" alt="" style="width: 100%; border-radius: 12px;">
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="card-col" style="margin-top: 24px; display: flex; flex-direction: column; align-items: flex-start;">
                    <div v-for="com, i in listCommentsSource" :key="i" style="margin-left: 6px;">
                        <div v-html="transformString(com.body_html)"/>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    props: {
        data: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        const request = useRequest();
        const nbComment = ref(0);
        const listCommentsSource = ref([]);
        const showDate = (val: number) => {
            let date = new Date(val * 1000);
            let stringDate = date.toLocaleString();
            return stringDate;
        };
        const countNbComments = (obj: object) => {
            const propName = "kind";
            const type = "t1";
            if (propName in obj && obj[propName] == type){
                nbComment.value++;
                if (obj.data.replies != "") {
                    obj.data.replies.data.children.forEach(el => {
                        countNbComments(el);
                    });
                }
            }
        };
        const transformString = (str: string) => {
            return str.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;#39;', "\'").replaceAll("&amp;quot;", '"').replaceAll('\\', '');
        }
        onMounted(() => {
            request.sendRequestToServer({
                method: "POST",
                endpoint: `reddit/get_post_comments`,
                accessToken: true,
                body: JSON.stringify({
                    link: props.data.id,
                    subredditName: props.data.subreddit
                }),
            }).then(response => {
                response[1].data.children.forEach(el => {
                    countNbComments(el);
                    if (listCommentsSource.value.length < 5) {
                        listCommentsSource.value.push(el.data);
                    }
                });
            });
        })
        return {
            showDate,
            onMounted,
            transformString,
            nbComment,
            listCommentsSource,
        }
    }
});
</script>

<style scoped>
.card {
    background: var(--bg);
    width: 90%;
    border-radius: 12px;
    margin: 12px;
    height: 100%;
    max-height: 720px;
    overflow-y: scroll;
    word-break: break-word;
}

.card::-webkit-scrollbar {
    display: none;
}

.card-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    max-height: 600px;
    gap: 12px;
    overflow-y: scroll;
}

.card-col::-webkit-scrollbar {
    display: none;
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