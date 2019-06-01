import React, { useState } from 'react'
import LitterForm from './LitterForm'
import PuppyList from './PuppyList'
import Reservations from './Reservations'
import LitterProgressBar from './LitterProgressBar'
import Pagination from './Pagination'
import ConfirmButton from './ConfirmButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Litter = ({ litters, user, dogs, editLitter, deleteLitter, showAll, setShowAll }) => {
  const [details, setDetails] = useState([])
  const [cursor, setCursor] = useState(0)
  const [litterToEdit, setLitterToEdit] = useState(null)

  if (litters.loading) {
    return <div className='container'>loading...</div>
  }

  if (litters.error) {
    return <div className='container'>
      Error, loading litters failed.
      <p>{litters.error.message}</p>
    </div>
  }

  const handleDelete = async (id) => {
    await deleteLitter({
      variables: { id }
    })
  }

  // initially it was possible to open up multiple detail views
  // To-Do: get rid of the array
  const toggleDetails = (id) => {
    if (details.includes(id)) {
      setDetails([])
    } else {
      setDetails([id])
    }
  }

  let filtered = litters.data.allLitters
  if (!showAll && litters.data.allLitters !== undefined) {
    const timeStamp = +new Date()
    const sixtyDaysAgo = timeStamp - 1000 * 60 * 60 * 24 * 60
    filtered = litters.data.allLitters.filter(litter => litter.duedate > sixtyDaysAgo)
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

      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen is-8-fullhd'>
            <Pagination data={filtered} cursor={cursor} setCursor={setCursor} />
          </div>
        </div>
      </div>

      {filtered !== undefined && filtered.slice(cursor, cursor + 5).map(litter =>
        <article
          key={litter.id}
          className='container'
          style={{ padding: '0.75rem', borderBottom: '1px solid', borderTop: '1px solid', borderImage: 'radial-gradient(rgba(0,0,0,0.7), rgba(255,255,255,0)) 1' }}>
          <div className='columns is-centered is-mobile is-clickable' onClick={() => toggleDetails(litter.id)} style={{ padding: '1rem' }}>
            <div className='column is-2-mobile is-2-tablet is-1-desktop'>
              <div style={{ maxWidth: '65px' }}>
                <LitterProgressBar date={litter.duedate} />
              </div>
            </div>
            <div className='column is-8-mobile is-7-tablet is-6-desktop'>
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
                  <div className='column'>
                    <div>
                      <p className="heading is-size-7 is-size-6-fullhd">{litter.reservations.length} Reservations</p>
                      <Reservations reservations={litter.reservations} />
                    </div>
                  </div>
                  <div className='column'>
                    <div>
                      <p className="heading is-size-7 is-size-6-fullhd">Actions</p>

                      {(user && litter.breeder.username !== user.username) &&
                        <button
                          className='button is-info is-outlined'
                          onClick={(event) => { event.stopPropagation(); }}
                        >reserve a puppy</button>
                      }
                      {(user && litter.breeder.username === user.username)
                        && <div className='buttons'>
                          <button
                            className='button is-info is-outlined'
                            onClick={(event) => { event.stopPropagation(); setLitterToEdit(litter) }}
                          >edit the litter</button>
                          <ConfirmButton action={handleDelete} payload={litter.id} />
                        </div>
                      }
                      {!user && <p className='title is-size-7 is-size-6-fullhd'>Login to reserve a puppy</p>}

                    </div>
                  </div>
                </div>
              }

            </div>
            <div className='column is-2-mobile is-2-tablet is-1-desktop'>
              <div>
                <p className='heading is-size-7 is-size-6-fullhd'>Price</p>
                <div className='is-size-6 is-size-5-fullhd'>{litter.price} €</div>
              </div>
            </div>
          </div>
        </article>
      )}
      {filtered !== undefined &&
        <div className='container'>
          <div className='columns is-centered'>
            <div className='column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen is-8-fullhd'>
              <Pagination data={filtered} cursor={cursor} setCursor={setCursor} />

              <div style={{ paddingLeft: '1em' }}>
                <label className='checkbox' title='Include over two month old litters?'>
                  <input type='checkbox' checked={showAll} onChange={() => setShowAll(!showAll)} /> Show all litters
            </label>
              </div>

            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Litter
