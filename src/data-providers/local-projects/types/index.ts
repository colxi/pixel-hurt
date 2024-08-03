import zod from 'zod'
import { LocalProjectNewSchema, LocalProjectSchema } from '../schemas'

export type LocalProject = zod.infer<typeof LocalProjectSchema>
export type LocalProjectNew = zod.infer<typeof LocalProjectNewSchema>
