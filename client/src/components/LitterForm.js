import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PuppyList from './PuppyList'
import { ALL_LITTERS, CREATE_LITTER, UPDATE_LITTER } from '../graphql/litters'
import { ALL_DOGS } from '../graphql/dogs'

let LitterForm = (props) => {
  const { user, litter, setLitterToEdit } = props

  const [duedate, setDuedate] = useState(litter
    ? new Date(parseInt(litter.duedate, 10)).toISOString().substr(0, 10) : '')
  const [dam, setDam] = useState(litter ? litter.dam.id : '')
  const [sire, setSire] = useState(litter ? litter.sire.id : '')
  const [price, setPrice] = useState(litter ? litter.price : 0)
  const [puppies, setPuppies] = useState(litter ? litter.puppies : [])
  const [myDogs, setMyDogs] = useState([])

  const { data, error, loading } = useQuery(ALL_DOGS)

  useEffect(() => {
    setMyDogs(data.allDogs.filter(dog => dog.owner.username === user.username))
  }, [data, user])

  const addLitter = useMutation(CREATE_LITTER, {
    onError: (error) => Sentry.captureException(error),
    update: (store, response) => {
      const addedLitter = response.data.addLitter
      const dataInStore = store.readQuery({ query: ALL_LITTERS })
      if (!dataInStore.allLitters.map(p => p.id).includes(addedLitter.id)) {
        dataInStore.allLitters.push(addedLitter)
        store.writeQuery({
          query: ALL_LITTERS,
          data: dataInStore
        })
        toast.info('You added a litter.')
      }
    }
  })

  const editLitter = useMutation(UPDATE_LITTER, {
    onError: (error) => Sentry.captureException(error),
    update: () => {
      toast.info('A litter was updated.')
    }
  })

  const adjustPuppies = (event, value) => {
    event.preventDefault()
    if (value === null) {
      setPuppies([])
    } else {
      setPuppies(puppies.concat(value))
    }
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!litter) {
      await addLitter({
        variables: {
          duedate, dam, sire, price: parseInt(price, 10), puppies
        }
      })
    } else {
      await editLitter({
        variables: {
          id: litter.id, duedate, sire, price: parseInt(price, 10), puppies
        }
      })
      setLitterToEdit(null)
    }

    props.history.push('/')
  }

  const formStyles = {
    padding: '2em'
  }

  if (loading) return <div className='box'>dogs loading...</div>
  if (error) return <div className='box'>Error loading dogs.</div>
  if (myDogs.length < 2) return <div className='box'>You need to add the dogs first.</div>

  return (
    <form className='box' style={formStyles} onSubmit={submit}>
      <h1 className='title'>{litter ? 'Edit' : 'Add a'} litter</h1>

      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
          <label className='label'>(due) date</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <p className='control has-icons-left'>
              <input
                className='input'
                type='date'
                value={duedate}
                onChange={({ target }) => setDuedate(target.value)}
                required
              />
              <span className='icon is-left'>
                <FontAwesomeIcon icon='calendar-alt' />
              </span>
              <span className='help'>the date when the puppies were born, or are due</span>
            </p>
          </div>
        </div>
      </div>
      {!litter
        ? <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>dam <i className='fas fa-venus'></i></label>
          </div>
          <div className='field-body'>
            <div className='select'>
              <select value={dam} required onChange={({ target }) => setDam(target.value)}>
                <option value='' disabled hidden>Choose dam</option>
                {myDogs.map(dog =>
                  dog.isFemale && <option key={dog.id} value={dog.id}>
                    {dog.name}, {dog.breed}</option>
                )}
              </select>
            </div>
          </div>
        </div>
        : <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>dam <FontAwesomeIcon icon='venus' /></label>
          </div>
          <div className='field-body'>
            <input
              className='input is-static'
              readOnly
              value={`${litter.dam.name}, ${litter.dam.breed}`}
            />
          </div>
        </div>
      }



      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
          <label className='label'>sire <FontAwesomeIcon icon='mars' /></label>
        </div>
        <div className='field-body'>
          <div className='select'>
            <select value={sire} required onChange={({ target }) => setSire(target.value)}>
              <option value='' disabled hidden>Choose sire</option>
              {myDogs.map(dog =>
                !dog.isFemale && <option key={dog.id} value={dog.id}>
                  {dog.name}, {dog.breed}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
          <label className='label'>price</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <p className='control has-icons-right'>
              <input
                className='input'
                type='number'
                value={price}
                onChange={({ target }) => setPrice(target.value)}
                pattern='^0|[0-9]*[1-9][0-9]*$'
                min='0'
                max='9000'
                required
              />
              <span className='icon is-right'>
                <FontAwesomeIcon icon='euro-sign' />
              </span>
              <span className='help'>price per 1 puppy</span>
            </p>
          </div>
        </div>
      </div>

      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
          <label className='label'>puppies</label>
        </div>
        {(duedate !== '' && new Date(duedate) <= new Date())
          ? <div className='field-body'>
            <div className='field is-grouped'>
              <div className='control is-expanded'>
                <div className='input'>
                  <PuppyList puppies={puppies} />
                </div>
                <input
                  className='input is-small'
                  type='hidden'
                  value={puppies}
                  onChange={({ target }) => setPuppies(target.value)}
                  readOnly
                />
                <span className='help'>
                  use the buttons to add a female <FontAwesomeIcon
                    icon='venus' /> or male <FontAwesomeIcon icon='mars' /> puppy
              </span>
              </div>
              <p className='control'>
                <button className='button is-danger is-outlined is-medium' title='add female puppy'
                  onClick={(event) => adjustPuppies(event, true)}>
                  <FontAwesomeIcon icon='venus' />
                </button>
              </p>
              <p className='control'>
                <button className='button is-info is-outlined is-medium' title='add male puppy'
                  onClick={(event) => adjustPuppies(event, false)}>
                  <FontAwesomeIcon icon='mars' />
                </button>
              </p>
              <p className='control'>
                <button className='button is-outlined'
                  onClick={(event) => adjustPuppies(event, null)}>
                  Reset
              </button>
              </p>
            </div>
          </div>
          : <div className='field-body'>
            <div className='field'>
              <p className='control'>
                <input className='input is-static' readOnly
                  defaultValue='To add puppies, set the date for today or in the past.' />
              </p>
            </div>
          </div>
        }
      </div>


      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
        </div>
        <div className='field-body'>
          <div className='field is-grouped'>
            <p className='control'>
              <button className='button is-success is-outlined' type='submit'>
                {litter ? 'save changes' : 'add a litter'}
              </button>
            </p>
            {litter ?
              <p className='control'>
                <button className='button is-danger is-outlined'
                  onClick={(event) => { event.preventDefault(); setLitterToEdit(null) }}>
                  cancel
                </button>
              </p>
              : <p className='control'>
                <button className='button is-danger is-outlined'
                  onClick={(event) => { event.preventDefault(); props.history.push('/') }}>
                  cancel
                </button>
              </p>
            }
          </div>
        </div>
      </div>

    </form>
  )
}

export default LitterForm = withRouter(LitterForm)