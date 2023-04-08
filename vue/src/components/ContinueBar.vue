<template>
    <n-card class = "react_bar" >
        <n-space justify="space-around">
            <n-button type="primary" @click="yes" >继续</n-button>
        </n-space>
    </n-card>
</template>
  
<script>
import { NCard, NButton, NSpace } from 'naive-ui'
import { useStore } from 'vuex'

export default {
    components: {
        NCard,
        NButton,
        NSpace
    },
    setup() {
        const store = useStore();
        let yes = () => {
            store.commit("socket_emit", {ev:"playerNextRound", data:{}});
            console.log("game continues");
        };
        return {
            yes
        }
    }
};
</script>
<style>



</style>