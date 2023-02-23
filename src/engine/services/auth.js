import Vue from 'vue'

export default {
  login (form, params) {
    let authorizer = this.integrations[params.portal]

    // login either using a standard form, or a custom 'login' function
    if (authorizer.hasOwnProperty('login')) {
      authorizer.login(this, form, params)
    } else if (authorizer.hasOwnProperty('build_form')) {
      authorizer.build_form(this, form, params)
      this.submitForm(form)
    }

    // redirect after login if its not natively handled by controller
    if (authorizer.hasOwnProperty('redirect')) {
      authorizer.redirect(this, params)
    }
  },

  toQueryString (params) {
    let qs = Object.keys(params).map(function (key) {
      return key + '=' + params[key]
    }).join('&')

    return qs
  },

  debugProperties (params) {
    let authorizer = this.integrations[params.portal]
    return {
      authorization_url: authorizer.authorization_url(params)
    }
  },
  setAction (form, url) {
    form.setAttribute('action', url)
  },

  setMethod (form, method) {
    form.setAttribute('method', method)
  },

  addInput (form, name, value) {
    let input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', name)
    input.setAttribute('value', value)
    form.appendChild(input)
  },

  submitForm (form) {
    document.createElement('form').submit.call(form)
  },

  dynamicRedirect (params, timeout) {
    Vue.nextTick(function () {
      setTimeout(() => {
        window.location.replace(params.post_authorization_redirection_url)
      }, timeout)
    })
  },

  integrations: {
    meraki: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'success_url', params.post_authorization_redirection_url)
        self.setMethod(form, 'POST')
        self.setAction(form, params.login_url)
      }
    },

    cisco: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'buttonClicked', 4)
        self.addInput(form, 'redirect_url', params.post_authorization_redirection_url)
        self.addInput(form, 'cmd', 'authenticate')
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        return params.switch_url
        // return 'https://1.1.1.1/login.html'
      }
    },

    aruba: {
      build_form (self, form, params) {
        self.addInput(form, 'user', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'url', params.post_authorization_redirection_url)
        self.addInput(form, 'cmd', 'authenticate')
        // self.addInput(form, 'wbaredirect', params.post_authorization_redirection_url)

        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        let server = 'securelogin.arubanetworks.com'
        if (params.switchip) {
          server = params.switchip
        }
        if (params.post) {
          server = params.post
        }
        return 'http://' + server + '/cgi-bin/login'
      }
    },

    aerohive: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'url', params.post_authorization_redirection_url)
        self.addInput(form, 'autherr', 0)
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        return 'http://1.1.1.1/reg.php'
      }
    },

    cambium: {
      build_form (self, form, params) {
        self.addInput(form, 'ga_user', params.radius_user_name)
        self.addInput(form, 'ga_pass', params.password)
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        let qs = 'ga_ap_mac=' + params.ga_ap_mac
        qs += '&ga_ssid='     + params.ga_ssid
        qs += '&ga_nas_id='   + params.ga_nas_id
        qs += '&ga_srvr='     + params.ga_srvr
        qs += '&ga_cmac='     + params.ga_cmac
        qs += '&ga_Qv='       + params.ga_Qv

        return 'http://' + params.ga_srvr + ':880/cgi-bin/hotspot_login.cgi?' + qs
      }
    },

    extreme_wing: {
      build_form (self, form, params) {
        self.addInput(form, 'f_user', params.radius_user_name)
        self.addInput(form, 'f_pass', params.password)
        self.addInput(form, 'f_hs_server', params.hs_server)
        self.addInput(form, 'f_Qv', params.Qv)
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        let port = '880'
        let path = '/cgi-bin/hslogin.cgi'
        let protocol = 'http://'
        let server = params.hs_server
        let url = protocol + server + ':' + port + path
        return url
      }
    },

    extreme_wireless: {
      build_form (self, form, params) {
        self.addInput(form, 'token', params.token)
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'wlan', params.wlan)
        self.addInput(form, 'dest', params.post_authorization_redirection_url)

        // Used when encrpytion is enabled...  extreme cloud?
        if ('X-Amz-Signature' in params) {
          self.addInput(form, 'X-Amz-Algorithm', params['X-Amz-Algorithm'])
          self.addInput(form, 'X-Amz-Credential', params['X-Amz-Credential'])
          self.addInput(form, 'X-Amz-Date', params['X-Amz-Date'])
          self.addInput(form, 'X-Amz-Expires', 600)
          self.addInput(form, 'X-Amz-Signature', params['X-Amz-Signature'])
          self.addInput(form, 'X-Amz-SignedHeaders', params['X-Amz-SignedHeaders'])
        }

        self.setMethod(form, 'GET')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        let protocol = 'https://'
        let server = params.hwc_ip
        let port = params.hwc_port
        let path = '/ext_approval.php'
        let url = protocol + server + ':' + port + path
        return url
      }
    },

    fortinet_forticloud: {
      build_form (self, form, params) {
        self.addInput(form, 'user', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.setMethod(form, 'POST')
        self.setAction(form, params.grant_url)
      }
    },

    huawei_cloud_campus: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'success_url', params.post_authorization_redirection_url)
        self.setMethod(form, 'POST')
        self.setAction(form, params.loginurl)
      }
    },

    mist: {
      redirect (self, params) {
        window.location.replace(params.post_authorization_redirection_url)
      }
    },

    ruckus_smartzone: {
      redirect (self, params) {
        window.location.replace(params.post_authorization_redirection_url)
      }
    },

    ruckus_unleashed: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'url', params.post_authorization_redirection_url)
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        return 'http://' + params.sip + ':9997/login'
      }
    },

    ruckus_zonedirector: {
      build_form (self, form, params) {
        self.addInput(form, 'user', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        let port = '9997'
        let path = '/login'
        let protocol = 'http://'
        let server = params.nbiIP
        let url = protocol + server + ':' + port + path
        return url
      }
    },

    ubiquiti_unifi: {
      login (self, form, params) {
        // Ubiquiti UniFi is an utter piece of shit.
        // We must submit the authroization to the contorller using a JSON api, and handle an AJAX request to handle the redirection
        // manually.
        // Since its json, we can't do a cross-domain request from our page (hosted on our servers),
        // So we need to:
        // - redirect the user to a page hosted on the controller,
        // - send auth credentials and redirect urls as parameters
        // - handle the AJAX post from this page, and also handle the redirection in both success and failure scenarios
        let username = params.radius_user_name
        let password = params.password
        let successUrl = params.post_authorization_redirection_url
        let authPage = params.unifi_login_url + `?username=${username}&password=${password}&success_url=${successUrl}`
        window.location.replace(authPage)
        throw new Error('This is not an error. This is just to abort javascript to make the page change')
      }
    },

    zyxel_usg: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.addInput(form, 'mp_idx', params.mp_idx)
        self.addInput(form, 'mobile', '1')
        self.setMethod(form, 'POST')
        self.setAction(form, params.gw_addr + params.auth_path)
        // self.dynamicRedirect()
      },

      redirect (self, params) {
        self.dynamicRedirect(params, 3000)
      }
    },

    zyxel_nebula: {
      build_form (self, form, params) {
        self.addInput(form, 'username', params.radius_user_name)
        self.addInput(form, 'password', params.password)
        self.setMethod(form, 'POST')
        self.setAction(form, this.authorization_url(params))
      },
      authorization_url (params) {
        // let url = params.apurl || params.url
        return params.gw_addr + params.auth_path
      }
    }
  }
}
