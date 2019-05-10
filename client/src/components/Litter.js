import React from 'react'

const FormattedDate = ({ unixTime }) => {
  const dateObj = new Date(parseInt(unixTime, 10))
  return (
    <>
      {dateObj.getDate()}.
      {dateObj.getMonth() + 1}.
      {dateObj.getFullYear()}
    </>
  )
}

const Litter = ({ result }) => {
  if (result.loading) {
    return <div>loading...</div>
  }
  return (
    <div>
      <h2>Litters</h2>
      <table>
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
            <tr key={litter.id}>
              <td><FormattedDate unixTime={litter.duedate} /></td>
              <td>{litter.dam.name} {litter.dam.breed}</td>
              <td>{litter.sire.name} {litter.sire.breed}</td>
              <td>{litter.price} €</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Litter
