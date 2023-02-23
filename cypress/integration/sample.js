describe('My First Test', () => {
    it('Does not do much', () => {
        cy.visit('https://app.development.bdigitalapp.com/')
        cy.contains('New User').click()
        cy.url().should('include', '/sign-up')
    })
})