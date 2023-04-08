<template>
    <n-card class = "react_bar" >
        <n-space justify="space-around">
            <n-button type="primary" @click="yes" >Yes</n-button>
            <n-button type="primary" @click="no" >No</n-button>
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
            let data = {
                type: "choose",
                event: {
                    id: this.optional_event.id,
                    type: this.optional_event.type
                },
                option : true,
            };
            store.commit("socket_emit", {ev:"playerOption", data:data});
            console.log("Yes function called");
        };
        let no = () => {
            let data = {
                type: "choose",
                event: {
                    id: this.optional_event.id,
                    type: this.optional_event.type
                },
                option : false,
            };
            store.commit("socket_emit", {ev:"playerOption", data:data});
            console.log("No function called");
        };

        return {
            optional_event: store.state.optional_event,
            yes,
            no
        }
    },
};
</script>
<style>



</style>