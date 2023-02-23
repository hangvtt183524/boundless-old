describe('The signup page', () => {
  beforeEach(() => {
    cy.visit('/sign-up')
  })

  it('should be able to signup with a correct name, email, password, phone', () => {
    cy.get('[data-test=signup-name]').type('boundless')
    cy.get('[data-test=signup-email]').type(`${new Date().getTime()}@boundlessdigital.fr`)
    cy.get('[data-test=signup-password]').type('boundless')
    cy.get('[data-test=phone-input]').type('433333333')
    cy.get('[data-test=signup-button]').should('have.not.attr', 'disabled')
    // cy.get('[data-test=signup-button]').click()
    // cy.url().should('not.eq', `${root}/sign-up`)
  })

  it('should show an error alert when sign up with already exists email', () => {
    cy.get('[data-test=signup-name]').type('boundless')
    cy.get('[data-test=signup-email]').type(`root@boundlessdigital.fr`)
    cy.get('[data-test=signup-password]').type('boundless')
    cy.get('[data-test=phone-input]').type('433333333')
    cy.get('[data-test=signup-button]').should('have.not.attr', 'disabled')
    cy.get('[data-test=signup-button]').click()
    cy.get('#toast-container .toast-error')
  })

  it('should show name validation error with empty character', () => {
    cy.get('[data-test=signup-name]').focus()
    cy.get('[data-test=signup-name]').blur()
    cy.get('.signup-name').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')

    cy.get('[data-test=signup-name]').type('b')
    cy.get('[data-test=signup-name]').type('{backspace}')
    cy.get('.signup-name').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when input incorrect email type', () => {
    cy.get('[data-test=signup-email]').type('root')
    cy.get('[data-test=signup-email]').blur()
    cy.get('.signup-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show email validation error with empty character', () => {
    cy.get('[data-test=signup-email]').focus()
    cy.get('[data-test=signup-email]').blur()
    cy.get('.signup-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')

    cy.get('[data-test=signup-email]').type('b')
    cy.get('[data-test=signup-email]').type('{backspace}')
    cy.get('.signup-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show the cleartext password when clicking on the eye icon', () => {
    cy.get('[data-test=signup-password]').type('boundless')
    cy.get('.signup-password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
    cy.get('[data-test=signup-password]')
      .should('have.attr', 'type').and('include', 'text')
  })

  it('should hide the password when clicking on the hide-eye icon', () => {
    cy.get('[data-test=signup-password]').type('boundless')
    cy.get('[data-test=signup-password]')
      .should('have.attr', 'type').and('include', 'password')
  })

  it('should show a validation error when input less 8 characters to password', () => {
    cy.get('[data-test=signup-password]').type('test')
    cy.get('.signup-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when input more 25 characters to password', () => {
    cy.get('[data-test=signup-password]').type('12345678901234567890123456')
    cy.get('.signup-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when input incorrect phone number', () => {
    cy.get('[data-test=phone-input]').type('43333333')
    cy.get('[data-test=phone-input]').blur()
    cy.get('[data-test=phone-error]')
  })

  it('should be able to change phone prefix', () => {
    cy.get('[data-test=open-phone-flags-button]').click()
    cy.get('[data-test=phone-flag-US]').click()
    cy.get('[data-test=phone-input]').type('2014667776')
    cy.get('[data-test=phone-input]').blur()
    cy.get('[data-test=phone-error-messages]').children().should('have.length', 0)
  })
})
