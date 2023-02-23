describe('Splash page engine sponsor', () => {
  let port = 8081
  const checkRenderedElements = function (version, pageName, pRef) {
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy
      .request('GET', `http://localhost:${port}/config.${version}.json`)
      .then((response) => {
        // console.log('response.body', response.body)
        let pages = response.body.splash_page.config.pages
        let page = pages[pageName]
        let keys = Object.keys(page)
        let totalElementCnt = 0
        keys.forEach(key => {
          let elements = page[key]
          if (!Array.isArray(elements)) {
            elements = [elements]
          }
          totalElementCnt += elements.length
        })
        cy.get('.page-form').children().should($children => {
          expect($children).to.have.length(totalElementCnt)
        })
      })
  }

  it('should be able to load defaultPage defined in JSON', () => {

  })

  it('sponsor page form should submit correct format', () => {

  })

  it('sponsor page should redirect to page which api returned when success', () => {
  })

  it('sponsor page should show error message when api return error', () => {
  })

  it('sponsor wait page should poll input every 1.5s till success or fail', () => {
  })

  it('after sponsor wait success it should redirect to login', () => {
  })

  it('if sponsor wait page get error, it should show retry login message', () => {
  })

  it('code page should submit the form to portal/sponsor/code/', () => {

  })

  it('on sponsor authorization page, should be able to select time selector and submit the form', () => {
  })

  it('If authorization success, it should show access granted wifi access', () => {

  })

  it('If authorization fail, it should show retry login message', () => {

  })
})
