import {createStore} from 'vuex'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')
const store = createStore({
  state: {
    game_status: "init",
    game_info: {
        career_options: [],
    },
    player: {
        name: "",
        money: 0,
        career: {
            name: "",
            salary: 0,
        },
        time: 0,
    },
    events_list: [],
    assets_list: [],
    optional_event: {
        id: 0,
        optional: false,
    }
  },
  mutations: {
    set_game_status(state, status) {
        state.game_status = status;
        console.log({set_game_status:status});
    },
    set_game_info(state, info) {
        state.game_info = info;
        console.log({set_game_info:info});
    },
    set_player(state, p) {
        state.player = p;
        console.log({set_player:p});
    },
    add_new_events(state, events) {
        state.events_list = state.events_list.concat(events);
        console.log({add_new_events:events});
    },
    add_new_event(state, event) {
        state.events_list.push(event);
        console.log({add_new_event:event});
    },
    set_optional_event(state, event) {
        state.optional_event = event;
        console.log({set_optional_event:event});
    },

    socket_emit(state, {ev, data}) {
        socket.emit(ev, data);
        console.log({ev:ev, data:data});
    }
  },
  actions: {
    socket_on_game_info({commit}) {
        socket.on("gameInfoResp", data => {
            commit('set_game_info', data.game_info);
            console.log({gameInfoResp:data});
        })
    },
    socket_on_player_info() {
        socket.on("playerInfoResp", data => {
            if (data && data.request_result === 'ok') {
                console.log("playerInfoResp success:"+JSON.stringify(data));
                socket.emit("playerNextRound", {});
            } else {
                console.log("playerInfoResp error:"+JSON.stringify(data));
            }
        })
    },
    socket_on_player_option({commit}) {
        socket.on("playerOptionResp", data => {
            commit('add_new_event', data.ev_result);
            if (data.ev_result.type === "choose") {
                commit('set_optional_event', {optional: false});
            }
        })
    },
    socket_on_player_next_round({commit}) {
        socket.on("playerNextRoundResp", data => {
            commit('add_new_events', data.events);
            commit('set_player', data.player);
            for (let event of data.events) {
                if (event.optional === true) {
                    commit('set_optional_event', event);
                    break;
                }
            }
            commit('set_game_status', data.game_status);
            console.log({events: data.events, player: data.player});
        })
    },
    socket_emit_interval({ev, data, intv}) {
        setInterval(socket.emit(ev, data), intv)
    },
  }
})

export default store
