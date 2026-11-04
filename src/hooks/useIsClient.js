import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** true solo nel browser, dopo l'idratazione; false durante il prerender. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
