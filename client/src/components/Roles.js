import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const ALL_USERS = gql`
{
  allUsers {
    username
    role
    phone
    email
    city
    id  
  }
}
`

const Roles = ({ user }) => (
  <Query query={ALL_USERS}>
    {({ loading, error, data }) => {
      if (!user || user.role !== 'admin') {
        return (
          <div className='container'>Only admins can change user roles.</div>
        )
      }
      if (loading) return 'Loading users...'
      if (error) return 'Error! Failed to load users.'
      return (
        <div className='container'>Roles</div>
      )
    }}
  </Query>

)

export default Roles