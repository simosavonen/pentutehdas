describe('Pentutehdas ', function() {
  it('front page can be openened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('PENTUTEHDAS')
  })
})
