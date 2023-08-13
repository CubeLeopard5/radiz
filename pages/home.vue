<template>
    <div class="home-container">
        Hello
        <a-button @click="auth2">
            connect
        </a-button>
        <a-button @click="getInfo">
            get info
        </a-button>
        <a-button @click="sendMessage">
            Send message
        </a-button>
        <a-button @click="createPost">
            Create Post
        </a-button>
        <a-button @click="getSubreddits">
            get Subreddits
        </a-button>
        <a-button @click="subredditsPost = []">
            come back subreddits
        </a-button>
        <div class="subreddit-container">
            <div v-if="subredditsPost.length == 0">
                <div v-for="subreddit, i in subredditList" :key="i" class="subreddits-list">
                    <div class="subreddit-card" @click="setSubredditPost(i)">
                        <span> {{ subreddit.data.title }} </span>
                        <span> {{ subreddit.data.description }} </span>
                        <img :src="subreddit.data.community_icon" alt="">
                    </div>
                </div>
            </div>
            <div v-for="subredditpost, i in subredditsPost" :key="i" class="subreddits-list">
                <div class="subreddit-card">
                    <span> {{ subredditpost.data.author }} </span>
                    <span> {{ subredditpost.data.title }} </span>
                    <div v-html="subredditpost.data.selftext_html"/>
                    <div v-if="subredditpost.data.preview">
                        <div v-if="subredditpost.data.preview.images[0].source.width < 300">
                            <img :src="subredditpost.data.preview.images[0].source.url" alt="" :style="{ 'width': `${subredditpost.data.preview.images[0].source.width}px`, 'border-radius': '12px' }">
                        </div>
                        <div v-else>
                            <img :src="subredditpost.data.preview.images[0].source.url" alt="" style="width: 100%; border-radius: 12px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let subredditList = ref([]);

let subredditsPost = ref([]);

const request = useRequest();

const auth2 = () => {
    navigateTo(`http://localhost:8000/auth/reddit`, {
        external: true
    });
};

const getInfo = async() => {
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `reddit/me`,
        accessToken: true,
    });
    console.log(response);
};

const sendMessage = async() => {
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/send_message",
        accessToken: true,
        body: JSON.stringify({
            to: "testCubeDev",
            subject: "MeinSubjector",
            text: "jkkqj qsh qkhskq"
        }),
    });
    console.log(response);
}

const createPost = async() => {
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/create_publication",
        accessToken: true,
        body: JSON.stringify({
            title: "My_title_2",
            description: "Ono otre dex ription",
        }),
    });
    console.log(response);
}

const getSubreddits = async() => {
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `reddit/my_subreddits`,
        accessToken: true,
    });
    console.log(response);
    subredditList.value = response.data.children;
};

const setSubredditPost = async(i) => {
    subredditsPost.value = [];
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: `reddit/subreddit_posts`,
        accessToken: true,
        body: JSON.stringify({
            subredditName: subredditList.value[i].data.display_name,
        }),
    });
    console.log(response);
    subredditsPost.value = response.data.children;
};

/*definePageMeta({
    middleware: 'auth-user',
});*/
</script>

<style scoped>
.home-container {
    height: 93.4vh;
    background-image: url("@/assets/plage_background.jpg");
    background-size: cover;
}

.subreddit-container {
    margin-top: 24px;
    overflow-y: scroll;
    height: 85vh;
}

.subreddit-container::-webkit-scrollbar {
    display: none;
}

.subreddits-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.subreddit-card {
    background: var(--bg);
    width: 80%;
    border-radius: 12px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}
</style>