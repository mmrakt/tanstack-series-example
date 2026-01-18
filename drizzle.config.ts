import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { resolveLocalD1DatabaseUrl } from './src/db/d1-local'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: resolveLocalD1DatabaseUrl({ explicitUrl: process.env.DATABASE_URL }),
  },
})
