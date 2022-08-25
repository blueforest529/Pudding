<template>
  <v-app>
    <nav-drawer ></nav-drawer>

    <v-app-bar app>
      디자인이 고민이고만,,
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import NavDrawer from "./components/common/NavDrawer.vue";

export default {
  name: 'App',
  data: () => ({
    //
  }),
  components: {
        'nav-drawer': NavDrawer
    },
}
</script>
