import React, { useState } from 'react'
import { useQuery, useSubscription } from 'react-apollo-hooks'
import { LitterForm, Litter, Pagination, Loading } from '..'
import { toast } from 'react-toastify'

import {
  ALL_LITTERS,
  LITTER_ADDED,
  LITTER_UPDATED,
} from '../../graphql/litters'

const LitterList = () => {
  const [cursor, setCursor] = useState(0)
  const [litterToEdit, setLitterToEdit] = useState(null)
  const [showAll, setShowAll] = useState(false) // not persisted

  const { data, loading, error } = useQuery(ALL_LITTERS, {
    notifyOnNetworkStatusChange: true,
  })

  useSubscription(LITTER_ADDED, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const addedLitter = subscriptionData.data.litterAdded
      const dataInStore = client.readQuery({ query: ALL_LITTERS })
      if (!dataInStore.allLitters.map(p => p.id).includes(addedLitter.id)) {
        dataInStore.allLitters.push(addedLitter)
        client.writeQuery({
          query: ALL_LITTERS,
          data: dataInStore,
        })
        toast.info('A litter was added.')
      }
    },
  })

  useSubscription(LITTER_UPDATED, {
    onSubscriptionData: () => {
      toast.info('A litter was updated.')
    },
  })

  if (loading) return <Loading />
  if (error)
    return <div className='container'>Error, loading litters failed.</div>

  if (data.allLitters.length === 0)
    return <div className='container'>Start by adding dogs and litters.</div>

  let filtered = data.allLitters
  if (!showAll) {
    const today = new Date()
    const sixtyDaysAgo = today.setMonth(today.getMonth() - 2)
    filtered = data.allLitters.filter(litter => litter.duedate > +sixtyDaysAgo)
  }

  filtered.sort((a, b) => {
    const comparePuppies =
      b.puppies.length > 0 > (a.puppies.length > 0)
        ? 1
        : a.puppies.length > 0 > (b.puppies.length > 0)
        ? -1
        : 0

    const compareDuedates =
      a.duedate > b.duedate ? 1 : a.duedate < b.duedate ? -1 : 0

    return comparePuppies || compareDuedates
  })

  const puppies = filtered.reduce(
    (sum, litter) => sum + litter.puppies.length,
    0
  )

  return (
    <>
      <div className={`modal ${litterToEdit && 'is-active'}`}>
        <div className='modal-background' />
        <div className='modal-content'>
          {litterToEdit && (
            <LitterForm
              litter={litterToEdit}
              setLitterToEdit={setLitterToEdit}
            />
          )}
        </div>
        <button
          className='modal-close is-large'
          aria-label='close'
          onClick={() => setLitterToEdit(null)}
        />
      </div>

      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen'>
            <Pagination
              data={filtered}
              cursor={cursor}
              setCursor={setCursor}
              chunkSize={5}
              message={`Showing ${puppies} puppies and ${
                filtered.length
              } litters.`}
            />
          </div>
        </div>
      </div>

      {filtered.slice(cursor, cursor + 5).map(litter => (
        <Litter
          key={litter.id}
          litter={litter}
          setLitterToEdit={setLitterToEdit}
        />
      ))}

      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen'>
            <Pagination
              data={filtered}
              cursor={cursor}
              setCursor={setCursor}
              chunkSize={5}
              message={`Showing ${puppies} puppies and ${
                filtered.length
              } litters.`}
            />

            <div style={{ paddingLeft: '1em' }}>
              <label
                className='checkbox'
                title='Include over two month old litters?'
              >
                <input
                  type='checkbox'
                  checked={showAll}
                  onChange={() => setShowAll(!showAll)}
                />{' '}
                Show all litters
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LitterList
