import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { ALL_LITTERS } from '../graphql/litters'
import { ALL_USERS } from '../graphql/user'
import { ALL_DOGS } from '../graphql/dogs'

const tableStyles = {
  backgroundColor: 'rgba(255, 255, 255, 0.3)'
}

const countLitters = (litterArray, breeder) => {
  return litterArray
    .filter(l => l.breeder.username === breeder.username)
    .length
}

const countDogs = (dogArray, owner) => {
  return dogArray
    .filter(d => d.owner.username === owner.username)
    .length
}

const countReservations = (litterArray, user) => {
  return litterArray
    .filter(l => l.reservations
      .map(r => r.username)
      .includes(user.username)
    )
    .length
}

const Roles = ({ user }) => {

  const users = useQuery(ALL_USERS)
  const litters = useQuery(ALL_LITTERS)
  const dogs = useQuery(ALL_DOGS)

  const toggleBreederStatus = (user) => {
    console.log('toggle toggle', user)
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className='container'>Only admins can change user roles.</div>
    )
  }
  if (users.loading || litters.loading || dogs.loading) return <div className='container'>Loading...</div>
  if (users.error || litters.error || dogs.error) return <div className='container'>Error! Failed to load data.</div>

  return (
    <div className='columns is-centered'>
      <div className='column is-12-mobile is-11-tablet is-9-desktop is-8-widescreen is-7-fullhd'>
        <h1 className='title'>User role management</h1>
        <table className='table is-fullwidth is-size-7-mobile is-size-6-tablet is-size-5-widescreen' style={tableStyles}>
          <thead>
            <tr>
              <th>username</th>
              <th>city</th>
              <th>phone</th>
              <th>email</th>
              <th className='has-text-centered'>role</th>
              <th className='has-text-centered' title='Litters'>L</th>
              <th className='has-text-centered' title='Dogs'>D</th>
              <th className='has-text-centered' title='Reservations'>R</th>
            </tr>
          </thead>
          <tbody>
            {users.data.allUsers
              .sort((a, b) => a.role > b.role ? 1 : (a.role < b.role ? -1 : 0))
              .map(user =>
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.city}</td>
                  <td>{user.phone}</td>
                  <td><a href={`mailto:${user.email}`} title={user.email}>email</a></td>
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
                  <td className='has-text-centered'>{countLitters(litters.data.allLitters, user)}</td>
                  <td className='has-text-centered'>{countDogs(dogs.data.allDogs, user)}</td>
                  <td className='has-text-centered'>{countReservations(litters.data.allLitters, user)}</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  )

}

export default Roles