import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const PuppyList = ({ puppies }) => {
  const divStyles = {
    minWidth: '1em',
    minHeight: '1em',
  }

  return (
    <div style={divStyles}>
      {puppies
        .sort()
        .reverse()
        .map((isFemale, index) =>
          isFemale ? (
            <FontAwesomeIcon
              key={index}
              icon='venus'
              className='has-text-danger'
              style={{ marginRight: '0.25em' }}
            />
          ) : (
            <FontAwesomeIcon
              key={index}
              icon='mars'
              className='has-text-info'
              style={{ marginLeft: '0.15em' }}
            />
          )
        )}
      {puppies.length === 0 && 'none'} &nbsp;
    </div>
  )
}

export default PuppyList
