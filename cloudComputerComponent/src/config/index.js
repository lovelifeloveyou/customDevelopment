module.exports = {
  ...require(`./${process.env.VUE_APP_MODE}`),
  accessToken: {
    get: () => {
      return sessionStorage.getItem('access_token')
    },
    set: (value) => {
      return sessionStorage.setItem('access_token', value)
    }
  },
  refreshToken: {
    get: () => {
      return sessionStorage.getItem('refresh_token')
    },
    set: (value) => {
      return sessionStorage.setItem('refresh_token', value)
    }
  }
}