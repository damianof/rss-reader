<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" light>
      <v-list>
        <v-list-item>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>list</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>All Articles</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
        <v-list-item>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>grade</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Favourites</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
        <v-list-item>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>archive</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Archives</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader>Subscriptions</v-subheader>
        <v-divider></v-divider>
        <v-subheader>Tags</v-subheader>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :fixed="true">
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>All Articles</v-toolbar-title>
    </v-toolbar>
    <main class="layout-background">
      <v-container fluid>
        <v-layout :align-center="true" :justify-center="true" wrap>
          <router-view></router-view>
        </v-layout>
        <v-snackbar
         :timeout="60000"
         :bottom="true"
          v-model="offline">
          You are currently offline
          <v-btn flat class="pink--text" @click.native="removeToast">Close</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import store from 'renderer/vuex/store'
import { ipcRenderer } from 'electron'

export default {
  store,
  data () {
    return {
      drawer: true
    }
  },
  computed: {
    offline () {
      return this.$store.state.offline.offline
    }
  },
  mounted () {
    this.$nextTick(function () {
      const self = this
      ipcRenderer.on('online-status-check', (event, status) => {
        self.$store.dispatch('setStatus', (status === 'offline'))
      })
    })
  },
  methods: {
    removeToast () {
      this.$store.dispatch('setStatus', false)
    }
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons')
@import '../../node_modules/vuetify/src/stylus/settings/_colors'
$theme := {
  primary: $grey.darken-4
  accent: $blue.accent-2
  secondary: $grey.lighten-4
  info: $blue.base
  warning: $amber.base
  error: $red.base
  success: $green.base
}
@import "../../node_modules/vuetify/src/stylus/main"

.layout-background
  background: $grey.lighten-2

.list-bg
  background: white

.subscribe-btn
  position fixed
  bottom 15px
  right 15px
</style>
