import React, { useState, useEffect } from 'react'

const { maleDogNames, femaleDogNames } = require('./DogNames.json')

const DogForm = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [isFemale, setIsFemale] = useState(true)
  const [filter, setFilter] = useState('')
  const [breeds, setBreeds] = useState([])
  const [filtered, setFiltered] = useState([])


  useEffect(() => {
    const { english } = require('./Breeds.json')
    setBreeds(english)
    setFiltered(english)
  }, [])


  const handleFilter = (filter) => {
    setFilter(filter)
    setFiltered(breeds.filter(b => b.toLowerCase().includes(filter.toLowerCase())))
  }

  const randomDog = (event) => {
    event.preventDefault()

    const isGirl = Math.random() < 0.5
    setIsFemale(isGirl)

    // if we use isFemale, the value is out of sync?
    // sometimes resulting in female dogs with a male name
    if (isGirl) {
      setName(femaleDogNames[Math.floor(Math.random() * femaleDogNames.length)])
    } else {
      setName(maleDogNames[Math.floor(Math.random() * maleDogNames.length)])
    }

    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)]
    handleFilter(randomBreed)

    const yearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    const randomBirthday = new Date(+(yearAgo) - Math.floor(Math.random() * 100000000000))
    setBorn(randomBirthday.toISOString().slice(0, 10))
  }

  const submit = async (event) => {
    event.preventDefault()

    await props.addDog({
      variables: {
        name, born, isFemale,
        breed: filter
      }
    })

    setName('')
    setBorn('')
    setFilter('')
    setFiltered(breeds)
  }


  return (
    <div className='container'>
      <form className='box'>
        <h1 className='title'>Add a dog</h1>
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>dog name</label>
          </div>
          <div className='field-body'>
            <div className='field'>
              <p className='control'>
                <input
                  className='input'
                  type='text'
                  placeholder='dog name'
                  value={name}
                  onChange={({ target }) => setName(target.value)}
                />
              </p>
            </div>
          </div>
        </div>

        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>breed</label>
          </div>
          <div className='field-body'>
            <div className='field is-grouped is-grouped-multiline'>

              <p className='control is-expanded has-icons-left has-icons-right'>
                <input
                  className='input'
                  type='text'
                  placeholder='filter'
                  value={filter}
                  onChange={({ target }) => handleFilter(target.value)}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-filter'></i>
                </span>
                {(filtered.length === 1 && filtered[0] === filter) ?
                  <>
                    <span className='icon is-small is-right has-text-success'>
                      <i className='fas fa-check'></i>
                    </span>
                    <span className='help has-text-success'>breed name is valid</span>
                  </>
                  : <span className='help'>filter the list and select one</span>
                }
              </p>
              <div className='select'>
                <select
                  onChange={({ target }) => handleFilter(target.value)}
                  onBlur={({ target }) => handleFilter(target.value)}
                >
                  {filtered.map(b =>
                    <option key={b} value={b}>{b}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'>born</label>
          </div>
          <div className='field-body'>
            <div className='field'>
              <p className='control'>
                <input
                  className='input'
                  type='date'
                  value={born}
                  onChange={({ target }) => setBorn(target.value)}
                />
              </p>
            </div>
          </div>
        </div>

        <div className='field is-horizontal'>
          <div className='field-label'>
            <label className='label'>gender</label>
          </div>
          <div className='field-body'>
            <div className='field is-narrow'>
              <div className='control'>
                <label className='radio'>
                  <input
                    type='radio'
                    name='isFemale'
                    checked={isFemale}
                    value='true'
                    onChange={() => setIsFemale(true)} /> female
                </label>
                <label className='radio'>
                  <input
                    type='radio'
                    name='isFemale'
                    checked={!isFemale}
                    value='false'
                    onChange={() => setIsFemale(false)} /> male
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className='field is-horizontal'>
          <div className='field-label'></div>
          <div className='field-body'>
            <div className='field is-grouped'>
              <div className="control">
                <button className='button is-success' onClick={submit}>
                  add a dog
                </button>
              </div>
              <div className="control">
                {props.user.role === 'admin' &&
                  <button className='button' onClick={randomDog}>
                    randomize
                  </button>
                }
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}

export default DogForm