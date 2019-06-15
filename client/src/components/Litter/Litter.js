import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { LitterDetails, LitterProgressBar, PuppyList } from '..'

const Litter = ({ litter, setLitterToEdit }) => {
  const [active, setActive] = useState('')
  return (
    <article
      className='container'
      style={{
        padding: '0.75rem',
        borderBottom: '1px solid',
        borderTop: '1px solid',
        borderImage: 'radial-gradient(rgba(0,0,0,0.7), rgba(255,255,255,0)) 1',
      }}
    >
      <div
        className='columns is-centered is-mobile is-clickable'
        onClick={() => setActive(active === litter.id ? '' : litter.id)}
        style={{ padding: '1rem 0 1rem 0' }}
      >
        <div
          className='column is-2-mobile is-2-tablet is-1-desktop'
          style={{ padding: '0.75rem 0.15rem 0 0.15rem' }}
        >
          <div style={{ maxWidth: '65px', minWidth: '45px', margin: '0 auto' }}>
            <LitterProgressBar date={litter.duedate} />
          </div>
        </div>
        <div className='column is-8-mobile is-7-tablet'>
          <div className='columns'>
            <div className='column'>
              <div>
                <p className='heading is-size-7 is-size-6-fullhd'>Location</p>
                <p className='title is-size-6 is-size-5-fullhd'>
                  {litter.breeder.city}
                </p>
              </div>
            </div>
            <div className='column'>
              <div>
                <p className='heading is-size-7 is-size-6-fullhd'>
                  <FontAwesomeIcon icon='venus' /> Dam
                </p>
                <p className='title is-size-6 is-size-5-fullhd'>
                  {litter.dam ? litter.dam.breed : 'removed'}
                  {litter.dam && active === litter.id && (
                    <span className='is-size-7 is-size-6-fullhd'>
                      <br />
                      {`"${litter.dam.name}"`}
                      <br />
                      {`born ${new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(parseInt(litter.dam.born, 10)))}`}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className='column'>
              <div>
                <p className='heading is-size-7 is-size-6-fullhd'>
                  <FontAwesomeIcon icon='mars' /> Sire
                </p>
                <p className='title is-size-6 is-size-5-fullhd'>
                  {litter.sire ? litter.sire.breed : 'removed'}
                  {litter.sire && active === litter.id && (
                    <span className='is-size-7 is-size-6-fullhd'>
                      <br />
                      {`"${litter.sire.name}"`}
                      <br />
                      {`born ${new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(parseInt(litter.sire.born, 10)))}`}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className='column'>
              <div>
                <p className='heading is-size-7 is-size-6-fullhd'>Puppies</p>
                <div className='is-size-6 is-size-5-fullhd'>
                  <PuppyList puppies={litter.puppies} />
                </div>
              </div>
            </div>
          </div>

          {active === litter.id && (
            <LitterDetails litter={litter} setLitterToEdit={setLitterToEdit} />
          )}
        </div>
        <div
          className='column is-2-mobile is-2-tablet is-1-desktop'
          style={{ padding: '0.75rem 0.3rem 0 0.3rem' }}
        >
          <div>
            <p className='heading is-size-7 is-size-6-fullhd'>Price</p>
            <div className='is-size-6 is-size-5-fullhd'>
              {litter.price}&nbsp;€
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
export default Litter
