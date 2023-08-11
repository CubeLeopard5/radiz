<template>
    <a-layout>
        <a-layout-header class="header">
            <Header/>
        </a-layout-header>
        <a-layout-content style="min-height: 93vh;">
            <NuxtPage/>
        </a-layout-content>
    </a-layout>
</template>

<style scoped>
.header {
    background: var(--bg);
}
</style>