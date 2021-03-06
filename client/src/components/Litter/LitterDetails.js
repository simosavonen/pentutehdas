import React, { useContext } from 'react'
import { useMutation } from 'react-apollo-hooks'
import { toast } from 'react-toastify'
import { ConfirmButton, Reservations, UserContext } from '..'
import {
  ALL_LITTERS,
  DELETE_LITTER,
  TOGGLE_RESERVATION,
} from '../../graphql/litters'

const LitterDetails = ({ litter, setLitterToEdit }) => {
  const userContext = useContext(UserContext)
  const { user } = userContext

  const toggleReservation = useMutation(TOGGLE_RESERVATION, {
    update: () => {
      toast.info('Toggled puppy reservation.')
    },
  })

  const deleteLitter = useMutation(DELETE_LITTER, {
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_LITTERS })
      dataInStore.allLitters = dataInStore.allLitters.filter(
        litter => litter.id !== response.data.deleteLitter.id
      )
      store.writeQuery({
        query: ALL_LITTERS,
        data: dataInStore,
      })
      toast.info('Litter was removed.')
    },
  })

  const handleReservation = async id => {
    await toggleReservation({
      variables: { id },
    })
  }

  const handleDelete = async id => {
    await deleteLitter({
      variables: { id },
    })
  }

  return (
    <div className='columns'>
      <div className='column'>
        <div>
          <p className='heading is-size-7 is-size-6-fullhd'>
            {litter.reservations.length} Reservation
            {litter.reservations.length !== 1 && 's'}
          </p>

          {user &&
            litter.reservations
              .map(reservation => reservation.username)
              .includes(user.username) &&
            user.role !== 'admin' && (
              <p className='is-size-7 is-size-6-fullhd'>
                {`You've reserved a puppy.`}
                <br />
                {'Wait for the seller to contact you.'}
              </p>
            )}

          {user &&
            (litter.breeder.username === user.username ||
              user.role === 'admin') &&
            litter.reservations.length > 0 && (
              <Reservations reservations={litter.reservations.map(r => r.id)} />
            )}
        </div>
      </div>
      <div className='column'>
        <div>
          <p className='heading is-size-7 is-size-6-fullhd'>Actions</p>
          <div className='buttons'>
            {user && litter.breeder.username !== user.username && (
              <button
                className='button is-info is-outlined'
                onClick={event => {
                  event.stopPropagation()
                  handleReservation(litter.id)
                }}
              >
                {litter.reservations
                  .map(reservation => reservation.username)
                  .includes(user.username)
                  ? 'cancel reservation'
                  : 'reserve a puppy'}
              </button>
            )}
            {user &&
              (litter.breeder.username === user.username ||
                user.role === 'admin') && (
                <>
                  <button
                    className='button is-info is-outlined'
                    onClick={event => {
                      event.stopPropagation()
                      setLitterToEdit(litter)
                    }}
                  >
                    edit the litter
                  </button>
                  <ConfirmButton
                    action={handleDelete}
                    payload={litter.id}
                    message='remove litter'
                    classNames='button is-outlined is-danger'
                  />
                </>
              )}
          </div>
          {!user && (
            <p className='title is-size-7 is-size-6-fullhd'>
              Login to reserve a puppy
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LitterDetails
