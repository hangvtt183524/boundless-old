describe('The Create Device Page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/inventory')
    })
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=inventory-list]').find('[data-test=btn-create-device]').click()
    })
  })

  it('should show validation error with empty character name in create manually', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').first().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=manual-device-info]').first().as('manualForm')
    cy.get('@manualForm').find('[data-test=device-name]').find('[data-test=device-name]').focus().blur()
    cy.get('@manualForm').find('[data-test=device-name]').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with empty character mac address in create manually', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').first().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=manual-device-info]').first().as('manualForm')
    cy.get('@manualForm').find('[data-test=mac-address]').focus().blur()
    cy.get('@manualForm').find('.mac-address').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should show validation error with invalid mac address in create manually', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').first().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=manual-device-info]').first().as('manualForm')
    cy.get('@manualForm').find('[data-test=mac-address]').type('ee:ee:ee:ee:ee:ee:e').blur()
    cy.get('@manualForm').find('.mac-address').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
  })

  it('should be able to create device manully', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').first().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=manual-device-info]').first().as('manualForm')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('@manualForm').find('[data-test=device-name]').find('[data-test=device-name]').type('Device e2e test')
    const hexDigits = '0123456789ABCDEF'
    let macAddress = ''
    for (var i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      if (i !== 5) macAddress += ':'
    }
    cy.get('@manualForm').find('[data-test=mac-address]').type(macAddress)
    cy.get('@manualForm').find('.device-vendor .v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').click()
    cy.get('#toast-container .toast-success')
  })

  it('should be able to create multi device manully', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').first().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=manual-device-info]').first().as('manualForm')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('@manualForm').find('[data-test=device-name]').find('[data-test=device-name]').type('Device e2e test')
    const hexDigits = '0123456789ABCDEF'
    let macAddress = ''
    for (var i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      if (i !== 5) macAddress += ':'
    }
    cy.get('@manualForm').find('[data-test=mac-address]').type(macAddress)
    cy.get('@manualForm').find('.device-vendor .v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=btn-add-device]').click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=manual-import]').find('[data-test=manual-device-info]').last().as('manualForm1')
    cy.get('@manualForm1').find('[data-test=device-name]').find('[data-test=device-name]').type('Device e2e test1')
    let macAddress1 = ''
    for (var j = 0; j < 6; j++) {
      macAddress1 += hexDigits.charAt(Math.round(Math.random() * 15))
      macAddress1 += hexDigits.charAt(Math.round(Math.random() * 15))
      if (j !== 5) macAddress1 += ':'
    }
    cy.get('@manualForm1').find('[data-test=mac-address]').type(macAddress1)
    cy.get('@manualForm1').find('.device-vendor .v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()

    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').click()
    cy.get('#toast-container .toast-success')
  })

  it('should show error message when save incorrect meraki api key in vonder api page', () => {
    cy.visit('/1/1/profile')
    cy.get('[data-test=meraki-api-info]').find('[data-test=editable-card]').as('merakiApi')
    cy.get('@merakiApi').trigger('mouseover')
    cy.get('@merakiApi').find('[data-test=edit-button]').click()
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('.v-input__control').find('.v-input__slot').then($element => {
      if ($element.children().length > 1) {
        cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('.v-input__control').find('.v-input__slot').find('.v-input__append-inner').click()
        cy.get('.v-dialog__content--active').find('[data-test=btn-confirm]').click()
        cy.get('#toast-container .toast-success')
      }
    })

    cy.visit('/1/1/inventory')
    cy.get('[data-test=inventory-list]').find('[data-test=btn-create-device]').click()
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').last().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=vendor-api-import]').as('vendorForm')
    cy.get('@vendorForm').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()

    cy.get('@vendorForm').find('[data-test=meraki-api-selection]').as('merakiSelection')
    cy.get('@merakiSelection').find('[data-test=select-meraki]').should('not.exist')
    cy.get('@merakiSelection').find('[data-test=btn-save-meraki]').should('have.attr', 'disabled')
    cy.get('@merakiSelection').find('[data-test=meraki-api-input]').type('664e73f042d0896eb0cfc940584fa1c0b97073b2')
    cy.get('@merakiSelection').find('[data-test=btn-save-meraki]').click()
    cy.get('#toast-container .toast-error').should('exist')
  })

  it('should show error message when saved incorrect api key in vendor api page', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').last().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=vendor-api-import]').as('vendorForm')
    cy.get('@vendorForm').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('#toast-container .toast-error').should('exist')
  })

  it('should be able to save meraki api key in vendor api page', () => {
    cy.visit('/1/1/profile')
    cy.get('[data-test=meraki-api-info]').find('[data-test=editable-card]').as('merakiApi')
    cy.get('@merakiApi').trigger('mouseover')
    cy.get('@merakiApi').find('[data-test=edit-button]').click()
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('.v-input__control').find('.v-input__slot').then($element => {
      if ($element.children().length > 1) {
        cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('.v-input__control').find('.v-input__slot').find('.v-input__append-inner').click()
        cy.get('.v-dialog__content--active').find('[data-test=btn-confirm]').click()
        cy.get('#toast-container .toast-success')
      }
    })

    cy.visit('/1/1/inventory')
    cy.get('[data-test=inventory-list]').find('[data-test=btn-create-device]').click()
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').last().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=vendor-api-import]').as('vendorForm')
    cy.get('@vendorForm').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()

    cy.get('@vendorForm').find('[data-test=meraki-api-selection]').as('merakiSelection')
    cy.get('@merakiSelection').find('[data-test=select-meraki]').should('not.exist')
    cy.get('@merakiSelection').find('[data-test=btn-save-meraki]').should('have.attr', 'disabled')
    cy.get('@merakiSelection').find('[data-test=meraki-api-input]').type('664e73f042d0896eb0cfc940584fa1c0b97073b3')
    cy.get('@merakiSelection').find('[data-test=btn-save-meraki]').click()
    cy.get('#toast-container .toast-error').should('not.exist')
    cy.get('@merakiSelection').find('[data-test=select-meraki]').should('exist')
  })

  it('should be able to import devices using meraki api key without create site.', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').last().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=vendor-api-import]').as('vendorForm')
    cy.get('@vendorForm').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('#toast-container .toast-error').should('not.exist')
    cy.get('@vendorForm').find('[data-test=meraki-api-selection]').as('merakiSelection')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('@merakiSelection').find('.v-select__slot').click()
    cy.wait(2000)
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').should('exist')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').find('[data-test=devices-added]').should('exist')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').find('[data-test=devices-ignored]').should('exist')
  })

  it('should be able to import devices using meraki api key with create site.', () => {
    cy.get('[data-test=add-inventory-dialog]').find('.selection-panel').last().click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=vendor-api-import]').as('vendorForm')
    cy.get('@vendorForm').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('#toast-container .toast-error').should('not.exist')
    cy.get('@vendorForm').find('[data-test=meraki-api-selection]').as('merakiSelection')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.attr', 'disabled')
    cy.get('@merakiSelection').find('.v-select__slot').click()
    cy.wait(2000)
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=create-test]').find('.v-input__slot').find('.v-input--selection-controls__input').then($checkbox => {
      if (!$checkbox.hasClass('.v-icon')) {
        cy.get('[data-test=add-inventory-dialog]').find('[data-test=create-test]').find('.v-input__slot').find('.v-input--selection-controls__input').click()
      }
    })
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').should('have.not.attr', 'disabled')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=btn-next]').click()
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').should('exist')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').find('[data-test=devices-added]').should('exist')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').find('[data-test=devices-ignored]').should('exist')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').find('[data-test=sites-added]').should('exist')
    cy.get('[data-test=add-inventory-dialog]').find('[data-test=step-3]').find('[data-test=sites-ignored]').should('exist')
  })
})
