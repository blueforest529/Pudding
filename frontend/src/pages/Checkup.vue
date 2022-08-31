<template>
    <v-card class="control-wrap">
        <config-form ref="checkupConfig" :product="product" @update="checkupStart" />

        <v-card-title> 점검하기</v-card-title>
        <v-divider inset></v-divider>
        <v-card-text class="text-wrap my-5">
            <v-row class="mb-3">
                <!-- prettier-ignore -->
                <v-col cols="2" class="py-0">
                <v-progress-circular :size="150" :width="6" color="lime" class="ma-0" :value="progress">
                    <span class="headline"> 
                        <span class="display-1"> {{ checkIdx }} </span>/ {{ checkList.length }} 
                    </span>
                </v-progress-circular>
                </v-col>

                <v-col cols="10" style="position: relative;">
                    <div v-if="(checkIdx === 0 || checkIdx === checkList.length) && checkupProgress === false">
                        <span class="title" v-if="!checkupComplete"> 점검을 시작합니다. </span>
                        <span class="title" v-else>점검이 완료되었습니다. <br />점검 결과를 확인하세요.</span>
                        <span class="caption lime--text pl-1">{{ checkupMessage }}</span>
                    </div>
                    <div v-else>
                        <span class="title">{{ checkIdx + 1 }}. {{ checkList[checkIdx].title }}</span> <br />
                        <span class="overline lime--text pl-1"> {{ checkupMessage }} </span> <br />
                        <span class="overline lime--text pl-1"> {{ checkupMessageDetail }} </span>
                    </div>
                </v-col>
                <v-col class="col-md-12 mt-1">
                    <v-btn block  class="blue darken-2" :loading="checkupProgress" :disabled="checkupProgress" @click="configDialog"> 
                        <v-icon>mdi-arrow-right-drop-circle-outline</v-icon> 점검하기
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row class="mt-5">
                <v-col class="col-md-12">
                    <v-stepper light v-model="cubestep" :vertical="true" class="checkup-stepper-wrap">
                        <!-- prettier-ignore -->
                        <v-stepper-step @click="cubestepTitleClicked(0)" class="orange darken-1 subtitle-2  font-weight-bold" :step="0" :complete="cubestep > 0">
                        전체 점검 항목 {{ checkList.length }} 건
                        </v-stepper-step>
                        
                        <v-stepper-content :step="0"></v-stepper-content>

                        <template v-for="(item, index) in checkList">
                        <!-- prettier-ignore -->
                            <v-stepper-step
                                :key="index"
                                @click="cubestepTitleClicked(index + 1)"
                                class="checkup-stepper"
                                :step="index + 1"
                                :complete="cubestep > index"
                                :rules="[() => item.result === 1]"
                            >

                                <v-row align="center" class="ml-1 mb-1">
                                    <span class="subtitle-1 font-weight-black">{{ index + 1 }}.{{ item.title }}</span>
                                    <span class="pl-2 text-center" v-if="item.isComplete">
                                        <v-chip label small v-if="item.result === 2" color="warning" text-color="white">경고</v-chip>
                                        <v-chip label small v-else-if="item.result === 0" color="red" text-color="white">위험</v-chip>
                                    </span>
                                </v-row>

                                <small class="text-body-2 ml-1" v-for="(text, idx) in item.desc" :key="idx">{{ text }}</small>
                            </v-stepper-step>

                            <v-stepper-content :key="item.name" :step="index + 1" v-if="!checkupProgress">
                                <v-card v-if="product.isChecked" class="contents mt-3 mb-3">
                                    <component :is="item.name" v-bind:product="product"  :ref="item.name"></component>
                                    <v-card-actions class="prev-next-wrap">
                                        <v-row>
                                        <v-col cols="6" class="text-left pa-0">
                                            <v-btn dark small tile @click="prev(index)" v-show="index != 0" class="prev-btn theme--dark">
                                            ▲ 이전
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="6" class="text-right pa-0">
                                            <v-btn dark small tile @click="next(index)" class="next-btn theme--dark">
                                            다음 ▼
                                            </v-btn>
                                        </v-col>
                                        </v-row>
                                    </v-card-actions>
                                </v-card>
                            </v-stepper-content>
                            <v-stepper-content :key="item.name" :step="index + 1" v-else></v-stepper-content>
                        </template>

                        <!-- prettier-ignore -->
                        <v-stepper-step
                        v-if="product.isChecked"
                        @click="cubestepTitleClicked(checkList.length + 1)"
                        class="green darken-1 subtitle-2  font-weight-bold"
                        :step="checkList.length + 1"
                        :complete="cubestep > 0"
                        >
                        점검결과
                        </v-stepper-step>

                        <v-stepper-content :step="checkList.length + 1" class="summary-wrap" v-if="product.isChecked">
                            <Summary :product="product" />
                        </v-stepper-content>

                    </v-stepper>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import fp from 'lodash/fp';
import {validateCode, getCompleteCode} from '../service/checkCode'
import checkList from '../service/checkList';
import CheckupService from '../service/checkupService';

import Summary from '../components/checkup/Summary';
import ServicePort from '../components/checkup/ServicePort';
import Bonding from '../components/checkup/Bonding';

import AccessControl from '../components/checkup/AccessControl';
import NetworkFilter from '../components/checkup/NetworkFilter';
import SMPAffinity from '../components/checkup/SMPAffinity';

import DB from '../components/checkup/DB';
import Disk from '../components/checkup/Disk';
import Maclog from '../components/checkup/Maclog';
import Process from '../components/checkup/Process';

import NetworkConf from '../components/checkup/NetworkConf';
import PLS from '../components/checkup/PLS';
import IntrusionLogAnalyzer from '../components/checkup/IntrusionLogAnalyzer';

import checkupConfig from '../components/checkup/CheckupConfig.vue';

export default {
    components: {
        'service-port': ServicePort,
        Bonding,
        AccessControl,
        NetworkFilter,
        SMPAffinity,
        Summary,
        DB,
        Disk,
        Maclog,
        Process,
        NetworkConf,
        'pls': PLS,
        'intrusionlog-analyzer': IntrusionLogAnalyzer,
        'config-form': checkupConfig
    },
     created() {
        this.init();
        this.orgCheckList = this.checkList;
        this.product = this.$store.state.product.data;
        this.defaultInfo = this.$store.state.auth.defaultInfo;
        this.getLocalGmt();
    },
    updated() {
        
    },
    data: () => ({ 
        cubestep: 0,
        checkList,
        orgCheckList:[],
        checkIdx: 0,
        checkupEditable: false,
        checkupProgress: false,
        checkupMessage: '',
        checkupItem: {},
        version: '',
        interval: null,
        checkupComplete: false,
        checkupMessageDetail: '',
        product:[],
        defaultInfo:{}
    }),
    computed: {
        progress() {
        return (this.checkIdx / this.checkList.length) * 100;
        },
  },
    methods: {
        init() {
            const desc = fp.reduce((acc, value) => {
                acc[value.name] = value.desc;
                return acc;
            }, {})(this.checkList);

            localStorage.setItem('desc', JSON.stringify(desc));
        },
        async configDialog() {
            try {
                const sphere_id = await this.$axios.get(`/webapi/info/sphere`).then(res=> res.data.id);
                this.$refs.checkupConfig.showDialog();
           } catch(e) {
                alert('세션이 만료 되었습니다.');
                this.$store.commit("isAuth",401);                    
            }  
        },
        checkupStart() {
            this.product = {
                webconsole : {
                    result : 0
                },
                wpconsole : {
                    result : 0
                },
                network : {
                    result : 0
                },
                system : {
                    result : 0
                }
            };
            
            this.$store.commit("updateProduct", this.product);

            this.checkupMessage = '';
            this.checkupMessageDetail = '';
            this.checkIdx = 0;
            this.checkupComplete = false;
            this.checkup();
        },
        checkup() {
            const ck_items = this.$store.state.auth.checkOptions.ck_items;
            const checkup_temp = [];
            this.checkList = this.orgCheckList;

            if (ck_items.length > 0) {
                this.checkList.forEach((v, k) => {
                    if(Object.values(ck_items).includes(v.name)) {
                        checkup_temp.push(v);
                    }
                });
                this.checkList = checkup_temp;
            }

            if (this.checkIdx < this.checkList.length) {
                this.checkupProgress = true;
                this.checkupEditable = false;

                setTimeout(
                    this.checkupService,
                    1000,
                );
            } else {
                this.checkupProgress = false;
                this.checkupEditable = true;
                this.completeCode();
                this.cubestepTitleClicked(1);
            }
        },
        checkupService() {
            let funcs = [];
            let item = this.checkList[this.checkIdx];

            const service = new CheckupService();
            if (funcs.length === 0) funcs = Object.getOwnPropertyNames(CheckupService.prototype);

            const promises = item.funcs.map(func => service[func]());
            const getResult = data =>
                    fp.pipe(fp.values, fp.map('result'), items => (fp.some(item => item === 0)(items) ? 0 : fp.max(items)))(data);
            
            Promise.all(promises)
                .then(res => item.keys.reduce((acc, key, idx) => fp.assign({ [key]: res[idx] }, acc), {}))
                .then(res => (!fp.has(res, 'result') ? { ...res, result: getResult(res) } : res))
                .then(res => this.checkupEnd({ status: 200, result: res.result, data: { ...res } }))
                .catch(e => {
                    this.checkupEnd({ status: 500, result: 0, data: { message: e.message } });
                });
        },
        checkupEnd(res) {          
            this.checkupItem = { ...this.checkList[this.checkIdx], isComplete: true, result: res.result };
            
            Object.assign(this.checkList[this.checkIdx], this.checkupItem);
            
            if (res.status && this.checkupProgress) {
                const { category, subCategory = '' } = this.checkList[this.checkIdx];
                
                this.product[category] = !fp.isEmpty(subCategory)
                ? { ...this.product[category], [subCategory]: { ...res.data } } 
                : { ...this.product[category], ...res.data } ;
                
                this.product[category].result =
                res.result === 0
                    ? 0
                    : fp.pipe(
                        fp.map(data => data.result),
                        fp.max,
                    )(this.product[category]);
                
                this.checkupMessage = '';
                this.checkupMessageDetail = '';
                this.cubestep += 1;
                this.checkIdx += 1;

                this.$store.commit("updateProduct", this.product);
                this.checkup();
            } else {
                this.checkupProgress = false;
                this.checkupEditable = true;
                
            }
        },
        completeCode() {
            const { contractNumber, sphere_id, code } = this.defaultInfo;
            
            // 점검코드 유효성 검사
            const validCode = validateCode(sphere_id, code, contractNumber);
            if (validCode.valid) {
                this.defaultInfo = {...this.defaultInfo, isValidatedCode:true};
                this.$store.commit('defaultInfo', this.defaultInfo);
            }

            //점검 완료코드
            const completeCode = getCompleteCode({sphere_id, contractNumber});

            this.product = {...this.product, isChecked: true, completeCode: completeCode.code};
            this.$store.commit('updateProduct', this.product);

            this.checkupComplete = true;
        },
        cubestepTitleClicked(stepIndex) {
            if(!this.checkupComplete) {
                return false;
            }

            this.cubestep = stepIndex;
        },
        next(index) {
            const offset = this.getOffest(index);

            window.scrollTo(0, offset);
            this.cubestep = index + 2;
        },
        prev(index) {
            const idx = index <= 1 ? 0 : index - 2;
            const offset = this.getOffest(idx);

            window.scrollTo(0, offset);
            this.cubestep = index;
        },
        getOffest(index) {
            const { name } = this.checkList[index];
            const ele = this.$refs[name][0].$el;
            const eleRect = ele.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();
            return eleRect.top - bodyRect.top - 60;
        },
        getLocalGmt() {
            var user_local_gmt = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
            var regex = /(\+|\-)[0-9]?\d{4}/;
            user_local_gmt = regex.exec(user_local_gmt)[0];
            user_local_gmt = user_local_gmt.substr(0, 3) + ":" + user_local_gmt.substr(3);

            localStorage.setItem('user_local_gmt', user_local_gmt);
        }
    }
}
</script>
<style>
.control-wrap .btn-wrap {
    position: absolute;
    bottom: 0;
    right: 4px;
}

.checkup-control {
  padding: 1px;
  border-radius: 10px;
  border: 3px dashed dimgray;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  max-height: 150px;
}

.checkup-stepper-wrap {
  padding: 10px;
  border-radius: 5px;
}
.v-stepper--vertical .v-stepper__step {
    padding: 24px 24px 16px;
    cursor: pointer;
}

.contents.v-sheet.v-card:not(.v-sheet--outlined) {
    box-shadow: none;
}

.checkup-stepper-wrap .v-stepper__content {
  margin: -8px 0px -18px 12px !important;
  padding: 12px 15px 20px 10px;
}

.checkup-stepper-header {
  padding: 10px;
  border: 1px dashed darkorange;
  background-color: darkorange;
}

.checkup-stepper {
  border: 1px solid gainsboro;
  border-radius: 3px;
  -webkit-box-shadow: 0 3px 6px -6px black;
  -moz-box-shadow: 0 3px 6px -6px black;
  box-shadow: 0 3px 6px -6px black;
  background-color: whitesmoke;
  padding: 10px;
  position: relative;
}

/* .checkup-stepper > span {
  height: 25px !important;
  min-width: 25px !important;
  width: 25px !important;
} */

.prev-next-wrap {
  padding: 20px 30px 20px 30px !important;
}

.checkup-stepper .v-stepper__label {
  width: 100%;
}

.checkup-stepper-wrap .contents-wrap {
  white-space: pre;
}

/* .checkup-stepper-footer {
  padding: 10px;
  border: 1px dashed darkorange;
  background-color: orange;
} */

.cube-item-body {
  background-color: beige;
  border-radius: 5px;
  padding: 5px;
}


.control-wrap .btn-wrap {
  position: absolute;
  bottom: 0;
  right: 4px;
}

.btn-stop {
  background-color: #c16a00 !important;
}
</style>