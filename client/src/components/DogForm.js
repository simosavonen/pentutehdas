import React, { useState, useEffect } from 'react'

const DogForm = (props) => {
  const [breeds, setBreeds] = useState([])
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [isFemale, setIsFemale] = useState(true)
  const [breed, setBreed] = useState('')

  useEffect(() => {
    const dogBreeds = require('./Breeds.json')
    const dogs = []
    for (const breed in dogBreeds.message) {
      const nameArray = dogBreeds.message[breed]
      if (nameArray.length === 0) {
        dogs.push(breed)
      }
      for (let i = 0; i < nameArray.length; i++) {
        dogs.push(nameArray[i] + ' ' + breed)
      }
    }
    setBreeds(dogs)
  }, [])

  return (
    <div className='columns'>
      <div className='column'></div>
      <form className='column is-half'>
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
            <div className='field'>
              <div className='select'>
                <select value={breed} onChange={({ target }) => setBreed(target.value)}>
                  {breeds.map(b => <option key={b} value={b}>{b}</option>)}
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

      </form>
      <div className='column'></div>
    </div>
  )
}

export default DogForm