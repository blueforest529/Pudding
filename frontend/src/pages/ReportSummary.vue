<template>
    <v-layout v-bind:class="['report-wrap', 'page']" ref="pdfarea">
        <v-btn
            class="download-btn"
            elevation="2"
            @click="savePdf"
            :loading="loading"
        >
            <v-icon left>
                mdi-file-download
            </v-icon>
            Save as PDF
        </v-btn>

        <page-header/>
        <section class="basic-info">
            <h4>1. 기본 정보</h4>
            <v-container fluid class="mt-1">
                <v-row>
                    <v-col cols="2">
                        <span> WAPPLES 버전 : </span>
                    </v-col>
                    <v-col cols="3">
                        <span> {{ defaultInfo.versions.wapples }} </span>
                    </v-col>
                    <v-col cols="2">
                        <span> 점검자 회사명 : </span>
                    </v-col>
                    <v-col cols="5">
                        <span> {{ checkOptions.basic.company }} </span>
                    </v-col>

                    <v-col cols="2">
                        <span> KERNEL 버전 : </span>
                    </v-col>
                    <v-col cols="3">
                        <span> {{ defaultInfo.versions.kernel }} </span>
                    </v-col>
                    <v-col cols="2">
                        <span> 점검자 사이트 : </span>
                    </v-col>
                    <v-col cols="5">
                        <span> {{ checkOptions.basic.site }} </span>
                    </v-col>
                    
                    <v-col cols="2">
                        <span> WAPPLES ID : </span>
                    </v-col>
                    <v-col cols="3">
                        <span> {{ defaultInfo.sphere_id }} </span>
                    </v-col>
                    <v-col cols="2">
                        <span> 확인자 : </span>
                    </v-col>
                    <v-col cols="4">
                        <span> {{ checkOptions.basic.customer }} </span>
                    </v-col>
                    <v-col cols="1"> <span class="caption">(서명)</span></v-col>

                     <v-col cols="2">
                        <span> CORE : </span>
                    </v-col>
                    <v-col cols="3">
                        <span> {{ defaultInfo.versions.core }} </span>
                    </v-col>
                    <v-col cols="2">
                        <span> 점검자 : </span>
                    </v-col>
                    <v-col cols="4">
                        <span> {{ checkOptions.basic.engineer }} </span>
                    </v-col>
                    <v-col cols="1"> <span class="caption">(서명)</span></v-col>
                </v-row>
            </v-container>
        </section>

        <section class="info-result">
            <h4>2. 정기점검 결과</h4>
            <v-container fluid class="">
                <table class="table">
                    <thead>
                        <tr>
                            <th width="150">항목</th>
                            <th>세부 내용</th>
                            <th width="150">결과</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-if="desc.hasOwnProperty('service-port') || desc.hasOwnProperty('bonding')">
                            <td>서비스 포트</td>
                            <td class="text-left">
                                <span v-if="desc.hasOwnProperty('service-port')">
                                    서비스 포트 : {{ servicePortText(servicePort.config.value) }}<br>
                                    Rx, Tx Drop 발생 : {{ servicePortDrop(servicePort.status.values) }} <br>
                                </span>
                                <span v-if="desc.hasOwnProperty('bonding')">
                                    Bonding 상태 : {{ bondingStatusText() }}<br>
                                </span>
                            </td>
                            <td>
                                <span v-if="result_flag.item1">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item1">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('network-filter') || desc.hasOwnProperty('network-conf') || desc.hasOwnProperty('access-control')">
                            <td>네트워크 필터</td>
                            <td class="text-left">
                                <span v-if="desc.hasOwnProperty('network-conf')">
                                    탐지 필터 : http {{ webserverCnt }}개, https {{ webserverSslCnt }}개 <br>
                                </span>
                                <span v-if="desc.hasOwnProperty('network-filter')">
                                    세션 필터 : {{ sessionFilter.values.length }} 개 <br>
                                </span>
                                <span v-if="desc.hasOwnProperty('access-control')">
                                    접근 제어 필터  : {{ (!accessControl ? 0 : accessControl.values.length-1) }} 개 <br>
                                </span>
                            </td>
                            <td>
                                <span v-if="result_flag.item2">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item2">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('SMP-Affinity')">
                            <td>CPU 활용</td>
                            <td class="text-left">
                                <span>{{ smpAffinityText() }}</span>
                            </td>
                            <td>
                                <span v-if="result_flag.item3">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item3">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('DB')">
                            <td>DB</td>
                            <td class="text-left">
                                <span>DB Transaction이 총 {{ getDbTransactionCount() }}건 입니다.<br>
                                {{ dbSizeText() }}</span>
                            </td>
                            <td>
                                <span v-if="result_flag.item4">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item4">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('disk')">
                            <td>디스크</td>
                            <td class="text-left">
                                <span>Disk 사용량 : {{ getDiskUsage() }} %</span>
                            </td>
                            <td>
                                <span v-if="result_flag.item5">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item5">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        
                        <tr v-if="desc.hasOwnProperty('intrusionlog-analyzer')">
                            <td>탐지 현황</td>
                            <td class="text-left">
                                <span>탐지 로그건수 : <strong>{{ intrusionlogCount()  }}</strong>건 ({{ ruleCountPeriodFrom }} ~ {{ ruleCountPeriodTo }}) </span><br><br>
                                <h4>Top5 룰별 탐지 </h4>
                                <div v-if="ruleByTop.length == 0"><span>탐지된 내용이 없습니다.</span></div>
                                <div v-for="(v, idx) in ruleByTop" :key="idx" ><span>{{v[0]}} : {{v[1]}} 건</span></div>
                            </td>
                            <td>
                                <span v-if="result_flag.item6">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item6">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('log-analyzer')">
                            <td>시스템 로그</td>
                            <td class="text-left">
                                <span>
                                코어덤프 : {{ coreDump }}개 <br>
                                Pls 동기화 상태 : {{ pls }} <br>
                                S/W바이패스 : {{ sw_bypass }} <br>
                                HA 상태 : {{ ha }} <br>
                                </span>
                            </td>
                            <td>
                                <span v-if="result_flag.item7">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item7">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('maclog')">
                            <td>MAC</td>
                            <td class="text-left">
                                <span>MAC Table: {{ macTableCnt() }} 개</span>
                            </td>
                            <td>
                                <span v-if="result_flag.item8">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item8">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                        <tr v-if="desc.hasOwnProperty('process')">
                            <td>프로세스</td>
                            <td class="text-left">
                                Sphered 데몬: {{ processInfo('sphered') }}<br>
                                탐지 엔진: {{ processInfo('wapples') }}<br>
                                DB 프로세스: {{ processInfo('db') }}<br>
                                관리도구 웹 데몬: {{ processInfo('db') }}<br>
                                시스템 데몬: {{ processInfo('db') }}<br>
                            </td>
                            <td>
                                <span v-if="result_flag.item9">
                                    <v-icon color="green" size="18" >mdi-check-circle</v-icon> 정상
                                </span>
                                <span v-if="!result_flag.item9">
                                    <v-icon color="warning" size="18">mdi-alert</v-icon> 확인필요
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </v-container>
        </section>

        <section>
            <h4>점검자 종합 의견
                <small>(점검 완료 코드 : {{ product.completeCode }})</small>
            </h4>
            <v-container>
                <v-row class="mt-1">
                    <v-col cols="12">
                        <v-textarea
                            class="caption"
                            dense
                            :light="true"
                            outlined
                            auto-grow
                            readonly
                            v-model="product.engineerOpinion"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </section>
        <page-footer></page-footer>
    </v-layout>
</template>
<script>
import PageHeader from '../components/report/PageHeader';
import PageFooter from '../components/report/PageFooter';
import fp from 'lodash/fp';
import html2pdf from 'html2pdf.js'

export default {
  props: {
  },
  data: () => ({
    product: {},
    desc: {},
    img_path: '',
    result_flag: {
        item1: true,
        item2: true,
        item3: true,
        item4: true,
        item5: true,
        item6: true,
        item7: true,
        item8: true,
        item9: true
    },
    dbSize: {},
    ruleCountByRule:{},
    ruleCountPeriodFrom: '',
    ruleCountPeriodTo: '',
    ruleByTop:{},
    coreDump: 0,
    sw_bypass: '',
    ha: '',
    pls: '',
    webserverCnt : 0,
    webserverSslCnt : 0,
    loading:false
  }),
  created() {
    this.$vuetify.theme.isDark = false

    this.defaultInfo = this.$store.state.auth.defaultInfo;
    this.checkOptions = this.$store.state.auth.checkOptions;

    this.product = JSON.parse(localStorage.getItem('product'));
    this.desc = JSON.parse(localStorage.getItem('desc'));

    if (this.checkOptions.ck_items.length > 0) {
      for (let key in this.desc) {
        if (!(this.checkOptions.ck_items).includes(key)) delete this.desc[key];
      }
    }

    let wpconsole = this.product.wpconsole;
    let system = this.product.system;

    if (wpconsole.hasOwnProperty('ruleCount')) {

        this.ruleCountByRule        = this.defaultInfo.versions.wapples.startsWith('4.0.36') ? this.product.wpconsole.ruleCountDayByRuleID.values : this.product.wpconsole.ruleCount.values.byRule;
        this.ruleCountPeriodFrom    = this.product.wpconsole.ruleCount.values.dtFrom;
        this.ruleCountPeriodTo      = this.product.wpconsole.ruleCount.values.dtTo;
        this.ruleByTop5();
    }
    
    if (wpconsole.hasOwnProperty('networkConf') && this.desc.hasOwnProperty('network-conf')) {
        this.getWebserverCount();
    }
    if (system.hasOwnProperty('coredumpStatistics')) {
        this.getCoreDumpCount();
    }
    if (system.hasOwnProperty('swbypass') || system.hasOwnProperty('ha') || system.hasOwnProperty('plsStatus')) {
        this.setSystemInfo();
    }
  },
  components: {
    'page-header': PageHeader,
    'page-footer': PageFooter
  },
  computed: {
    servicePort: vm => vm.product.network.servicePort,
    bonding: vm => vm.product.network.bonding,
    sessionFilter: vm => {
        const { sessionFilter } = vm.product.network.filter;
        sessionFilter.values = sessionFilter.values.filter(value => value !== '') || [];
        return sessionFilter;
    },
    accessControl: vm => vm.product.network.accessControl,
    smpAffinity: vm => vm.product.network.smpAffinity,
    db: vm => vm.product.system.db,
    db_transaction: vm =>
      vm.product.system.db.transactionCount.values.length > 0
        ? this.fp.pipe(
            this.fp.first,
            Object.keys,
            keys => keys.sort((s1, s2) => s2.localeCompare(s1)), // descending
          )(vm.product.system.db.transactionCount)
        : ['datname', 'age'],
    diskUsage: vm => vm.product.system.disk.usage,
    diskStatus: vm => vm.product.system.disk.state.status,
    hdd: vm => {
      return (vm.product.system.diagnosis.values.find(d => d.key === 'hdd') || { items: [] }).items;
    },
  },
  methods:{
        servicePortText(v) {
            
            const sp_list = [];
            const list = v.split('\n');
            list.forEach(function(p){
                const tmp = [p.split(/[ ]+/)[0], p.split(/^[a-zA-Z0-9]+[ ]{1,2}/)[1]];
                sp_list.push(tmp);
            })
            sp_list.shift();
            const sp_obj = sp_list.reduce((acc, cur) => {
                const [k, v] = cur;
                acc[k] = [...(acc[k] || []), v];
                return acc;
            }, {});
            return JSON.stringify(sp_obj).replace(/\"|:|{|}+/gi, '');
        },
        servicePortDrop(p) {
            const vm = this;
            let str = '';
            p.forEach(function(v){
                if (Number(v.rx_drop_avg) > 0 || Number(v.rx_err_avg) > 0 || Number(v.tx_drop_avg) > 0 || Number(v.tx_err_avg) > 0) {
                vm.result_flag.item1 = false;
                str = str.concat(', ',v.dev_name)
                }
            })
            return str == '' ? 'NONE' : str;
        },
        bondingStatusText() {
            if (this.bonding.status === 'stop') {
                return 'Bonding 설정이 꺼져있습니다.';
            }
            if (this.bonding.status === 'start' && this.bonding.result == 1) {
                return 'Bonding 설정이 정상 동작중입니다.';
            }
            let arr = [];
            if (this.bonding.status === 'start' && this.bonding.result == 2) {
                this.bonding.values.forEach((bonding, idx) => {
                    if (!bonding.isDetected) {
                        arr.push(bonding.name);
                    }
                });
            }
            let str = arr.join(', ');
            this.result_flag.item1 = false;
            return str + '가 비활성화 상태입니다. 확인해주세요.';
        },
        smpAffinityText() {
            if (this.smpAffinity.result === 1 && this.smpAffinity.enable === 0) {
                this.result_flag.item3 = true;
                return 'SMP-Afiinity를 지원하지 않는 장비입니다.';
            } else if(this.smpAffinity.result === 1) {
                return 'SMP-Afiinity가 정상 동작중 입니다.';
            } else if(this.smpAffinity.result === 2) {
                this.result_flag.item3 = true;
                return 'SMP-Afiinity가 설정되지 않았습니다.';
            } else {
                this.result_flag.item3 = false;
                return 'SMP-Afiinity를 확인해주세요.';
            }
        },
        dbSizeText() {
            if (this.db.result) {
                return 'DB 정상 동작 중 입니다.';
            } else if (!this.db.connectionCount.result){
                this.result_flag.item4 = false;
                return 'Connection count를 확인해주세요.';
            } else if (!this.db.processCountAndTrak.result) {
                this.result_flag.item4 = false;
                return '프로세스 카운트 및 Transaction size를 확인해주세요.';
            } else if(!this.db.transactionCount.result) {
                this.result_flag.item4 = false;
                return 'Transaction size를 확인해주세요.';
            }
        },
        getDbTransactionCount() {
            let cnt = 0;
            this.db_transaction.forEach((key,idx) => {
                cnt += this.db.transactionCount[idx] ? this.db.transactionCount[idx][key] : 0 ;
            });
            return cnt;
        },
        getDiskUsage() {
            let str = this.diskUsage.values[0] || '';
            str = str.replace(/[^0-9\\.]+/gi, '');
            if (str >= 80) {
                this.result_flag.item5 = false;
            }
            // Disk 상태
            if (this.diskStatus.result === 0) {
                this.result_flag.item5 = false;                 
            }

            return str;
        },
        intrusionlogCount() {
            let cnt = 0;
            if (this.ruleCountByRule.length > 0) {
                this.ruleCountByRule.forEach(item => {
                    if (this.defaultInfo.versions.wapples.startsWith('4.0.36')) {
                        cnt += Number(item.rule_count);
                    } else {
                        cnt += Number(item.count);
                    }
                });
            }
            return cnt;
        },
        ruleByTop5() {
            try {
                const items = [];
                this.ruleCountByRule.forEach(item => {
                    if (this.defaultInfo.versions.wapples.startsWith('4.0.36')) {
                        if (!items[item.name]) {
                            items[item.name] = 0;
                        }
                
                        items[item.name] += parseInt(item.rule_count, 10);
                    } else {
                        if (!items[item.rule_name]) {
                            items[item.rule_name] = 0;
                        }

                        items[item.rule_name] += parseInt(item.count, 10);
                    }
                });

                const sorted = _(items)
                .toPairs()
                .orderBy([1], ['desc'])
                .fromPairs()
                .value();

                this.ruleByTop = Object.entries(sorted).slice(0,5);

            } catch (ex) {
                console.log(`updateRuleCountByRule exception `, ex);
            }
        },
        getCoreDumpCount() {
            let cnt = 0;
            if (this.product.system.coredumpStatistics.values.length > 0) {
                this.product.system.coredumpStatistics.values.forEach(item =>{
                    cnt += item.files.length;
                })
            }
            this.coreDump = cnt;
        },
        setSystemInfo() {
            // sw bypass
            if (this.product.system.swbypass) {
                this.sw_bypass = this.product.system.swbypass ? '활성' : '비활성';
            } else {
                this.sw_bypass = '해당없음'
            }

            // HA
            if (this.product.system.ha) {
                this.ha = this.product.system.ha ? '활성' : '비활성';
            } else {
                this.ha = '해당없음'
            }

            // pls
            if (this.product.wpconsole.plsStatus.result) {
                this.pls = this.product.wpconsole.plsStatus.values.status.data.enable ? '활성' : '비활성';
            } else {
                this.pls = '해당없음'
            }
        },
        getWebserverCount() {

            if (this.defaultInfo.versions.wapples.startsWith('4.0.36')) {
                this.product.wpconsole.networkConf.values.data.rows.forEach(item => {
                   if (item.ssl) {
                        this.webserverSslCnt += 1;
                    } else {
                        this.webserverCnt += 1;
                    }
                });
            }

            if (this.defaultInfo.versions.wapples.startsWith('5.0.12') || this.defaultInfo.versions.wapples.startsWith('6.0')) {
                this.product.wpconsole.networkConf.values.data.webserver.forEach(item => {
                    if (item.ssl) {
                        this.webserverSslCnt += 1;
                    } else {
                        this.webserverCnt += 1;
                    }
                });
            }
        },
        macTableCnt() {
            let table_arr = [];
            let cnt = 0;

            if (this.product.system.mactable.values.length == undefined) {
                return cnt;
            }
  
            if (this.defaultInfo.versions.v_npcore == 3) {
                table_arr = this.product.system.mactable.values.split('\n');
            } else {
                const mac_str = this.product.system.mactable.values.replace(/[\w\s\\:-]+(\( 300\)\-\n)/g, "");
                table_arr =  mac_str.split('\n');
            }
            table_arr.forEach((line, index) => {
                const words = (line.replace(/[\s]+/g, ' ')).split(' ');
                if (words.length > 0 && words[0] != "") {
                    cnt += 1;
                }
            });
            return cnt; 
        },
        processInfo(daemon) {
            let value = fp.filter(p => p.key == daemon)(this.product.system.diagnosis.values);
            if (value.result > 1) {
                this.item9 = false;
                return '경고';
            }
            return '정상';
        },
        savePdf(){
            let vm = this;
            vm.loading = true;
            let date = new Date();
            let file_name = 'summary_report_'+this.defaultInfo.sphere_id+'_'+this.dateFormat('yyyyMMdd',date)+'.pdf';
            
            html2pdf(this.$refs.pdfarea, {
              margin: 0,
              filename: file_name,
              image: {type:"jpeg", quality: 0.98},
              //	allowTaint 옵션추가
              html2canvas: {
                // useCORS: true,
                scrollY: 0,
                scale:2,
                dpi: 1000,
                letterRendering: true,
                allowTaint: false //useCORS를 true로 설정 시 반드시 allowTaint를 false처리 해주어야함
               },
              jsPDF: {orientation: 'portrait', unit: 'in', format: 'a4', compressPDF: true}
            }).then(function() {
                vm.loading = false;
            })

        }
    }
};
</script>
<style>
.download-btn {
    position: fixed;
    top:100px;
    right:5%;
}

.layout {
    margin-left: auto;
    margin-right: auto;
}

.theme--light.v-application {
    background-color: #484C4F;
}

.report-wrap {
  max-width: 210mm !important;
  min-width: 210mm !important;
  color: #000;
  padding: 0px !important;
  
}

.report-wrap.page {
    position: relative;
    min-height: 29cm !important;
    padding: 10mm 10mm 10mm 10mm !important;
    background: #fff;
    border: 1px solid #666;
    display: block;

}

.report-wrap.page .label {
      font-size: 20.8px !important;
      font-weight: 800 !important;
      color: #000 !important;
      margin-bottom: 2.5mm !important;
      margin-top: 2.5mm !important;
}

.report-wrap.page header div {
      width: 100%;
      text-align: right;
}

.report-wrap.page footer {
      position: absolute;
      bottom: 5mm;
      color: #000;
      right: 13mm;
}

.report-wrap.page .smp-affinity-wrap {
      max-width: 716.13px;
      max-height: 795px;
      overflow: hidden;
}

span {
    font-size:13px;
}

.col {
    padding: 0px !important;
}

section {
    overflow: hidden;
    margin-bottom: 6mm;
}
section h3 {
    font-size: 20.8px;
    font-weight: 800;
    color: #000;
    margin-bottom: 2.5mm;
}

section ul {
    display: inline-block;
    margin-right: 10mm;
    list-style: none;
    margin-right: 0px;
}
section ul li {
position: relative;
margin: 0.5mm 0;
}

section li p::before {
    position: absolute;
    content: '';
    display: block;
    width: 3px;
    height: 3px;
    top: 1.5mm;
    left: 0;
    background-color: #808080;
}

li p {
    font-size: 0.9rem;
    font-weight: 300;
    padding: 0 3mm;
    line-height: 1.1rem;
    margin: 0px;
}
li p .value {
font-size: 0.9rem;
font-weight: 900;
color: #000;
}

table {
width: 100%;
border-collapse: collapse;
}
tr {
    border-top: 1px solid #ddd;
}

tr:first-child {
    border-top: 2px solid #b2b2b2;
}

tr:last-child {
    border-bottom: 2px solid #b2b2b2;
}

th {
    font-size: 0.875rem;
    font-weight: 400;
    color: #000;
    text-align: center !important;
}

td {
    font-size: 0.875rem !important;
    padding: 5px 0 5px 0;
}
  
 
tbody tr:hover {
background-color: transparent !important;
}
  

.back-cover {
    text-align: center;
    overflow: hidden;
}

.back-cover .wapples-logo {
    margin-top: 100mm;
    width: 49mm;
}

.back-cover .penta-logo-c {
    margin-top: 60mm;
    width: 43mm;
}

.back-cover .comp-logo {
    margin-top: 45mm;
    width: 50mm;
}

.back-cover .address {
    margin-top: 5mm;
}

@page {
  size: A4;
  margin: 0;
  max-height: 100px;
}

@page {
  margin: 1cm 0.5cm 1cm 0cm;
  @top-center {
      content: element(pageHeader);
  }
  @bottom-center {
      content: element(pageFooter);
  }
}

@media print {
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
</style>
