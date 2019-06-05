import React from 'react'
import { Query } from 'react-apollo'
import { USERS } from '../graphql/user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Reservations = ({ reservations }) => (
  <Query query={USERS} variables={{ ids: reservations }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading reservations...'
      if (error) return 'Error! Failed to load reservations.'

      return (
        <div>
          {data.users.map((r, index) => (
            <div
              className='media'
              key={r.username}
              title={`reservation #${index + 1}`}
              onClick={event => event.stopPropagation()}
            >
              <div className='media-left is-size-6-mobile is-size-7-tablet is-size-6-desktop has-text-centered'>
                <figure
                  style={{
                    border: '1px solid grey',
                    padding: '2px 8px 2px 8px',
                    borderRadius: '5px',
                  }}
                >
                  #{index + 1}
                </figure>
              </div>
              <div className='media-content is-size-6-mobile is-size-7-tablet is-size-6-fullhd'>
                {r.phone && (
                  <p>
                    <FontAwesomeIcon icon='phone' />{' '}
                    <a href={`tel:${r.phone}`} style={{ paddingLeft: '0.3vw' }}>
                      {r.phone}
                    </a>
                  </p>
                )}
                {r.email && (
                  <p>
                    <FontAwesomeIcon icon='at' />{' '}
                    <a
                      href={`mailto:${r.email}`}
                      style={{ paddingLeft: '0.3vw' }}
                    >
                      {r.email}
                    </a>
                  </p>
                )}
                {r.city && (
                  <p>
                    <FontAwesomeIcon icon='globe' />{' '}
                    <span style={{ paddingLeft: '0.3vw' }}>{r.city}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }}
  </Query>
)

export default Reservations
