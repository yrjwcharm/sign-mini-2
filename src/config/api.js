let wxApi = 'http://175.102.179.84:8090/sign';
import Constant from '../../project.config.json'
export default {
    key:'946eedbef5b95fbeff0d6dfb42958db8',
    login:wxApi+`/user/${Constant.appid}/login`,
    getImgCode:wxApi+`/user/${Constant.appid}/getImgVerifyCode`,
    saveUserInfo:wxApi+`/user/${Constant.appid}/saveUserInfo`,
    saveCompanyInfo:wxApi+`/company/saveCompanyInfo`,
    saveSignAct:wxApi + `/activity/saveSignActivity`,
    signList:wxApi + `/sign/getMySignList`,
    createdAct:wxApi + `/activity/getMyCreate`,
    getUserInfo:wxApi+`/user/${Constant.appid}/getUserInfo`,
    deleteAct:wxApi + `/activity/deleteActivity`,
    getCompany:wxApi+`/company/getCompanyInfo`,
    updateCompany:wxApi + `/company/updateCompanyInfo`,
    getActQrWeiMaInfo:wxApi + `/activity/getActivityQRCode`,
    alreadySignList:wxApi + `/activity/getActivitySignList`,
    getSignTimes:wxApi + `/sign/getTodaySignInfo`

}
