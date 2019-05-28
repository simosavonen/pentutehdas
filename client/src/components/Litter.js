import React, { useState } from 'react'
import Moment from 'react-moment'
import LitterForm from './LitterForm'
import PuppyList from './PuppyList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
const Reservations = (props) => {
  const resStyles = {
    padding: '0.6em',
    margin: '0.5em 1em 0.5em 0',
    border: '1px solid lightgrey',
    backgroundColor: 'rgba(0,0,0,0.02)'
  }

  if (props.reservations.length === 0) {
    return (
      <p><strong>No reservations yet</strong></p>
    )
  }
  return (
    <>
      <p><strong>Puppy reservations</strong></p>
      <div className='is-clearfix'>
        {props.reservations.map((r, index) =>
          <div key={r.username} style={resStyles} className='is-pulled-left' title={`reservation #${index + 1}`}>
            {r.phone && <p><span className="icon"><FontAwesomeIcon icon='phone' /></span> {r.phone}</p>}
            {r.email && <p><span className="icon"><FontAwesomeIcon icon='at' /></span> <a href={`mailto:${r.email}`}>
              {r.email}</a></p>}
            {r.city && <p><span className="icon"><FontAwesomeIcon icon='globe' /></span> {r.city}</p>}
          </div>
        )}
      </div>
    </>
  )
}

const Litter = ({ litters, user, dogs, editLitter }) => {
  const [details, setDetails] = useState([])
  const [litterToEdit, setLitterToEdit] = useState(null)

  const toggleDetails = (id) => {
    if (details.includes(id)) {
      setDetails(details.filter(d => d !== id))
    } else {
      setDetails([...details, id])
    }
  }



  const tableStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  }

  if (litters.loading) {
    return <div className='container'>loading...</div>
  }

  return (
    <>
      <div className={`modal ${litterToEdit && 'is-active'}`}>
        <div className='modal-background'></div>
        <div className="modal-content">
          {litterToEdit &&
            <LitterForm
              user={user}
              dogs={dogs}
              litter={litterToEdit}
              editLitter={editLitter}
              toggle={setLitterToEdit}
            />}
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => setLitterToEdit(null)}></button>
      </div>
      <div className='columns is-centered'>
        <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
          <table id="litterTable" className='table is-fullwidth is-size-7-mobile' style={tableStyles}>
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
              {litters.data.allLitters.map(litter =>
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
                    <td><PuppyList puppies={litter.puppies} /></td>
                    <td>{litter.price}&nbsp;€</td>
                  </tr>
                  {details.includes(litter.id) &&
                    <tr>
                      <td></td>
                      <td colSpan='2'>
                        <p><strong>Breeder</strong></p>
                        <p>{litter.breeder.username}</p>
                      </td>
                      <td>{litter.dam
                        ? <ul>
                          <li>"{litter.dam.name}"</li>
                          <li>born <Moment format="DD.MM.YY">{new Date(parseInt(litter.dam.born, 10))}</Moment></li>
                        </ul>
                        : 'removed'
                      }</td>
                      <td>{litter.sire
                        ? <ul>
                          <li>"{litter.sire.name}"</li>
                          <li>born <Moment format="DD.MM.YY">{new Date(parseInt(litter.sire.born, 10))}</Moment></li>
                        </ul>
                        : 'removed'
                      }</td>
                      <td colSpan="2">
                        {(user && litter.breeder.username !== user.username) &&
                          <button className='button is-small is-success'>reserve a puppy</button>
                        }
                        {(user && litter.breeder.username === user.username)
                          && <button className='button is-small is-info' onClick={() => setLitterToEdit(litter)}>edit the litter</button>
                        }
                        {!user && <span>Login to reserve a puppy</span>}
                      </td>
                    </tr>
                  }
                  {(details.includes(litter.id) && user && litter.breeder.username === user.username) &&
                    <tr>
                      <td></td>
                      <td colSpan="6">
                        <Reservations reservations={litter.reservations} />
                      </td>
                    </tr>
                  }
                </React.Fragment>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Litter
