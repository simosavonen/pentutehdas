import React, { useState, useEffect } from 'react'
import Select from 'react-select'

const DogForm = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [isFemale, setIsFemale] = useState(true)
  const [breed, setBreed] = useState('')
  const [options, setOptions] = useState([])


  useEffect(() => {
    const { english } = require('./Breeds.json')
    setOptions(english.map(b => {
      return { value: b, label: b }
    }))
  }, [])

  const submit = async (event) => {
    event.preventDefault()

    await props.addDog({
      variables: {
        name, born, isFemale, breed: breed.value
      }
    })

    setName('')
    setBorn('')
    setBreed('')
  }

  const formStyles = {
    padding: '1em'
  }

  return (
    <div className='columns is-centered'>
      <div className='box column is-12-tablet is-9-desktop is-8-widescreen is-7-fullhd'>
        <form style={formStyles} onSubmit={submit}>
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
                    pattern='.{3,30}'
                    required
                    title='Name length between 3 and 30 characters.'
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
                <Select
                  value={breed}
                  onChange={(selected) => setBreed(selected)}
                  options={options}
                  placeholder='Start typing to see a filtered list of breeds'
                />
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
                    required
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
              <div className='field'>
                <div className="control">
                  <button className='button is-success is-outlined' type='submit'>
                    add a dog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DogForm