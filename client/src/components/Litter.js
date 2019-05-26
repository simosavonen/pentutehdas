import React, { useState } from 'react'
import Moment from 'react-moment'

const LitterProgressBar = (props) => {
  // normal gestation period in dogs
  const gestation = 63
  const duedate = new Date(parseInt(props.duedate, 10)).getTime()
  const today = new Date().getTime()
  let days = (duedate - today) / (1000 * 60 * 60 * 24)

  // should not be allowed to set due date too far into the future
  if (days > gestation) {
    days = gestation
  }

  let progress = 100

  if (days < 0) {
    days = 0
  } else {
    progress = Math.floor(100 * (gestation - days) / gestation)
  }

  let color = 'progress is-large is-success'
  if (progress < 66) { color = 'progress is-large is-warning' }
  if (progress < 33) { color = 'progress is-large is-danger' }

  return (
    <progress
      className={color}
      max={gestation}
      value={Math.floor(gestation - days)}
    >
      {progress}%
    </progress>
  )
}

const Puppies = (props) => {
  if (!props.puppies) {
    return null
  }
  return (
    <>
      {props.puppies.map((isFemale, index) =>
        isFemale
          ? <i key={index} className='fas fa-venus has-text-danger'
            style={{ marginRight: "0.25em" }}></i>
          : <i key={index} className='fas fa-mars has-text-info'
            style={{ marginLeft: "0.15em" }}></i>
      )}
    </>
  )
}

const Litter = ({ result, user }) => {
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

    <div className='columns is-centered'>
      <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
        <table className='table is-hoverable is-fullwidth'>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Due date</th>
              <th style={{ width: '20%' }}>Progress</th>
              <th style={{ width: '20%' }}><i className='fas fa-venus'></i> Dam</th>
              <th style={{ width: '20%' }}><i className='fas fa-mars'></i> Sire</th>
              <th style={{ width: '20%' }}>Puppies</th>
              <th style={{ width: 'auto' }}>Price</th>
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
                  <td><LitterProgressBar duedate={litter.duedate} /></td>
                  <td>{litter.dam ? litter.dam.breed : 'removed'}</td>
                  <td>{litter.sire ? litter.sire.breed : 'removed'}</td>
                  <td><Puppies puppies={litter.puppies} /></td>
                  <td>{litter.price}&nbsp;€</td>
                </tr>
                {details.includes(litter.id) &&
                  <tr>
                    <td colSpan='2'>Breeder: {litter.breeder.username}</td>
                    <td>{litter.dam ? litter.dam.name : 'removed'}</td>
                    <td>{litter.sire ? litter.sire.name : 'removed'}</td>
                    <td colSpan='2'>
                      {user
                        ? <button className='button is-small is-success'>reserve a puppy</button>
                        : <span>login to reserve a puppy</span>
                      }
                      {(user && litter.breeder.username === user.username)
                        && <button className='button is-small is-info' style={{ marginLeft: '1em' }}>edit the litter</button>
                      }
                    </td>
                  </tr>
                }
              </React.Fragment>
            )}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Litter
