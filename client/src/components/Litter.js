import React, { useState } from 'react'
import Moment from 'react-moment'
import LitterForm from './LitterForm'
import PuppyList from './PuppyList'
import Reservations from './Reservations'
import LitterProgressBar from './LitterProgressBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Litter = ({ litters, user, dogs, editLitter }) => {
  const [details, setDetails] = useState([])
  const [litterToEdit, setLitterToEdit] = useState(null)

  const toggleDetails = (id) => {
    if (details.includes(id)) {
      setDetails([])
    } else {
      setDetails([id])
    }
  }

  const tableStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  }

  const detailStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
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

      {litters.data.allLitters.map(litter =>
        <React.Fragment key={litter.id}>
          <div className='columns is-centered is-mobile'>
            <div className='column is-2-mobile is-2-tablet is-1-desktop'>
              <div style={{ maxWidth: '65px' }}>
                <LitterProgressBar date={litter.duedate} />
              </div>
            </div>
            <div className='column is-8-mobile is-7-tablet is-6-desktop is-clickable' onClick={() => toggleDetails(litter.id)}>
              <div className='columns'>
                <div className='column'>
                  <div>
                    <p className="heading is-size-7 is-size-6-fullhd">Location</p>
                    <p className='title is-size-6 is-size-5-fullhd'>{litter.breeder.city}</p>
                  </div>
                </div>
                <div className='column'>
                  <div>
                    <p className='heading is-size-7 is-size-6-fullhd'><FontAwesomeIcon icon='venus' /> Dam</p>
                    <p className='title is-size-6 is-size-5-fullhd'>{litter.dam ? litter.dam.breed : 'removed'}
                      {litter.dam && details.includes(litter.id) &&
                        <span className='is-size-7 is-size-6-fullhd'>
                          <br />{`"${litter.dam.name}"`}
                          <br />{`born ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
                            .format(new Date(parseInt(litter.dam.born, 10)))}`}
                        </span>
                      }
                    </p>
                  </div>
                </div>
                <div className='column'>
                  <div>
                    <p className='heading is-size-7 is-size-6-fullhd'><FontAwesomeIcon icon='mars' /> Sire</p>
                    <p className='title is-size-6 is-size-5-fullhd'>{litter.sire ? litter.sire.breed : 'removed'}
                      {litter.sire && details.includes(litter.id) &&
                        <span className='is-size-7 is-size-6-fullhd'>
                          <br />{`"${litter.sire.name}"`}
                          <br />{`born ${new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
                            .format(new Date(parseInt(litter.sire.born, 10)))}`}
                        </span>
                      }
                    </p>
                  </div>
                </div>
                <div className='column'>
                  <div>
                    <p className='heading is-size-7 is-size-6-fullhd'>Puppies</p>
                    <div className='is-size-6 is-size-5-fullhd'><PuppyList puppies={litter.puppies} /></div>
                  </div>
                </div>
              </div>

              {details.includes(litter.id) &&
                <div className='columns'>
                  <div className='column'>details</div>
                  <div className='column'>details</div>
                  <div className='column'>details</div>
                  <div className='column'>details</div>
                </div>
              }

            </div>
            <div className='column is-2-desktop is-1-widescreen'>
              <div>
                <p className='heading is-size-7 is-size-6-fullhd'>Price</p>
                <div className='is-size-6 is-size-5-fullhd'>{litter.price} €</div>
              </div>
            </div>
          </div>


          <div style={{ margin: '2em auto', width: '80%', height: '1em', borderTop: '1px solid grey' }}></div>
        </React.Fragment>
      )}



      <div className='columns is-centered'>
        <div className='column is-12-tablet is-11-desktop is-10-widescreen is-9-fullhd'>
          <table id="litterTable" className='table is-fullwidth is-size-7-mobile' style={tableStyles}>
            <thead>
              <tr>
                <th style={{ width: '2%' }}></th>
                <th style={{ width: '7%' }}>Due</th>
                <th className='has-text-centered' style={{ width: '20%' }}>Location</th>
                <th><FontAwesomeIcon icon='venus' /> Dam</th>
                <th><FontAwesomeIcon icon='mars' /> Sire</th>
                <th>Puppies</th>
                <th style={{ width: '6%' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {litters.data.allLitters.map((litter, index) =>
                <React.Fragment key={index}>
                  <tr id={litter.id}
                    onClick={(event) => toggleDetails(event.currentTarget.id)}
                    className={details.includes(litter.id) ? 'is-clickable borderless' : 'is-clickable'}
                    style={details.includes(litter.id) ? detailStyles : null}
                  >
                    <td>{details.includes(litter.id) ? <strong>&#8722;</strong> : <strong>&#43;</strong>}</td>
                    <td>
                      <LitterProgressBar date={litter.duedate} />
                    </td>
                    <td className='has-text-centered'>{litter.breeder.city}</td>
                    <td>{litter.dam ? litter.dam.breed : 'removed'}</td>
                    <td>{litter.sire ? litter.sire.breed : 'removed'}</td>
                    <td><PuppyList puppies={litter.puppies} /></td>
                    <td className='has-text-right'>{litter.price}&nbsp;€</td>
                  </tr>
                  {details.includes(litter.id) &&
                    <tr className='borderless' style={detailStyles}>
                      <td></td>
                      <td colSpan='2'>
                        <p><strong>Progress</strong></p>

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
                        <p><strong>Actions</strong></p>
                        {(user && litter.breeder.username !== user.username) &&
                          <button className='button is-small is-info is-outlined'>reserve a puppy</button>
                        }
                        {(user && litter.breeder.username === user.username)
                          && <button className='button is-small is-info is-outlined' onClick={() => setLitterToEdit(litter)}>edit the litter</button>
                        }
                        {!user && <span>Login to reserve a puppy</span>}
                      </td>
                    </tr>
                  }
                  {(details.includes(litter.id) && user && litter.breeder.username === user.username) &&
                    <tr style={detailStyles}>
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
