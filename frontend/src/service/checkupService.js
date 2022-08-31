import axios from "axios";
import store from "../store";
import fp from "lodash/fp";
import { extendWith } from "lodash";
import moment from 'moment';

/**
 * @typedef CheckupService
 */

class CheckupService {
  constructor() {
    this.axios = axios;
    this.store = store;
    this.fp = fp;
  }

  /**
   * resource data(cpu,mem,throughput,cps)
   * @returns
   */
  async getResourceData() {
    const { memTotalGB, line } = await this.axios
      .get("/webapi/tool/system/resource")
      .then((res) => ({
        memTotalGB: Number(res.data.mem_total.replace(/[^0-9]/gi, "")) / 1000,
        line: res.data.sysmonlog,
      }))
      .catch((e) => {
        console.log(e.response.statusText);
        this.store.commit("isAuth", e.response.status);
      });

    const arr = line.match(/([0-9]*[.])?[0-9]+/gi).map(Number);

    return {
      cpuUsage: this.fp.sum(arr.slice(5, 8)),
      memFreePer: Math.floor((arr[8] / memTotalGB) * 100),
      memFree: arr[8] || 0,
      throughput: this.fp.last(arr) || 0,
      cps: arr[15],
    };
  }

  /**
   * @return {Promise<Array>}
   */
  getUpdateHistory() {
    return this.axios
      .get("/webapi/tool/system/update-history")
      .then((res) =>
        this.fp.isEmpty(res.data.history)
          ? []
          : res.data.history.trim().split("\n")
      )
      .catch((e) => {
        console.log(e.response.statusText);
        this.store.commit("isAuth", e.response.status);
      });
  }

  /**
   * Network - Service port
   *
   * @return {Promise<Object>}
   */
  getServicePortConfig() {
    return this.axios
      .get(`/webapi/tool/network/service_port/config`)
      .then((res) => ({ value: res.data.config.trim(), result: 1 }));
  }

  /**
   * Network - Service port
   *
   * @return {Promise<Object>}
   */
  async getServicePortStatus() {
    const checkColumns = [
      "rx_err_avg",
      "rx_drop_avg",
      "tx_err_avg",
      "tx_drop_avg",
    ];
    const response = await this.axios.get(
      `/webapi/tool/network/service_port/status`
    );
    const status = response.data.status;

    const getResult = (row) =>
      this.fp.pipe(this.fp.pick(checkColumns), (row) =>
        this.fp.every((column) => Number(row[column]) === 0)(checkColumns)
      )(row);

    const values = status.map((data) => ({
      ...data,
      result: getResult(data),
    }));

    const result = this.fp.every((value) => value.result)(values) ? 1 : 0;

    return { values, result };
  }

  /**
   * Network - Service port
   *
   * @return {Promise<String>}
   */
  getSessionControlConfig() {
    return this.axios
      .get(`/webapi/tool/network/service_port/session_control`)
      .then((res) => ({
        values: res.data.sessionControl.trim().split("\n"),
        result: 1,
      }));
  }

  /**
   * Network - Bonding
   *
   * @return {Promise<Object>}
   */

  getBondingConfig() {
    return this.axios.get(`/webapi/tool/network/bonding`).then((res) => {
      let result = 1;
      const { configs = [], status } = res.data;

      if (!this.fp.isEmpty(configs)) {
        result = this.fp.every((b) => b.isDetected)(configs) ? 1 : 2;
      }

      return { values: configs, status, result };
    });
  }

  /**
   * Network - Access control
   *
   * @return {Promise<String>}
   */
  getAccessControlStatus() {
    return this.axios
      .get(`/webapi/tool/network/access_control`)
      .then((res) => ({
        values: res.data.access_control.trim().split("\n"),
        result: 1,
      }));
  }

  /**
   * Network - Filter
   *
   * @return {Promise<String>}
   */
  getSessionFilter() {
    const MAX = 900;

    return this.axios
      .get(`/webapi/tool/network/filter/session_filter`)
      .then(res =>
        res.data.filter
          .replace('Session Filter Info', '')
          .replace(/\s+L(.)+\n/gi, "\n")
          .replace(/[- ]+\w+(\<[\d]+\>)+/gi, '')
          .replace(/(ENABLE|DISABLE)/gi, '')
          .split('\n')
          .map(s => s.replace(/\s+ /gi, ''))
          .slice(1),
      )
      .then(values => ({ values, result: values.length < MAX ? 1 : 0 }));
  }

  /**
   * Network - Filter
   *
   * @return {Promise<String>}
   */
  getSessionTimeout() {
    const ESTABLEISH_TIMEOUT = 300;
    const BLOCK_TIMEOUT = 3;

    const getTimeout = regex =>
      this.fp.pipe(
        this.fp.find(timeout => regex.test(timeout)),
        str => str.replace(/[^0-9]+/gi, ''),
        Number,
      );

    return this.axios
      .get(`/webapi/tool/network/filter/session_timeout`)
      .then(res => {
        let timeData = res.data.timeout.split('\n');
        const establishTimeout = getTimeout(/Establish timeout/)(timeData);
        if (/Block timeout/.test(timeData)) {
          const blockTimeout = getTimeout(/Block timeout/)(timeData);
          return { values : timeData, result: establishTimeout === ESTABLEISH_TIMEOUT && blockTimeout === BLOCK_TIMEOUT ? 1 : 2 };
        }
        return { values : timeData, result: establishTimeout === ESTABLEISH_TIMEOUT ? 1 : 2 };
      });
  }

  /**
   * Network - Filter
   *
   * @return {Promise<Object>}
   */
  getNetworkFailoverAction() {
    return this.axios
      .get(`/webapi/tool/network/filter/failover_action`)
      .then((res) => ({
        values: res.data.failover_action
          .replace("*** Network Failover Action Info ***\n", "")
          .replace(/(Timeslice)[.\s\n:\[\]\d\w\'']+/gm, "")
          .replace(/^\s+/gm, "")
          .split("\n"),
        result: 1,
      }));
  }

  /**
   * Network - SMP-Affinity
   *
   * @return {Promise<Objcet>}
   */
  getSMPAffinityConfig() {
    return this.axios.get(`/webapi/tool/network/smp_affinity`).then((res) =>
      ({
      values: res.data.smp_affinity
        .replace(/^\s+/gm, "")
        .split("\n")
        .map((str) => str.replace(/\s+/gi, " ")),
      result: res.data.result,
      cpuCount: res.data.cpu_count,
      enable: res.data.enable,
      })
  );
  }

  /**
   * System - Process
   *
   * @return {Promise<Array>}
   */
   async getDiagnosis() {
    let key = null;
    let obj = { items: [] };
    const diagnosis = [];
    const strArr = await this.axios.get("/webapi/tool/system/diagnosis").then((res) => this.fp.filter((str) => !this.fp.isEmpty(str))(res.data.diagnosis));

    strArr.forEach(str => {
      if (/^\*/.test(str)) {
        console.log(str)
        key = this.fp.camelCase(str.replace(/\*|checking/g, '')).trim();
        if (key === 'postgresql') key = 'db';

        obj = this.fp.find(diagnosis, data => data.key === key);

        if (!obj) obj = { key, items: [], text: str.replace(/\*|checking/g, '').trim() };

        diagnosis.push(obj);
      } else {
        obj.items.push(str.replace(/\s+ /gi, ' '));
      }
    });

    const values = diagnosis.map(d => ({ ...d, result: this.getDiagnosisResult(d) ? 1 : 0 }));

    return {
      values,
      result: this.fp.every(v => v.result)(values) ? 1 : 0,
    };
  }

  /**
   * @private
   *
   * @param {Object} process
   *
   * @return {Boolean}
   */
   getDiagnosisResult(process) {
    const isLeaderOne = (regex, items) =>
      this.fp.some(item => (regex.test(item) ? Number(item.replace(regex, '').trim()) === 1 : false))(items);

    switch (process.key) {
      case 'sphered':
        return isLeaderOne(/(number of sphered leader.)=/gi, process.items);

      case 'wapples': {
        const coreRegex = /(number of CPU cores.)=/gi;
        const childrenRegex = /(number of wapples children.)=/gi;

        const getCount = regex =>
          this.fp.pipe(
            this.fp.find(item => regex.test(item)),
            str => str.replace(regex, '').trim(),
          );

        const coreCount = getCount(coreRegex)(process.items);
        const childrenCount = getCount(childrenRegex)(process.items);

        return coreCount >= childrenCount;
      }

      case 'apacheDaemonForWebInterface': {
        const regex = /(number of httpd process.)=/gi;
        return this.fp.some(item => (regex.test(item) ? Number(item.replace(regex, '').trim()) > 0 : false))(
          process.items,
        );
      }

      case 'variousSingleDaemons': {
        const tmpArr = process.items.map(item => item.split('='));
        return this.fp.every(item => item.length === 2 && item[1] > 0)(tmpArr);
      }

      default:
        return true;
    }
  }

  /**
   * System - HA - 추후 개발 예정
   *
   * @return {Promise<Object>}
   */
  getHA() {
    return true;
    return this.axios.get(`/webapi/tool/status/ha`).then((res) => ({
      values: res.data,
      result: 1,
    }));
  }

  /**
   * System - sw_bypass - 추후 개발 예정
   *
   * @return {Promise<Object>}
   */
  getSwbypass() {
    return true;
    return this.axios.get(`/webapi/tool/status/sw_bypass`).then((res) => ({
      values: res.data,
      result: 1,
    }));
  }

  /**
   * system - db
   *
   * @return {Promise<Object>}
   */
  getDBTransactionCount() {
    return { values: [], result: this.fp.isEmpty("") };
  }

  /**
   * system - db
   *
   * @return {Promise<String>}
   */
  getDBConnectionCount() {
    return this.axios
      .get(`/webapi/tool/system/db/connection_count`)
      .then((res) => Number(this.fp.first(res.data.connection_count).Value));
  }

  /**
   * system - db
   *
   * @return {Promise<String>}
   */
  getDBProcessCountAndTrak() {
    const MAX_PROCESS = 100;

    return this.axios
      .get(`/webapi/tool/system/db/process_count`)
      .then((res) => ({
        value: { processCount: res.data.process_count },
        result: res.data.process_count < MAX_PROCESS ? 1 : 0,
      }));
  }

  /**
   * System - Disk
   *
   * @return {Promise<Object>}
   */
  async getDiskUsage() {
    let result = 0;
    const { total, used } = await this.axios
      .get("/webapi/tool/system/disk/usage")
      .then((res) => res.data.usage);
    const percent = (used / total) * 100;
    const values = [
      ` PartitionCheckResult : ${percent.toFixed(2)}% `,
      " Configured Ratio     : 70.00% ",
    ];

    if (percent < 70) result = 1;
    else if (percent < 90) result = 2;

    return { values, result };
  }

  async getDiskStatus() {
    const statusArr = await this.axios
      .get("/webapi/tool/system/disk/status")
      .then((res) =>
        !res.data.status
          ? []
          : res.data.status.map((value) => ({
              disk: value.disk,
              output: value.output.match(
                /Reallocated_Sector_Ct.+|Spin_Retry_Count.+|Current_Pending_Sector.+|Offline_Uncorrectable.+|UDMA_CRC_Error_Count.+/gi
              ),
            }))
      );

    const isEmpty =
      this.fp.isEmpty(statusArr) ||
      this.fp.every((status) => this.fp.isEmpty(status.output))(statusArr);

    if (isEmpty) {
      return { values: [], result: 1 };
    }

    const result = this.fp.every((status) =>
      this.fp.first(status.output.match(/[0-9]$/gi) === "0")
    )(statusArr)
      ? 1
      : 0;

    return { values: statusArr, result };
  }

  /**
   * System - Disk
   *
   * @return {Promise<Object}
   */
  async getDiskState() {
    const status = await this.getDiskStatus();
    const speed = { values: [], result: 1 };
    const result = status.result === 1 && speed.result === 1 ? 1 : 0;

    return { status, speed, result };
  }

  /**
   * System - MAC 테이블 분석
   *
   * @return {Promise<Object>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getMactable() {
    const ret = await this.axios
      .get(`/webapi/tool/system/log_analyzer/mactable`)
      .then((res) => res.data.mactable);
    return { values: ret, result: 1 };
  }

  /**
   * wpconsole - 보호대상 서비스
   *
   * @return {Promise<Object>}
   */
  async getNetworkConf() {
    const ret = await this.axios.get("/webapi/tool/wpconsole/network_conf");
    return { values : ret, result: 1 };
  }

  /**
   * wpconsole - PLS (정책 동기화)
   *
   * @return {Promise<Object>}
   */
  async getPlsStatus() {
    const status = await this.axios.get(
      "/webapi/tool/wpconsole/pls_status/status"
    );
    return { values: { status }, result: 1 };
  }

  /**
   * wpconsole - PLS (정책 동기화)
   *
   * @return {Promise<Object>}
   */
  async getPlsAuditLog() {
    const audit = await this.axios.get(
      "/webapi/tool/wpconsole/pls_status/audit"
    );
    return { values: { audit }, result: 1 };
  }

  
  /**
   * wpconsole - 탐지로그 분석
   *
   * @return {Promise<Object>}
   */
    async getUserDefinedPatternStatistics() {
        const ud = await this.axios
            .get("/webapi/tool/wpconsole/intrusionlog_analyzer/user_defined")
            .then(res => res.data.rows);
        
        const udp = await this.axios
            .get("/webapi/tool/wpconsole/intrusionlog_analyzer/user_defined_pattern")
            .then(res => res.data.rows);
        
        return { values: { ud, udp }, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * @return {Promise<Object>}
   */
  async getVirtualHost() {
    const website = await this.axios.get('/webapi/tool/wpconsole/intrusionlog_analyzer/website').then(res => res.data.rows);
    return { values: { website }, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * @return {Promise<Object>}
   */
  async getPolicyRule() {
    const policy = await this.axios.get('/webapi/tool/wpconsole/intrusionlog_analyzer/policy').then(res => res.data.rows);
    const rule = await this.axios.get('/webapi/tool/wpconsole/intrusionlog_analyzer/rule').then(res => res.data.rows);

    return { values: { policy, rule }, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * @return {Promise<Object>}
   */
  async getExceptionPattern() {
    const exp = await this.axios.get('/webapi/tool/wpconsole/intrusionlog_analyzer/exception_pattern')
      .then(res => res.data.rows);

    return { values: { exp }, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * 최근 4개월간의 탐지로그 통계
   *
   * @return {Promise<Object>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getRuleCountQuarter() {
    const data = {};
    return { values: data, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * 최근 1개월간의 주별 탐지로그 통계
   *
   * @return {Promise<Object>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getRuleCountWeek() {
    const data = {};
    return { values: data, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * 최근 1주일간의 일별 탐지로그 통계
   *
   * @return {Promise<Object>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getRuleCountDay() {
    const data = {};
    return { values: data, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * @return {Promise<Object>}
   */
  async getRuleCount() {
    let date = this.store.state.auth.checkOptions.date;
    let dtFrom = date.start_date;
    let dtTo = date.end_date;

    if (dtFrom == '' || dtTo == '') {
        dtFrom = moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD');

        dtTo = moment().format('YYYY-MM-DD');
    }
    
    var params = new FormData();
    params.append('dt_from', dtFrom);
    params.append('dt_to', dtTo);

    try {
      const byAction = await this.axios.post('/webapi/tool/wpconsole/intrusionlog_analyzer/by_action', params).then(res => res.data.by_action);
      const byCountry = await this.axios.post('/webapi/tool/wpconsole/intrusionlog_analyzer/by_country', params).then(res => res.data.by_country);
      const byIp = await this.axios.post('/webapi/tool/wpconsole/intrusionlog_analyzer/by_ip', params).then(res => res.data.by_ip);
      const byRule = await this.axios.post('/webapi/tool/wpconsole/intrusionlog_analyzer/by_rule', params).then(res => res.data.by_rule);
        
      return { values: { byAction, byCountry, byIp, byRule, dtFrom, dtTo }, result: 1 };
    } catch (ex) {
      console.log('* getRuleCount exception.');
    }
    return { values: { byAction: [], byCountry: [], byIp: [], byRule: [], dtFrom, dtTo }, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * 최근 1주일간의 일별 룰기준 탐지로그 통계
   *
   * @return {Promise<Object>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getRuleCountDayByRuleID() {
    const data = {};
    return { values: data, result: 1 };
  }

  /**
   * wpconsole - 탐지로그 분석
   *
   * 룰 이름 정보
   *
   * @return {Promise<Object>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getBasicRule() {
    const data = {};
    return { values: data, result: 1 };
  }
}
export default CheckupService;
