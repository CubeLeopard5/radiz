<template>
    <div class="home-container">
        <div class="subreddit-container" v-if="ready == true && noAccountConnected == false" @scroll="onScroll">
            <div v-for="subRedditPost, i in redditFeed" :key="i" class="subreddits-list">
                <SubredditPost :data="subRedditPost.data"/>
            </div>
        </div>
        <div class="skeleton-container" v-else-if="ready == false && noAccountConnected == false">
            <div class="skeleton-list" v-for="i in 4" :key="i">
                <div class="skeleton">
                    <a-skeleton active/>
                </div>
            </div>
        </div>
        <div class="no-account-container" v-if="noAccountConnected == true">
            <div class="no-account-card">
                <span> You don't have any account connected </span>
                <RadizButton text="Comptes" @onClick="goToComptes"/>
            </div>
        </div>
        <div class="load-new-posts" v-if="loadingNewPosts">
            <a-spin :indicator="indicator" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue';
import { useMainStore } from '~/store/main';
import { LoadingOutlined } from '@ant-design/icons-vue';

const store = useMainStore();
const request = useRequest();
const redditFeed = ref([]);
const ready = ref(false);
const subRedditsInfo = reactive([]);
const noAccountConnected = ref(false);
const router = useRouter();
const loadingNewPosts = ref(false);

const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '48px',
    },
    spin: true,
});

const sortByCreatedUTC = (a, b) => {
    if (a.data.created_utc < b.data.created_utc) {
        return 1;
    }
    if (a.data.created_utc > b.data.created_utc) {
        return -1;
    }
    return 0;
};

const goToComptes = () => {
    router.push({ path: '/comptes' });
};

const getLinkedIn = async() => {
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `linkedin/me`,
        accessToken: true,
    });
    console.log(response);
};

const getSubreddits = async() => {
    let shuffled = [];
    let selectedSubReddit = [];
    let rtn = [];
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `reddit/my_subreddits`,
        accessToken: true,
    });
    if (response.data) {
        response.data.children.forEach(el => {
            if (!subRedditsInfo.find(e => e.subRedditName === el.data.display_name)) {
                subRedditsInfo.push({
                    subRedditName: el.data.display_name,
                    next: null,
                });
            }
        });
    } else {
        noAccountConnected.value = true;
    }
    if (subRedditsInfo.length > 5) {
        shuffled = subRedditsInfo.sort(() => 0.5 - Math.random());
        selectedSubReddit = shuffled.slice(0, 5);
    } else {
        selectedSubReddit = subRedditsInfo;
    }
    for (let i = 0; i < selectedSubReddit.length; i++) {
        rtn = rtn.concat(await getPostsOfSubReddit(selectedSubReddit[i].subRedditName));
    }
    return rtn;
};

const getPostsOfSubReddit = async(subRedditName) => {
    let obj = subRedditsInfo.find(o => o.subRedditName === subRedditName);
    if (!obj) {
        subRedditsInfo.push({
            subRedditName: subRedditName,
            next: null,
        });
    }
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: `reddit/subreddit_posts`,
        accessToken: true,
        body: JSON.stringify({
            subRedditName: subRedditName,
            limit: 4,
            next: (obj != null ? obj.next : null),
        }),
    });
    subRedditsInfo.find((o, i) => {
        if (o.subRedditName === subRedditName) {
            subRedditsInfo[i] = { subRedditName: subRedditName, next: response.data.after };
            return true;
        }
    });
    return response.data.children;
};

const onScroll = async({ target: { scrollTop, clientHeight, scrollHeight }}) => {
    let tab = [];
    if (scrollTop + clientHeight >= scrollHeight) {
        loadingNewPosts.value = true;
        if (store.research.length == 0) {
            tab = await getSubreddits();
            tab = tab.sort(sortByCreatedUTC);
            redditFeed.value = redditFeed.value.concat(tab);
        } else {
            for (let i = 0; i < store.research.length; i++) {
                tab = tab.concat(await getPostsOfSubReddit(store.research[i]));
            }
            tab = tab.sort(sortByCreatedUTC);
            redditFeed.value = redditFeed.value.concat(tab);
        }
        loadingNewPosts.value = false;
    }
};

watch(() => store.research, async(newValue) => {
    ready.value = false;
    redditFeed.value = [];
    subRedditsInfo.length = 0;
    
    for (let i = 0; i < newValue.length; i++) {
        redditFeed.value = redditFeed.value.concat(await getPostsOfSubReddit(newValue[i]));
    }
    
    redditFeed.value = redditFeed.value.sort(sortByCreatedUTC);
    ready.value = true;
});

onMounted(async() => {
    await getLinkedIn();
    redditFeed.value = [];
    redditFeed.value = await getSubreddits();
    redditFeed.value = redditFeed.value.sort(sortByCreatedUTC);
    ready.value = true;
});

definePageMeta({
    middleware: 'auth-user',
});
</script>

<style scoped>
.home-container {
    height: 93.4vh;
    background-image: url("@/assets/plage_background.jpg");
    background-size: cover;
    padding-top: 1px;
}

.subreddit-container {
    margin-top: 24px;
    overflow-y: scroll;
    height: 89vh;
}

.subreddit-container::-webkit-scrollbar {
    display: none;
}

.subreddits-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.skeleton-container {
    margin-top: 24px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.skeleton-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.skeleton {
    width: 80%;
    background: var(--bg);
    border-radius: 12px;
    padding: 16px;
}

.no-account-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.no-account-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 24px;
    background: var(--bg);
    border-radius: 12px;
    width: 25%;
    padding: 24px;
}

.load-new-posts {
    position: absolute;
    top: 90%;
    left: calc(50% - 24px);
    z-index: 1;
}
</style>