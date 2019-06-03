import React from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const LitterProgressBar = ({ date }) => {
  // normal gestation period in dogs
  const gestation = 63
  const dateObj = new Date(parseInt(date, 10))
  const duedate = dateObj.getTime()
  const today = new Date().getTime()
  let days = (duedate - today) / (1000 * 60 * 60 * 24)


  // should not be allowed to set duedate too far into the future
  if (days > gestation) {
    days = gestation
  }

  const styles = {
    fontSize: '16px',
    lineHeight: '16px',
    marginTop: '-16px'
  }

  const progress = Math.floor(100 * (gestation - days) / gestation)
  let color = '#23d160'
  if (progress < 66) { color = '#ffdd57' }
  if (progress < 33) { color = '#ff3860' }

  return (
    <CircularProgressbarWithChildren
      maxValue={gestation}
      value={Math.floor(gestation - days)}
      strokeWidth={13}
      styles={{
        path: {
          stroke: color
        }
      }}
    >
      <div className='has-text-centered' style={styles} title={progress < 100 ? `Estimated due date` : `Puppies' birthday`}>
        {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj)}<br />
        <strong>{dateObj.getDate()}</strong>
      </div>
    </CircularProgressbarWithChildren>

  )
}

export default LitterProgressBar