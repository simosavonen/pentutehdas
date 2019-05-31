import React from 'react'

const Pagination = ({ data, cursor, setCursor }) => {

  const cursors = []
  for (let i = 0; i < data.length; i += 5) {
    cursors.push(i)
  }

  const puppies = data.reduce((sum, litter) => sum + litter.puppies.length, 0)

  const tdStyles = {
    width: '50px',
    textAlign: 'center'
  }

  const tableStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0',
    marginTop: '10px',
    marginBottom: '10px'
  }

  const paginate = (direction) => {
    const current = cursors.indexOf(cursor)
    switch (direction) {
      case -1:
        current === 0 ? setCursor(cursors[cursors.length - 1]) : setCursor(cursors[current - 1])
        return
      case 1:
        current === cursors.length - 1 ? setCursor(cursors[0]) : setCursor(cursors[current + 1])
        return
      default:
        return
    }
  }

  return (
    <table className='table is-fullwidth' style={tableStyles}>
      <tbody>
        <tr>
          <td style={{ width: '100%' }}>There are {puppies} puppies in {data.length} litters.</td>
          <td className='is-clickable' onClick={() => paginate(-1)}>&#171;</td>
          {cursors.map((i, index) =>
            <td key={i}
              className={`is-clickable ${cursor === i && 'has-text-info is-bold'}`}
              style={tdStyles}
              onClick={() => setCursor(i)}>{index + 1}</td>
          )}
          <td className='is-clickable' onClick={() => paginate(1)}>&#187;</td>
        </tr>
      </tbody>

    </table>
  )
}

export default Pagination