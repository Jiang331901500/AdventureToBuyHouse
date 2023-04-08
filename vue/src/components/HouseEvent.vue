<template>
  <n-card class="timeline-container">
    <NScrollbar style="max-height: auto">
      <n-timeline>
        <n-timeline-item v-for="(event, index) in events_list" :key="index" type="info" :content="event.result" :time="get_time(event.trigger_time)" line-type="dashed" />
      </n-timeline>
    </NScrollbar>
  </n-card>
</template>

<script>
import { NScrollbar, NCard, NTimeline, NTimelineItem } from "naive-ui";
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  components: {
    NCard,
    NTimeline,
    NTimelineItem,
    NScrollbar
  },
  setup() {
    const store = useStore();
    let events_list = computed(() => {
      return store.state.events_list;
    });

    let get_time = (m) => {
      // 获取当前时间
      let now = new Date();

      // 将月份加上3
      let futureDate = new Date(now);
      futureDate.setMonth(futureDate.getMonth() + m);

      // 格式化日期
      let year = futureDate.getFullYear();
      let month = futureDate.getMonth() + 1;
      let day = futureDate.getDate();

      // 在月和日前添加前导零
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }

      // 将日期和时间拼接起来
      let formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }
    return {
      events_list,
      get_time
    }
  }
};
</script>

<style scoped>
.timeline-container {
  margin: 10px 0px;
  height: 70vh; 
  overflow: auto;
}
</style>