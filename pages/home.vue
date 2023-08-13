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
    </div>
</template>

<script setup>
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
</style>