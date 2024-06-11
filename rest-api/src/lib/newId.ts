import { nanoid } from 'nanoid'

const newId = (prefix: string) => {
  const length = 16
  return prefix + nanoid(length)
}

const linkId = () => {
  const length = 8
  return nanoid(length)
}

export { newId, linkId }
