describe('Splash page engine', () => {
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
  it('should be able to render all components on v0 guest form', () => {
    checkRenderedElements('v0-origin', 'guestForm', '')
  })

  it('should be able to render all components on v0 guest social', () => {
    checkRenderedElements('v0-origin', 'guestSocial', 'social')
  })

  it('should be able to render all components on v0 access granted page', () => {
    checkRenderedElements('v0-origin', 'accessGrantedPage', 'login')
  })

  it('should be able to render all components on v0 wifi unavailable page', () => {
    checkRenderedElements('v0-origin', 'wifiUnavailablePage', 'wifi-unavailable')
  })

  it('should be able to render all components on v0 sms access code', () => {
    checkRenderedElements('v0-origin', 'smsAccessCode', 'sms-access-code')
  })

  it('should be able to render all components on v0 sponsor auth', () => {
    checkRenderedElements('v0-origin', 'sponsorAuth', 'sponsor-auth')
  })

  it('should be able to render all components on v0 sponsor code', () => {
    checkRenderedElements('v0-origin', 'sponsorCode', 'sponsor-code')
  })

  it('should be able to render all components on v0 sponsor page', () => {
    checkRenderedElements('v0-origin', 'sponsorPage', 'sponsor')
  })

  it('should be able to render all components on v0 sponsor wait', () => {
    checkRenderedElements('v0-origin', 'sponsorWait', 'sponsor-wait')
  })

  it('should be able to render all components on v1 guest form', () => {
    checkRenderedElements('v1', 'guestForm', '')
  })

  it('should be able to render all components on v1 guest social', () => {
    checkRenderedElements('v1', 'guestSocial', 'social')
  })

  it('should be able to render all components on v1 access granted page', () => {
    checkRenderedElements('v1', 'accessGrantedPage', 'login')
  })

  it('should be able to render all components on v1 wifi unavailable page', () => {
    checkRenderedElements('v1', 'wifiUnavailablePage', 'wifi-unavailable')
  })

  it('should be able to render all components on v1 sms access code', () => {
    checkRenderedElements('v1', 'smsAccessCode', 'sms-access-code')
  })

  it('should be able to render all components on v1 sponsor auth', () => {
    checkRenderedElements('v1', 'sponsorAuth', 'sponsor-auth')
  })

  it('should be able to render all components on v1 sponsor code', () => {
    checkRenderedElements('v1', 'sponsorCode', 'sponsor-code')
  })

  it('should be able to render all components on v1 sponsor page', () => {
    checkRenderedElements('v1', 'sponsorPage', 'sponsor')
  })

  it('should be able to render all components on v1 sponsor wait', () => {
    checkRenderedElements('v1', 'sponsorWait', 'sponsor-wait')
  })

  it('should be able to do form validation on guest form', () => {
    let version = 'v1'
    let pRef = ''
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    let textInput = cy.get('.page-form').find('.text-input').first()
    textInput.find('input').type('a').clear().blur()
    cy.get('.page-form').find('.text-input').first().find('.invalid-feedback').should('be.visible')
    cy.get('.page-form').find('.text-input').first().find('.invalid-feedback').should(($div) => {
      expect($div[0].innerText).to.match(new RegExp(`Field is Required`))
    })
  })

  it('should be able to select country on phone number selection on guest form', () => {
    let version = 'v1'
    let pRef = ''
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    let telInput = cy.get('.page-form').find('.tel-input').first()
    telInput.find('button').click()
    let dropDownElement = cy.get('.page-form').find('.tel-input').first().find('.dropdown.open')
    dropDownElement.should($dropdown => {
      expect($dropdown).to.have.length(1)
    })
    dropDownElement.find('.dropdown-item').contains('Portugal').click()
    cy.get('.page-form').find('.tel-input').first().find('button').find('img[src="flags/PT.png"]').should($img => {
      expect($img).to.have.length(1)
    })
  })
  it('guest form connect button should show popup on preview mode', () => {
    let version = 'v1'
    let pRef = ''
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('.page-form .btn-login-option').click()
    cy.get('.modal-dialog').should($modal => {
      expect($modal).to.have.length(1)
    })
  })

  it('social page login with facebook should show popup on preview mode', () => {
    let version = 'v1'
    let pRef = 'social'
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('.page-form .btn-login-option').contains('Login with Facebook').click()
    cy.get('.modal-dialog').should($modal => {
      expect($modal).to.have.length(1)
    })
  })

  it('social page login with email button should connect to guest form', () => {
    let version = 'v1'
    let pRef = 'social'
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('.page-form .btn-login-option').contains('Login with Email').click()
    cy.url().should('eq', `http://localhost:${port}/?version=${version}#/`)
  })

  it('guest form connect via social network should move to social page', () => {
    let version = 'v1'
    let pRef = ''
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('a').contains('connect via social network').click()
    cy.url().should('eq', `http://localhost:${port}/?version=${version}#/social`)
  })

  it('guest form terms and condition should open popup on preview mode', () => {
    let version = 'v1'
    let pRef = ''
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('a').contains('terms and conditions of usage').click()
    cy.get('.modal-dialog').should($modal => {
      expect($modal).to.have.length(1)
    })
  })

  it('logo should be available on all pages', () => {
    let version = 'v1'
    let pRef = ''
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('.logo-component').should($logo => {
      expect($logo).to.have.length(1)
    })
  })

  it('sponsor wait icon should be available on sponsor wait page', () => {
    let version = 'v1'
    let pRef = 'sponsor-wait'
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('.loader-component').should('be.visible')
  })

  it('request a new access code button should work on sponsor code page', () => {
    let version = 'v1'
    let pRef = 'sponsor-code'
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    cy.get('a').contains('Request a new access code').click()
  })

  it('form validation should work on sponsor code page', () => {
    let version = 'v1'
    let pRef = 'sponsor-code'
    cy.visit(`http://localhost:${port}/?version=${version}#/${pRef}`)
    let textInput = cy.get('.text-input')
    textInput.find('input').click().blur()
    cy.get('.text-input').find('.invalid-feedback').should('be.visible')
    cy.get('.text-input').find('.invalid-feedback').should($validation => {
      expect($validation[0].innerText).to.match(new RegExp(`Field is Required`))
    })
  })

  it('access granted page login button should redirect to login page', () => {
    let version = 'v1'
    cy.visit(`http://localhost:${port}/?version=${version}#/login`)
    cy.get('.btn-login-option').click()
    cy.url().should('eq', `http://localhost:${port}/?#/login`)
  })
})
