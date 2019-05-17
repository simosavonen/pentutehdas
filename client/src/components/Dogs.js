import React from 'react'
import DogForm from './DogForm'
import Moment from 'react-moment'

const Dogs = (props) => {

  const handleDelete = async (id) => {
    await props.deleteDog({
      variables: { id }
    })
  }

  if (props.result.loading) {
    return (
      <DogForm user={props.user} addDog={props.addDog} />
    )
  }

  return (
    <>
      <DogForm user={props.user} addDog={props.addDog} />
      <div className='columns is-centered'>
        <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
          <table className='table is-hoverable is-fullwidth'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Breed</th>
                <th>Gender</th>
                <th>Born</th>
                <th>Owner</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.result.data.allDogs.map(dog =>
                (props.user.role === 'admin' || props.user.username === dog.owner.username) &&
                <tr key={dog.id}>
                  <td>{dog.name}</td>
                  <td>{dog.breed}</td>
                  <td>{dog.isFemale ? 'female' : 'male'}</td>
                  <td>
                    <Moment format="DD.MM.YYYY">
                      {new Date(parseInt(dog.born, 10))}
                    </Moment>
                  </td>
                  <td>
                    {dog.owner.username}
                  </td>
                  <td>
                    <button
                      className='button is-outlined is-danger is-small is-rounded'
                      onClick={() => handleDelete(dog.id)}
                    >remove</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dogs

