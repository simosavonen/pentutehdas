import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PuppyList from './PuppyList'

let LitterForm = (props) => {
  const { dogs, user, litter, history, addLitter, editLitter } = props

  const [duedate, setDuedate] = useState(litter
    ? new Date(parseInt(litter.duedate, 10)).toISOString().substr(0, 10) : '')
  const [dam, setDam] = useState(litter ? litter.dam.id : '')
  const [sire, setSire] = useState(litter ? litter.sire.id : '')
  const [price, setPrice] = useState(litter ? litter.price : 0)
  const [puppies, setPuppies] = useState(litter ? litter.puppies : [])
  const [myDogs, setMyDogs] = useState(null)



  useEffect(() => {
    const filtered = dogs.data.allDogs.filter(dog =>
      dog.owner.username === user.username)
    setMyDogs(filtered)
  }, [dogs, user])

  const adjustPuppies = (event, value) => {
    event.preventDefault()
    if (value === null) {
      setPuppies([])
    } else {
      setPuppies(puppies.concat(value).sort().reverse())
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
      props.toggle(null)
    }

    history.push('/')
  }

  const formStyles = {
    padding: '2em'
  }

  if (!myDogs) {
    return (
      <div className='columns is-centered'>
        <div className='box column'>
          dogs loading...
        </div>
      </div>
    )
  }
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
        <div className='field-body'>
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
                use the buttons to add a female <FontAwesomeIcon icon='venus'
                /> or male <FontAwesomeIcon icon='mars' /> puppy</span>
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
            {litter &&
              <p className='control'>
                <button className='button is-danger is-outlined'
                  onClick={(event) => { event.preventDefault(); props.toggle(null) }}>
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