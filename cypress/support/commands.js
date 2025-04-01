Cypress.Commands.add("login", () => {
    const setup = () => {
      cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true")
      cy.contains("button", "Login").click()
    }
  
    const validate = () => {
      cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true")
      cy.contains("button", "Login", { timeout: 1000 })
        .should("not.be.visible")
    }
  
    const options = {
      cacheAcrossSpecs: true,
      validate
    }
  
    cy.session(
      "sessionId",
      setup,
      options
    )
  })

  Cypress.Commands.add('run', cmd => {
    cy.get("textarea[placeholder='Write your Cypress code here...']")
      .type(cmd)
    cy.contains("button", "Run").click()
  })
  
  