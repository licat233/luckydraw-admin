import { webapi } from './webapi';
import * as components from "./luckydrawComponents"
export * from "./luckydrawComponents"

/**
 * @description "抽奖接口"
 * @param req
 */
export function luckydraw(req: components.LuckydrawReq) {
	return webapi.post<components.BaseResp>(`/api/luckydraw`, req)
}

/**
 * @description "获取ip"
 */
export function getRemoteIp() {
	return webapi.get<components.BaseResp>(`/api/ip`)
}

/**
 * @description "获取验证码"
 * @param req
 */
export function getMathCaptcha(req: components.CaptchaReq) {
	return webapi.post<components.BaseResp>(`/api/math-captcha`, req)
}

/**
 * @description "测试"
 */
export function test() {
	return webapi.get<components.BaseResp>(`/api/test`)
}

/**
 * @description "添加 基础API"
 * @param req
 */
export function addActivity(req: components.AddActivityReq) {
	return webapi.post<components.BaseResp>(`/api/activity`, req)
}

/**
 * @description "更新 基础API"
 * @param req
 */
export function putActivity(req: components.PutActivityReq) {
	return webapi.put<components.BaseResp>(`/api/activity`, req)
}

/**
 * @description "获取 基础API"
 * @param params
 */
export function getActivity(params: components.GetActivityReqParams) {
	return webapi.get<components.BaseResp>(`/api/activity`, params)
}

/**
 * @description "删除 基础API"
 * @param req
 */
export function delActivity(req: components.DelActivityReq) {
	return webapi.delete<components.BaseResp>(`/api/activity`, req)
}

/**
 * @description "获取列表 基础API"
 * @param params
 */
export function getActivityList(params: components.GetActivityListReqParams) {
	return webapi.get<components.BaseResp>(`/api/activity/list`, params)
}

/**
 * @description "获取枚举列表 基础API"
 * @param params
 */
export function getActivityEnums(params: components.GetActivityEnumsReqParams) {
	return webapi.get<components.BaseResp>(`/api/activity/enums`, params)
}

/**
 * @description "添加 基础API"
 * @param req
 */
export function addAdminer(req: components.AddAdminerReq) {
	return webapi.post<components.BaseResp>(`/api/adminer`, req)
}

/**
 * @description "更新 基础API"
 * @param req
 */
export function putAdminer(req: components.PutAdminerReq) {
	return webapi.put<components.BaseResp>(`/api/adminer`, req)
}

/**
 * @description "获取 基础API"
 * @param params
 */
export function getAdminer(params: components.GetAdminerReqParams) {
	return webapi.get<components.BaseResp>(`/api/adminer`, params)
}

/**
 * @description "删除 基础API"
 * @param req
 */
export function delAdminer(req: components.DelAdminerReq) {
	return webapi.delete<components.BaseResp>(`/api/adminer`, req)
}

/**
 * @description "获取列表 基础API"
 * @param params
 */
export function getAdminerList(params: components.GetAdminerListReqParams) {
	return webapi.get<components.BaseResp>(`/api/adminer/list`, params)
}

/**
 * @description "获取枚举列表 基础API"
 * @param params
 */
export function getAdminerEnums(params: components.GetAdminerEnumsReqParams) {
	return webapi.get<components.BaseResp>(`/api/adminer/enums`, params)
}

/**
 * @description "管理员登录"
 * @param req
 */
export function adminerLogin(req: components.AdminerLoginReq) {
	return webapi.post<components.BaseResp>(`/api/login`, req)
}

/**
 * @description "获取当前信息"
 */
export function currentAdminer() {
	return webapi.get<components.BaseResp>(`/api/currentAdminer`)
}

/**
 * @description "退出登录"
 */
export function adminerLogout() {
	return webapi.get<components.BaseResp>(`/api/logout`)
}

/**
 * @description "添加 基础API"
 * @param req
 */
export function addAwards(req: components.AddAwardsReq) {
	return webapi.post<components.BaseResp>(`/api/awards`, req)
}

/**
 * @description "更新 基础API"
 * @param req
 */
export function putAwards(req: components.PutAwardsReq) {
	return webapi.put<components.BaseResp>(`/api/awards`, req)
}

/**
 * @description "获取 基础API"
 * @param params
 */
export function getAwards(params: components.GetAwardsReqParams) {
	return webapi.get<components.BaseResp>(`/api/awards`, params)
}

/**
 * @description "删除 基础API"
 * @param req
 */
export function delAwards(req: components.DelAwardsReq) {
	return webapi.delete<components.BaseResp>(`/api/awards`, req)
}

/**
 * @description "获取列表 基础API"
 * @param params
 */
export function getAwardsList(params: components.GetAwardsListReqParams) {
	return webapi.get<components.BaseResp>(`/api/awards/list`, params)
}

/**
 * @description "获取枚举列表 基础API"
 * @param params
 */
export function getAwardsEnums(params: components.GetAwardsEnumsReqParams) {
	return webapi.get<components.BaseResp>(`/api/awards/enums`, params)
}

/**
 * @description "获取某活动的奖项信息"
 * @param req
 */
export function getAwardsListByActivityUuid(req: components.GetAwardsListByActivityUuidReq) {
	return webapi.post<components.BaseResp>(`/api/awards/list`, req)
}

/**
 * @description "筛选by id list"
 * @param req
 */
export function selectAwardsByIds(req: components.SelectAwardsByIdsReq) {
	return webapi.post<components.BaseResp>(`/api/awards/selectAwardsByIds`, req)
}

/**
 * @description "添加 基础API"
 * @param req
 */
export function addUsers(req: components.AddUsersReq) {
	return webapi.post<components.BaseResp>(`/api/users`, req)
}

/**
 * @description "更新 基础API"
 * @param req
 */
export function putUsers(req: components.PutUsersReq) {
	return webapi.put<components.BaseResp>(`/api/users`, req)
}

/**
 * @description "获取 基础API"
 * @param params
 */
export function getUsers(params: components.GetUsersReqParams) {
	return webapi.get<components.BaseResp>(`/api/users`, params)
}

/**
 * @description "删除 基础API"
 * @param req
 */
export function delUsers(req: components.DelUsersReq) {
	return webapi.delete<components.BaseResp>(`/api/users`, req)
}

/**
 * @description "获取列表 基础API"
 * @param params
 */
export function getUsersList(params: components.GetUsersListReqParams) {
	return webapi.get<components.BaseResp>(`/api/users/list`, params)
}

/**
 * @description "获取枚举列表 基础API"
 * @param params
 */
export function getUsersEnums(params: components.GetUsersEnumsReqParams) {
	return webapi.get<components.BaseResp>(`/api/users/enums`, params)
}

/**
 * @description "用户注册"
 * @param req
 */
export function userRegister(req: components.UserRegisterReq) {
	return webapi.post<components.BaseResp>(`/api/users/register`, req)
}

/**
 * @description "用户登录"
 * @param req
 */
export function userLogin(req: components.UserLoginReq) {
	return webapi.post<components.BaseResp>(`/api/users/login`, req)
}

/**
 * @description "当前用户"
 * @param req
 */
export function currentUser(req: components.CurrentUserReq) {
	return webapi.post<components.BaseResp>(`/api/users/currentUser`, req)
}

/**
 * @description "添加 基础API"
 * @param req
 */
export function addWinningRecords(req: components.AddWinningRecordsReq) {
	return webapi.post<components.BaseResp>(`/api/winningRecords`, req)
}

/**
 * @description "更新 基础API"
 * @param req
 */
export function putWinningRecords(req: components.PutWinningRecordsReq) {
	return webapi.put<components.BaseResp>(`/api/winningRecords`, req)
}

/**
 * @description "获取 基础API"
 * @param params
 */
export function getWinningRecords(params: components.GetWinningRecordsReqParams) {
	return webapi.get<components.BaseResp>(`/api/winningRecords`, params)
}

/**
 * @description "删除 基础API"
 * @param req
 */
export function delWinningRecords(req: components.DelWinningRecordsReq) {
	return webapi.delete<components.BaseResp>(`/api/winningRecords`, req)
}

/**
 * @description "获取列表 基础API"
 * @param params
 */
export function getWinningRecordsList(params: components.GetWinningRecordsListReqParams) {
	return webapi.get<components.BaseResp>(`/api/winningRecords/list`, params)
}

/**
 * @description "获取枚举列表 基础API"
 * @param params
 */
export function getWinningRecordsEnums(params: components.GetWinningRecordsEnumsReqParams) {
	return webapi.get<components.BaseResp>(`/api/winningRecords/enums`, params)
}

/**
 * @description "中奖记录查询接口"
 * @param req
 */
export function query(req: components.QueryReq) {
	return webapi.post<components.BaseResp>(`/api/winningRecords/query`, req)
}
