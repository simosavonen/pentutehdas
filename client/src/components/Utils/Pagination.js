import React from 'react'

const Pagination = ({ data, cursor, setCursor, chunkSize, message }) => {
  const cursors = []
  for (let i = 0; i < data.length; i += chunkSize) {
    cursors.push(i)
  }

  const paginate = direction => {
    const current = cursors.indexOf(cursor)
    switch (direction) {
      case -1:
        current === 0
          ? setCursor(cursors[cursors.length - 1])
          : setCursor(cursors[current - 1])
        return
      case 1:
        current === cursors.length - 1
          ? setCursor(cursors[0])
          : setCursor(cursors[current + 1])
        return
      default:
        return
    }
  }

  return (
    <div className='level is-mobile' style={{ margin: '1em' }}>
      <div className='level-left'>
        <div className='level-item'>{message}</div>
      </div>
      <div className='level-right'>
        <div
          className='level-item is-clickable is-marginless'
          onClick={() => paginate(-1)}
          style={{ width: '25px' }}
        >
          &#171;
        </div>
        {cursors.map((i, index) => (
          <div
            key={i}
            className={`level-item is-clickable is-marginless ${cursor === i &&
              'has-text-info is-bold'}`}
            style={{ width: '25px' }}
            onClick={() => setCursor(i)}
          >
            {index + 1}
          </div>
        ))}
        <div
          className='level-item is-clickable is-marginless'
          onClick={() => paginate(1)}
          style={{ width: '25px' }}
        >
          &#187;
        </div>
      </div>
    </div>
  )
}

export default Pagination
