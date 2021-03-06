import request from './request.js';
import {baseUrl} from '../global.js';

class register {
  constructor() {
    this._baseUrl = baseUrl;
    this._request = new request();
    this._request.setErrorHandler(this.errorHander);
  }

  errorHander(res) {
    console.error(res);
  }

  login(obj) {
    return this._request
      .postRequest(this._baseUrl + 'api/login', obj)
      .then(res => res.data);
  }

  /**
   * 完善个人信息
   */
  userComplete(obj, header) {
    return this._request
      .postRequest(this._baseUrl + 'api/users/complete', obj, header)
      .then(res => res.data);
  }

  /**
   * 验证手机是否唯一
   */
  checkMobile(obj, header) {
    return this._request
      .getRequest(this._baseUrl + 'api/verify_codes/mobile_exists', obj, header)
      .then(res => res.data);
  }

  /**
   * 发送手机验证码
   */
  sendVerify(obj, header) {
    return this._request
      .getRequest(this._baseUrl + 'api/verify_codes', obj, header)
      .then(res => res.data);
  }

  /**
   * 检验验证码
   */
  checkVerify(obj, header) {
    return this._request
      .getRequest(this._baseUrl + 'api/verify_codes/check', obj, header)
      .then(res => res.data);
  }

  /**
   * 图片上传接口
   */
  uploadImage(obj, header) {
    return this._request
      .postRequest(this._baseUrl + 'api/upload', obj, header)
      .then(res => res.data);
  }

  /**
   * 获取用户信息
   */
  userInfo(obj, header) {
    return this._request
      .getRequest(this._baseUrl + 'api/users/info', obj, header)
      .then(res => res.data);
  }
}
export default register;
