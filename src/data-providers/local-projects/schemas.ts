import zod from 'zod'

export const LocalProjectSchema = zod.object({
  name: zod.string(),
  id: zod.string()
})

export const LocalProjectNewSchema = LocalProjectSchema.omit({ id: true })
