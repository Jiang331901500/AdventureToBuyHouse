<template>
    <n-card :inline="'true'">
        <n-form-item label="昵称">
            <n-input v-model:value="name" />
        </n-form-item>
        <n-form-item label="年龄">
            <n-input v-model:value="age" />
        </n-form-item>
        <n-form-item label="性别">
            <n-radio-group v-model:value="gender" name="left-size" style="margin-bottom: 12px">
                <n-radio-button value="男"> 男</n-radio-button>
                <n-radio-button value="女"> 女</n-radio-button>
            </n-radio-group>
        </n-form-item>
        <n-form-item label="职业">
            <n-radio-group v-model:value="choose_career_idx" name="left-size" style="margin-bottom: 12px">
                <n-radio-button v-for="(data, index) in career_options" :key="index" :value="index">
                    {{ data.name }}：￥{{ data.salary }}
                </n-radio-button>
            </n-radio-group>
        </n-form-item>
        <n-button @click="sendPlayerInfo">Submit</n-button>
    </n-card>
</template>
  
<script>
import { ref } from 'vue';
import { NCard, NButton, NFormItem, NInput, NRadioGroup, NRadioButton } from 'naive-ui';
import { useStore } from 'vuex'
import { computed } from 'vue';

export default {
    components: {
        NCard,
        NButton,
        NFormItem,
        NInput,
        NRadioGroup,
        NRadioButton,
    },
    setup() {
        const store = useStore();
        store.dispatch("socket_on_game_info");
        store.commit("socket_emit", {ev:"gameInfo", data:{}});

        let gender = ref("");
        let name = ref("");
        let age = ref("");
        let choose_career_idx = ref(0);

        let sendPlayerInfo = () => {
            let formData = {
                mode: 'auto',
                name: name.value,
                age: Number(age.value),
                gender: gender.value,
                career: {
                    id : "",
                    name : "",
                    salary : 0
                }
            };
            if (store.state.game_info.career_options.length > choose_career_idx.value) {
                formData.career = store.state.game_info.career_options[choose_career_idx.value];
            }
            store.dispatch("socket_on_player_info");
            store.dispatch("socket_on_player_next_round");
            store.commit("socket_emit", {ev:"playerInfo", data:formData});
        };

        let career_options = computed(()=>{
            return store.state.game_info.career_options
        });

        return {
            name,
            gender,
            age,
            choose_career_idx,
            career_options,
            sendPlayerInfo,
        };
    }
};
</script>
  