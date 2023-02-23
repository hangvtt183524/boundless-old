describe('The Wifi Self Registration Page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/wifi/self-registration')
    })
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')
    cy.wait('@getManageableNodes')
  })

  it('should be able to disable save button first time', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
  })

  it('should be able to enable save button after change wifi self registration', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-time]').find('[data-test=enable-switch]').click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should be able to save wifi self registration', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-time]').as('connectionTime')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-frequency]').as('connectionFrequency')
    cy.get('[data-test=wifi-registration]').find('[data-test=wifi-programming]').as('wifiProgramming')
    cy.get('[data-test=wifi-registration]').find('[data-test=data-limitation]').as('dataLimitation')
    cy.get('[data-test=wifi-registration]').find('[data-test=bandwidth-limitation]').as('bandwidthLimitation')
    cy.get('@connectionTime').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
    cy.get('@connectionFrequency').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
    cy.get('@wifiProgramming').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
    cy.get('@dataLimitation').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
    cy.get('@bandwidthLimitation').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').click()
    cy.get('#toast-container .toast-success')
  })

  it("should be able to can't change connection time when switch disabled", () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-time]').as('connectionTime')
    cy.get('@connectionTime').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@connectionTime').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@connectionTime').find('.form-card').should('have.attr', 'disabled')
        }
      })
  })

  it('should be able to change connection time', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-time]').as('connectionTime')
    cy.get('@connectionTime').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@connectionTime').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@connectionTime').find('.connection-time').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
    cy.get('@connectionTime').find('.connection-time-unit').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it("should be able to can't change connection frequency when switch disabled", () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-frequency]').as('connectionFrequency')
    cy.get('@connectionFrequency').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if ($togle.hasClass('v-input--is-label-active')) {
          cy.get('@connectionFrequency').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@connectionFrequency').find('.form-card').should('have.attr', 'disabled')
        }
      })
  })

  it('should be able to change connection frequency', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=connection-frequency]').as('connectionFrequency')
    cy.get('@connectionFrequency').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@connectionFrequency').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@connectionFrequency').find('.connection-limit').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
    cy.get('@connectionFrequency').find('.connection-frequency').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it("should be able to can't change Schedule Wifi Availability when switch disabled", () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=wifi-programming]').as('wifiProgramming')
    cy.get('@wifiProgramming').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if ($togle.hasClass('v-input--is-label-active')) {
          cy.get('@wifiProgramming').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@wifiProgramming').find('[data-test=programming-table]').should('have.not.exist')
        }
      })
  })

  it('should be able to change Schedule Wifi Availability', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=wifi-programming]').as('wifiProgramming')
    cy.get('@wifiProgramming').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@wifiProgramming').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@wifiProgramming').find('[data-test=programming-table]')
      .find('tbody').find('tr').first().children().eq(1).find('.circle-status').then(($status) => {
        if (!$status.hasClass('active')) {
          cy.get('@wifiProgramming').find('[data-test=programming-table]')
            .find('tbody').find('tr').first().children().eq(1).find('.circle-status').click()
        }
      })
    cy.get('@wifiProgramming').find('[data-test=programming-table]')
      .find('tbody').find('tr').first().children().eq(4).find('.vue-slider').click()
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should be able to enable all weekdays when select always available option in Schedule Wifi Availability', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=wifi-programming]').as('wifiProgramming')
    cy.get('@wifiProgramming').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@wifiProgramming').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@wifiProgramming').find('.schedule-select').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(2).click()
    const loop = 6
    for (let i = 0; i <= loop; i++) {
      cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(i).children().eq(1)
        .find('.circle-status').should('have.attr', 'class').and('include', 'active')
      cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(i).children().eq(2)
        .find('.v-select > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > .v-select__selection').contains('00:00')
      cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(i).children().eq(3)
        .find('.v-select > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > .v-select__selection').contains('23:59')
    }
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should be able to enable all weekdays with work hours when select Available 8 ~ 6 daily option in Schedule Wifi Availability', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=wifi-programming]').as('wifiProgramming')
    cy.get('@wifiProgramming').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@wifiProgramming').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@wifiProgramming').find('.schedule-select').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    const loop = 6
    for (let i = 0; i <= loop; i++) {
      cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(i).children().eq(1)
        .find('.circle-status').should('have.attr', 'class').and('include', 'active')
      cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(i).children().eq(2)
        .find('.v-select > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > .v-select__selection').contains('08:00')
      cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(i).children().eq(3)
        .find('.v-select > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > .v-select__selection').contains('18:00')
    }
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
  })

  it('should be able to enable work weekdays with work hours when select Available 8 ~ 6 weekdays option in Schedule Wifi Availability', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=wifi-programming]').as('wifiProgramming')
    cy.get('@wifiProgramming').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@wifiProgramming').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
        }
      })
    cy.get('@wifiProgramming').find('.schedule-select').find('.v-select__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(6).children().eq(1)
      .find('.circle-status').should('have.attr', 'class').and('include.not', 'active')
    cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(6).children().eq(2)
      .find('.v-select > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > .v-select__selection').contains('08:00')
    cy.get('@wifiProgramming').find('[data-test=programming-table]').find('tbody').children().eq(6).children().eq(3)
      .find('.v-select > .v-input__control > .v-input__slot > .v-select__slot > .v-select__selections > .v-select__selection').contains('18:00')
  })

  it("should be able to can't change Data limitation when switch disabled", () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=data-limitation]').as('dataLimitation')
    cy.get('@dataLimitation').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if ($togle.hasClass('v-input--is-label-active')) {
          cy.get('@dataLimitation').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@dataLimitation').find('.form-card').should('have.attr', 'disabled')
        }
      })
  })

  it('should be able to change Data limitation', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=data-limitation]').as('dataLimitation')
    cy.get('@dataLimitation').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@dataLimitation').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@dataLimitation').find('[data-test=download-slider]').click()
          cy.get('@dataLimitation').find('[data-test=upload-slider]').click()
          cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
        }
      })
  })

  it("should be able to can't change Banwidth limitation when switch disabled", () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=bandwidth-limitation]').as('bandwidthLimitation')
    cy.get('@bandwidthLimitation').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if ($togle.hasClass('v-input--is-label-active')) {
          cy.get('@bandwidthLimitation').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@bandwidthLimitation').find('.form-card').should('have.attr', 'disabled')
        }
      })
  })

  it('should be able to change Bandwidth limitation', () => {
    cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.attr', 'disabled')
    cy.get('[data-test=wifi-registration]').find('[data-test=bandwidth-limitation]').as('bandwidthLimitation')
    cy.get('@bandwidthLimitation').find('[data-test=enable-switch]')
      .find('.v-input')
      .then(($togle) => {
        if (!$togle.hasClass('v-input--is-label-active')) {
          cy.get('@bandwidthLimitation').find('[data-test=enable-switch]').find('.v-input--selection-controls__input').click()
          cy.get('@bandwidthLimitation').find('[data-test=download-slider]').click()
          cy.get('@bandwidthLimitation').find('[data-test=upload-slider]').click()
          cy.get('[data-test=wifi-registration]').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
        }
      })
  })
})
