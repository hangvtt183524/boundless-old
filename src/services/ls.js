export default {
  get (key) {
    const getAllParams = function (url) {
      var params = {}
      var parser = document.createElement('a')
      parser.href = url
      var query = parser.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        params[pair[0]] = decodeURIComponent(pair[1])
      }
      return params
    }

    const pageParams = getAllParams(window.location.href)

    if (pageParams.noAuth && key === 'auth.token' && process.env.VUE_APP_AUTOMATIC_TOKEN) {
      return process.env.VUE_APP_AUTOMATIC_TOKEN
    }
    return localStorage.getItem(key)
  },

  getJson (key, defaultValue) {
    try {
      const value = this.get(key)
      return value !== null ? JSON.parse(value) : defaultValue
    } catch (e) {
      return defaultValue || {}
    }
  },

  updateInJson (key, field, value) {
    const data = this.getJson(key, {})
    data[field] = value

    try {
      this.set(key, JSON.stringify(data))
    } catch (e) {
      return false
    }

    return true
  },

  set (key, val) {
    localStorage.setItem(key, val)
  },

  remove (key) {
    localStorage.removeItem(key)
  }
}
