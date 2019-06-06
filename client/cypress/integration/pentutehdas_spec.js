describe('Pentutehdas ', function() {
  beforeEach(function() {
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
})
