import 'server-only'

const SNOWFLAKE_ACCOUNT = process.env.SNOWFLAKE_ACCOUNT || ''
const SNOWFLAKE_TOKEN = process.env.SNOWFLAKE_TOKEN || ''
const SNOWFLAKE_WAREHOUSE = process.env.SNOWFLAKE_WAREHOUSE || 'COMPUTE_WH'

function getBaseUrl() {
  if (!SNOWFLAKE_ACCOUNT) throw new Error('SNOWFLAKE_ACCOUNT env var not set')
  return `https://${SNOWFLAKE_ACCOUNT}.snowflakecomputing.com`
}

/**
 * Call Snowflake Cortex COMPLETE via the SQL API.
 * Uses: SELECT SNOWFLAKE.CORTEX.COMPLETE(model, prompt)
 * This works on trial accounts (the REST inference endpoint does not).
 */
export async function cortexComplete(
  prompt: string,
  options?: { model?: string; temperature?: number; maxTokens?: number },
): Promise<string> {
  if (!SNOWFLAKE_TOKEN) throw new Error('SNOWFLAKE_TOKEN env var not set')

  const model = options?.model ?? 'snowflake-arctic'
  const url = `${getBaseUrl()}/api/v2/statements`

  // Escape single quotes in the prompt for SQL
  const escaped = prompt.replace(/'/g, "''")

  const sql = `SELECT SNOWFLAKE.CORTEX.COMPLETE('${model}', '${escaped}') as response`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SNOWFLAKE_TOKEN}`,
      'X-Snowflake-Authorization-Token-Type': 'PROGRAMMATIC_ACCESS_TOKEN',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      statement: sql,
      warehouse: SNOWFLAKE_WAREHOUSE,
      timeout: 60,
    }),
  })

  const json = await res.json()

  if (json.code && json.code !== '090001') {
    throw new Error(`Snowflake error ${json.code}: ${json.message}`)
  }

  // SQL API returns data as array of rows, each row is array of column values
  const text = json.data?.[0]?.[0] ?? ''
  return typeof text === 'string' ? text.trim() : JSON.stringify(text)
}

/** Check if Snowflake credentials are configured */
export function isSnowflakeConfigured(): boolean {
  return !!(SNOWFLAKE_ACCOUNT && SNOWFLAKE_TOKEN)
}
