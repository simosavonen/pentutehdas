import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { LitterForm, PuppyList, Reservations, LitterProgressBar, Pagination, ConfirmButton } from '../components'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ALL_LITTERS, DELETE_LITTER, TOGGLE_RESERVATION } from '../graphql/litters'

const LitterList = ({ user }) => {
  const [active, setActive] = useState('')
  const [cursor, setCursor] = useState(0)
  const [litterToEdit, setLitterToEdit] = useState(null)
  const [showAll, setShowAll] = useState(false) // not persisted

  const { data, loading, error } = useQuery(ALL_LITTERS, { notifyOnNetworkStatusChange: true })

  const toggleReservation = useMutation(TOGGLE_RESERVATION, {
    onError: (error) => Sentry.captureException(error),
    update: () => {
      toast.info('Toggled puppy reservation.')
    }
  })

  const deleteLitter = useMutation(DELETE_LITTER, {
    onError: (error) => Sentry.captureException(error),
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_LITTERS })
      dataInStore.allLitters = dataInStore.allLitters.filter(litter => litter.id !== response.data.deleteLitter.id)
      store.writeQuery({
        query: ALL_LITTERS,
        data: dataInStore
      })
      toast.info('Litter was removed.')
    }
  })

  const handleReservation = async (id) => {
    await toggleReservation({
      variables: { id }
    })
  }

  const handleDelete = async (id) => {
    await deleteLitter({
      variables: { id }
    })
  }


  if (loading) return <div className='container'>loading...</div>
  if (error) return <div className='container'>Error, loading litters failed.</div>

  let filtered = data.allLitters
  if (!showAll) {
    const timeStamp = +new Date()
    const sixtyDaysAgo = timeStamp - 1000 * 60 * 60 * 24 * 60
    filtered = data.allLitters.filter(litter => litter.duedate > sixtyDaysAgo)
  }

  filtered.sort((a, b) => {
    const comparePuppies = (a.puppies.length > 0) < (b.puppies.length > 0) ? 1
      : ((a.puppies.length > 0) > (b.puppies.length > 0) ? - 1 : 0)

    const compareDuedates = a.duedate > b.duedate ? 1 : (a.duedate < b.duedate ? -1 : 0)

    return comparePuppies || compareDuedates
  })

  const puppies = filtered.reduce((sum, litter) => sum + litter.puppies.length, 0)


  return (
    <>
      <div className={`modal ${litterToEdit && 'is-active'}`}>
        <div className='modal-background'></div>
        <div className="modal-content">
          {litterToEdit &&
            <LitterForm
              user={user}
              litter={litterToEdit}
              setLitterToEdit={setLitterToEdit}
            />}
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={() => setLitterToEdit(null)}></button>
      </div>

      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen is-8-fullhd'>
            <Pagination
              data={filtered}
              cursor={cursor}
              setCursor={setCursor}
              chunkSize={5}
              message={`Showing ${puppies} puppies and ${filtered.length} litters.`}
            />
          </div>
        </div>
      </div>

      {filtered.slice(cursor, cursor + 5).map(litter =>
        <article
          key={litter.id}
          className='container'
          style={{
            padding: '0.75rem', borderBottom: '1px solid', borderTop: '1px solid',
            borderImage: 'radial-gradient(rgba(0,0,0,0.7), rgba(255,255,255,0)) 1'
          }}>
          <div className='columns is-centered is-mobile is-clickable'
            onClick={() => setActive(active === litter.id ? '' : litter.id)}
            style={{ padding: '1rem' }}>
            <div className='column is-2-mobile is-2-tablet is-1-desktop'>
              <div style={{ maxWidth: '65px' }}>
                <LitterProgressBar date={litter.duedate} />
              </div>
            </div>
            <div className='column is-8-mobile is-7-tablet'>
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
                      {litter.dam && active === litter.id &&
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
                      {litter.sire && active === litter.id &&
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

              {active === litter.id &&
                <div className='columns'>
                  <div className='column'>
                    <div>
                      <p className="heading is-size-7 is-size-6-fullhd">
                        {litter.reservations.length} Reservation{litter.reservations.length !== 1 && 's'}
                      </p>
                      {(user
                        && (litter.breeder.username === user.username || user.role === 'admin')
                        && litter.reservations.length > 0)
                        && <Reservations reservations={litter.reservations.map(r => r.id)} />
                      }
                    </div>
                  </div>
                  <div className='column'>
                    <div>
                      <p className="heading is-size-7 is-size-6-fullhd">Actions</p>

                      {(user && litter.breeder.username !== user.username) &&
                        <button
                          className='button is-info is-outlined'
                          onClick={(event) => { event.stopPropagation(); handleReservation(litter.id) }}
                        >
                          {litter.reservations.map(user => user.username).includes(user.username) ? 'cancel reservation' : 'reserve a puppy'}
                        </button>
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

      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen is-8-fullhd'>
            <Pagination
              data={filtered}
              cursor={cursor}
              setCursor={setCursor}
              chunkSize={5}
              message={`Showing ${puppies} puppies and ${filtered.length} litters.`}
            />

            <div style={{ paddingLeft: '1em' }}>
              <label className='checkbox' title='Include over two month old litters?'>
                <input type='checkbox' checked={showAll} onChange={() => setShowAll(!showAll)} /> Show all litters
              </label>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}

export default LitterList
