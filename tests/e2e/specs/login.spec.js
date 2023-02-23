describe('The login page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  it('should be able to login with a correct email and password', () => {
    cy.get('[data-test=login-email]').type('root@boundlessdigital.fr')
    cy.get('[data-test=login-password]').type('boundless')
    cy.get('[data-test=login-button]').click()
    cy.get('[data-test=logged-in]')
  })
  it('should show a validation error when logging in without an email and password', () => {
    cy.get('[data-test=login-button]').click()
    cy.get('.login-email > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('.login-password > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when logging in without an email', () => {
    cy.get('[data-test=login-password]').type('boundless')
    cy.get('[data-test=login-button]').click()
    cy.get('.login-email > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show a validation error when logging in without password', () => {
    cy.get('[data-test=login-email]').type('root@boundlessdigital.fr')
    cy.get('[data-test=login-button]').click()
    cy.get('.login-password > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show an error alert when logging in with a bad email', () => {
    cy.get('[data-test=login-email]').type('root@boundless.app')
    cy.get('[data-test=login-password]').type('boundless')
    cy.get('[data-test=login-button]').click()
    cy.get('#toast-container .toast-error')
  })

  it('should show an error alert when logging in with a bad password', () => {
    cy.get('[data-test=login-email]').type('root@boundlessdigital.fr')
    cy.get('[data-test=login-password]').type('test')
    cy.get('[data-test=login-button]').click()
    cy.get('#toast-container .toast-error')
  })

  it('should show the cleartext password when clicking on the eye icon', () => {
    cy.get('[data-test=login-password]').type('boundless')
    cy.get('.login-password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
    cy.get('[data-test=login-password]')
      .should('have.attr', 'type').and('include', 'text')
  })
  it('should hide the  password when clicking on the hide-eye icon', () => {
    cy.get('[data-test=login-password]').type('boundless')
    cy.get('[data-test=login-password]')
      .should('have.attr', 'type').and('include', 'password')
  })

  it('should have a link to sign up as a new user', () => {
    cy.get('[data-test=signup-link]').should('have.attr', 'href').and('include', '/sign-up')
  })
  it('should have a link to reset your password', () => {
    cy.get('[data-test=forgot-link]')
  })

  it('should take you to the signup page when clicking the "new user" link', () => {
    cy.get('[data-test=signup-link]')
      .should('have.attr', 'href').and('include', '/sign-up')
      .then((href) => {
        cy.visit(href)
        cy.get('[data-test=signup-page]')
      })
  })
  it('should launch the reset password modal when clicking the "forgot password" link', () => {
    cy.get('[data-test=forgot-link]').click()
    cy.get('[data-test=forgot-password-button]')
  })

  it('should be able to log out of the dashboard', () => {
    cy.login()
    cy.get('[data-test=user-menu]').click()
    cy.get('[data-test=logout-user]').click()
    cy.get('.login-container')
  })
})
