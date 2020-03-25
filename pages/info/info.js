const app = getApp();
Page({
  data: {
    userInfo: {},
  },

  onLoad: function() {
    console.log(`%c===================================`, 'color:red');
    console.log(`user token ${app.globalData.token}`);
    console.log(`%c===================================`, 'color:red');

    app.myregister
      .userInfo(
        {},
        {
          accept: 'application/json',
          Authorization: `Bearer ${app.globalData.token}`,
        },
      )
      .then(res => {
        console.log(`%c===================================`, 'color:red');
        console.log(`%c userInfo %s`, 'color:blue', JSON.stringify(res));
        console.log(`%c===================================`, 'color:red');
        this.setData({
          userInfo: res,
        });
      });
  },
});
