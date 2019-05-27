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

const Reservations = (props) => {
  const resStyles = {
    padding: '0.6em',
    margin: '1em 1em 0 0',
    border: '1px solid lightgrey'

  }

  if (props.reservations.length === 0) {
    return null
  }
  return (
    <>
      <p>Reservations</p>
      <div>
        {props.reservations.map((r, index) =>
          <div key={r.username} style={resStyles} className='is-size-7 is-pulled-left'>
            {r.phone && <p><strong>phone</strong> {r.phone}</p>}
            {r.email && <p><strong>email</strong> {r.email}</p>}
            {r.city && <p><strong>city</strong> {r.city}</p>}
          </div>
        )}
      </div>
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

  const tableStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  }

  if (result.loading) {
    return <div className='container'>loading...</div>
  }

  return (

    <div className='columns is-centered'>
      <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
        <table className='table is-hoverable is-fullwidth' style={tableStyles}>
          <thead>
            <tr>
              <th style={{ width: '2%' }}></th>
              <th style={{ width: '7%' }}>Due</th>
              <th style={{ width: 'auto' }}>Progress</th>
              <th style={{ width: '20%' }}><i className='fas fa-venus'></i> Dam</th>
              <th style={{ width: '20%' }}><i className='fas fa-mars'></i> Sire</th>
              <th style={{ width: '15%' }}>Puppies</th>
              <th style={{ width: '6%' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {result.data.allLitters.map(litter =>
              <React.Fragment key={litter.id}>
                <tr id={litter.id}
                  onClick={(event) => toggleDetails(event.currentTarget.id)}
                  className='is-clickable'
                >
                  <td>{details.includes(litter.id) ? <strong>&#8722;</strong> : <strong>&#43;</strong>}</td>
                  <td>
                    <Moment format="DD.MM.YY">
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
                    <td></td>
                    <td colSpan='2'>
                      {(user && litter.breeder.username !== user.username) &&
                        <p>Breeder: {litter.breeder.username}</p>
                      }
                      {(user && litter.breeder.username === user.username)
                        && <Reservations reservations={litter.reservations} />
                      }
                    </td>
                    <td>{litter.dam ? litter.dam.name : 'removed'}</td>
                    <td>{litter.sire ? litter.sire.name : 'removed'}</td>
                    <td colSpan="2">
                      {(user && litter.breeder.username !== user.username) &&
                        <button className='button is-small is-success'>reserve a puppy</button>
                      }
                      {(user && litter.breeder.username === user.username)
                        && <button className='button is-small is-info'>edit the litter</button>
                      }
                      {!user && <span>Login to reserve a puppy</span>}
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
