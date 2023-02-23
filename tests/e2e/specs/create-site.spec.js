describe('The Create Site Page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/venues')
    })
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=venues-list]').find('[data-test=btn-create-site]').click()
    })
  })

  it('should show validation error with empty character in name', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-name]')
      .find('[data-test=site-name]').type('test').type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-name]')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with space character in name', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-name]')
      .find('[data-test=site-name]').type('   ').blur()
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-name]')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with empty character in timezone', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-timezone]').focus().blur()
    cy.get('[data-test=new-site-dialog]').find('.site-timezone')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with empty character in address', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').focus().blur()
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-address]').find('.error-messages')
      .should('have.not.length', 0)
  })

  it('should be able to auto select timezone when we select address', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').type('2532')
    cy.get('.pac-container').should('have.attr', 'style').and('not.include', 'display: none')
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').type('{downarrow}').type('{enter}')
    cy.get('[data-test=new-site-dialog]').find('.site-timezone').find('.v-input__slot').find('.v-select__selections').find('.v-select__selection--comma').should('have.exist')
  })

  it('should be disabled Continue button until input correct info', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-name]').find('[data-test=site-name]').type('site 1')
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').type('2532')
    cy.get('.pac-container').should('have.attr', 'style').and('not.include', 'display: none')
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').type('{downarrow}').type('{enter}')
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=new-site-dialog]').find('.site-industry .v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
  })

  it('should be able to create new site', () => {
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('[data-test=new-site-dialog]').find('[data-test=site-name]').find('[data-test=site-name]').type('site 1')
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').type('2532')
    cy.get('.pac-container').should('have.attr', 'style').and('not.include', 'display: none')
    cy.get('[data-test=new-site-dialog]').find('[data-test=address-input]').type('{downarrow}').type('{enter}')
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=new-site-dialog]').find('.site-industry .v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').click()
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-skip]').click()
    cy.get('[data-test=new-site-dialog]').find('[data-test=btn-next]').click()
    cy.get('#toast-container .toast-success')
  })
})
