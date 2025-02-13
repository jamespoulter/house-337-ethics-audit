import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { REPORT_SYSTEM_PROMPT, generateReportPrompt } from "@/lib/prompts/report-generation"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const encoder = new TextEncoder()
    const sendProgress = (controller: ReadableStreamDefaultController, data: any) => {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initial progress update
          sendProgress(controller, {
            phase: "initializing",
            message: "Starting report generation...",
            progress: 5
          })

          const supabase = createRouteHandlerClient({ cookies })
          const { data: { session } } = await supabase.auth.getSession()

          if (!session) {
            sendProgress(controller, {
              error: "Unauthorized - Please log in to generate reports"
            })
            controller.close()
            return
          }

          const json = await req.json()
          const { auditId, title, description, customInstructions } = json

          if (!auditId) {
            sendProgress(controller, {
              error: "Audit ID is required"
            })
            controller.close()
            return
          }

          // Update progress - Fetching audit data
          sendProgress(controller, {
            phase: "fetching",
            message: "Fetching audit data...",
            progress: 10
          })

          const { data: auditData, error: auditError } = await supabase
            .from("audits")
            .select(`
              *,
              ethical_assessment_categories!inner (
                id,
                category_name,
                score,
                created_at
              ),
              ethical_assessment_responses!inner (
                id,
                category_name,
                question_id,
                response,
                created_at,
                ethical_assessment_questions!inner (
                  id,
                  category_name,
                  question_text
                )
              ),
              staff_interviews (
                id,
                staff_name,
                position,
                interview_date,
                notes
              ),
              raci_matrix (
                id,
                role,
                responsibility,
                assignment_type
              )
            `)
            .eq("id", auditId)
            .single()

          if (auditError) {
            sendProgress(controller, {
              error: "Error fetching audit data",
              details: auditError.message
            })
            controller.close()
            return
          }

          // Update progress - Processing audit data
          sendProgress(controller, {
            phase: "processing",
            message: "Processing audit data...",
            progress: 20
          })

          const formattedAudit = {
            ...auditData,
            ethical_assessment: auditData.ethical_assessment_categories?.reduce((acc: Record<string, { score: number, responses: Array<{ question: string, response: number, questionId: string }> }>, category: { category_name: string, score: number }) => {
              const categoryResponses = auditData.ethical_assessment_responses?.filter(
                (response: { category_name: string }) => response.category_name === category.category_name
              ) || []

              const sortedResponses = [...categoryResponses].sort((a, b) => 
                (a.question_id || '').localeCompare(b.question_id || '')
              )

              acc[category.category_name] = {
                score: category.score,
                responses: sortedResponses.map((response: { 
                  ethical_assessment_questions?: { question_text: string }, 
                  response: number, 
                  question_id: string 
                }) => ({
                  question: response.ethical_assessment_questions?.question_text || `Question ${response.question_id}`,
                  response: response.response,
                  questionId: response.question_id
                }))
              }
              return acc
            }, {})
          }

          // Update progress - Generating report
          sendProgress(controller, {
            phase: "generating",
            message: "Generating report content...",
            progress: 30
          })

          const userPrompt = generateReportPrompt({
            audit: formattedAudit,
            title,
            description,
            customInstructions,
          })

          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content: REPORT_SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
            temperature: 0.7,
            stream: true,
          })

          let fullContent = ""
          let chunkCount = 0
          const totalExpectedChunks = 200 // Approximate number of chunks we expect

          // Stream the report content
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              fullContent += text
              chunkCount++
              
              // Calculate progress between 30% and 90%
              const generationProgress = Math.min(90, 30 + (chunkCount / totalExpectedChunks * 60))
              
              // Send both the text chunk and the progress update
              sendProgress(controller, {
                phase: "generating",
                text,
                progress: generationProgress,
                message: "Generating report content..."
              })
            }
          }

          // Update progress - Saving report
          sendProgress(controller, {
            phase: "saving",
            message: "Saving report...",
            progress: 95
          })

          // Save the report to the database
          const { data: reportData, error: reportError } = await supabase
            .from("reports")
            .insert([
              {
                audit_id: auditId,
                title,
                description,
                content: fullContent,
                custom_instructions: customInstructions,
                created_by: session.user.id,
                created_at: new Date().toISOString(),
                status: 'completed',
                version: 1,
              },
            ])
            .select()
            .single()

          if (reportError) {
            sendProgress(controller, {
              error: "Failed to save report",
              details: reportError.message
            })
          } else {
            // Send completion message with report ID
            sendProgress(controller, {
              status: "complete",
              reportId: reportData.id,
              message: "Report generation completed successfully",
              progress: 100
            })
          }

          // Send final DONE message
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Error in stream processing:", error)
          sendProgress(controller, {
            error: "Stream processing failed",
            details: error instanceof Error ? error.message : "Unknown error"
          })
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Fatal error in report generation:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Error generating report", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }), 
      { status: 500 }
    )
  }
} 