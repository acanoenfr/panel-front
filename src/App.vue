<template>
  <v-app id="app">
    <v-snackbar
      v-model="$store.getters.snackbar.show"
      top
      :timeout="3000"
      :color="$store.getters.snackbar.color">
        {{ $store.getters.snackbar.text }}
    </v-snackbar>
    <v-navigation-drawer v-if="isLogged" permanent dark app>
      <v-list-item @click="onLogout">
        <v-list-item-icon>
          <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            Panel - Bespin
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ currentUser.name }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="(item, key) in items" :key="key" :to="item.path">
        <v-list-item-icon>
          <v-icon :color="$route.path === item.path ? 'primary' : ''">{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
    <v-container fluid>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      items: [
        { title: 'Serveurs', icon: 'mdi-server', path: '/Home' },
        { title: 'Paramètres', icon: 'mdi-account-cog', path: '/Params' }
      ]
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout')
      this.$store.commit('CALL_MSG', {
        text: 'Vous avez été déconnecté.',
        color: 'orange darken-1',
        show: true
      })
      this.$router.push('/Login')
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.user
    },
    isLogged() {
      return this.$store.getters.isLogged
    },
    isAdmin() {
      return this.$store.getters.isAdmin
    }
  }
}
</script>

<style>
</style>
