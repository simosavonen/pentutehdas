import React, { useContext, useState } from 'react'
import DogForm from './DogForm'
import Moment from 'react-moment'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { ALL_DOGS, DELETE_DOG } from '../../graphql/dogs'
import { toast } from 'react-toastify'
import { ConfirmButton, Loading, UserContext, Pagination } from '..'

const Dogs = () => {
  const [cursor, setCursor] = useState(0)
  const dogs = useQuery(ALL_DOGS)
  const userContext = useContext(UserContext)
  const { user } = userContext

  const deleteDog = useMutation(DELETE_DOG, {
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
    return (
      <div className='section'>This page is meant for logged in users.</div>
    )

  if (dogs.loading) return <Loading />
  if (dogs.error) return <div className='container'>Error loading dogs.</div>

  let filtered = dogs.data.allDogs
  if (user.role !== 'admin') {
    filtered = dogs.data.allDogs.filter(
      dog => dog.owner.username === user.username
    )
  }

  return (
    <>
      <DogForm />
      <div className='section columns is-centered'>
        <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
          <Pagination
            data={filtered}
            cursor={cursor}
            setCursor={setCursor}
            chunkSize={10}
            message=''
          />
          <table className='table is-fullwidth' style={tableStyles}>
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
              {filtered.slice(cursor, cursor + 10).map(dog => (
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
                  <td className='has-text-centered'>{dog.owner.username}</td>
                  <td>
                    <ConfirmButton
                      action={handleDelete}
                      payload={dog.id}
                      message='remove dog'
                      classNames='button is-outlined is-danger is-small'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            data={filtered}
            cursor={cursor}
            setCursor={setCursor}
            chunkSize={10}
            message=''
          />
        </div>
      </div>
    </>
  )
}

export default Dogs
