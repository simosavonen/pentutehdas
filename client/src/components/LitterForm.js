import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

let LitterForm = (props) => {
  const [duedate, setDuedate] = useState('')
  const [dam, setDam] = useState('')
  const [sire, setSire] = useState('')
  const [price, setPrice] = useState('')
  const [puppies, setPuppies] = useState([])
  const [myDogs, setMyDogs] = useState(null)


  useEffect(() => {
    const filtered = props.result.data.allDogs.filter(dog =>
      dog.owner.username === props.user.username)
    setMyDogs(filtered)
  }, [props.result, props.user])

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

    await props.addLitter({
      variables: {
        duedate, dam, sire, price, puppies
      }
    })
    props.history.push('/')
  }

  if (!myDogs) {
    return (
      <div className='container'>
        <div className='box'>
          dogs loading...
        </div>
      </div>
    )
  }
  return (
    <div className='columns'>
      <div className='column'></div>
      <form className='box column is-full-mobile is-two-thirds-tablet is-half-desktop'
        onSubmit={submit}
      >
        <h1 className='title'>Add a litter</h1>

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
                />
                <span className='icon is-left'>
                  <i className='far fa-calendar-alt'></i>
                </span>
                <span className='help'>the date when the puppies were born, or are due</span>
              </p>
            </div>
          </div>
        </div>

        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>dam <i className='fas fa-venus'></i></label>
          </div>
          <div className='field-body'>
            <div className='select'>
              <select value={dam} onChange={({ target }) => setDam(target.value)}>
                <option value='' disabled hidden>Choose dam</option>
                {myDogs.map(dog =>
                  dog.isFemale && <option key={dog.id} value={dog.id}>
                    {dog.name}, {dog.breed}</option>
                )}
              </select>
            </div>
          </div>
        </div>


        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>sire <i className='fas fa-mars'></i></label>
          </div>
          <div className='field-body'>
            <div className='select'>
              <select value={sire} onChange={({ target }) => setSire(target.value)}>
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
                  onChange={({ target }) => setPrice(parseInt(target.value, 10))}
                />
                <span className='icon is-right'>
                  <i className='fas fa-euro-sign'></i>
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
              <p className='control is-expanded'>
                <input
                  className='input is-small'
                  type='text'
                  value={puppies}
                  onChange={({ target }) => setPuppies(target.value)}
                  readOnly
                />
                <span className='help'>use the buttons to add female (true) or male (false)</span>
              </p>
              <p className='control'>
                <button className='button is-danger is-outlined is-medium' title='add female puppy'
                  onClick={(event) => adjustPuppies(event, true)}>
                  <i className='fas fa-venus'></i>
                </button>
              </p>
              <p className='control'>
                <button className='button is-info is-outlined is-medium' title='add male puppy'
                  onClick={(event) => adjustPuppies(event, false)}>
                  <i className='fas fa-mars'></i>
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
            <div className='field'>
              <p className='control'>
                <button className='button is-primary' type='submit'>
                  add a litter
                </button>
              </p>
            </div>
          </div>
        </div>

      </form>
      <div className='column'></div>
    </div>
  )
}

export default LitterForm = withRouter(LitterForm)