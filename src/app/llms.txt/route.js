import { llmsTxt } from '@/lib/llms'

// scritto una volta durante la build come file statico /llms.txt
export const dynamic = 'force-static'

export function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
