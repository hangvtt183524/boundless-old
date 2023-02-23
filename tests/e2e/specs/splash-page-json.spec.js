describe('Splash page builder JSON test', () => {
  it('v1 template should have 1.2em lineHeight on Heading component and others 1.5em except logo and loading component', () => {
    let port = 8081
    let version = 'v1'
    cy
      .request('GET', `http://localhost:${port}/config.${version}.json`)
      .then((response) => {
        console.log('response.body', response.body)
        let pages = response.body.splash_page.config.pages
        Object.keys(pages).forEach(pageName => {
          let page = pages[pageName]
          let keys = Object.keys(page)
          keys.forEach(key => {
            let elements = page[key]
            if (!Array.isArray(elements)) {
              elements = [elements]
            }
            elements.forEach((element) => {
              console.log('testing element', element)
              if (element.config.version === 'v1') {
                if (element.component === 'heading') {
                  expect(element.config.lineHeight).to.equal('1.2em')
                } else if (['loader', 'logo'].indexOf(element.component) === -1) {
                  expect(element.config.lineHeight).to.equal('1.5em')
                }
              }
            })
          })
        })
      })
  })
  it('v0 template -> terms-checkbox should not contain background rgba(0,0,0,0.6)', () => {
    let port = 8081
    let version = 'v0-origin'
    cy
      .request('GET', `http://localhost:${port}/config.${version}.json`)
      .then((response) => {
        console.log('response.body', response.body)
        let pages = response.body.splash_page.config.pages
        Object.keys(pages).forEach(pageName => {
          let page = pages[pageName]
          let keys = Object.keys(page)
          keys.forEach(key => {
            let elements = page[key]
            if (!Array.isArray(elements)) {
              elements = [elements]
            }
            elements.forEach((element) => {
              console.log('testing element', element)
              if (element.component === 'terms-checkbox') {
                let rgba = element.config.backgroundColor.rgba
                let rgbaText = `${rgba.r},${rgba.g},${rgba.b},${rgba.a}`
                expect(rgbaText).to.not.equal('0,0,0,0.6')
              }
            })
          })
        })
      })
  })
})
