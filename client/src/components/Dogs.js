import React from 'react'
import DogForm from './DogForm'
import Moment from 'react-moment'

const Dogs = (props) => {

  const handleDelete = async (id) => {
    await props.deleteDog({
      variables: { id }
    })
  }

  const tableStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  }

  if (props.dogs.loading) {
    return (
      <DogForm user={props.user} addDog={props.addDog} />
    )
  }

  return (
    <>
      <DogForm user={props.user} addDog={props.addDog} />
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.dogs.data.allDogs.map(dog =>
                (props.user.role === 'admin' || props.user.username === dog.owner.username) &&
                <tr key={dog.id}>
                  <td>{dog.name}</td>
                  <td>{dog.breed}</td>
                  <td className='has-text-centered'>{dog.isFemale ? 'female' : 'male'}</td>
                  <td className='has-text-centered'>
                    <Moment format="MMM YY">
                      {new Date(parseInt(dog.born, 10))}
                    </Moment>
                  </td>
                  <td className='has-text-centered'>
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

