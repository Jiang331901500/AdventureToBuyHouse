<template>
  <div class="app_box">
    <h>买房大冒险</h>
    <PlayerStatus class="status_box" v-if="game_status!=='init'"/>
    <HouseEvent v-if="game_status!=='init'" />
    <StartGameInput v-if="game_status==='init'" />
    <ReactBar v-show="optional_event.optional" v-if="game_status!=='init'" />
    <ContinueBar v-show="!optional_event.optional" v-if="game_status!=='init'" />
    <p>本游戏仅供娱乐，不构成任何法律或投资建议，也不代表任何真实的人物、组织或事件。
      游戏中的随机事件纯属虚构，不代表任何概率或可能性，也不预示任何未来发生的事情，请玩家勿过分相信或恐慌。
    </p>
  </div>
</template>

<script>
import HouseEvent from './components/HouseEvent.vue'
import PlayerStatus from './components/PlayerStatus.vue';
import ReactBar from './components/ReactBar.vue';
import ContinueBar from './components/ContinueBar.vue';
import StartGameInput from './components/StartGameInput.vue';
import {computed} from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    HouseEvent,
    PlayerStatus,
    ReactBar,
    ContinueBar,
    StartGameInput,

  },
  setup() {
    const store = useStore();
    let game_status = computed(() => {
      return store.state.game_status;
    });
    let optional_event = computed(() => {
      return store.state.optional_event;
    });
    return {
      game_status,
      optional_event
    }
  }
}

</script>

<style>
html {
  touch-action: pan-x pan-y;
  user-select: none;
  -ms-content-zooming: none;
  -ms-touch-action: pan-x pan-y;
  -ms-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;

  touch-action: pan-x pan-y;
  user-select: none;
  -ms-content-zooming: none;
  -ms-touch-action: pan-x pan-y;
  -ms-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}

.app_box {
  padding: 0 1%;
}
</style>
