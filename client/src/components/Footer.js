import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
  return (
    <footer className='footer has-background-grey-lighter'>
      <div className='container has-text-centered has-text-grey-darker is-size-7-mobile'>
        <p className='subtitle'>
          <span className='icon is-medium'>
            <FontAwesomeIcon icon='paw' size='lg' transform={{ rotate: 45 }} />
          </span>{' '}
          <strong>PENTUTEHDAS</strong> by Simo Savonen{' '}
          <span className='icon is-medium'>
            <a href='https://github.com/simosavonen/pentutehdas' title='GitHub'>
              <FontAwesomeIcon icon={['fab', 'github-square']} size='lg' />
            </a>
          </span>
          <span className='icon is-medium'>
            <a href='https://www.linkedin.com/in/simosavonen/' title='LinkedIn'>
              <FontAwesomeIcon icon={['fab', 'linkedin']} size='lg' />
            </a>
          </span>
        </p>
        <p>
          An exercise project for{' '}
          <a href='https://fullstackopen.com/challenge/'>#fullstackhaaste</a>
        </p>
        <p>
          Made with <a href='https://reactjs.org/'>ReactJS</a>,{' '}
          <a href='https://www.graphql.com/'>GraphQL</a>,{' '}
          <a href='https://www.apollographql.com/'>Apollo</a>,{' '}
          <a href='https://www.mongodb.com/'>MongoDB</a>,{' '}
          <a href='https://nodejs.org/en/'>Node.js</a>.
        </p>
        <p>
          Disclaimer: there are no dogs sold here, the puppy farm is imaginary.
        </p>
      </div>
    </footer>
  )
}

export default Footer
