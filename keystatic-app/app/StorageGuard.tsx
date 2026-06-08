'use client'
import { useEffect } from 'react'

export default function StorageGuard() {
  useEffect(() => {
    if (!navigator.storage?.estimate || !indexedDB.databases) return
    navigator.storage.estimate().then(({ usage = 0, quota = 1 }) => {
      if (usage / quota < 0.8) return
      indexedDB.databases().then(dbs => {
        dbs.forEach(({ name }) => name && indexedDB.deleteDatabase(name))
        console.info('[StorageGuard] Wyczyszczono IndexedDB (zużycie >', Math.round(usage / quota * 100), '%)')
      })
    })
  }, [])
  return null
}
