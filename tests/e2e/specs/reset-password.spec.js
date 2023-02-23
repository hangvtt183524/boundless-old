describe('The reset password page', () => {
  beforeEach(() => {
    cy.visit('/reset-password/:uidb64/:token')
  })

  it('should be able to rest password with a correct new password and confirm password', () => {
    cy.get('[data-test=new-password]').type('boundless')
    cy.get('[data-test=confirm-password]').type('boundless')
    cy.get('[data-test=reset-password-button]').should('have.not.attr', 'disabled')
    cy.get('[data-test=reset-password-button]').click()
  })

  it('should show the cleartext new password when clicking on the eye icon', () => {
    cy.get('[data-test=new-password]').type('boundless')
    cy.get('.new-password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
    cy.get('[data-test=new-password]')
      .should('have.attr', 'type').and('include', 'text')
  })

  it('should hide the new password when clicking on the hide-eye icon', () => {
    cy.get('[data-test=new-password]').type('boundless')
    cy.get('[data-test=new-password]')
      .should('have.attr', 'type').and('include', 'password')
  })

  it('should show the cleartext confirm password when clicking on the eye icon', () => {
    cy.get('[data-test=confirm-password]').type('boundless')
    cy.get('.confirm-password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
    cy.get('[data-test=confirm-password]')
      .should('have.attr', 'type').and('include', 'text')
  })

  it('should hide the confirm password when clicking on the hide-eye icon', () => {
    cy.get('[data-test=confirm-password]').type('boundless')
    cy.get('[data-test=confirm-password]')
      .should('have.attr', 'type').and('include', 'password')
  })

  it('should show a validation error when input less 8 characters to new password with confirm password', () => {
    cy.get('[data-test=new-password]').type('test')
    cy.get('[data-test=confirm-password]').type('test')
    cy.get('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=reset-password-button]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input less 8 characters to new password without confirm password', () => {
    cy.get('[data-test=new-password]').type('test')
    cy.get('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=reset-password-button]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input more 25 characters to new password with confirm password', () => {
    cy.get('[data-test=new-password]').type('12345678901234567890123456')
    cy.get('[data-test=confirm-password]').type('12345678901234567890123456')
    cy.get('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=reset-password-button]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input more 25 characters to new password without confirm password', () => {
    cy.get('[data-test=new-password]').type('12345678901234567890123456')
    cy.get('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=reset-password-button]').should('have.attr', 'disabled')
  })

  it("should show a validation error when input confirm password doesn't match with new password", () => {
    cy.get('[data-test=new-password]').type('boundless')
    cy.get('[data-test=confirm-password]').type('boundless1')
    cy.get('.confirm-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=reset-password-button]').should('have.attr', 'disabled')
  })
})
