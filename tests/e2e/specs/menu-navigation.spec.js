describe('The Navigation Menu', () => {
  beforeEach(() => {
    cy.login()
  })

  describe('Monitoring Menu', () => {
    it('should have a Monitoring menu', () => {
      cy.get('data-test-menu-monitoring')
    })
  })
})
