module.exports = [

  /**
   * 注册页面发送验证码
   */
  {
    url: '/global/register/getRegisterSmsCode',
    selections: [
      {
        name: '发送成功',
        value: `[
          @success
        ]`
      },
      {
        name: '发送失败',
        value: `[
          @fail
        ]`
      }
    ]
  },

  /**
   * 需要易盾校验开关
   */
  {
    url: '/global/switch',
    selections: [
      {
        name: '需要校验',
        value: `[
          result [ slideValidate [ @needValidate ] ]
        ]`
      },
      {
        name: '不需要校验',
        value: `[
          result [ slideValidate [ @needNotValidate ] ]
        ]`
      }
    ]
  },

  /**
   * 获取用户信息
   */
  {
    url: '/global/account/currentInfo',
    selections: [
      {
        name: '已登录；无提现能力；未实名',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@none],
              merchant [
                merchantType [@noCerified],
                status [@inactivated]
              ],
              holderList [@noCerified]
            ]
          ]
        ]`
      },
      // 大陆个人
      {
        name: '已登录；人民币提现能力；大陆个人--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@RMBWithdraw],
              merchant [
                merchantType [@personal],
                status [@normal]
              ],
              holderList [@personal]
            ]
          ]
        ]`
      },
      {
        name: '已登录；无提现能力；大陆个人--待审核',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@none],
              merchant [
                merchantType [@personal],
                status [@pending]
              ],
              holderList [@personal]
            ]
          ]
        ]`
      },
      {
        name: '已登录；无提现能力；大陆个人--实名审核未通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@none],
              merchant [
                merchantType [@personal],
                status [@identify_rejected]
              ],
              holderList [@personal]
            ]
          ]
        ]`
      },
      {
        name: '已登录；无提现能力；大陆个人--冻结',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@RMBWithdraw],
              merchant [
                merchantType [@personal],
                status [@frozen]
              ],
              holderList [@personal]
            ]
          ]
        ]`
      },
      // 大陆企业
      {
        name: '已登录；人民币提现能力；大陆企业--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@RMBWithdraw],
              merchant [
                merchantType [@enterprise],
                status [@normal]
              ],
              holderList [@enterprise]
            ]
          ]
        ]`
      },
      // 香港个人
      {
        name: '已登录；外币提现能力；香港个人--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@exchangeWithdraw],
              merchant [
                merchantType [@hkPersonal],
                status [@normal]
              ],
              holderList [@hkPersonal]
            ]
          ]
        ]`
      },
      // 香港企业
      {
        name: '已登录；外币提现能力；香港企业--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@exchangeWithdraw],
              merchant [
                merchantType [@hkEnterprise],
                status [@normal]
              ],
              holderList [@hkEnterprise]
            ]
          ]
        ]`
      },
      // 大陆个人+大陆企业
      {
        name: '已登录；外币提现能力；大陆个人+大陆企业--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@RMBWithdraw],
              merchant [
                merchantType [@personal+enterprise],
                status [@normal]
              ],
              holderList [@personal+enterprise]
            ]
          ]
        ]`
      },
      // 大陆个人+香港企业
      {
        name: '已登录；外币提现能力；大陆个人+香港企业--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@withdraw],
              merchant [
                merchantType [@personal+hkEnterprise],
                status [@normal]
              ],
              holderList [@personal+hkEnterprise]
            ]
          ]
        ]`
      },
      // 香港个人+香港企业
      {
        name: '已登录；外币提现能力；香港个人+香港企业--审核通过',
        value: `[
          @loggedIn [
            result [
              merchantAbility [@exchangeWithdraw],
              merchant [
                merchantType [@hkPersonal+hkEnterprise],
                status [@normal]
              ],
              holderList [@hkPersonal+hkEnterprise]
            ]
          ]
        ]`
      },
      // 未登录
      {
        name: '未登录',
        value: `[
          @notLoggedIn
        ]`
      },
    ]
  }
]