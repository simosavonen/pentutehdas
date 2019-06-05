import React, { useState } from 'react'

const ConfirmButton = ({ action, payload, message, classNames }) => {
  const [confirming, setConfirming] = useState(false)

  return (
    <button
      className={classNames}
      onClick={event => {
        event.stopPropagation()
        if (!confirming) {
          setConfirming(true)
        } else {
          action(payload)
        }
      }}
    >
      {confirming ? 'please confirm' : message}
    </button>
  )
}

export default ConfirmButton
