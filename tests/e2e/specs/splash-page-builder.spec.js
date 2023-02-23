describe('Splash page builder', () => {
  beforeEach(() => {
    cy.login().then(() => {
      cy.visit('/265/265/page-builder/425')
    })
  })
  let iframeContent = null
  const selectPageByIndexAndCheckChanges = (idx) => {
    cy.get('.page-menu-heading').click()
    cy.wait(1000)
    let $btn = cy.get('.page-list .page-item').eq(idx)
    $btn.click()
    cy.wait(1000)
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      if (iframeContent) {
        expect($body.text()).to.not.equal(iframeContent)
      }
      iframeContent = $body.text()
    })
  }

  it('should be able to switch pages using navigation menu 0-1', () => {
    selectPageByIndexAndCheckChanges(0)
    cy.wait(2000)
    selectPageByIndexAndCheckChanges(1)
  })

  // it('should be able to switch pages using navigation menu 1-2', () => {
  //   selectPageByIndexAndCheckChanges(1)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(2)
  // })

  // it('should be able to switch pages using navigation menu 2-3', () => {
  //   selectPageByIndexAndCheckChanges(2)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(3)
  // })

  // it('should be able to switch pages using navigation menu 3-4', () => {
  //   selectPageByIndexAndCheckChanges(3)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(4)
  // })

  // it('should be able to switch pages using navigation menu 4-5', () => {
  //   selectPageByIndexAndCheckChanges(4)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(5)
  // })

  // it('should be able to switch pages using navigation menu 5-6', () => {
  //   selectPageByIndexAndCheckChanges(5)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(6)
  // })

  // it('should be able to switch pages using navigation menu 6-7', () => {
  //   selectPageByIndexAndCheckChanges(6)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(7)
  // })

  // it('should be able to switch pages using navigation menu 7-8', () => {
  //   selectPageByIndexAndCheckChanges(7)
  //   cy.wait(2000)
  //   selectPageByIndexAndCheckChanges(8)
  // })

  const addElementByName = (elementName, elementTitle) => {
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      $body.find('.add-block').css('visibility', 'visible')
      $body.find('.add-block').css('opacity', 1)
      let addInputBtn = $body.find('.add-block button')
      addInputBtn.click()
      cy.wait(1000)

      let elementCount = $body.find(`[data-title="${elementTitle}"]`).length
      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        let elementSelect = $newBody.find('.add-block select')
        elementSelect.val(elementName)[0].dispatchEvent(new CustomEvent('change'))
        cy.wait(100)
        let addBtn = $newBody.find('.add-block button')
        addBtn.click()
        cy.wait(1000)
        cy.get('#iframe-container > iframe').then($updatedElement => {
          let $newBody = $updatedElement.contents().find('body')
          let updateElementCount = $newBody.find(`[data-title="${elementTitle}"]`).length
          expect(elementCount).to.equal(updateElementCount - 1)
        })
      })
      $body.find('.add-block').attr('style', '')
    })
  }
  it('should be able to add heading component using add input on iframe', () => {
    addElementByName('heading', 'Heading')
  })
  it('should be able to add text input component using add input on iframe', () => {
    addElementByName('text-input', 'Text Input')
  })
  it('should be able to add link component using add input on iframe', () => {
    addElementByName('base-link', 'Link')
  })
  it('should be able to add text component using add input on iframe', () => {
    addElementByName('text-paragraph', 'Text')
  })
  it('should be able to add select input component using add input on iframe', () => {
    addElementByName('select-input', 'Text Input')
  })
  it('should be able to add email input component using add input on iframe', () => {
    addElementByName('email-input', 'Email Input')
  })
  it('should be able to add phone input component using add input on iframe', () => {
    addElementByName('phone-input', 'Phone Input')
  })
  it('should be able to add component using components bar', () => {
    let elementTitle = 'Link'
    cy.get('button.toggle-components-bar').click()

    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let elementCount = $body.find(`[data-title="${elementTitle}"]`).length

      cy.get('.components-list li').contains(elementTitle).click()
      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        let updateElementCount = $newBody.find(`[data-title="${elementTitle}"]`).length
        expect(elementCount).to.equal(updateElementCount - 1)
      })
    })
  })

  it('should be able to reset page using settings->reset', () => {
    let iframeContent = null
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let headingComponent = $body.find('.page-component.heading')
      headingComponent.click()

      cy.wait(1000)

      cy.get('.option-category-body textarea').type('changing heading component')
      cy.get('#iframe-container > iframe').then($element => {
        $body = $element.contents().find('body')
        iframeContent = $body.text()
      })
    })

    cy.wait(2000)

    cy.get('.toggle-icon').click()
    cy.get('.settings-panel > ul > li').contains('Reset').click()
    cy.get('.settings-panel .sub-panel button').contains('Reset').click()

    cy.get('#iframe-container > iframe').then($element => {
      const $body = $element.contents().find('body')
      if (iframeContent) {
        expect($body.text()).to.not.equal(iframeContent)
      }
    })
  })

  it('should be able to remove dynamically added component', () => {
    let elementTitle = 'Link'
    cy.get('button.toggle-components-bar').click()
    cy.get('.components-list li').contains(elementTitle).click()
    cy.wait(1000)

    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let similarElements = $body.find(`[data-title="${elementTitle}"]`)
      let elementCount = similarElements.length

      let lastAddedComponent = similarElements.last()
      lastAddedComponent.click()
      cy.wait(1000)

      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        $newBody.find('.selected-item .action-block .remove-action').click()
        cy.get('#iframe-container > iframe').then($updatedElement => {
          let $newBody = $updatedElement.contents().find('body')
          let updateElementCount = $newBody.find(`[data-title="${elementTitle}"]`).length
          expect(elementCount).to.equal(updateElementCount + 1)
        })
      })
    })
  })
  it('heading component text on iframe should be changed when change title on right sidebar', () => {
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let headingComponent = $body.find('.page-component.heading').first()
      let headingText = headingComponent.text()
      headingComponent.click()

      cy.wait(1000)

      cy.get('.option-category-body textarea').type('updating heading component on right panel')
      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        let updatedHeadingComponent = $newBody.find('.page-component.heading').first()
        let updatedHeadingText = updatedHeadingComponent.text()
        expect(updatedHeadingText).to.not.equal(headingText)
      })
    })
  })
  it('heading component shawdow property should be changed when change values on right sidebar', () => {
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let headingComponent = $body.find('.page-component.heading').first()
      headingComponent.click()

      cy.wait(1000)

      cy.get('.option-category-label').contains('Shadow').click()
      cy.wait(300)
      cy.get('.option-category-body label').contains('Blur').next().find('input').type('10')
      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        let updatedHeadingComponent = $newBody.find('.page-component.heading').first()

        let updatedHeadingStyle = updatedHeadingComponent.find('h2 span').attr('style')
        expect(updatedHeadingStyle).to.match(/^text-shadow/)
      })
    })
  })
  it('logo width should be changed when change values on right sidebar', () => {
    let randomNumber = 512
    cy.get('#iframe-container > iframe').then($element => {
      // activate logo
      let $body = $element.contents().find('body')
      $body.find(`[data-title="Logo"]`).click()

      cy.wait(500)
      let widthLabel = cy.get('.option-label').contains('Width')
      let widthInput = widthLabel.parent().next().find('input.form-control')
      let widthModeSelect = widthInput.next()
      widthInput.type(`{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}${randomNumber}`)
      widthModeSelect.click()
      cy.wait(500)
      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        let newLogoStyle = $newBody.find(`[data-title="Logo"] img`).attr('style')
        let regExpPattern = `width: ${randomNumber}`
        expect(newLogoStyle).to.match(new RegExp(regExpPattern))
      })
    })
  })
  it('should be able to change page background to solid color', () => {
    let elementTitle = 'Page Background'
    cy.get('button.toggle-components-bar').click()

    cy.get('.components-list li').contains(elementTitle).click()
    let solidColorOption = cy.get('.sub-panel .v-input--radio-group__input label').contains('Solid Color')
    solidColorOption.click()
    cy.get('#iframe-container > iframe').then($updatedElement => {
      let $newBody = $updatedElement.contents().find('body')
      let updatedBkStyle = $newBody.find(`#background-image`).attr('style')
      let regExpPattern = `background-color:`
      expect(updatedBkStyle).to.match(new RegExp(regExpPattern))
    })
  })
  it('should be able to change page background to image', () => {
    let elementTitle = 'Page Background'
    cy.get('button.toggle-components-bar').click()

    cy.get('.components-list li').contains(elementTitle).click()
    let solidColorOption = cy.get('.sub-panel .v-input--radio-group__input label').contains('Image')
    solidColorOption.click()
    cy.get('#iframe-container > iframe').then($updatedElement => {
      let $newBody = $updatedElement.contents().find('body')
      let updatedBkStyle = $newBody.find(`#background-image`).attr('style')
      let regExpPattern = `background-image:`
      expect(updatedBkStyle).to.match(new RegExp(regExpPattern))
    })
  })
  it('right sidebar value should be changed and typing text should be correct when user change on iframe', () => {
    let typingText = 'I am typing on page using contenteditable'
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let headingComponent = $body.find('.page-component.heading').first()
      headingComponent.click()
      cy.wait(1000)
      cy.get('.option-category-body textarea').invoke('val').then((originalText) => {
        cy.wrap(headingComponent.find('span')[0]).type(typingText)
        cy.wait(1000)
        cy.get('.option-category-body textarea').invoke('val').then((changedText) => {
          expect(originalText).not.to.eq(changedText)
          expect(changedText).to.match(new RegExp(`${typingText}`))
        })
      })
    })
  })

  let iframeStyle = null
  const selectResolutionByIndexAndCheckChanges = (idx) => {
    cy.get('.device-menu-heading').click()
    cy.wait(1000)
    let $btn = cy.get('.device-list .device-item').eq(idx)
    $btn.click()
    cy.wait(1000)
    cy.get('#iframe-container > iframe').invoke('attr', 'style').then((newIframeStyle) => {
      if (iframeStyle) {
        expect(newIframeStyle).to.not.equal(iframeStyle)
      }
      iframeStyle = newIframeStyle
    })
  }

  it('iframe resolution should be changed on device selection', () => {
    iframeStyle = null
    selectResolutionByIndexAndCheckChanges(0)
    cy.wait(2000)
    selectResolutionByIndexAndCheckChanges(1)
  })

  const selectScaleByIndexAndCheckChanges = (idx) => {
    cy.get('.scale-menu-heading').click()
    cy.wait(1000)
    let $btn = cy.get('.scale-list .scale-item').eq(idx)
    $btn.click()
    cy.wait(1000)
    cy.get('#iframe-container > iframe').invoke('attr', 'style').then((newIframeStyle) => {
      if (iframeStyle) {
        expect(newIframeStyle).to.not.equal(iframeStyle)
      }
      iframeStyle = newIframeStyle
    })
  }

  it('iframe scale should be changed on scale selection', () => {
    iframeStyle = null
    selectScaleByIndexAndCheckChanges(0)
    cy.wait(2000)
    selectScaleByIndexAndCheckChanges(1)
  })
  it('should be able to select custom resolution and iframe should change according to the resolution value', () => {
    cy.get('.device-resolution input').first().type('555')
    cy.get('.device-resolution input').last().type('777')
    cy.wait(1000)
    cy.get('#iframe-container > iframe').invoke('attr', 'style').then((newIframeStyle) => {
      expect(newIframeStyle).to.match(new RegExp(`width: 555px`))
      expect(newIframeStyle).to.match(new RegExp(`height: 777px`))
    })
  })
  it('should be able to create link using right click', () => {
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let headingComponent = $body.find('.page-component.heading').first()
      headingComponent.click()
      cy.wait(1000)
      cy.wrap(headingComponent.find('span')[0]).type('{selectall}')
      cy.wait(500)
      $body.find('.screen-center')[0].dispatchEvent(new CustomEvent('contextmenu'))
      console.log('For now it should be tested manually since cypress uses iframe ...')
      // cy.get('.context-menu li').click()
      // cy.wait(1000)
      // cy.get('.option-category-body textarea').invoke('val').then((changedText) => {
      //   expect(changedText).to.match(/<.*>/)
      // })
    })
  })
  it('should be able to do undo/redo and disable button when it is at the end', () => {
    cy.get('#iframe-container > iframe').then($element => {
      let $body = $element.contents().find('body')
      let headingComponent = $body.find('.page-component.heading').first()
      let headingText = headingComponent.text()
      headingComponent.click()

      cy.wait(1000)

      cy.get('.option-category-body textarea').type('updating heading component on right panel')
      cy.get('#iframe-container > iframe').then($updatedElement => {
        let $newBody = $updatedElement.contents().find('body')
        let updatedHeadingComponent = $newBody.find('.page-component.heading').first()
        let updatedHeadingText = updatedHeadingComponent.text()
        expect(updatedHeadingText).to.not.equal(headingText)

        cy.get('.btn-redo').should(($button) => {
          expect($button).to.have.class('disabled')
        })
        cy.get('.btn-undo').click()
        cy.get('.btn-redo').should(($button) => {
          expect($button).to.not.have.class('disabled')
        })
        cy.get('#iframe-container > iframe').then($newUpdateElement => {
          let $newUpdateBody = $newUpdateElement.contents().find('body')
          let newHeadingComponent = $newUpdateBody.find('.page-component.heading').first()
          let newHeadingText = newHeadingComponent.text()
          expect(newHeadingText).to.equal(headingText)
        })
      })
    })
  })
  // it('should be able to convert old version of template to current version automatically', () => {
  // })
  // const checkRenderedElements = function (visitPage, version, pageName) {
  //   cy.visit(visitPage)
  //   cy
  //     .request('GET', `http://localhost:8081/config.${version}.json`)
  //     .then((response) => {
  //       console.log('response.body', response.body)
  //       let pages = response.body.splash_page.config.pages
  //       let page = pages[pageName]
  //       let keys = Object.keys(page)
  //       let totalElementCnt = 0
  //       keys.forEach(key => {
  //         let elements = page[key]
  //         if (!Array.isArray(elements)) {
  //           elements = [elements]
  //         }
  //         totalElementCnt += elements.length
  //       })
  //       cy.get('#iframe-container > iframe').then($element => {
  //         let $body = $element.contents().find('body')
  //         expect($body.find(`.page-form`).children().length).to.equal(totalElementCnt)
  //       })
  //     })
  // }
  // it('should render all components which is available in v0 JSON structure', () => {
  //   checkRenderedElements('/265/265/page-builder/364', 0, 'guestForm')
  // })
  // it('should render all components which is available in v1 JSON structure', () => {
  //   checkRenderedElements('/265/265/page-builder/337', 1, 'guestForm')
  // })
})
