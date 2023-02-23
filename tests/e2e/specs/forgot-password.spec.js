describe('The forgot password page', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('[data-test=forgot-link]').click()
  })

  it('should be able to forgot password with a correct email', () => {
    cy.get('[data-test=forgot-email]').type('root@boundlessdigital.fr')
    cy.get('[data-test=forgot-password-button]').click()
    cy.get('[data-test=forgot-password-button]').should('have.not.attr', 'disabled')
    cy.get('#toast-container .toast-success')
  })

  it('should show a validation error when reset link in without an email', () => {
    cy.get('[data-test=forgot-password-button]').click()
    cy.get('.forgot-email > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=forgot-password-button]').should('have.attr', 'disabled').and('include', 'disabled')
  })

  it('should show a validation error when input incorrect email type', () => {
    cy.get('[data-test=forgot-email]').type('root')
    cy.get('[data-test=forgot-email]').blur()
    cy.get('.forgot-email > .v-input__control > .v-text-field__details > .v-messages > .v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=forgot-password-button]').should('have.attr', 'disabled').and('include', 'disabled')
  })

  it('should have a link to login page', () => {
    cy.get('[data-test=login-link]')
  })

  it('should go to login page when clicking the "Already have an account?" link', () => {
    cy.get('[data-test=login-link]').click()
  })
})
