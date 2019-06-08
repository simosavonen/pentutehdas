import React from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { Reservations, ConfirmButton } from '..'
import { toast } from 'react-toastify'
import {
  ALL_LITTERS,
  DELETE_LITTER,
  TOGGLE_RESERVATION,
} from '../../graphql/litters'
import { USER } from '../../graphql/user'

const LitterDetails = ({ litter, setLitterToEdit }) => {
  const { data: user, loading, error } = useQuery(USER)

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

  if (loading) return <div>Loading details...</div>
  if (error) return <div>Error! Failed to load details.</div>

  return (
    <div className='columns'>
      <div className='column'>
        <div>
          <p className='heading is-size-7 is-size-6-fullhd'>
            {litter.reservations.length} Reservation
            {litter.reservations.length !== 1 && 's'}
          </p>

          {user.me &&
            litter.reservations
              .map(reservation => reservation.username)
              .includes(user.me.username) &&
            user.me.role !== 'admin' && (
              <p className='is-size-7 is-size-6-fullhd'>
                You've reserved a puppy.
                <br />
                Wait for the breeder to contact you.
              </p>
            )}

          {user.me &&
            (litter.breeder.username === user.me.username ||
              user.me.role === 'admin') &&
            litter.reservations.length > 0 && (
              <Reservations reservations={litter.reservations.map(r => r.id)} />
            )}
        </div>
      </div>
      <div className='column'>
        <div>
          <p className='heading is-size-7 is-size-6-fullhd'>Actions</p>

          {user.me && litter.breeder.username !== user.me.username && (
            <button
              className='button is-info is-outlined'
              onClick={event => {
                event.stopPropagation()
                handleReservation(litter.id)
              }}
            >
              {litter.reservations
                .map(reservation => reservation.username)
                .includes(user.me.username)
                ? 'cancel reservation'
                : 'reserve a puppy'}
            </button>
          )}
          {user.me && litter.breeder.username === user.me.username && (
            <div className='buttons'>
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
            </div>
          )}
          {!user.me && (
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
