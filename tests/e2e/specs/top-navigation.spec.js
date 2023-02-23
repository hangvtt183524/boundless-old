describe('The Top Org/Node selector', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/settings/general')
    })

    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')

    cy.route({
      method: 'PATCH',
      url: '/api/organization/1/'
    }).as('updateOrganization')

    cy.get('[data-test=organization-settings]').find('[data-test=settings-list]').as('settingsList')
  })

  it('should be able to select Node in Venue Swicher', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=top-group-site-selector]').click()
      cy.get('.menuable__content__active > .v-card').find('.group-site-list > .list-item').eq(1).click()
      cy.url().should('not.include', '/1/1/settings/general')
    })
  })

  it('should be change group site navigation when select node', () => {
    cy.visit('/1/1/monitoring/wifi-analytics')
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-org]').should('have.exist')
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-node]').should('have.not.exist')
      cy.get('[data-test=top-group-site-selector]').click()
      cy.get('.menuable__content__active > .v-card').find('.group-site-list > .list-item').eq(1).click()
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-node]').should('have.exist')
    })
  })

  it('should be change node selector when click group/site navigation', () => {
    cy.visit('/1/1/monitoring/wifi-analytics')
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-org]').should('have.exist')
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-node]').should('have.not.exist')
      cy.get('[data-test=top-group-site-selector]').click()
      cy.get('.menuable__content__active > .v-card').find('.group-site-list > .list-item').eq(1).click()
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-node]').should('have.exist')
      cy.url().should('not.include', '/1/1/monitoring/wifi-analytics')
      cy.get('[data-test=group-site-navigation]').find('[data-test=nav-org]').click()
      cy.url().should('include', '/1/1/monitoring/wifi-analytics')
    })
  })

  it('should be able to select org node when click close ion in Venue Switcher', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=top-group-site-selector]').click()
      cy.get('.menuable__content__active > .v-card').find('.group-site-list > .list-item').eq(1).click()
      cy.url().should('not.include', '/1/1/settings/general')
      cy.get('[data-test=top-group-site-selector]').find('.close-icon').click()
      cy.url().should('include', '/1/1/settings/general')
    })
  })

  it('should be able to redirect to wifi analyties page when we change org switcher', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=top-org-selector]').click()
      cy.get('.menuable__content__active').find('[data-test=org-list]').children().eq(0).click()
      cy.url().should('include', '/monitoring/wifi-analytics')
    })
  })

  it('should be able to add/search/delete organization', () => {
    cy.route({
      method: 'POST',
      url: '/api/organization/'
    }).as('createOrg')

    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=top-org-selector]').click()
      cy.get('.menuable__content__active').find('[data-test=btn-add-org]').click()
      cy.get('[data-test=add-new-org-dialog]').find('[data-test=org-name]').find('[data-test=org-name]').type('E2e Test')
      cy.get('[data-test=add-new-org-dialog]').find('[data-test=btn-create-org]').click()
      cy.wait('@createOrg').then((xhr) => {
        const newId = xhr.response.body.data.id
        const name = xhr.response.body.data.name
        cy.url().should('include', '/monitoring/wifi-analytics')
        cy.log('new Organization Added')
        cy.visit(`/${newId}/${newId}/settings/general`)
        cy.route({
          method: 'DELETE',
          url: `/api/organization/${newId}/`
        }).as('deleteOrg')
        cy.route({
          method: 'GET',
          url: `/api/node/${newId}/tree/?layout=flat&types=organization,group,site,floor`
        }).as('getNewManageableNodes')
        cy.wait('@getNewManageableNodes').then(() => {
          cy.get('[data-test=top-org-selector]').click()
          cy.get('.menuable__content__active').find('[data-test=search-input]').type(name)
          cy.get('.menuable__content__active').find('[data-test=org-list]').children().should('have.not.length', 0)
          cy.get('[data-test=organization-settings]').find('[data-test=settings-general-page]').as('generalPage')
          cy.get('@generalPage').find('[data-test=btn-delete-organization]').click()
          cy.log('~~ should be disabled Delete button, if Confirm Text is empty')
          cy.get('[data-test=confirm-delete]').find('[data-test=btn-delete]').should('have.attr', 'disabled')
          cy.log('~~ should be disabled Delete button, if Confirm Text is incorrect')
          cy.get('[data-test=confirm-delete]').find('[data-test=confirm-text]').type('I wish to delete all data for')
          cy.get('[data-test=confirm-delete]').find('[data-test=btn-delete]').should('have.attr', 'disabled')
          cy.get('[data-test=confirm-delete]').find('[data-test=confirm-text]')
            .type('{selectall}').type('{backspace}').type(`I wish to delete all data for ${name}`)
          cy.get('[data-test=confirm-delete]').find('[data-test=btn-delete]').should('have.not.attr', 'disabled')
          cy.get('[data-test=confirm-delete]').find('[data-test=btn-delete]').click()
          cy.wait('@deleteOrg').then(() => {
            cy.log('deleted org successfully')
          })
        })
      })
    })
  })
})
