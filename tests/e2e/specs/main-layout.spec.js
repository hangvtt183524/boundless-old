describe('When loading the app', () => {
  beforeEach(() => {
    cy.login()

    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/organizations'
    }).as('getOrganizations')
  })

  it('should show all venues item in venues list', () => {
    cy.wait('@getOrganizations').then((res) => {
      const orgList = res.response.body.data
      cy.get('[data-test=top-org-selector]')
        .click()
        .then(() => {
          cy.get('.org-menu-dropdown')
            .find('ul')
            .find('li')
            .should('have.length', orgList.length)
            .eq(3)
            .click()
        })
      cy.get('[data-test=top-org-selector]')
        .find('h3.org-menu-heading')
        .find('span')
        .contains(orgList[3].name)

      cy.get('[data-test=top-group-site-selector]')
        .find('h3.menu-heading')
        .find('span')
        .contains('All venues')
    })
  })
})
