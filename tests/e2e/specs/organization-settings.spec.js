describe('The Organization settings page', () => {
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

  it('should be able to change setting pages', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-social]').click()
      cy.get('@settingsList').find('[data-test=list-item-social]').should('have.attr', 'class').and('include', 'active')
      cy.get('[data-test=organization-settings]').find('[data-test=settings-social-oauth-page]')
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('@settingsList').find('[data-test=list-item-export]').should('have.attr', 'class').and('include', 'active')
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('@settingsList').find('[data-test=list-item-external]').should('have.attr', 'class').and('include', 'active')
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]')
      cy.get('@settingsList').find('[data-test=list-item-portability]').click()
      cy.get('@settingsList').find('[data-test=list-item-portability]').should('have.attr', 'class').and('include', 'active')
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-portability-page]')
      cy.get('@settingsList').find('[data-test=list-item-general]').click()
      cy.get('@settingsList').find('[data-test=list-item-general]').should('have.attr', 'class').and('include', 'active')
      cy.get('[data-test=organization-settings]').find('[data-test=settings-general-page]')
    })
  })

  it('should be able to change logo in general page', () => {
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at'
    }).as('fetchMediaLibrary')

    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=organization-settings]').find('[data-test=settings-general-page]').as('generalPage')
      cy.get('@generalPage').find('[data-test=btn-choose-logo]').click()
      cy.wait('@fetchMediaLibrary').then((mediaXhr) => {
        if (mediaXhr.response.body.data.results.length) {
          cy.get('[data-test=media-library-dialog]').find('.v-tabs > .v-tabs__bar > .v-tabs__wrapper > .v-tabs__container > .v-tabs__div').eq(1).click()
          cy.get('[data-test=media-library-dialog]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
          cy.get('[data-test=media-library-dialog]').find('[data-test=btn-select]').click()
          cy.wait('@updateOrganization').then((orgXhr) => {
            const logoUrl = orgXhr.response.body.data.logo_url
            cy.get('#toast-container .toast-success')
            cy.get('[data-test=logo]').should('have.attr', 'src').and('include', logoUrl)
          })
        } else {
          cy.log('Media Library empty')
          cy.get('[data-test=media-library-dialog]').find('[data-test=btn-close]').click()
        }
      })
    })
  })

  it('should be able to remove logo in general page', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=organization-settings]').find('[data-test=settings-general-page]').as('generalPage')
      cy.get('@generalPage').find('[data-test=btn-remove-logo]').click()
      cy.wait('@updateOrganization').then((orgXhr) => {
        const logoUrl = orgXhr.response.body.data.logo_url
        cy.get('#toast-container .toast-success')
        cy.get('[data-test=logo]').should('have.attr', 'src').and('include', logoUrl)
      })
    })
  })

  it('should be able to save Social Credentials in Social Login App', () => {
    const socialNames = [
      'facebook',
      'twitter',
      'instagram',
      'linkedin',
      'google'
    ]
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-social]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-social-oauth-page]').as('socialOauthPage')
      socialNames.map(soicalName => {
        cy.log(`~~~ ${soicalName} check ~~`)
        cy.get('@socialOauthPage').find(`[data-test=${soicalName}-social-auth]`).as('socialAuth')
        cy.get('@socialAuth').find('[data-test=oauth-switch]')
          .find('.v-input')
          .then(($togle) => {
            if (!$togle.hasClass('v-input--is-label-active')) {
              cy.get('@socialAuth').find('[data-test=oauth-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
            }
          })
        cy.get('@socialAuth').find('[data-test=oauth-id]').type('{selectall}').type('{backspace}').type(soicalName)
        cy.get('@socialAuth').find('[data-test=oauth-secret-key]').type('{selectall}').type('{backspace}').type('oauth-secret-key')
        cy.get('@socialOauthPage').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
        cy.get('@socialOauthPage').find('[data-test=btn-save]').click()
        cy.wait('@updateOrganization').then(() => {
          cy.get('#toast-container .toast-success')
        })
      })
    })
  })

  it('should be able to delete Social Credentials when remove oauth-secret-key in Social Login App', () => {
    const socialNames = [
      'facebook',
      'twitter',
      'instagram',
      'linkedin',
      'google'
    ]
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-social]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-social-oauth-page]').as('socialOauthPage')
      socialNames.map(soicalName => {
        cy.log(`~~~ ${soicalName} check ~~`)
        cy.get('@socialOauthPage').find(`[data-test=${soicalName}-social-auth]`).as('socialAuth')
        cy.get('@socialAuth').find('[data-test=oauth-switch]')
          .find('.v-input')
          .then(($togle) => {
            if (!$togle.hasClass('v-input--is-label-active')) {
              cy.get('@socialAuth').find('[data-test=oauth-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
            }
          })
        cy.get('@socialAuth').find('[data-test=oauth-secret-key]').type('{selectall}').type('{backspace}')
        cy.get('@socialOauthPage').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
        cy.get('@socialOauthPage').find('[data-test=btn-save]').click()
        cy.wait('@updateOrganization').then(() => {
          cy.get('#toast-container .toast-success')
          cy.get('@socialAuth').find('[data-test=oauth-switch]')
            .find('.v-input--is-label-active').should('not.exist')
        })
      })
    })
  })

  it('should show validation error with empty character in server host of Export Data', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=server-host]').should('have.not.attr', 'readonly')
      cy.get('@ftpPage').find('[data-test=server-host]').type('{selectall}').type('{backspace}').blur()
      cy.get('@ftpPage').find('.server-host').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in server port of Export Data', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=server-port]').should('have.not.attr', 'readonly')
      cy.get('@ftpPage').find('[data-test=server-port]').type('{selectall}').type('{backspace}').blur()
      cy.get('@ftpPage').find('.server-port').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in user name of Export Data', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=user-name]').should('have.not.attr', 'readonly')
      cy.get('@ftpPage').find('[data-test=user-name]').type('{selectall}').type('{backspace}').blur()
      cy.get('@ftpPage').find('.user-name').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in password of Export Data', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=password]').should('have.not.attr', 'readonly')
      cy.get('@ftpPage').find('[data-test=password]').type('{selectall}').type('{backspace}').blur()
      cy.get('@ftpPage').find('.password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show the cleartext password when clicking on the eye icon', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=password]').type('{selectall}').type('{backspace}').type('boundless')
      cy.get('@ftpPage').find('.password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
      cy.get('@ftpPage').find('[data-test=password]').should('have.attr', 'type').and('include', 'text')
    })
  })
  it('should hide the password when clicking on the hide-eye icon', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=password]').type('{selectall}').type('{backspace}').type('boundless')
      cy.get('@ftpPage').find('[data-test=password]').should('have.attr', 'type').and('include', 'password')
    })
  })
  it('should be able to save Export Data', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-export]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-export-page]')
        .find('[data-test=ftp-info]').find('[data-test=editable-card]').as('ftpPage')
      cy.get('@ftpPage').trigger('mouseover')
      cy.get('@ftpPage').find('[data-test=edit-button]').click()
      cy.get('@ftpPage').find('[data-test=server-host]').type('{selectall}').type('{backspace}')
      cy.get('@ftpPage').find('[data-test=server-port]').type('{selectall}').type('{backspace}')
      cy.get('@ftpPage').find('[data-test=user-name]').type('{selectall}').type('{backspace}')
      cy.get('@ftpPage').find('[data-test=password]').type('{selectall}').type('{backspace}')
      cy.get('@ftpPage').find('[data-test=btn-submit]').should('have.attr', 'disabled')
      cy.get('@ftpPage').find('[data-test=server-host]').type('https://app.development.bdigitalapp.com/')
      cy.get('@ftpPage').find('[data-test=btn-submit]').should('have.attr', 'disabled')
      cy.get('@ftpPage').find('[data-test=server-port]').type('21')
      cy.get('@ftpPage').find('[data-test=btn-submit]').should('have.attr', 'disabled')
      cy.get('@ftpPage').find('[data-test=user-name]').type('root')
      cy.get('@ftpPage').find('[data-test=btn-submit]').should('have.attr', 'disabled')
      cy.get('@ftpPage').find('[data-test=password]').type('boundless')
      cy.get('@ftpPage').find('[data-test=btn-submit]').should('have.not.attr', 'disabled')
      cy.get('@ftpPage').find('[data-test=btn-submit]').click()
      cy.wait('@updateOrganization').then(() => {
        cy.get('#toast-container .toast-success')
      })
    })
  })

  it('should be disabled when Email config disable', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if ($togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@externalPage').find('.form-card').should('have.attr', 'disabled')
    })
  })

  it('should show validation error with empty character in sender name of Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=sender-name]').type('{selectall}').type('{backspace}').blur()
      cy.get('@emailConfig').find('.sender-name').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in sender email of Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=sender-email]').type('{selectall}').type('{backspace}').blur()
      cy.get('@emailConfig').find('.sender-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with incorrect type of email in sender email of Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=sender-email]').type('{selectall}').type('{backspace}').type('root').blur()
      cy.get('@emailConfig').find('.sender-email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in SMTP Host of Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=smtp-host]').type('{selectall}').type('{backspace}').blur()
      cy.get('@emailConfig').find('.smtp-host').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in SMTP User Name of Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=smtp-user-name]').type('{selectall}').type('{backspace}').blur()
      cy.get('@emailConfig').find('.smtp-user-name').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in SMTP Password of Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=smtp-password]').type('{selectall}').type('{backspace}').blur()
      cy.get('@emailConfig').find('.smtp-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should be able to save Email Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=email-config]').as('emailConfig')
      cy.get('@emailConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@emailConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@emailConfig').find('[data-test=sender-name]').type('{selectall}').type('{backspace}')
      cy.get('@emailConfig').find('[data-test=sender-email]').type('{selectall}').type('{backspace}')
      cy.get('@emailConfig').find('[data-test=smtp-host]').type('{selectall}').type('{backspace}')
      cy.get('@emailConfig').find('[data-test=smtp-user-name]').type('{selectall}').type('{backspace}')
      cy.get('@emailConfig').find('[data-test=smtp-password]').type('{selectall}').type('{backspace}')
      cy.get('@emailConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@emailConfig').find('[data-test=sender-name]').type('root')
      cy.get('@emailConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@emailConfig').find('[data-test=sender-email]').type('root@boundlessdigital.en')
      cy.get('@emailConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@emailConfig').find('[data-test=smtp-host]').type('https://app.development.bdigitalapp.com')
      cy.get('@emailConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@emailConfig').find('[data-test=smtp-user-name]').type('root')
      cy.get('@emailConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@emailConfig').find('[data-test=smtp-password]').type('boundless')
      cy.get('@emailConfig').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
      cy.get('@emailConfig').find('[data-test=btn-save]').click()
      cy.wait('@updateOrganization').then(() => {
        cy.get('#toast-container .toast-success')
      })
    })
  })

  it('should be disabled when SMS config disable', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=sms-config]').as('smsConfig')
      cy.get('@smsConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@smsConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@smsConfig').find('.form-card').should('have.attr', 'disabled')
    })
  })

  it('should show validation error with empty character in Account SID of SMS Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=sms-config]').as('smsConfig')
      cy.get('@smsConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@smsConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@smsConfig').find('[data-test=account-sid]').type('{selectall}').type('{backspace}').blur()
      cy.get('@smsConfig').find('.account-sid').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in Auth Token of SMS Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=sms-config]').as('smsConfig')
      cy.get('@smsConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@smsConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@smsConfig').find('[data-test=auth-token]').type('{selectall}').type('{backspace}').blur()
      cy.get('@smsConfig').find('.auth-token').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    })
  })

  it('should show validation error with empty character in Twilio Phone of SMS Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=sms-config]').as('smsConfig')
      cy.get('@smsConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@smsConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@smsConfig').find('[data-test=phone-input]').type('{selectall}').type('{backspace}').blur()
      cy.get('@smsConfig').find('[data-test=phone-error]')
    })
  })

  it('should show validation error with incorrect type phone number in Twilio Phone of SMS Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=sms-config]').as('smsConfig')
      cy.get('@smsConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@smsConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@smsConfig').find('[data-test=phone-input]').type('{selectall}').type('{backspace}').type('43333333').blur()
      cy.get('@smsConfig').find('[data-test=phone-error]')
    })
  })

  it('should be able to save SMS Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=sms-config]').as('smsConfig')
      cy.get('@smsConfig').find('[data-test=config-switch]')
        .find('.v-input')
        .then(($togle) => {
          if (!$togle.hasClass('v-input--is-label-active')) {
            cy.get('@smsConfig').find('[data-test=config-switch]').find('.v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input').click()
          }
        })
      cy.get('@smsConfig').find('[data-test=account-sid]').type('{selectall}').type('{backspace}')
      cy.get('@smsConfig').find('[data-test=auth-token]').type('{selectall}').type('{backspace}')
      cy.get('@smsConfig').find('[data-test=phone-input]').type('{selectall}').type('{backspace}')
      cy.get('@smsConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@smsConfig').find('[data-test=account-sid]').type('account-sid')
      cy.get('@smsConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@smsConfig').find('[data-test=phone-input]').type('433333333')
      cy.get('@smsConfig').find('[data-test=btn-save]').should('have.attr', 'disabled')
      cy.get('@smsConfig').find('[data-test=auth-token]').type('auth-token')
      cy.get('@smsConfig').find('[data-test=btn-save]').should('have.not.attr', 'disabled')
      cy.get('@smsConfig').find('[data-test=sender-name]').type('{selectall}').type('{backspace}').type('root')
      cy.get('@smsConfig').find('[data-test=btn-save]').click()
      cy.wait('@updateOrganization').then(() => {
        cy.get('#toast-container .toast-success')
      })
    })
  })

  it('should show validation error with empty character in api key of Email Validation', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]')
        .find('[data-test=email-validation]').find('[data-test=editable-card]').as('emailValidation')
      cy.get('@emailValidation').trigger('mouseover')
      cy.get('@emailValidation').find('[data-test=edit-button]').click()
      cy.get('@emailValidation').find('[data-test=api-key]').find('[data-test=api-key]').should('have.not.attr', 'readonly')
      cy.get('@emailValidation').find('[data-test=api-key]').find('[data-test=api-key]').type('{selectall}').type('{backspace}').blur()
      cy.get('@emailValidation').find('[data-test=api-key]').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
      cy.get('@emailValidation').find('[data-test=btn-submit]').should('have.attr', 'disabled')
    })
  })

  it('should show validation error with more 64 character in api key of Email Validation', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]')
        .find('[data-test=email-validation]').find('[data-test=editable-card]').as('emailValidation')
      cy.get('@emailValidation').trigger('mouseover')
      cy.get('@emailValidation').find('[data-test=edit-button]').click()
      cy.get('@emailValidation').find('[data-test=api-key]').find('[data-test=api-key]').should('have.not.attr', 'readonly')
      cy.get('@emailValidation').find('[data-test=api-key]').find('[data-test=api-key]')
        .type('{selectall}').type('{backspace}')
        .type('should show validation error with more 64 character in api key of Email Validation').blur()
      cy.get('@emailValidation').find('[data-test=api-key]').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
      cy.get('@emailValidation').find('[data-test=btn-submit]').should('have.attr', 'disabled')
    })
  })

  it('should be able to save correct api key of Email Validation', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]')
        .find('[data-test=email-validation]').find('[data-test=editable-card]').as('emailValidation')
      cy.get('@emailValidation').trigger('mouseover')
      cy.get('@emailValidation').find('[data-test=edit-button]').click()
      cy.get('@emailValidation').find('[data-test=api-key]').find('[data-test=api-key]').should('have.not.attr', 'readonly')
      cy.get('@emailValidation').find('[data-test=api-key]').find('[data-test=api-key]')
        .type('{selectall}').type('{backspace}')
        .type('0c66ff340').blur()
      cy.get('@emailValidation').find('[data-test=btn-submit]').should('have.not.attr', 'disabled')
      cy.get('@emailValidation').find('[data-test=btn-submit]').click()
      cy.get('#toast-container .toast-success')
    })
  })

  it('should be able to add Ale ID of Ale Configuration', () => {
    const hexDigits = '0123456789ABCDEF'
    let macAddress = ''
    for (var i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      if (i !== 5) macAddress += ':'
    }

    cy.wait('@getManageableNodes').then(() => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=ale-config]').as('aleConfig')
      cy.get('@aleConfig').find('[data-test=ale-id]').type('{selectall}').type('{backspace}').type(macAddress).blur()
      cy.get('@aleConfig').find('[data-test=btn-add]').should('have.not.attr', 'disabled')
      cy.get('@aleConfig').find('[data-test=btn-add]').click()
      cy.wait('@updateOrganization').then((xhr) => {
        const aleCount = xhr.response.body.data.aruba_ale_ids.length
        cy.get('@aleConfig').find('[data-test=ale-ids]').children().should('have.length', aleCount)
        cy.get('@aleConfig').find('[data-test=btn-add]').should('have.attr', 'disabled')
      })
    })
  })

  it('should be able to remove Ale ID of Ale Configuration', () => {
    cy.wait('@getManageableNodes').then(() => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=ale-config]').as('aleConfig')
      cy.get('@aleConfig').find('[data-test=ale-ids]').children().eq(0)
        .find('[data-test=removable-item]').find('[data-test=btn-remove]').click()
      cy.wait('@updateOrganization').then((xhr) => {
        const aleCount = xhr.response.body.data.aruba_ale_ids.length
        cy.get('@aleConfig').find('[data-test=ale-ids]').children().should('have.length', aleCount)
      })
    })
  })

  it('should show validation error with empty character in Ale ID of Ale Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=ale-config]').as('aleConfig')
      cy.get('@aleConfig').find('[data-test=ale-id]').type('{selectall}').type('{backspace}').blur()
      cy.get('@aleConfig').find('.ale-id').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
      cy.get('@aleConfig').find('[data-test=btn-add]').should('have.attr', 'disabled')
    })
  })

  it('should show validation error with incorrect type Ale ID of Ale Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=ale-config]').as('aleConfig')
      cy.get('@aleConfig').find('[data-test=ale-id]').type('{selectall}').type('{backspace}').type('ee:ee:ee:ee:ee:e').blur()
      cy.get('@aleConfig').find('.ale-id').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
      cy.get('@aleConfig').find('[data-test=btn-add]').should('have.attr', 'disabled')
    })
  })

  it('should show validation error with more 17 character in Ale ID of Ale Configuration', () => {
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=ale-config]').as('aleConfig')
      cy.get('@aleConfig').find('[data-test=ale-id]').type('{selectall}').type('{backspace}').type('ee:ee:ee:ee:ee:ee:e').blur()
      cy.get('@aleConfig').find('.ale-id').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
      cy.get('@aleConfig').find('[data-test=btn-add]').should('have.attr', 'disabled')
    })
  })

  it('should show validation error with equal Ale ID of Ale Configuration', () => {
    const hexDigits = '0123456789ABCDEF'
    let macAddress = ''
    for (var i = 0; i < 6; i++) {
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      macAddress += hexDigits.charAt(Math.round(Math.random() * 15))
      if (i !== 5) macAddress += ':'
    }

    cy.wait('@getManageableNodes').then(() => {
      cy.get('@settingsList').find('[data-test=list-item-external]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-external-integrations-page]').as('externalPage')
      cy.get('@externalPage').find('[data-test=ale-config]').as('aleConfig')
      cy.get('@aleConfig').find('[data-test=ale-id]').type('{selectall}').type('{backspace}').type(macAddress).blur()
      cy.get('@aleConfig').find('[data-test=btn-add]').should('have.not.attr', 'disabled')
      cy.get('@aleConfig').find('[data-test=btn-add]').click()
      cy.wait('@updateOrganization').then((xhr) => {
        cy.get('@aleConfig').find('[data-test=ale-id]').type('{selectall}').type('{backspace}').type(macAddress).blur()
        cy.get('@aleConfig').find('.ale-id').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
        cy.get('@aleConfig').find('[data-test=btn-add]').should('have.attr', 'disabled')
      })
    })
  })

  it('should be able to Export All Organization Data', () => {
    cy.route({
      method: 'POST',
      url: '/api/organization/1/gdpr-export/'
    }).as('exportGdpr')

    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('@settingsList').find('[data-test=list-item-portability]').click()
      cy.get('[data-test=organization-settings]').find('[data-test=settings-data-portability-page]').as('portabilityPage')
      cy.get('@portabilityPage').find('[data-test=btn-export]').click()
      cy.wait('@exportGdpr').then(() => {
        cy.get('#toast-container .toast-success')
        cy.get('@portabilityPage').find('[data-test=btn-export]').should('not.exist')
      })
    })
  })
})
