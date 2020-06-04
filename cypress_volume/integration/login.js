describe('Basic login test', () => {
    it('Checks if we can load the page', () => {
        cy.visit(Cypress.config().baseUrl)

        // Check if there's an input field
        cy.get('#login-container').should('be.visible')
    })

    it('Checks if we can log in',() => {
        // Type into the first input on the page
        cy.get('input').eq(0).type('ann.perkins')

        // Type into the second input on the page
        cy.get('input').eq(1).type('password')

        cy.get('button').click()     
        
        cy.get('#topbar').should('be.visible')
    })
})