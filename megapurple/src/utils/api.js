import request from './request'

export default {
    toLogin: data => request.post('/api/user/login', data),
    getUserInfo: data => request.post('/api/user/getUserInfo', data),
    getScoreList: data => request.post('/api/fundRecords/getUserFundRecords', data),
    setInviteCode: data => request.post('/api/user/invitationUser', data),
    getPrizeList: data => request.post('/api/prize/getPrizeAll', data),
    getUserHistoryList: data => request.post('/api/user/getUserSolanaList', data),
    getPrizeDetail: data => request.post('/api/userPrize/getUserPrizeList', data),
    getTotalPrize: data => request.post('/api/bonusPool/getBonusPool', data)
}