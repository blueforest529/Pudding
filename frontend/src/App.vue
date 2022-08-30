<template>
  <v-app>
    <div>
      <v-main>
        <nav-drawer></nav-drawer>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </div>
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
