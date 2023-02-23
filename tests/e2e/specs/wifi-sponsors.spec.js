describe('The Wifi Add Sponsors Page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/wifi/sponsored-access/sponsor')
    })
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')
    cy.wait('@getManageableNodes')
  })

  it('save button will disabled first time and then it will enable when there is any changes', () => {
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=sponsors]').find('[data-test=assign-emails-form]').as('emailsForm')
    cy.get('@emailsForm').find('[data-test=email-input]').type('root@boundless.app')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.not.attr', 'disabled')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').click()
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should show a validation error and disable add email button when input incorrect email type', () => {
    cy.get('[data-test=sponsors]').find('[data-test=assign-emails-form]').as('emailsForm')
    cy.get('@emailsForm').find('[data-test=email-input]').type('root')
    cy.get('@emailsForm').find('.email-input').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.attr', 'disabled')
    cy.get('@emailsForm').find('[data-test=email-input]').type('{selectall}').type('{backspace}').type('root@boundless.a')
    cy.get('@emailsForm').find('.email-input').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.attr', 'disabled')
  })

  it('should be able to add email to Assign one or more emails', () => {
    cy.get('[data-test=sponsors]').find('[data-test=assign-emails-form]').as('emailsForm')
    cy.get('@emailsForm').find('[data-test=email-input]').type('root@boundless.app')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.not.attr', 'disabled')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').click()
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should show a validation error and disable add email button when input same email', () => {
    cy.get('[data-test=sponsors]').find('[data-test=assign-emails-form]').as('emailsForm')
    cy.get('@emailsForm').find('[data-test=email-input]').type('root@boundless.app')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.not.attr', 'disabled')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').click()
    cy.get('@emailsForm').find('[data-test=email-input]').type('root@boundless.app')
    cy.get('@emailsForm').find('.email-input').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.attr', 'disabled')
  })

  it('should be able to remove email in Assign one or more emails', () => {
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=sponsors]').find('[data-test=assign-emails-form]').as('emailsForm')
    cy.get('@emailsForm').find('[data-test=email-input]').type('root@boundless.app')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').should('have.not.attr', 'disabled')
    cy.get('@emailsForm').find('[data-test=btn-add-email]').click()
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
    cy.get('@emailsForm').find('[data-test=added-emails]').find('[data-test=added-email]').first()
      .find('.item-row').find('.item-action').find('[data-test=btn-delete]').click()
  })

  it('should show a validation error and disable add domain button when input incorrect domain type', () => {
    cy.get('[data-test=sponsors]').find('[data-test=assign-domains-form]').as('domainsForm')
    cy.get('@domainsForm').find('[data-test=domain-input]').type('boundless')
    cy.get('@domainsForm').find('.domain-input').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').should('have.attr', 'disabled')
    cy.get('@domainsForm').find('[data-test=domain-input]').type('{selectall}').type('{backspace}').type('boundless.a')
    cy.get('@domainsForm').find('.domain-input').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').should('have.attr', 'disabled')
  })

  it('should be able to add domain to Assign one or more domains', () => {
    cy.get('[data-test=sponsors]').find('[data-test=assign-domains-form]').as('domainsForm')
    cy.get('@domainsForm').find('[data-test=domain-input]').type('boundless.app')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').should('have.not.attr', 'disabled')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').click()
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should show a validation error and disable add domain button when input same domain', () => {
    cy.get('[data-test=sponsors]').find('[data-test=assign-domains-form]').as('domainsForm')
    cy.get('@domainsForm').find('[data-test=domain-input]').type('boundless.app')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').should('have.not.attr', 'disabled')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').click()
    cy.get('@domainsForm').find('[data-test=domain-input]').type('boundless.app')
    cy.get('@domainsForm').find('.domain-input').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').should('have.attr', 'disabled')
  })

  it('should be able to remove domain in Assign one or more domains', () => {
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=sponsors]').find('[data-test=assign-domains-form]').as('domainsForm')
    cy.get('@domainsForm').find('[data-test=domain-input]').type('boundless.app')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').should('have.not.attr', 'disabled')
    cy.get('@domainsForm').find('[data-test=btn-add-domain]').click()
    cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
    cy.get('@domainsForm').find('[data-test=added-domains]').find('[data-test=added-domain]').first()
      .find('.item-row').find('.item-action').find('[data-test=btn-delete]').click()
  })

  it('personalization form will disable when Allow Wifi personalization disabled', () => {
    cy.get('[data-test=sponsors]').find('[data-test=personalization-form]').as('personalizationForm')
    cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]')
      .find('.v-input--selection-controls').then(($togle) => {
        if ($togle.hasClass('v-input--is-label-active')) {
          cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]').find('.v-input--selection-controls').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@personalizationForm').should('have.attr', 'disabled')
  })

  it('personalization form will enable Allow Wifi personalization enabled', () => {
    cy.get('[data-test=sponsors]').find('[data-test=personalization-form]').as('personalizationForm')
    cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]')
      .find('.v-input--selection-controls').then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]').find('.v-input--selection-controls').find('.v-input--selection-controls__input').click()
        }
        cy.get('@personalizationForm').should('have.not.attr', 'disabled')
      })
    cy.get('@personalizationForm').should('have.not.attr', 'disabled')
  })

  it('personalization switchs can change when Allow Wifi personalization enabled', () => {
    cy.get('[data-test=sponsors]').find('[data-test=personalization-form]').as('personalizationForm')
    cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]')
      .find('.v-input--selection-controls').then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]').find('.v-input--selection-controls').find('.v-input--selection-controls__input').click()
        }
        cy.get('@personalizationForm').should('have.not.attr', 'disabled')
        cy.get('@personalizationForm').find('[data-test=switch-access-window]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('@personalizationForm').find('[data-test=switch-session-duration]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('@personalizationForm').find('[data-test=switch-data-limit]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('@personalizationForm').find('[data-test=switch-bandwidth-limit]').eq(0).find('.v-input--selection-controls__input').click()
      })
  })

  it('should be able to save wifi sponsors data', () => {
    cy.get('[data-test=sponsors]').find('[data-test=personalization-form]').as('personalizationForm')
    cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]')
      .find('.v-input--selection-controls').then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('[data-test=sponsors]').find('[data-test=switch-personalization]').find('.v-input--selection-controls').find('.v-input--selection-controls__input').click()
        }
        cy.get('@personalizationForm').should('have.not.attr', 'disabled')
        cy.get('@personalizationForm').find('[data-test=switch-access-window]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('@personalizationForm').find('[data-test=switch-session-duration]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('@personalizationForm').find('[data-test=switch-data-limit]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('@personalizationForm').find('[data-test=switch-bandwidth-limit]').eq(0).find('.v-input--selection-controls__input').click()
        cy.get('[data-test=sponsors]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
        cy.get('[data-test=sponsors]').find('[data-test=btn-save]').click()
        cy.get('#toast-container .toast-success')
      })
  })
})
