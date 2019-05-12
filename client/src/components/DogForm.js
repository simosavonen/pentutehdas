import React, { useState, useEffect } from 'react'

const DogForm = () => {
  const [breeds, setBreeds] = useState([])
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [isFemale, setIsFemale] = useState(true)
  const [filter, setFilter] = useState('')
  const [filtered, setFiltered] = useState([])


  useEffect(() => {
    const { english } = require('./Breeds.json')
    setBreeds(english)
    setFiltered(english)
  }, [])


  const handleChange = (filter) => {
    setFilter(filter)
    setFiltered(breeds.filter(b => b.toLowerCase().includes(filter.toLowerCase())))
  }


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
            <div className='field is-grouped'>

              <p className='control has-icons-left has-icons-right'>
                <input
                  className='input'
                  type='text'
                  value={filter}
                  onChange={({ target }) => handleChange(target.value)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-filter"></i>
                </span>
                {filtered.length === 1 ?
                  <>
                    <span className="icon is-small is-right has-text-success">
                      <i className="fas fa-check"></i>
                    </span>
                    <span className='help has-text-success'>breed OK</span>
                  </>
                  : <span className='help'>filter the list and select one</span>
                }

              </p>
              <div className='select'>
                <select

                  onBlur={({ target }) => handleChange(target.value)}>
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

        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label">gender</label>
          </div>
          <div className="field-body">
            <div className="field is-narrow">
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="isFemale"
                    checked={isFemale}
                    value='true'
                    onChange={() => setIsFemale(true)} /> female
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="isFemale"
                    checked={!isFemale}
                    value='false'
                    onChange={() => setIsFemale(false)} /> male
                </label>
              </div>
            </div>
          </div>
        </div>

      </form>
      <div className='column'></div>
    </div>
  )
}

export default DogForm