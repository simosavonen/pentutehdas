describe('Pentutehdas ', function() {
  before(function() {
    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/graphql',
      body: { query: 'mutation { reset }' },
      failsOnStatusCode: false,
    }).then(res => cy.log(res))
    cy.visit('http://localhost:3000')
  })

  it('front page can be openened', function() {
    cy.contains('PENTUTEHDAS')
  })

  describe('when logged out', function() {
    it('can register a new user', function() {
      cy.contains('Login / Register').click()
      cy.contains('register new user').click()
      cy.get('#username').type('breeder')
      cy.get('#password').type('ananas')
      cy.get('#phone').type('040765421')
      cy.get('#email').type('breeder@test.com')
      cy.get('#city').type('Cypress Village')
      cy.get('#register').click()
      cy.wait(1000)
    })

    it('can log in as the new user', function() {
      cy.get('#login').click()
      cy.wait(1000)
    })

    it('navigation menu shows new buttons', function() {
      cy.contains('profile')
    })

    after(function() {
      cy.contains('Logout').click()
    })
  })

  describe('when logged in as admin', function() {
    beforeEach(() => {
      cy.restoreLocalStorage()
    })

    afterEach(() => {
      cy.saveLocalStorage()
    })

    before(function() {
      cy.contains('Login / Register').click()
      cy.wait(1000)
      cy.get('#username').type('admin')
      cy.wait(1000)
      cy.get('#password').type('ananas')
      cy.wait(1000)
      cy.get('#login').click()
      cy.wait(1000)
    })

    it('navigation menu shows admin tools', function() {
      cy.contains('roles')
    })

    it('can promote a user to breeder role', function() {
      cy.contains('roles').click()
      cy.wait(1000)
      cy.get('button')
        .contains('user')
        .click()
    })

    after(function() {
      cy.wait(1000)
      cy.contains('Logout').click()
    })
  })

  describe('when logged in as breeder', function() {
    beforeEach(() => {
      cy.restoreLocalStorage()
    })

    afterEach(() => {
      cy.saveLocalStorage()
    })

    before(function() {
      cy.contains('Login / Register').click()
      cy.get('#username').type('breeder')
      cy.get('#password').type('ananas')
      cy.get('#login').click()
      cy.wait(1000)
    })

    it('navigation menu shows tools for adding dogs and litters', function() {
      cy.contains('add a litter')
      cy.contains('my dogs')
    })

    after(function() {
      cy.contains('Logout').click()
    })
  })
})
