const { timeout } = require("async")
describe("Cypress Simulator", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true", {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted")
      }
    })
  })

  it("Erro: comando válido sem parênteses", () => {
    cy.run("cy.visit")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Error:")
      .and("contain", "Missing parentheses on `cy.visit` command")
      .and("be.visible");
  });
  it("Verifica os estados desativado e ativado do botão de execução", () => {
    cy.contains("button", "Run").should("be.disabled")

    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Yay!')")
    cy.contains("button", "Run").should("be.enabled")

    cy.get("textarea[placeholder='Write your Cypress code here...']").clear()
    cy.contains("button", "Run").should("be.disabled")
  })

  it("Limpa a entrada de código ao sair e fazer login novamente", () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Yo!')")

    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()
    cy.contains("button", "Login").click()

    cy.get("textarea[placeholder='Write your Cypress code here...']").should("have.value", "")
  })

  it("Desativa o botão de execução ao sair e fazer login novamente", () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Yo!')")

    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()
    cy.contains("button", "Login").click()

    cy.contains("button", "Run").should("be.disabled")
  })

  it("Limpa a saída do código ao sair e fazer login novamente", () => {
    cy.run("cy.log('Yo!')")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.log('Yo!') // Logged message 'Yo!'")
      .and("be.visible")

    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()
    cy.contains("button", "Login").click()

    cy.get("#outputArea").should("not.contain", "cy:log('Yo!')")
  })

  it("Não exibe o banner de consentimento de cookies na página de login", () => {
    cy.clearAllLocalStorage()

    cy.reload()

    cy.contains("button", "Login").should("be.visible")
    cy.get("#cookieConsent").should("not.be.visible")
  })
})

describe("Cypress Simulator - Consentimento de cookies", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true")
  })

  it("Rejeita cookies", () => {
    cy.get("#cookieConsent")
      .as("cookieConsentBanner")
      .find("button:contains('Decline')")
      .click();
  
    cy.get("@cookieConsentBanner").should("not.be.visible")
    cy.window()
      .its("localStorage.cookieConsent")
      .should("be.equal", "declined")
  
  })
})
