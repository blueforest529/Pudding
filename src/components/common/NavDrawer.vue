<template>
    <div>
        <v-navigation-drawer
        v-model="drawer"
        app
        >
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        PUDDING
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            
            <v-list class="red_list">
                <v-list-item-group
                    v-model="model"
                >
                    <v-list-item
                        v-for="(m, index) in menus"
                        :key="index"
                        link
                        :to="{path:m.to}"
                    >
                        <v-list-item-icon>
                        <v-icon>{{ m.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                        <v-list-item-title>{{ m.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            
            <template v-slot:append>
                <div class="pa-2">
                    hello
                </div>
            </template>
        </v-navigation-drawer>

    </div>
</template>

<script>
  export default {
    data: () => ({ 
        drawer: null,
        menus: [
            {
                icon: 'mdi-view-dashboard',
                text: '기본정보',
                to: '/'
            },
            {
                icon: 'mdi-cards-heart',
                text: '최근 업데이트',
                to: '/recentupdate'
            },
            {
                icon: 'mdi-needle',
                text: '리소스 확인',
                to: '/checkresources'
            },
            {
                icon: 'mdi-file-chart',
                text: '번역요청',
                to: '/translationrequest'
            },
            {
                icon: 'mdi-alien-outline',
                text: '리소스 작성 가이드',
                to: '/rulesofuse'
            },
        ],
        model: [{to: '/'}],
    }),
    methods: {
    }
  }
</script>

<style>
.lsls {
    color:lime;
}

.red_list .v-list-item-group .v-list-item--active{
  background-color: #EF6C00;
  color: white;
}
</style>
