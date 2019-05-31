import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Reservations = ({ reservations }) => {
  const resStyles = {
    padding: '0.6em',
    margin: '0.5em 1em 0.5em 0',
    border: '1px solid lightgrey',
  }

  if (reservations.length === 0) {
    return null

  }
  return (
    <div className='is-clearfix'>
      {reservations.map((r, index) =>
        <div
          key={r.username}
          style={resStyles}
          className='is-pulled-left is-size-7 is-size-6-fullhd'
          title={`reservation #${index + 1}`}
          onClick={(event) => event.stopPropagation()}
        >
          <p><span className='icon'><strong>&#8470;</strong></span> {index + 1} / {reservations.length}</p>
          {r.phone && <p><span className="icon"><FontAwesomeIcon icon='phone' /></span> <a href={`tel:${r.phone}`}>{r.phone}</a></p>}
          {r.email && <p><span className="icon"><FontAwesomeIcon icon='at' /></span> <a href={`mailto:${r.email}`}>
            {r.email}</a></p>}
          {r.city && <p><span className="icon"><FontAwesomeIcon icon='globe' /></span> {r.city}</p>}
        </div>
      )}
    </div>

  )
}

export default Reservations