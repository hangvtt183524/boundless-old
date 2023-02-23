describe('The Create User Page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/users')
    })
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=user-list]').find('[data-test=btn-invite-user]').click()
    })
  })

  it('should show validation error with empty character in name', () => {
    cy.get('[data-test=new-user-dialog]').find('[data-test=user-name]')
      .find('[data-test=user-name]').type('test').type('{selectall}').type('{backspace}').blur()
    cy.get('[data-test=new-user-dialog]').find('[data-test=user-name]')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with more 64 character in name', () => {
    cy.get('[data-test=new-user-dialog]').find('[data-test=user-name]')
      .find('[data-test=user-name]').type('should show validation error with more 64 character in name more 64 character in name').blur()
    cy.get('[data-test=new-user-dialog]').find('[data-test=user-name]')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with empty character in email', () => {
    cy.get('[data-test=new-user-dialog]')
      .find('[data-test=user-email]').focus().blur()
    cy.get('[data-test=new-user-dialog]').find('.user-email')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with incorrect type email', () => {
    cy.get('[data-test=new-user-dialog]')
      .find('[data-test=user-email]').type('root').blur()
    cy.get('[data-test=new-user-dialog]').find('.user-email')
      .find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should be able to invite user', () => {
    cy.get('[data-test=new-user-dialog]').find('[data-test=btn-invite]').should('have.attr', 'disabled')
    cy.get('[data-test=new-user-dialog]').find('[data-test=user-name]')
      .find('[data-test=user-name]').type('test')
    cy.get('[data-test=new-user-dialog]')
      .find('[data-test=user-email]').type('test@mail.com')
    cy.get('[data-test=new-user-dialog]').find('[data-test=btn-invite]').should('have.not.attr', 'disabled')
    cy.get('[data-test=new-user-dialog]').find('[data-test=btn-invite]').click()
    cy.get('#toast-container .toast-success')
  })
})
