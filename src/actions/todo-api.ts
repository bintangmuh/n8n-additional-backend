export async function sendToTodoWebhooks(payload: object) {
  const url = process.env.TODO_BOT_N8N_HOOKS
  if (!url) {
    throw new Error('TODO_BOT_N8N_HOOKS environment variable is not set')
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Failed to send to dummy service: ${response.statusText}`)
  }
  return response.json()
}