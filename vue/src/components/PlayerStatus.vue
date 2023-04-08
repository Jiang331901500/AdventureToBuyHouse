<template>
  <n-card class = "status_card" :padding="'10px'" >
    <div class="naive-ui-bar">
      <n-icon size="18" class="naive-ui-icon"><Accessibility /></n-icon>
      <span class="naive-ui-text">{{player.name}}</span>
      <n-icon size="18" class="naive-ui-icon"><Briefcase/></n-icon>
      <span class="naive-ui-text">{{player.career.name}}</span>
      <n-icon size="18" class="naive-ui-icon"><Card /></n-icon>
      <span class="naive-ui-text">{{player.money}}</span>
      <n-icon size="18" class="naive-ui-icon"><MoneyCollectFilled/></n-icon>
      <span class="naive-ui-text">{{player.career.salary}}</span>

      <n-icon size="18" class="naive-ui-icon"><Calendar/></n-icon>
      <span class="naive-ui-text">{{player.time}}</span>
    </div>
</n-card>
</template>

<script>
import { NCard, NIcon } from "naive-ui";
import { defineComponent, computed } from "vue";
import { Briefcase,Card,Accessibility,Calendar} from "@vicons/ionicons5";
import { MoneyCollectFilled} from "@vicons/antd";
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    NIcon,
    Briefcase,
    NCard,
    Card,
    Calendar,
    Accessibility,
    MoneyCollectFilled,

  },
  setup() {
    const store = useStore();
    let player = computed(() => {
      return store.state.player;
    });
    return {
      player
    }
  }
});
</script>

<style scoped>
.status_card{
  padding: 3% 0 1% 0;
}
.naive-ui-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vh;
}
.naive-ui-icon {
  margin-right: 8px;
}
.naive-ui-text {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
</style>