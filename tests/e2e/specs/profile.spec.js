describe('The profile page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/profile')
    })
    cy.get('[data-test=personal-info]').find('[data-test=editable-card]').as('personal')
    cy.get('[data-test=preferences]').find('[data-test=editable-card]').as('preferences')
    cy.get('[data-test=email-info]').find('[data-test=editable-card]').as('emailInfo')
    cy.get('[data-test=meraki-api-info]').find('[data-test=editable-card]').as('merakiApi')
  })

  // Personal Info

  it('should be not able to change name, job, phone in personal info when disable editing', () => {
    cy.get('@personal').should('have.attr', 'readonly').and('include', 'readonly')
    cy.get('@personal').find('[data-test=name]').should('have.attr', 'readonly')
    cy.get('@personal').find('[data-test=job]').should('have.attr', 'readonly')
    cy.get('@personal').find('[data-test=phone-input]').should('have.attr', 'readonly')
  })
  it('should be able to editable when we click edit icon in personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=name]').should('have.not.attr', 'readonly')
    cy.get('@personal').find('[data-test=job]').should('have.not.attr', 'readonly')
    cy.get('@personal').find('[data-test=phone-input]').should('have.not.attr', 'readonly')
  })

  it('should show validation error with empty character in name of personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=name]').find('[data-test=name]').type('{selectall}').type('{backspace}')
    cy.get('@personal').find('[data-test=name]').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@personal').find('[data-test=btn-submit]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input more 64 characters to name of personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=name]').find('[data-test=name]').type('should show a validation error when input more 64 characters to name of personal info')
    cy.get('@personal').find('[data-test=name]').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@personal').find('[data-test=btn-submit]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input more 64 characters to job title of personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=job]').find('[data-test=job]').type('should show a validation error when input more 64 characters to name of personal info')
    cy.get('@personal').find('[data-test=job]').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@personal').find('[data-test=btn-submit]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input incorrect phone number in personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').type('43333333')
    cy.get('@personal').find('[data-test=phone-input]').blur()
    cy.get('@personal').find('[data-test=phone-error]')
    cy.get('@personal').find('[data-test=btn-submit]').should('have.attr', 'disabled')
  })

  it('should be able to change phone prefix in personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=open-phone-flags-button]').click()
    cy.get('@personal').find('[data-test=phone-flag-US]').click()
    cy.wait(500)
    cy.get('@personal').find('[data-test=phone-input]').type('{backspace}').type('2014667776')
    cy.get('@personal').find('[data-test=phone-input]').blur()
    cy.get('@personal').find('[data-test=phone-error-messages]').children().should('have.length', 0)
  })

  it('should be able to not change values when click cancel button in personal info', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=btn-cancel]').click()
    cy.get('@personal').should('have.attr', 'readonly').and('include', 'readonly')
  })

  it('should be able to save personal info with correct value', () => {
    cy.get('@personal').trigger('mouseover')
    cy.get('@personal').find('[data-test=edit-button]').click()
    cy.get('@personal').find('[data-test=name]').find('[data-test=name]').type('{selectall}').type('{backspace}').type('root')
    cy.get('@personal').find('[data-test=job]').find('[data-test=job]').type('{selectall}').type('{backspace}').type('Administrator')
    cy.get('@personal').find('[data-test=phone-input]')
      .type('{selectall}').type('{backspace}').type('433333333')
    cy.get('@personal').find('[data-test=btn-submit]').click()
    cy.get('#toast-container .toast-success')
    cy.get('@personal').should('have.attr', 'readonly').and('include', 'readonly')
  })

  // Preferences

  it('should be not able to change Language, Timezone, Date Format, Time Format, First day of week in preferences when disable editing', () => {
    cy.get('@preferences').should('have.attr', 'readonly').and('include', 'readonly')
    cy.get('@preferences').find('.language').find('[data-test=language]').should('have.attr', 'readonly')
    cy.get('@preferences').find('.timezone').find('[data-test=timezone]').should('have.attr', 'readonly')
    cy.get('@preferences').find('.date-format').find('[data-test=date-format]').should('have.attr', 'readonly')
    cy.get('@preferences').find('.time-format').find('[data-test=time-format]').should('have.attr', 'readonly')
    cy.get('@preferences').find('.first-day-of-week').find('[data-test=first-day-of-week]').should('have.attr', 'readonly')
  })

  it('should be able to change language in preferences', () => {
    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.language').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('@preferences').find('[data-test=btn-submit]').click()

    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.language').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('[data-test=btn-submit]').click()
  })

  it('should be able to change Time zone in preferences', () => {
    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.timezone').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
  })

  it('should be able to change Date format in preferences', () => {
    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.date-format').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('@preferences').find('.date-format').find('.v-select__selection').contains('dd/mm/YYYY')

    cy.get('@preferences').find('.date-format').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('.date-format').find('.v-select__selection').contains('mm/dd/YYYY')
  })

  it('should be able to change time format in preferences', () => {
    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.time-format').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.get('@preferences').find('.time-format').find('.v-select__selection').contains('24')

    cy.get('@preferences').find('.time-format').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('.time-format').find('.v-select__selection').contains('12')
  })

  it('should be able to change First day of week in preferences', () => {
    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.first-day-of-week').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()

    cy.get('@preferences').find('.first-day-of-week').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
  })

  it('should be able to save preferences with changed value', () => {
    cy.get('@preferences').trigger('mouseover')
    cy.get('@preferences').find('[data-test=edit-button]').click()
    cy.get('@preferences').find('.language').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('.timezone').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('.date-format').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('.time-format').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('.first-day-of-week').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.get('@preferences').find('[data-test=btn-submit]').click()
  })

  it('should be not able to change email in Email Info when disable editing', () => {
    cy.get('@emailInfo').should('have.attr', 'readonly').and('include', 'readonly')
    cy.get('@emailInfo').find('[data-test=email]').should('have.attr', 'readonly').and('include', 'readonly')
  })

  it('should show a validation error when input incorrect email type in Email Info', () => {
    cy.get('@emailInfo').trigger('mouseover')
    cy.get('@emailInfo').find('[data-test=edit-button]').click()
    cy.get('@emailInfo').find('[data-test=email]').type('{selectall}').type('{backspace}').type('root')
    cy.get('@emailInfo').find('[data-test=email]').blur()
    cy.get('@emailInfo').find('.email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@emailInfo').find('[data-test=btn-submit]').should('have.attr', 'disabled')
  })

  it('should show email validation error with empty character in Email Info', () => {
    cy.get('@emailInfo').trigger('mouseover')
    cy.get('@emailInfo').find('[data-test=edit-button]').click()
    cy.get('@emailInfo').find('[data-test=email]').type('{selectall}').type('{backspace}')
    cy.get('@emailInfo').find('[data-test=email]').blur()
    cy.get('@emailInfo').find('.email').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('@emailInfo').find('[data-test=btn-submit]').should('have.attr', 'disabled')
  })

  it('should be able to save Email Info with correct email', () => {
    cy.get('@emailInfo').trigger('mouseover')
    cy.get('@emailInfo').find('[data-test=edit-button]').click()
    cy.get('@emailInfo').find('[data-test=email]').type('{selectall}').type('{backspace}').type('root@boundlessdigital.en')
    cy.get('@emailInfo').find('[data-test=email]').blur()
    cy.get('@emailInfo').find('[data-test=btn-submit]').click()
    cy.get('@emailInfo').trigger('mouseover')
    cy.get('@emailInfo').find('[data-test=edit-button]').click()
    cy.get('[data-test=email-change-confirm]')
  })

  // password info

  it('should be able to update password with a correct new password and confirm password in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('boundless')
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]').type('boundless')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').should('have.not.attr', 'disabled')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').click()
  })

  it('should show the cleartext new password when clicking on the eye icon in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('boundless')
    cy.get('[data-test=password-info]').find('.new-password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
    cy.get('[data-test=password-info]').find('[data-test=new-password]')
      .should('have.attr', 'type').and('include', 'text')
  })

  it('should hide the new password when clicking on the hide-eye icon in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('boundless')
    cy.get('[data-test=password-info]').find('[data-test=new-password]')
      .should('have.attr', 'type').and('include', 'password')
  })

  it('should show the cleartext confirm password when clicking on the eye icon in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]').type('boundless')
    cy.get('[data-test=password-info]').find('.confirm-password > .v-input__control > .v-input__slot > .v-input__append-inner > .v-input__icon--append').click()
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]')
      .should('have.attr', 'type').and('include', 'text')
  })

  it('should hide the confirm password when clicking on the hide-eye icon in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]').type('boundless')
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]')
      .should('have.attr', 'type').and('include', 'password')
  })

  it('should show a validation error when input less 8 characters to new password with confirm password in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('test')
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]').type('test')
    cy.get('[data-test=password-info]').find('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input less 8 characters to new password without confirm password in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('test')
    cy.get('[data-test=password-info]').find('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input more 25 characters to new password with confirm password in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('12345678901234567890123456')
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]').type('12345678901234567890123456')
    cy.get('[data-test=password-info]').find('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').should('have.attr', 'disabled')
  })

  it('should show a validation error when input more 25 characters to new password without confirm password in Password info', () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('12345678901234567890123456')
    cy.get('[data-test=password-info]').find('.new-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').should('have.attr', 'disabled')
  })

  it("should show a validation error when input confirm password doesn't match with new password in Password info", () => {
    cy.get('[data-test=password-info]').find('[data-test=new-password]').type('boundless')
    cy.get('[data-test=password-info]').find('[data-test=confirm-password]').type('boundless1')
    cy.get('[data-test=password-info]').find('.confirm-password').find('.v-messages__wrapper > .v-messages__message').should('exist').and('not.be.empty')
    cy.get('[data-test=password-info]').find('[data-test=submit-password-button]').should('have.attr', 'disabled')
  })

  // Meraki API key

  it('should be not able to Meraki api key when disable editing', () => {
    cy.get('@merakiApi').should('have.attr', 'readonly').and('include', 'readonly')
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('[data-test=meraki-api-key]').should('have.attr', 'readonly')
  })

  it('should be able to editable when we click edit icon in Meraki Api Info', () => {
    cy.get('@merakiApi').trigger('mouseover')
    cy.get('@merakiApi').find('[data-test=edit-button]').click()
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('[data-test=meraki-api-key]').should('have.not.attr', 'readonly')
  })

  it('should be able to save Meraki Api key when we click save button in Meraki Api Info', () => {
    cy.get('@merakiApi').trigger('mouseover')
    cy.get('@merakiApi').find('[data-test=edit-button]').click()
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('[data-test=meraki-api-key]').type('{selectall}').type('{backspace}').type('664e73f042d0896eb0cfc940584fa1c0b97073b3')
    cy.get('@merakiApi').find('[data-test=btn-submit]').click()
    cy.get('#toast-container .toast-success')
  })

  it('should be able to delete Meraki Api key when we click delete icon in Meraki Api Info', () => {
    cy.get('@merakiApi').trigger('mouseover')
    cy.get('@merakiApi').find('[data-test=edit-button]').click()
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('.v-input__control').find('.v-input__slot').find('.v-input__append-inner').click()
    cy.get('.v-dialog__content--active').find('[data-test=btn-confirm]').click()
    cy.get('#toast-container .toast-success')

    cy.get('@merakiApi').trigger('mouseover')
    cy.get('@merakiApi').find('[data-test=edit-button]').click()
    cy.get('@merakiApi').find('[data-test=meraki-api-key]').find('[data-test=meraki-api-key]').type('{selectall}').type('{backspace}').type('664e73f042d0896eb0cfc940584fa1c0b97073b3')
    cy.get('@merakiApi').find('[data-test=btn-submit]').click()
  })

  // // Boundless API key

  it('should be able to delete boundless api key', () => {
    cy.get('[data-test=boundless-api-info]').find('[data-test=btn-key-generate]').click()
    cy.get('[data-test=boundless-api-info]').find('.v-input__control').find('.v-input__slot').find('.v-input__append-inner').click()
    cy.get('.v-dialog__content--active').find('[data-test=btn-confirm]').click()
  })

  it('should be able to generate/copy boundless api key', () => {
    cy.get('[data-test=boundless-api-info]').find('[data-test=btn-key-generate]').click()
    cy.get('[data-test=boundless-api-info]').find('[data-test=btn-copy-board]').click()
  })
})
