import React from 'react'

const Loading = () => {
  return (
    <div className='section has-text-centered'>
      <h1 className='title is-size-6'>Fetching...</h1>
      <div className='columns is-centered'>
        <div className='column is-2'>
          <img src={require('../images/loading.gif')} alt='running dog' />
        </div>
      </div>
    </div>
  )
}

export default Loading
