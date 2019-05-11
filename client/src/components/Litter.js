import React, { useState } from 'react'
import Moment from 'react-moment'
import { Table, Progress } from 'react-bulma-components/full'


const Litter = ({ result }) => {
  const [details, setDetails] = useState([])

  const toggleDetails = (id) => {
    if (details.includes(id)) {
      setDetails(details.filter(d => d !== id))
    } else {
      setDetails([...details, id])
    }
  }

  if (result.loading) {
    return <div className='container'>loading...</div>
  }

  return (
    <div className='container'>
      <h2 className='title'>Litters</h2>
      <Table className='is-hoverable'>
        <thead>
          <tr>
            <th>Due date</th>
            <th>Progress</th>
            <th><i className='fas fa-venus'></i> Dam</th>
            <th><i className='fas fa-mars'></i> Sire</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {result.data.allLitters.map(litter =>
            <React.Fragment key={litter.id}>
              <tr id={litter.id}
                onClick={(event) => toggleDetails(event.currentTarget.id)}
                className='is-clickable'
              >
                <td>
                  <Moment format="DD.MM.YYYY">
                    {new Date(parseInt(litter.duedate, 10))}
                  </Moment>
                </td>
                <td><Progress max={65} value={15} color='primary' size='large' /></td>
                <td>{litter.dam.breed}</td>
                <td>{litter.sire.breed}</td>
                <td>{litter.price} €</td>
              </tr>
              {details.includes(litter.id) &&
                <tr>
                  <td colSpan='2'>Breeder: {litter.breeder.username}</td>
                  <td>{litter.dam.name}</td>
                  <td>{litter.sire.name}</td>
                  <td><button>reserve a puppy</button></td>
                </tr>
              }
            </React.Fragment>
          )}
        </tbody>
      </Table>

    </div>
  )
}

export default Litter
