import React, { useState } from 'react'

const ConfirmButton = ({ action, payload }) => {
  const [confirming, setConfirming] = useState(false)

  return (
    <button className='button is-outlined is-danger'
      onClick={(event) => {
        event.stopPropagation()
        if (!confirming) {
          setConfirming(true)
        } else {
          action(payload)
        }
      }
      }
    >
      {confirming ? 'please confirm' : 'remove'}
    </button>
  )
}

export default ConfirmButton