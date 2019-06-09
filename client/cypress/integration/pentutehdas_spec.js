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
      cy.get('#username').type('tester')
      cy.get('#password').type('ananas')
      cy.get('#phone').type('040765421')
      cy.get('#email').type('tester@test.com')
      cy.get('#city').type('Cypress Village')
      cy.get('#register').click()
    })

    it('can log in as the new user', function() {
      cy.get('#login').click()
    })

    it('navigation menu shows new buttons', function() {
      cy.contains('profile')
    })
  })

  describe('when logged in as admin', function() {
    beforeEach(function() {
      if (this.token) {
        localStorage.setItem('pentutehdas-user-token', this.token)
      }
    })

    before(function() {
      cy.contains('Logout').click()
      this.token = null
      cy.contains('Login / Register').click()
      cy.get('#username').type('admin')
      cy.get('#password').type('ananas')
      cy.get('#login').click()
      cy.contains('roles').then(function() {
        cy.wrap(localStorage.getItem('pentutehdas-user-token')).as('token')
      })
    })

    it('can promote a user to breeder role', function() {
      cy.contains('roles').click()
      cy.get('.button')
        .contains('user')
        .click()
      cy.contains('breeder')
      cy.get('.button')
        .contains('user')
        .click()
    })
  })

  describe('when logged in as breeder', function() {
    beforeEach(function() {
      if (this.token) {
        localStorage.setItem('pentutehdas-user-token', this.token)
      }
    })

    before(function() {
      cy.contains('Logout').click()
      this.token = null
      cy.contains('Login / Register').click()
      cy.get('#username').type('tester')
      cy.get('#password').type('ananas')
      cy.get('#login').click()
      cy.contains('add a litter').then(function() {
        cy.wrap(localStorage.getItem('pentutehdas-user-token')).as('token')
      })
    })

    it('can add dogs', function() {
      cy.contains('my dogs').click()
      cy.get('#name').type('Milja')
      cy.get('#breed')
        .click()
        .find('input')
        .type('Finnish', { force: true })
        .get('#breed')
        .find('.dogbreeds__menu')
        .should('contain', 'Finnish Hound')
        .contains('Finnish Hound')
        .click()
      cy.get('#born').type('2017-05-03')
      cy.get('button')
        .contains('add a dog')
        .click()
      cy.contains('Milja')

      cy.get('#name').type('Rufus')
      cy.get('#breed')
        .click()
        .find('input')
        .type('German', { force: true })
        .get('#breed')
        .find('.dogbreeds__menu')
        .should('contain', 'German Shepherd Dog')
        .contains('German Shepherd Dog')
        .click()
      cy.get('#born').type('2016-07-02')
      cy.get('#male').click()
      cy.get('button')
        .contains('add a dog')
        .click()
      cy.contains('Rufus')
    })

    it('can add a litter', function() {
      cy.contains('add a litter').click()
      cy.get('#duedate').type(new Date().toISOString().substring(0, 10))
      cy.get('#dam').select('Milja, Finnish Hound')
      cy.get('#sire').select('Rufus, German Shepherd Dog')
      cy.get('#price').type('{backspace}1200')
      cy.get('#addOrSaveLitter').click()
    })

    it('can edit the litter', function() {
      cy.contains('Location').click()
      cy.contains('edit the litter').click()
      cy.get('#addFemalePuppy').click()
      cy.get('#addMalePuppy').click()
      cy.get('#addOrSaveLitter').click()
    })
  })

  describe('when logged in as a user', function() {
    beforeEach(function() {
      if (this.token) {
        localStorage.setItem('pentutehdas-user-token', this.token)
      }
    })

    before(function() {
      cy.contains('Logout').click()
      this.token = null
      cy.contains('Login / Register').click()
      cy.get('#username').type('testuser')
      cy.get('#password').type('ananas')
      cy.get('#login').click()
      cy.contains('profile').then(function() {
        cy.wrap(localStorage.getItem('pentutehdas-user-token')).as('token')
      })
    })

    it('can make a puppy reservation', function() {
      cy.contains('Location').click()
      cy.contains('reserve a puppy').click()
      cy.contains('Wait for the seller to contact you.')
    })

    it('can edit user profile', function() {
      cy.contains('profile').click()
      cy.get('#city')
        .clear()
        .type('Kaarina')
      cy.get('#save').click()
      cy.contains('profile').click()
      cy.get('#city').should('have.value', 'Kaarina')
      cy.get('#cancel').click()
    })
  })

  describe('Mobile resolutions', function() {
    beforeEach(function() {
      cy.viewport('iphone-6+')
    })

    it('hamburger menu appears', function() {
      cy.get('.burger').should('be.visible')
      cy.get('.burger').click()
      cy.contains('profile')
    })
  })
})
