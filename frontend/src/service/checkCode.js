import crypto from 'crypto';
import fp from 'lodash/fp';
import dateFormat from 'date-format';

/**
 * @private
 *
 * @param {String} wapplesId
 * @param {String} contractNumber
 *
 * @return {Buffer}
 */
function getKeyBuffer(wapplesId, contractNumber) {
  const salt = 'PENTASECURITY';
  const buf = new ArrayBuffer(5);
  const uInt8Array = new Uint8Array(buf);
  const key = crypto
    .createHash('sha256')
    .update(`${salt}${wapplesId}${contractNumber}`)
    .digest('hex');

  for (let i = 0; i < uInt8Array.length; i += 1) {
    uInt8Array[i] = parseInt(key.substr(i * 2, 2), 16);
  }

  return Buffer.from(uInt8Array);
}

/**
 * @private
 *
 * @param {String} code
 *
 * @return {Buffer}
 */
function getCodeBuffer(code) {
  const buf = new ArrayBuffer(5);
  const uInt8Array = new Uint8Array(buf);

  for (let i = 0; i < uInt8Array.length; i += 1) {
    uInt8Array[i] = parseInt(code.substr(i * 2, 2), 16);
  }

  return Buffer.from(uInt8Array);
}

/**
 * @private
 *
 * @return {Buffer}
 */
function getDateBuffer() {
  let bit = 0;
  const buf = new ArrayBuffer(5);
  const view = new DataView(buf);

  const date = new Date();
  const year = date.getFullYear() % 100;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getUTCHours() + 9;
  const minute = date.getMinutes();
  const status = 0;
  let checksum = 0;

  bit = (year << 4) | month;
  bit = (bit << 5) | day;
  bit = (bit << 5) | hour;
  bit = (bit << 6) | minute;
  bit = (bit << 5) | status;
  bit >>>= 0; // unsigned shift

  view.setInt32(1, bit, false);

  for (let i = 1; i < 5; i += 1) {
    checksum ^= view.getUint8(i);
  }

  view.setInt8(0, checksum);

  return Buffer.from(view.buffer);
}

/**
 *
 * @param {Number} num
 * @param {Number} length
 *
 * @return {String}
 */
function leadingZero(num, length) {
  return num.toString(16).padStart(length, '0');
}

/**
 *
 * @param {Object} event
 * @param {Object} data
 * @param {String} data.code
 * @param {String} data.wapplesId
 * @param {String} data.contractNumber
 *
 * @return {Void}
 */
function validateCode(wapplesId, code, contractNumber) {
  try {
    let isDevMode = false;
    let isIssuedForTest = false;
    let codeValidationComment = '';
    let isValidatedCode = false;
    const keyBuffer = getKeyBuffer(wapplesId, contractNumber);
    const codeBuffer = getCodeBuffer(code);
    const buf = new Uint8Array(new ArrayBuffer(5));

    if (codeBuffer.length === 5 && keyBuffer.length === 5) {
      codeBuffer.forEach((val, idx) => buf.fill(val ^ keyBuffer[idx], idx));

      let checksum = 0;
      const cocoChecksum = buf[0];
      const dateArray = buf.slice(1, 5);

      dateArray.forEach(val => {
        checksum ^= val;
      });

      // 테스트용 점검코드의 경우 년도는 0xff로 시작
      isIssuedForTest = dateArray[0] === 0xff;

      const expireDate = new Date(dateArray.join('/').replace('/', ''));
      const current = new Date();
      current.setHours(0, 0, 0, 0);

      const diffDays = parseInt((expireDate - current) / (1000 * 60 * 60 * 24), 10);

      if (checksum !== cocoChecksum) {
        codeValidationComment = `유효성 검증에 실패하였습니다.`;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (isIssuedForTest) {
          const testDateArray = buf.slice(1, 5);
          testDateArray[0] = 20;
          const testExpireDate = new Date(testDateArray.join('/').replace('/', ''));
          const testDiffDays = parseInt((testExpireDate - current) / (1000 * 60 * 60 * 24), 10);

          if (fp.isNaN(testDiffDays)) {
            codeValidationComment = `invalid date`;
          } else if (testDiffDays < 0) {
            codeValidationComment = `점검코드 만료 (~${dateFormat('yyyy-MM-dd', testExpireDate)})`;
          } else {
            isValidatedCode = true;
            codeValidationComment = `(테스트) 유효한 점검코드. ${dateFormat(
              'yyyy-MM-dd',
              testExpireDate,
            )} 까지 사용가능`;
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (fp.isNaN(diffDays)) {
            codeValidationComment = `invalid date`;
          } else if (diffDays < 0) {
            codeValidationComment = `점검코드 만료 (~${dateFormat('yyyy-MM-dd', expireDate)})`;
          } else if (diffDays > 3) {
            codeValidationComment = `유효일자 ${dateFormat('yyyy-MM-dd', expireDate)} 이전 3일 이내만 사용가능`;
          } else {
            isValidatedCode = true;
            codeValidationComment = `유효한 점검코드. ${dateFormat('yyyy-MM-dd', expireDate)} 까지 사용가능`;
          }
        }
      }
    }
    //console.log(codeValidationComment);
    return {valid:isValidatedCode, msg:codeValidationComment}
  } catch (e) {
    console.log(e.message);
    return {valid:false, msg:'점검코드 검증 오류'}
  }
}

function getCompleteCode({ wapplesId, contractNumber }) {
  try {
    const keyBuffer = getKeyBuffer(wapplesId, contractNumber);
    const dateBuffer = getDateBuffer();

    let completeCode = '';

    dateBuffer.forEach((date, i) => {
      completeCode += leadingZero(date ^ keyBuffer[i], 2);
    });
    return {code:completeCode};
  } catch (e) {
    console.log(e.message);
    return {valid:false, msg:'점검완료 코드류'}
  }
}

export {validateCode, getCompleteCode};