describe('Splash page creation', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/265/265/marketing/splash-pages')
    })
  })

  it('should be able to create new splash page using new splash page button', () => {
    cy.wait(1000)
    cy.get('.main-container .page-content button').contains('New Splash page').click()
    cy.wait(1000)
    cy.get('.v-dialog--active .selection-panel').contains('Page Configurator').click()
    cy.wait(1000)
    cy.get('.v-dialog--active button').contains('Create').click()
    cy.wait(4000)
    cy.url().should('match', /\/page-builder\/[0-9]+/)
  })
})
