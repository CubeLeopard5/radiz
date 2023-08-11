<template>
	<NuxtLayout>
		<NuxtPage />
  	</NuxtLayout>
</template>

<style>
:root {
	--color: black;
	--color-primary: #13850a;
	--color-secondary: #0e2233;
	--bg: white;
	--bg-secondary: #f0f2f5;
	--border-color: #13850a;
	--error: #FF4D4D;
}

.dark-mode {
	--color: white;
	--color-primary: #13850a;
	--color-secondary: #fdf9f3;
	--bg: black;
	--bg-secondary: #28282B;
	--border-color: #13850a;
	--error: #FF4D4D;
}

body {
	background-color: var(--bg);
	color: var(--color);
	transition: background-color .3s;
	font-family: 'Ruwudu', serif;
}

a {
  	color: var(--color-primary)
}
</style>