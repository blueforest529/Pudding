<template>
    <v-container class="report-wrap" fluid grid-list-md id="report-wrap" ref="pdfarea">
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
        <front-cover :product="product" />
        <contents :product="product" :desc="desc"/>
        <back-cover :product="product" />
    </v-container>
</template>

<script>
// const fs = require('fs');

import FrontCover from '../components/report/FrontCover';
import BackCover from '../components/report/BackCover';
import Contents from '../components/report/Contents';
import html2pdf from 'html2pdf.js'

export default {
    components: {
        FrontCover,
        Contents: Contents,
        BackCover,
    },
    created() {
        this.$vuetify.theme.isDark = false
      
        this.ck_items = this.$store.state.auth.checkOptions.ck_items;
        this.defaultInfo = this.$store.state.auth.defaultInfo;
        
        this.product = JSON.parse(localStorage.getItem('product'));
        this.desc = JSON.parse(localStorage.getItem('desc'));
        
        if (this.ck_items.length > 0) {
          for (let key in this.desc) {
            if (!(this.ck_items).includes(key)) delete this.desc[key];
          }
        }
       
    },
    data: () => ({
        product: {},
        desc: {},
        ck_items:{},
        loading: false
    }),
    methods: {
        savePdf(){
            let vm = this;
            vm.loading = true;
            let date = new Date();
            let file_name = 'report_'+this.defaultInfo.sphere_id+'_'+this.dateFormat('yyyyMMdd',date)+'.pdf';

            html2pdf(this.$refs.pdfarea, {
              margin: [0, 0, 0.7, 0],
              filename: file_name,
              image: {type:"jpeg", quality: 0.98},
              //	allowTaint 옵션추가
              html2canvas: {
                // useCORS: true,
                scrollY: 0,
                scale:3,
                dpi: 1000,
                letterRendering: true,
                allowTaint: false //useCORS를 true로 설정 시 반드시 allowTaint를 false처리 해주어야함
               },
              jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true}
            }).then(function() {
                vm.loading = false;
            })

        }
    },
};
</script>
<style>
.col {
    margin-bottom: 20px !important;
}

.report-summary-wrap .col {
    margin:0px !important;
}

.download-btn {
    position: fixed;
    top:100px;
    right:5%;
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
.report-wrap .page {
    position: relative;
    min-height: 29.5cm !important;
    max-height: 29.5cm !important;
    padding: 10mm 10mm 10mm 10mm !important;
    background: #fff;
    margin: 5px 0 5px 0 !important;
    /* border: 1px solid #666; */
    display: block;
    overflow:hidden;

}

.report-wrap .page .label {
      font-size: 18px !important;
      font-weight: 800 !important;
      color: #000 !important;
}

.report-wrap .page header div {
      width: 100%;
      text-align: right;
}

.report-wrap .page footer {
      position: absolute;
      bottom: 5mm;
      color: #000;
      right: 13mm;
}

.report-wrap .page .smp-affinity-wrap {
      max-width: 716.13px;
      max-height: 795px;
      overflow: hidden;
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