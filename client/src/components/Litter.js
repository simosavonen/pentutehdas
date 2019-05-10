import React, { useState } from 'react'
import Moment from 'react-moment'
import { Table } from 'react-bulma-components/full'


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
            <th>Dam</th>
            <th>Sire</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {result.data.allLitters.map(litter =>
            <React.Fragment key={litter.id}>
              <tr id={litter.id}
                onClick={(event) => toggleDetails(event.target.parentElement.id)}
                className='is-clickable'
              >
                <td>
                  <Moment format="DD.MM.YYYY">
                    {new Date(parseInt(litter.duedate, 10))}
                  </Moment>
                </td>
                <td>{litter.dam.breed}</td>
                <td>{litter.sire.breed}</td>
                <td>{litter.price} €</td>
              </tr>
              {details.includes(litter.id) &&
                <tr>
                  <td></td>
                  <td>{litter.dam.name}</td>
                  <td>{litter.sire.name}</td>
                  <td></td>
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
