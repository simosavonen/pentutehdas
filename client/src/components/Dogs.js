import React from 'react'
import DogForm from './DogForm'
import Moment from 'react-moment'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { ALL_DOGS, DELETE_DOG } from '../graphql/dogs'
import * as Sentry from '@sentry/browser'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'
import { ConfirmButton } from '../components'

const Dogs = ({ user }) => {
  const dogs = useQuery(ALL_DOGS)

  const deleteDog = useMutation(DELETE_DOG, {
    onError: error => Sentry.captureException(error),
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_DOGS })
      dataInStore.allDogs = dataInStore.allDogs.filter(
        dog => dog.id !== response.data.deleteDog.id
      )
      store.writeQuery({
        query: ALL_DOGS,
        data: dataInStore,
      })
      toast.info('Dog was removed.')
    },
  })

  const handleDelete = async id => {
    await deleteDog({
      variables: { id },
    })
  }

  const tableStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  }

  if (!user || !['breeder', 'admin'].includes(user.role))
    return <Redirect to='/' />

  if (dogs.loading) return <div className='container'>Loading dogs...</div>
  if (dogs.error) return <div className='container'>Error loading dogs.</div>

  return (
    <>
      <DogForm user={user} />
      <div className='columns is-centered'>
        <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
          <table className='table is-fullwidth is-striped' style={tableStyles}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Breed</th>
                <th className='has-text-centered'>Gender</th>
                <th className='has-text-centered'>Born</th>
                <th className='has-text-centered'>Owner</th>
                <th style={{ width: '130px' }} />
              </tr>
            </thead>
            <tbody>
              {dogs.data.allDogs.map(
                dog =>
                  (user.role === 'admin' ||
                    user.username === dog.owner.username) && (
                    <tr key={dog.id}>
                      <td>{dog.name}</td>
                      <td>{dog.breed}</td>
                      <td className='has-text-centered'>
                        {dog.isFemale ? 'female' : 'male'}
                      </td>
                      <td className='has-text-centered'>
                        <Moment format='MMM YY'>
                          {new Date(parseInt(dog.born, 10))}
                        </Moment>
                      </td>
                      <td className='has-text-centered'>
                        {dog.owner.username}
                      </td>
                      <td>
                        <ConfirmButton
                          action={handleDelete}
                          payload={dog.id}
                          message='remove dog'
                          classNames='button is-outlined is-danger is-small'
                        />
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dogs
