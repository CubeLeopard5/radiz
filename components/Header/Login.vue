<template>
    <div>
        <a-button @click="visible = true">
            <span> Login </span>
        </a-button>
        <a-modal v-model:visible="visible" :title="'Login' + ': ' + errMessage" @ok="handleOk"
            :style="{ '--bg-error': (error) ? '#FF4D4D' : '#13850a' }" :class="(error) ? 'login-failure' : ''"
            :footer="null">
            <a-form :model="formState" name="normal_login" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item :label="'Email'" name="email" :rules="[
                    {
                        required: true,
                        message: 'Please enter your email'
                    },
                    {
                        type: 'email',
                        message: 'Please enter a valid email'
                    },
                ]">
                    <a-input v-model:value="formState.email">
                        <template #prefix>
                            <UserOutlined/>
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item :label="'Password'" name="password" :rules="[{ required: true, message: 'Please enter your password' }]">
                    <a-input-password v-model:value="formState.password" v-on:keyup.enter="handleOk">
                        <template #prefix>
                            <LockOutlined/>
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                    <div class="group-button-log-can">
                        <a-button type="primary" @click="resetForm" class="button-cancel">
                            <span> Cancel </span>
                        </a-button>
                        <a-button type="primary" html-type="submit" @click="handleOk" class="button-login">
                            <span> Submit </span>
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

interface FormState {
    email: string;
    password: string;
};

export default defineComponent({
    components: {
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const request = useRequest();
        const formState = reactive<FormState>({
            email: '',
            password: '',
        });
        const visible = ref<boolean>(false);
        let error = ref<boolean>(false);
        let errMessage = ref<string>('');

        const handleOk = async() => {
            const response = await request.login(formState.password, formState.email);
            if (!response.token) {
                errMessage.value = response.response;
                error.value = true;
            } else {
                errMessage.value = '';
                error.value = false;
                visible.value = false;
                resetForm();
            }
        };

        const checkInputs = () => {
            if (!formState.email || formState.password) {
                return true;
            }
            return false;
        };

        const resetForm = () => {
            formState.email = '';
            formState.password = '';
        };

        return {
            formState,
            visible,
            error,
            errMessage,
            handleOk,
            checkInputs,
            resetForm,
        }
    }
});
</script>

<style>
.ant-modal-header {
    background: var(--bg-error);
    border-bottom: none;
}

.ant-modal-title {
    color: var(--color);
}

.ant-modal-body {
    background: var(--bg);
    padding-bottom: 1px !important
}

.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: var(--color-primary);
}

.ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
    border-color: var(--color-primary);
    box-shadow: none;
}

.ant-form-item-label > label {
    color: var(--color);
}

.group-button-log-can {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.button-login {
    background: var(--color-primary);
    border-color: var(--color-primary);
    border-radius: 6px;
}

.button-login:hover {
    background: var(--color-primary);
    border-color: var(--color-primary);
    border-radius: 6px;
}

.button-login:focus {
    background: var(--color-primary);
    border-color: var(--color-primary);
    border-radius: 6px;
}

.button-cancel {
    background: var(--error);
    border-color: var(--error);
    border-radius: 6px;
    color: var(--color);
}

.button-cancel:hover {
    background: var(--error);
    border-color: var(--error);
    border-radius: 6px;
    color: var(--color);
}

.button-cancel:focus {
    background: var(--error);
    border-color: var(--error);
    border-radius: 6px;
    color: var(--color);
}

.login-failure {
	animation-name: shakeError;
	animation-fill-mode: forwards;
	animation-duration: 600ms;
	animation-timing-function: ease-in-out;
}

@keyframes shakeError {
	0% {
		transform: translateX(0); }
	15% {
		transform: translateX(0.375rem); }
	30% {
		transform: translateX(-0.375rem); }
	45% {
		transform: translateX(0.375rem); }
	60% {
		transform: translateX(-0.375rem); }
	75% {
		transform: translateX(0.375rem); }
	90% {
		transform: translateX(-0.375rem); }
	100% {
		transform: translateX(0);
	}
}
</style>