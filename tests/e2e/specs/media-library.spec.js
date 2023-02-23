describe('The Media Library Page', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/1/1/marketing/media-library')
    })
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/node/1/tree/?layout=flat&types=organization,group,site,floor'
    }).as('getManageableNodes')
    cy.wait('@getManageableNodes').then((xhr) => {
      cy.get('[data-test=media-library-home]').find('[data-test=media-library]').as('mediaLibrary')
    })
    cy.route({
      method: 'POST',
      url: '/api/organization/1/asset/'
    }).as('postImage')
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at'
    }).as('fetchImages')
  })

  it('should be able to show errors', () => {
    cy.get('[data-test=url-tab]').click()
    cy.get('[data-test=upload-url]').should('be.empty')
    cy.get('[data-test=btn-upload-url]').should('be.disabled')
    cy.get('[data-test=upload-url]').type('https://test.com/test.png')
    cy.get('[data-test=btn-upload-url]').should('not.be.disabled').click()
    cy.wait(2000)
    cy.get('.url-card').find('.v-messages__message').contains('The URL is not image or video, please input correct url')
  })

  it('should be able to upload image from url', () => {
    cy.get('[data-test=url-tab]').click()
    cy.get('[data-test=upload-url]').clear().type('https://cdn1.medicalnewstoday.com/content/images/articles/291/291683/apples.jpg')
    cy.get('.url-card').find('.v-messages__message').should('not.exist')
    cy.get('[data-test=btn-upload-url]').should('not.be.disabled').click()
    cy.wait('@postImage')
    cy.wait('@fetchImages')
  })

  it('should be show details page when click media asset', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('not.exist')
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should be show delete button when click media asset checkbox', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('not.exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().should('have.attr', 'class').and('not.include', 'active')
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().find('[data-test=media-item-checkbox]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().should('have.attr', 'class').and('include', 'active')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should be able to delete selected Media library', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('not.exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().should('have.attr', 'class').and('not.include', 'active')
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().find('[data-test=media-item-checkbox]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().should('have.attr', 'class').and('include', 'active')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').click()
        cy.get('[data-test=delete-confirm-dialog]').find('[data-test=btn-confirm]').click()
        cy.get('#toast-container .toast-success')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should be able to close delete confirm dialog when click cancel button', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('not.exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().should('have.attr', 'class').and('not.include', 'active')
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().find('[data-test=media-item-checkbox]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-container]').find('[data-test=media-item]').first().should('have.attr', 'class').and('include', 'active')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').click()
        cy.get('[data-test=delete-confirm-dialog]').find('[data-test=btn-cancel]').click()
        cy.get('[data-test=delete-confirm-dialog]').should('not.exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should have a link to select all media libraries', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').should('exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should be able to select all media libraries', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('exist')
      }
    })
  })

  it('should have a link to deselect all media libraries', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-deselect-all]').should('exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should be able to deselect selected media libraries', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-select-all]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-deselect-all]').should('exist')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=link-deselect-all]').click()
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-delete-files]').should('not.exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should have a buttons for show media libraries by grid/list', () => {
    cy.get('@mediaLibrary')
      .find('[data-test=media-header]').find('[data-test=btn-show-list]').should('exist')
    cy.get('@mediaLibrary')
      .find('[data-test=media-header]').find('[data-test=btn-show-grid]').should('exist')
  })

  it('should be able to show media libraries by grid/list', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-show-list]').click()
        cy.get('@mediaLibrary')
          .find('.dropzone-files').should('have.attr', 'class').and('include', 'layout-row')
        cy.get('@mediaLibrary')
          .find('[data-test=media-header]').find('[data-test=btn-show-grid]').click()
        cy.get('@mediaLibrary')
          .find('.dropzone-files').should('have.attr', 'class').and('not.include', 'layout-row')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should have a sort by and filter by', () => {
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('[data-test=header-sort]').should('exist')
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('[data-test=header-filter]').should('exist')
  })

  it('should be able to sort by media library', () => {
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=size'
    }).as('fetchMediaLibraryBySize')
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=name'
    }).as('fetchMediaLibraryByName')
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-sort').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.wait('@fetchMediaLibraryBySize').then((xhr) => {
      cy.log('fetch media library sort by size successfuly')
    })
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-sort').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(0).click()
    cy.wait('@fetchMediaLibraryByName').then((xhr) => {
      cy.log('fetch media library sort by name successfuly')
    })
  })

  it('should be able to filter by media library', () => {
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at&asset_type=video'
    }).as('fetchVideoMediaLibrary')
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at&asset_type=image'
    }).as('fetchImageMediaLibrary')

    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-filter').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(1).click()
    cy.wait('@fetchVideoMediaLibrary').then((xhr) => {
      cy.log('fetch video assets successfuly')
    })
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-filter').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(2).click()
    cy.wait('@fetchImageMediaLibrary').then((xhr) => {
      cy.log('fetch image assets successfuly')
    })
  })
  it('should be able to open dialog for drop image', () => {
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at&asset_type=image'
    }).as('fetchImageMediaLibrary')
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-filter').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(2).click()
    cy.wait('@fetchImageMediaLibrary').then((xhr) => {
      if (xhr.response.body.data.results.length > 0) {
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('not.exist')
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]').find('[data-test=preview-image]').click()
        cy.get('[data-test=image-cropper]').should('exist')
      } else {
        cy.log('please add images first')
      }
    })
  })

  it('should have a image cropper control and crop button in image cropper dialog', () => {
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at&asset_type=image'
    }).as('fetchImageMediaLibrary')
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-filter').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(2).click()
    cy.wait('@fetchImageMediaLibrary').then((xhr) => {
      if (xhr.response.body.data.results.length > 0) {
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('not.exist')
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]').find('[data-test=preview-image]').click()
        cy.get('[data-test=image-cropper]').should('exist')
        cy.get('[data-test=image-cropper]').find('[data-test=crop-control]').as('cropControl')
        cy.get('@cropControl').find('[data-test=btn-move]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-crop]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-desktop]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-tablet]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-mobile]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-free]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-arrow-left]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-arrow-right]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-arrow-up]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-arrow-down]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-rotate]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-rotate-revert]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-scale-x]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-scale-y]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-reset]').should('exist')
        cy.get('@cropControl').find('[data-test=btn-crop-image]').should('exist')
      } else {
        cy.log('please add images first')
      }
    })
  })

  it('should be able to crop image', () => {
    cy.route({
      method: 'GET',
      url: '/api/organization/1/asset/?page_size=20&page=1&ordering=updated_at&asset_type=image'
    }).as('fetchImageMediaLibrary')
    cy.get('@mediaLibrary').find('[data-test=media-header]').find('.header-filter').find('.v-input__slot').click()
    cy.get('.menuable__content__active > .v-card > .v-list > div').eq(2).click()
    cy.wait('@fetchImageMediaLibrary').then((xhr) => {
      if (xhr.response.body.data.results.length > 0) {
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('not.exist')
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]').find('[data-test=preview-image]').click()
        cy.get('[data-test=image-cropper]').should('exist')
        cy.get('[data-test=image-cropper]').find('[data-test=crop-control]').as('cropControl')
        cy.get('@cropControl').click()
        cy.get('@cropControl').find('[data-test=btn-crop-image]').click()
      } else {
        cy.log('please add images first')
      }
    })
  })

  it('should be able to can copy asset url', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]').find('[data-test=btn-copy-url]').click()
        cy.get('#toast-container .toast-success')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should be able to delete asset in Details', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]').find('[data-test=btn-delete-asset]').click()
        cy.get('[data-test=delete-confirm-dialog]').find('[data-test=btn-confirm]').click()
        cy.get('#toast-container .toast-success')
      } else {
        cy.log('please add media asset first')
      }
    })
  })

  it('should have a view asset button in Details', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]').find('[data-test=btn-view-asset]').should('exist')
      } else {
        cy.log('please add media asset first')
      }
    })
  })
  it('should be able to save meta data', () => {
    cy.get('@mediaLibrary').find('[data-test=media-container]').then($media => {
      if ($media.children().length > 2) {
        cy.get('[data-test=media-library-home]')
          .find('[data-test=media-library]').find('[data-test=media-container]').find('[data-test=media-item]').first().click()
        cy.get('@mediaLibrary').find('[data-test=media-details]').should('exist')
        cy.get('@mediaLibrary').find('[data-test=media-details]')
          .find('[data-test=title-input]').type('{selectAll}').type('{backspace}').type('test')
        cy.get('@mediaLibrary').find('[data-test=media-details]')
          .find('[data-test=caption-input]').type('{selectAll}').type('{backspace}').type('test')
        cy.get('@mediaLibrary').find('[data-test=media-details]')
          .find('[data-test=alt-input]').type('{selectAll}').type('{backspace}').type('test')
        cy.get('@mediaLibrary').find('[data-test=media-details]')
          .find('[data-test=btn-update-meta]').click()
        cy.get('#toast-container .toast-success')
      } else {
        cy.log('please add media asset first')
      }
    })
  })
})
