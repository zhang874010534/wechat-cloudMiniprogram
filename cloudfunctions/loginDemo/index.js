const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();

  const db = cloud.database();
  const result = await db.collection('users').where({
    openid: wxContext.OPENID
  }).limit(1).get()
  console.log(result);
  if(result.data.length === 0) {
    db.collection('users').add({
      data: {
        ...event.user,
        openid: wxContext.OPENID
      }
    })
    return {
      ...event.user,
      openid: wxContext.OPENID
    }
  }else {
    return result.data[0]
  }
}