<template>
    <div class="home-container">
        hello
        <!--div style="display: flex; flex-direction: row; gap: 12px;">
            <div v-for="el, i in selection.services" :key="i">
                <span v-if="el == -1" @click="setSelected(-1, i)"> Services </span>
                <span v-if="el == 0" @click="setSelected(0, i)"> Messages 0 </span>
                <span v-if="el == 1" @click="setSelected(1, i)"> Messages 1 </span>
                <span v-if="el == 2" @click="setSelected(2, i)"> Messages 2 </span>
            </div>
            <span @click="addPlus"> + </span>
        </div>
        <div v-if="selection.services[selection.selected] == -1" class="services">
            <div v-for="item, i in listServices" :key="i" class="list-services" @click="serviceSelection(i)">
                <ServicesItem :data="item"/>
            </div>
        </div>
        <div v-if="selection.services[selection.selected] == 0">
            MESSAGE 0
        </div>
        <div v-if="selection.services[selection.selected] == 1">
            MESSAGE 1
        </div>
        <div v-if="selection.services[selection.selected] == 2">
            MESSAGE 2
        </div-->






        <!--a-button @click="getInfo">
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
        <a-input v-model:value="search" placeholder="Basic usage" @change="searchRedditsAuto" @pressEnter="searchReddits"/>
        <div v-for="el, i in listSubreddits" :key="i">
            <div @click="setSubredditPosts(el)">
                {{ el }}
            </div>
        </div>
        <div class="subreddit-container" @scroll="onScroll">
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
                <SubredditPost :data="subredditpost.data"/>
            </div>
        </div-->



        <div class="subreddit-container" v-if="ready == true" @scroll="onScroll">
            <div v-for="subRedditPost, i in redditFeed" :key="i" class="subreddits-list">
                <SubredditPost :data="subRedditPost.data"/>
            </div>
        </div>
        <div class="skeleton-container" v-else>
            <div class="skeleton-list" v-for="i in 5" :key="i">
                <div class="skeleton">
                    <a-skeleton active/>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useMainStore } from '~/store/main';

const store = useMainStore();
const request = useRequest();
const redditFeed = ref([]);
const ready = ref(false);
const subRedditsInfo = reactive([]);

const sortByCreatedUTC = (a, b) => {
    if (a.data.created_utc < b.data.created_utc) {
        return 1;
    }
    if (a.data.created_utc > b.data.created_utc) {
        return -1;
    }
    return 0;
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
    }
    if (subRedditsInfo.length > 5) {
        shuffled = subRedditsInfo.sort(() => 0.5 - Math.random());
        selectedSubReddit = shuffled.slice(0, 5);
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
    const result = await request.sendRequestToServer({
        method: "POST",
        endpoint: `reddit/reddit_user_posts`,
        accessToken: true,
        body: JSON.stringify({
            redditUser: subRedditName,
            limit: 4,
            next: (obj != null ? obj.next : null),
        }),
    });
    console.log(result)
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
    redditFeed.value = [];
    redditFeed.value = await getSubreddits();
    redditFeed.value = redditFeed.value.sort(sortByCreatedUTC);
    ready.value = true;
});

/*const listServices = ref([
    {
        title: 'Messages',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Google_Messages_logo.svg/2048px-Google_Messages_logo.svg.png',
    },
    {
        title: 'Messages 1',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Google_Messages_logo.svg/2048px-Google_Messages_logo.svg.png',
    },
    {
        title: 'Messages 2',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Google_Messages_logo.svg/2048px-Google_Messages_logo.svg.png',
    }
]);

const selection = reactive({
    services: [-1],
    selected: 0,
});

const serviceSelection = (i) => {
    if (selection.services[selection.services.length - 1] == -1) {
        selection.services[selection.services.length - 1] = i;
    }
    selection.selected = selection.services.length - 1;
};

const addPlus = () => {
    if (selection.services[selection.services.length - 1] == -1) {
        return;
    }
    selection.services.push(-1);
    selection.selected = selection.services.length - 1;
};

const setSelected = (val, idx) => {
    selection.selected = idx;
};*/







/*let subredditList = ref([]);

let subredditsPost = ref([]);

let search = ref('');

let listSubreddits = ref([]);

const request = useRequest();

let nextTarget = ref('');
let nameChosen = ref('');

const onScroll = ({ target: { scrollTop, clientHeight, scrollHeight }}) => {
    if (scrollTop + clientHeight >= scrollHeight) {
        setSubredditPostAgain();
    }
};

const getInfo = async() => {
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `reddit/me`,
        accessToken: true,
    });
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
}

const getSubreddits = async() => {
    const response = await request.sendRequestToServer({
        method: "GET",
        endpoint: `reddit/my_subreddits`,
        accessToken: true,
    });
    subredditList.value = response.data.children;
};

const setSubredditPostAgain = async() => {
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: `reddit/subreddit_posts`,
        accessToken: true,
        body: JSON.stringify({
            subredditName: nameChosen.value,
            after: nextTarget.value
        }),
    });
    subredditsPost.value = subredditsPost.value.concat(response.data.children);
    nextTarget.value = response.data.after;
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
    subredditsPost.value = response.data.children;
    nameChosen.value = subredditList.value[i].data.display_name;
    nextTarget.value = response.data.after;
};

const setSubredditPosts = async(el) => {
    subredditsPost.value = [];
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: `reddit/subreddit_posts`,
        accessToken: true,
        body: JSON.stringify({
            subredditName: el,
        }),
    });
    subredditsPost.value = response.data.children;
    nextTarget.value = response.data.after;
    nameChosen.value = el;
    listSubreddits.value = [];
}

const searchReddits = async() => {
    listSubreddits.value = [];
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/search_subreddits",
        accessToken: true,
        body: JSON.stringify({
            search: search.value,
        }),
    });
    listSubreddits.value = response.names;
};

const searchRedditsAuto = async() => {
    listSubreddits.value = [];
    const response = await request.sendRequestToServer({
        method: "POST",
        endpoint: "reddit/search_subreddits_autocomplete",
        accessToken: true,
        body: JSON.stringify({
            search: search.value,
        }),
    });
    response.data.children.forEach(el => {
        listSubreddits.value.push(el.data.display_name);
    });
};*/

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

/*.services {
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
}*/

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
}
</style>