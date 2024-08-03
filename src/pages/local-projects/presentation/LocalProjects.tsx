import { FC } from 'react'
import { LocalProjectsContextProvider } from '../context'
import { LocalProjectsList } from './LocalProjectsList'
import { LocalProjectsNew } from './LocalProjectsNew'


export const LocalProjects: FC = () => {
  return <>
    <LocalProjectsContextProvider>
      <LocalProjectsNew />
      <LocalProjectsList />
    </LocalProjectsContextProvider>
  </>
}