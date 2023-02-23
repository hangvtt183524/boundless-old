describe('The contact us page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/profile')
    })
    cy.get('[data-test=main-toolbar]').find('[data-test=user-menu-1]').find('[data-test=btn-user-menu-1]').click()
    cy.get('[data-test=user-menu-list-1]')
      .find('[data-test=item-contact-us]').click()
  })

  it('should show a validation error when input empty value to name', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-name]')
      .type('{selectall}').type('{backspace}')
    cy.get('[data-test=contact-us-dialog]').find('.contact-us-name').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when input empty value to email', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-email]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('.contact-us-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when input incorrect type email', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-email]')
      .type('{selectall}').type('{backspace}').type('root').blur()
    cy.get('[data-test=contact-us-dialog]').find('.contact-us-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when input empty value to phone number', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-error]')
  })

  it('should show a validation error when input incorrect phone number', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').type('43333333').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-error]')
  })

  it('should be able to change phone prefix', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=open-phone-flags-button]').click()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-flag-US]').click()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]').type('2014667776').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-error-messages]').children().should('have.length', 0)
  })

  it('should be able to change availability', () => {
    cy.wait(1000)
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-availability]').eq(0).click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-availability]')
      .find('.v-select__selections').children().should('have.length', 2)
  })

  it('should show a validation error when input empty value to message', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-message]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('.contact-us-message').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should be able to send message with correct values', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-name]')
      .type('{selectall}').type('{backspace}').type('root')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-email]')
      .type('{selectall}').type('{backspace}').type('root@boundlessdigital.fr')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').type('433333333')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-availability]').eq(0).click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-message]')
      .type('{selectall}').type('{backspace}').type('contact us e2e test')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').should('have.not.attr', 'disabled')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').click()
    cy.get('#toast-container .toast-success')
  })

  it('should be disabled Send button when input incorrect type values', () => {
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-name]')
      .type('{selectall}').type('{backspace}').type('root')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-email]')
      .type('{selectall}').type('{backspace}').type('root@boundlessdigital.fr')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').type('433333333')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-availability]').eq(0).click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-message]')
      .type('{selectall}').type('{backspace}').type('contact us e2e test')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').should('have.not.attr', 'disabled')
    cy.log('Enabled Send Button !!!')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-name]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').should('have.attr', 'disabled')
    cy.log('Disabled Send Button !!!')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-name]').type('root')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-email]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').should('have.attr', 'disabled')
    cy.log('Disabled Send Button !!!')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-email]').type('root@boundlessdigital.fr')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').should('have.attr', 'disabled')
    cy.log('Disabled Send Button !!!')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=phone-input]').type('433333333')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-message]')
      .type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=contact-us-dialog]').find('[data-test=btn-send]').should('have.attr', 'disabled')
    cy.log('Disabled Send Button !!!')
    cy.get('[data-test=contact-us-dialog]').find('[data-test=contact-us-message]').type('contact us e2e test')
  })
})
