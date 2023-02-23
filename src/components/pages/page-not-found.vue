<script>
export default {
  name: 'page-not-found-page',

  template: '',

  created () {
    let port = window.location.port ? ':' + window.location.port : ''
    window.location.href = `${window.location.protocol}//${window.location.hostname}${port}/404.html`
  }
}
</script>
