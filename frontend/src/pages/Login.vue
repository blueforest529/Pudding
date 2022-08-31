<template>
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md6>
                  <v-card
                    class="mx-auto"
                    >
                    <v-toolbar dark color="indigo">
                        <v-toolbar-title>WAPPLES 정기점검 툴
                        </v-toolbar-title>
                        <v-progress-linear
                            :active="loading"
                            :indeterminate="loading"
                            absolute
                            bottom
                            color="indigo lighten-5"
                        ></v-progress-linear>
                        </v-toolbar>
                    <v-list-item>
                        <v-list-item-avatar
                        tile
                        size="350"
                        color="#2A2D32"
                        rounded
                        >
                        <img src="../assets/img/left-bg.png" style="display:none;" />
                        <v-img :src="bgImg"></v-img>
                        </v-list-item-avatar>
                        
                        <v-list-item-content class="ml-5">
                            <v-alert
                            dense
                            :value="alert.status" 
                            type="error">
                                {{alert.msg}}
                            </v-alert>
                            <v-form ref="loginForm">
                                <v-text-field
                                prepend-icon="mdi-account"
                                name="userId"
                                v-model="userId"
                                label="아이디"
                                type="text"
                                :rules="idRules"
                                required
                                ></v-text-field>
                                <v-text-field
                                prepend-icon="mdi-lock"
                                name="userPwd"
                                v-model="userPwd"
                                label="비밀번호"
                                type="password"
                                :rules="passwordRules"
                                required
                                ></v-text-field>
                                <v-text-field
                                prepend-icon="mdi-file-sign"
                                name="contractNumber"
                                v-model="contractNumber"
                                label="납품 계약번호"
                                type="text"
                                :rules="contractRules"
                                required
                            ></v-text-field>
                                <v-text-field
                                prepend-icon="mdi-code-string"
                                name="code"
                                v-model="code"
                                label="정기점검 코드"
                                counter = "10"
                                type="text"
                                :rules="codeRules"
                                required
                            ></v-text-field>
                                
                            </v-form>
                            
                            <v-btn color="indigo" @click="loginSubmit"> 로그인 </v-btn>
                        </v-list-item-content>
                    </v-list-item>
                    </v-card>
               </v-flex>
            </v-layout>
         </v-container>

</template>

<script>
import {validateCode} from '../service/checkCode'
import querystring from 'querystring';

export default {
    name: 'Login',
    props: {
    },
    created() {
        if (this.isDev) {
            this.bgImg='/src/assets/img/left-bg.png';
            this.userId='admin1';
            this.userPwd='bugzero..1';
            this.contractNumber='P2019032412311';
            this.code='0945885e24';
        }
        
    },
    data: ()=>({
        userId: '',
        userPwd: '',
        contractNumber: '',
        code: '',
        alert: {
            status: false,
            msg: ''
        },
        loading: false,
        bgImg:'./assets/img/left-bg.png',
        idRules: [
            v => !!v || '아이디를 입력하세요'
        ],
        passwordRules: [
            v => !!v || '비밀번호를 입력하세요'
        ],
        contractRules: [
            v => !!v || '납품 계약번호를 입력하세요'
        ],
        codeRules: [
            v => !!v || '점검 코드를 입력해주세요.',
            v => (v && v.length === 10 && /[a-z0-9]/g.test(v)) || '점검 코드를 확인해주세요.',
        ],
    }),
    methods: {
        async loginSubmit() {
           if (this.$refs.loginForm.validate()) {
               this.loading = true;
                try {
                    // 로그인(return doc_id)
                    const formData = querystring.stringify({id:this.userId,password:this.userPwd});
                    const doc_id = await this.$axios.post(`/webapi/auth`, formData, {headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res => res.data.doc_id);

                    // 관리자 여부 확인
                    const adm_check = await this.$axios.get(`/webapi/conf/groups`).then(res=> res.data.filter(function(data) {
                        return data.groupname == 'administrators'
                    }).map(member => {return member.members})[0].includes(doc_id));

                    if (!adm_check) {
                        this.alertFnc('접근 권한이 없습니다.');
                        return false;
                    }

                    // 장비 ID가져오기
                    const sphere_id = await this.$axios.get(`/webapi/info/sphere`).then(res=> res.data.id);
                    let codeObj = validateCode(sphere_id, this.code, this.contractNumber);
                    if (codeObj.valid) {// 코드검증
                        const versions = await this.$axios.get(`/webapi/info/version`).then(res => res.data);
                        const defaultInfo = {
                            sphere_id: sphere_id,
                            code: this.code,
                            contractNumber: this.contractNumber,
                            versions: versions
                        };
                        this.$store.commit("defaultInfo",defaultInfo);
                        this.$store.commit("login", {auth:true});
                        
                        window.location.replace(this.rootPath);

                        console.log('login success')
                    } else {
                        console.log('code validation fail');
                        this.alertFnc(codeObj.msg);
                    }
                } catch(e) {
                    console.log(e.message);
                    this.alertFnc('인증에 실패하였습니다.');
                    
                }               
            } 
        },
        alertFnc(msg){
            this.loading = false;
            this.alert.status = true;
            this.alert.msg = msg;
            setTimeout(() => {
                this.alert.status = false;
            }, 3000);

        }
    }
};
</script>

<style>
.theme--dark.v-application, .theme--dark.v-card {
    background-color: #2A2D32;
}
</style>
