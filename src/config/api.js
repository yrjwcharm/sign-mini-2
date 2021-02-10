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
    createdAct:wxApi + `/activity/getMyCreate`
}
