// let wxApi = 'http://175.102.179.84:8090';
// let wxApi = 'https://hstest.youjiankang.net'
let wxApi = 'https://www.youjiankang.net/xyqd'
import Constant from '../../project.config.json'
export default {
    key:'946eedbef5b95fbeff0d6dfb42958db8',
    templateIds:['2KQxdayP9BLvq-ezhtl5C76SKE_UqjPU_8tfk2A_3S4'],
    login:wxApi+`/sign/user/${Constant.appid}/login`,
    getImgCode:wxApi+`/sign/user/${Constant.appid}/getImgVerifyCode`,
    saveUserInfo:wxApi+`/sign/user/${Constant.appid}/saveUserInfo`,
    saveCompanyInfo:wxApi+`/sign/company/saveCompanyInfo`,
    saveSignAct:wxApi + `/sign/activity/saveSignActivity`,
    signList:wxApi + `/sign/sign/getMySignList`,
    createdAct:wxApi + `/sign/activity/getMyCreate`,
    getUserInfo:wxApi+`/sign/user/${Constant.appid}/getUserInfo`,
    deleteAct:wxApi + `/sign/activity/deleteActivity`,
    getCompany:wxApi+`/sign/company/getCompanyInfo`,
    updateCompany:wxApi + `/sign/company/updateCompanyInfo`,
    getActQrWeiMaInfo:wxApi + `/sign/activity/getActivityQRCode`,
    alreadySignList:wxApi + `/sign/activity/getActivitySignList`,
    getSignTimes:wxApi + `/sign/sign/getTodaySignInfo`,
    resetPwd:wxApi + `/sign/company/resetPasswordById`,
    exportExcel:wxApi + `/sign/activity/exportExcel`,

}
