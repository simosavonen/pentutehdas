import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Reservations = ({ reservations }) => {
  if (reservations.length === 0) {
    return null
  }
  return (
    <div>
      {reservations.map((r, index) =>
        <div className='media'
          key={r.username}
          title={`reservation #${index + 1}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className='media-left is-size-6-mobile is-size-7-tablet is-size-6-desktop has-text-centered'>
            <figure style={{ border: '1px solid grey', padding: '2px 8px 2px 8px', borderRadius: '5px' }}>#{index + 1}</figure>
          </div>
          <div className='media-content is-size-6-mobile is-size-7-tablet is-size-6-fullhd'>
            {r.phone && <p><FontAwesomeIcon icon='phone' /> <a href={`tel:${r.phone}`} style={{ paddingLeft: '0.3vw' }}>{r.phone}</a></p>}
            {r.email && <p><FontAwesomeIcon icon='at' /> <a href={`mailto:${r.email}`} style={{ paddingLeft: '0.3vw' }}>{r.email}</a></p>}
            {r.city && <p><FontAwesomeIcon icon='globe' /> <span style={{ paddingLeft: '0.3vw' }}>{r.city}</span></p>}
          </div>
        </div>
      )}
    </div>

  )
}

export default Reservations