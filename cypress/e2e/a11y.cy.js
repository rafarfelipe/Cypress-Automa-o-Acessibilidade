describe("Cypress Simulator - A11y Checks", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true", {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted")
      }
    })
    cy.injectAxe()
  })
  it("Simula com sucesso um comando Cypress (e.g., cy.log('Yay!'))", () => {
    cy.run("cy.log('Yay!')")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and("be.visible");

    cy.checkA11y(".success")
  })

  it("Exibe um erro ao inserir e executar um comando inválido do Cypress (por exemplo, cy.run())", () => {
    cy.run("cy.run()")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Error:")
      .and("contain", "Invalid Cypress command: cy.run()")
      .and("be.visible");

    cy.checkA11y(".error")  
  })

  it("Exibe um aviso ao inserir e executar um comando não implementado do Cypress (por exemplo, cy.contains('Login'))", () => {
    cy.run("cy.contains('Login')")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Warning:")
      .and("contain", "The `cy.contains` command has not been implemented yet.")
      .and("be.visible");

    cy.checkA11y(".warning")
  })

  it("Pede ajuda e recebe comandos comuns do Cypress com exemplos e um link para a documentação", () => {
    cy.run("help")

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Common Cypress commands and examples:")
      .and("contain", "For more commands and details, visit the official Cypress API documentation.")
      .and("be.visible");
    cy.contains("#outputArea a", "official Cypress API documentation")
      .should("have.attr", "href", "https://docs.cypress.io/api/table-of-contents")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer")
      .and("be.visible");

    cy.checkA11y("#outputArea")   
  })

  it("Maximiza e minimiza um resultado de simulação", () => {
    cy.run("cy.log('Yay!')")

    cy.get(".expand-collapse").click();

    cy.get("#outputArea", { timeout: 6000 })
      .should("contain", "Success:")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and("be.visible");
    cy.get("#collapseIcon").should("be.visible");

    cy.checkA11y()

    cy.get(".expand-collapse").click();

    cy.get("#expandIcon").should("be.visible")
  })

  it("Logout com sucesso", () => {
    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()

    cy.contains("button", "Login").should("be.visible")
    cy.get("#sandwich-menu").should("not.be.visible")

    cy.checkA11y()
  });

  it("Exibe e oculta o botão de logout", () => {
    cy.get("#sandwich-menu").click();

    cy.contains("button", "Logout").should("be.visible");
    cy.injectAxe()

    cy.get("#sandwich-menu").click();

    cy.contains("button", "Logout").should("not.be.visible");
  })

  it("Mostra o estado em execução antes de exibir o resultado final", () => {
    cy.run("cy.log('Yay!')")
    
    cy.contains("button", "Running...").should("be.visible")
    cy.contains("#outputArea", "Running... Please wait").should("be.visible")

    cy.checkA11y()

    cy.contains("button", "Running...", { timeout: 6000 }).should("not.exist")
    cy.get("#outputArea")
      .should("contain", "Success:")
      .and("contain", "cy.log('Yay!') // Logged message 'Yay!'")
      .and("be.visible")
  })
})

describe("Cypress Simulator - Consentimento de cookies", () => {
  beforeEach(() => {
    cy.login()
    cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html?skipCaptcha=true")
    cy.injectAxe()
  })
  it("Aceita cookies", () => {
    cy.get("#cookieConsent")
      .as("cookieConsentBanner")
      .should("be.visible")

    cy.checkA11y()

    cy.get("@cookieConsentBanner")
      .find("button:contains('Accept')").click()

    cy.get("@cookieConsentBanner").should("not.be.visible")
    cy.window()
      .its("localStorage.cookieConsent")
      .should("be.equal", "accepted")
  })
})
describe("Cypress Simulator - Captcha", () => {
  beforeEach(() => {
    cy.visit("https://cypress-simulator.s3.eu-central-1.amazonaws.com/index.html")
    cy.contains("button", "Login").click()
    cy.injectAxe()
  })

  it("Não encontra problemas de acessibilidade em todos os estados de exibição do CAPTCHA (botão ativado/desativado e erro)", () => {
    cy.contains("button", "Verify").should("be.disabled")

    cy.get("input[placeholder='Enter your answer']").type("333")

    cy.contains("button", "Verify").should("be.enabled")
    cy.checkA11y()

    cy.contains("button", "Verify").click()

    cy.contains(".error", "Incorrect answer, please try again.").should("be.visible")
    cy.get("input[placeholder='Enter your answer']").should("have.value", "")
    cy.contains("button", "Verify").should("be.disabled")

    cy.checkA11y()

  })
})
