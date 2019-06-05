import React from 'react'

const Pagination = ({ data, cursor, setCursor, chunkSize, message }) => {

  const cursors = []
  for (let i = 0; i < data.length; i += chunkSize) {
    cursors.push(i)
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
    <table className='table is-fullwidth'
      style={{ backgroundColor: 'rgba(255, 255, 255, 0)', marginTop: '1em', marginBottom: '1em' }}>
      <tbody>
        <tr>
          <td style={{ width: '100%' }}>{message}</td>
          <td className='is-clickable' onClick={() => paginate(-1)}>&#171;</td>
          {cursors.map((i, index) =>
            <td key={i}
              className={`is-clickable ${cursor === i && 'has-text-info is-bold'}`}
              style={{ width: '50px', textAlign: 'center' }}
              onClick={() => setCursor(i)}>{index + 1}</td>
          )}
          <td className='is-clickable' onClick={() => paginate(1)}>&#187;</td>
        </tr>
      </tbody>
    </table>
  )
}

export default Pagination