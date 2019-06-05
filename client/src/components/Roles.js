import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { ALL_LITTERS } from '../graphql/litters'
import { ALL_USERS, UPDATE_ROLE } from '../graphql/user'
import { ALL_DOGS } from '../graphql/dogs'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Pagination } from '../components'

const countLitters = (litterArray, breeder) => {
  return litterArray.filter(l => l.breeder.username === breeder.username).length
}

const countDogs = (dogArray, owner) => {
  return dogArray.filter(d => d.owner.username === owner.username).length
}

const countReservations = (litterArray, user) => {
  return litterArray.filter(l =>
    l.reservations.map(r => r.username).includes(user.username)
  ).length
}

const tableStyles = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
}

const Roles = ({ user }) => {
  const [cursor, setCursor] = useState(0)

  const users = useQuery(ALL_USERS)
  const litters = useQuery(ALL_LITTERS)
  const dogs = useQuery(ALL_DOGS)

  const updateRole = useMutation(UPDATE_ROLE, {
    onError: error => Sentry.captureException(error),
    update: () => {
      toast.info('Role was updated')
    },
  })

  const toggleBreederStatus = async user => {
    if (user.role !== 'admin') {
      await updateRole({
        variables: { username: user.username },
      })
    } else {
      toast.error('Cannot touch admins.')
    }
  }

  if (!user || user.role !== 'admin') {
    return <div className='container'>Only admins can change user roles.</div>
  }
  if (users.loading || litters.loading || dogs.loading)
    return <div className='container'>Loading...</div>
  if (users.error || litters.error || dogs.error)
    return <div className='container'>Error! Failed to load data.</div>

  return (
    <div className='columns is-centered'>
      <div className='column is-12-mobile is-11-tablet is-9-desktop is-8-widescreen is-7-fullhd'>
        <h1 className='title is-size-4-mobile is-size-3'>
          User role management
        </h1>
        <table
          className='table is-fullwidth is-size-7-mobile is-size-6-tablet is-size-5-widescreen'
          style={tableStyles}
        >
          <thead>
            <tr>
              <th>username</th>
              <th>city</th>
              <th className='has-text-centered' title='phone'>
                <FontAwesomeIcon icon='phone' />
              </th>
              <th className='has-text-centered' title='email'>
                <FontAwesomeIcon icon='at' />
              </th>
              <th className='has-text-centered'>role</th>
              <th className='has-text-centered' title='Litters'>
                L
              </th>
              <th className='has-text-centered' title='Dogs'>
                D
              </th>
              <th className='has-text-centered' title='Reservations'>
                R
              </th>
            </tr>
          </thead>
          <tbody>
            {users.data.allUsers
              .sort((a, b) => a.username.localeCompare(b.username))
              .slice(cursor, cursor + 10)
              .map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.city}</td>
                  <td className='has-text-centered'>
                    {user.phone && (
                      <a href={`tel:${user.phone}`} title={user.phone}>
                        <FontAwesomeIcon icon='phone' />
                      </a>
                    )}
                  </td>
                  <td className='has-text-centered'>
                    {user.email && (
                      <a href={`mailto:${user.email}`} title={user.email}>
                        <FontAwesomeIcon icon='at' />
                      </a>
                    )}
                  </td>
                  <td className={'has-text-centered'}>
                    <button
                      className={`button is-small is-outlined
                      ${user.role === 'user' && ' is-success'}
                      ${user.role === 'breeder' && ' is-info'}
                      ${user.role === 'admin' && ' is-danger'}
                    `}
                      onClick={() => toggleBreederStatus(user)}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className='has-text-centered' title='Litters'>
                    {countLitters(litters.data.allLitters, user)}
                  </td>
                  <td className='has-text-centered' title='Dogs'>
                    {countDogs(dogs.data.allDogs, user)}
                  </td>
                  <td className='has-text-centered' title='Reservations'>
                    {countReservations(litters.data.allLitters, user)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <Pagination
          data={users.data.allUsers}
          cursor={cursor}
          setCursor={setCursor}
          chunkSize={10}
          message=''
        />
      </div>
    </div>
  )
}

export default Roles
