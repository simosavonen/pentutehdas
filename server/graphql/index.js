import {
  typeDefs as root
} from './root'
import {
  typeDefs as litter,
  resolvers as litterResolvers
} from './litter'
import {
  typeDefs as dog,
  resolvers as dogResolvers
} from './dog'
import {
  typeDefs as user,
  resolvers as userResolvers
} from './user'

export const typeDefs = [
  root,
  litter,
  dog,
  user
]

export const resolvers = [
  litterResolvers,
  dogResolvers,
  userResolvers
]
