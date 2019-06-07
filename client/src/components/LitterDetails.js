import React from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { Reservations, ConfirmButton } from '../components'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import {
  ALL_LITTERS,
  DELETE_LITTER,
  TOGGLE_RESERVATION,
} from '../graphql/litters'
import { USER } from '../graphql/user'

const LitterDetails = ({ litter, setLitterToEdit }) => {
  const user = useQuery(USER)

  const toggleReservation = useMutation(TOGGLE_RESERVATION, {
    onError: error => Sentry.captureException(error),
    update: () => {
      toast.info('Toggled puppy reservation.')
    },
  })

  const deleteLitter = useMutation(DELETE_LITTER, {
    onError: error => Sentry.captureException(error),
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
          {user.data.me &&
            (litter.breeder.username === user.data.me.username ||
              user.data.me.role === 'admin') &&
            litter.reservations.length > 0 && (
              <Reservations reservations={litter.reservations.map(r => r.id)} />
            )}
        </div>
      </div>
      <div className='column'>
        <div>
          <p className='heading is-size-7 is-size-6-fullhd'>Actions</p>

          {user.data.me && litter.breeder.username !== user.data.me.username && (
            <button
              className='button is-info is-outlined'
              onClick={event => {
                event.stopPropagation()
                handleReservation(litter.id)
              }}
            >
              {litter.reservations
                .map(reservation => reservation.username)
                .includes(user.data.me.username)
                ? 'cancel reservation'
                : 'reserve a puppy'}
            </button>
          )}
          {user.data.me && litter.breeder.username === user.data.me.username && (
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
          {!user.data.me && (
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
