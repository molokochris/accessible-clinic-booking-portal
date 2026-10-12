import { createContext, useContext } from 'react'

export const AnnouncerContext = createContext(() => {})

// Returns announce(text): queues a message for the polite live region.
export function useAnnouncer() {
  return useContext(AnnouncerContext)
}
