import axios from 'axios'

export default {
  getSignedURL (file) {
    let endpoint = 'https://24sfotd2mk.execute-api.eu-west-1.amazonaws.com/dev/'
    let payload = {
      filePath: file.name,
      contentType: file.type
    }

    return axios.post(endpoint, payload)
      .then((res) => {
        return Promise.resolve(res.data.url || '/')
      })
      .catch((err) => {
        console.error(err)
        return Promise.reject(err)
      })
  }
}
