import React from 'react'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container has-text-centered'>
        <p>
          <strong>PENTUTEHDAS</strong> by Simo Savonen. An exercise project for <a href='https://fullstackopen.com/challenge/'>#fullstackhaaste</a>
        </p>
        <p>
          Made with <a href='https://reactjs.org/'>ReactJS</a>, <a href='https://www.graphql.com/'>GraphQL</a>, <a
            href='https://www.apollographql.com/'>Apollo</a>, <a href='https://www.mongodb.com/'>MongoDB</a>, <a href='https://nodejs.org/en/'>Node.js</a>.
        </p>
        <p>
          Disclaimer: there are no dogs sold here, the puppy farm is imaginary.
        </p>
      </div>
    </footer>
  )
}

export default Footer