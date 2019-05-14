import React from 'react'
import DogForm from './DogForm'
import Moment from 'react-moment'

const Dogs = (props) => {

  const handleDelete = async (id) => {
    await props.deleteDog({
      variables: { id }
    })
  }

  return (
    <>
      <DogForm user={props.user} addDog={props.addDog} />
      {props.result.loading &&
        <div>Loading dogs...</div>
      }
      {!props.result.loading &&
        <div className='section'>
          <table className='table is-hoverable is-fullwidth'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Breed</th>
                <th>Gender</th>
                <th>Born</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {props.result.data.allDogs.map(dog =>
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
                    {dog.owner.username} &nbsp;
                    {dog.owner.username === props.user.username &&
                      <button
                        className='button is-outlined is-danger is-small is-rounded'
                        onClick={() => handleDelete(dog.id)}
                      >remove</button>
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      }
    </>
  )
}

export default Dogs

