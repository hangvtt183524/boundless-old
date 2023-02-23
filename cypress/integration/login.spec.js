describe('The login page', () => {
  it('should be able to log in with a correct email and password', () => {
    // cy.visit('/')
    // cy.get('[data-test=login-email]').type('root@boundless.app')
    // cy.get('[data-test=login-password]').type('boundless')
    // cy.get('[data-test=login-button]').click()
    // cy.get('[data-test=navigation-organization-selector]')
  }),

  it('should show a validation error when logging in without an email', () => {})
  it('should show a validation error when logging in without a password', () => {})

  it('should show an error alert when logging in with a bad email', () => {})
  it('should show an error alert when logging in with a bad password', () => {})

  it('should show the cleartext password when clicking on the eye icon', () => {})
  it('should hide the  password when clicking on the hide-eye icon', () => {})


  it('should have a link to sign up as a new user', () => {})
  it('should have a link to reset your password', () => {})

  it('should take you to the signup page when clicking the "new user" link', () => {})
  it('should launch the reset password modal when clicking the "forgot password" link', () => {})
})
