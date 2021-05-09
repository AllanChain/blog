describe('There is no error', () => {

  for (const page of ['/blog/programming/', '/', '/post/about/']){
    it(`Looks good on ${page}`, () => {
      cy.visit(page)
    })
  }
})
