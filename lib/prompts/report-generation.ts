import { format } from "date-fns"

export const REPORT_SYSTEM_PROMPT = `You are an expert AI Ethics Advisor with extensive experience in evaluating organizational AI practices and providing strategic recommendations. Your role is to analyze audit data and generate comprehensive, professional reports that assess an organization's AI ethics maturity and practices.

Key Responsibilities:
1. Analyze quantitative and qualitative audit data objectively
2. Identify patterns and trends in AI ethics implementation
3. Highlight areas of excellence and opportunities for improvement
4. Provide actionable, strategic recommendations
5. Present findings in a clear, professional format
6. Synthesize information from multiple assessment components

Your reports should:
- Be written in a professional, authoritative tone
- Use clear, concise language while maintaining technical accuracy
- Support conclusions with specific evidence from the audit data
- Provide context for scores and assessments
- Include practical, implementable recommendations
- Integrate insights from all assessment components
- Be structured in markdown format

Structure your response in the following sections:
# Executive Summary
- Brief overview of the assessment
- Overall ethics score and key findings
- High-level recommendations

## Organizational Context
- Overview of the organization's AI implementation
- Current ethical framework summary
- Key stakeholders and responsibilities (RACI Matrix)

## Detailed Assessment
### Transparency & Communication
### Privacy & Data Governance
### Inclusivity & Fairness
### Accountability & Responsibility
### Sustainability & Impact
### Compliance & Governance

## Governance & Risk Management
- Analysis of the ethical framework
- Risk assessment and mitigation strategies
- Continuous monitoring approach
- Compliance measures

## Stakeholder Insights
- Summary of staff interviews
- Key themes from stakeholder feedback
- Areas of consensus and concern
- Organizational readiness assessment

## Key Strengths
- Highlight areas where the organization excels
- Evidence from assessment scores
- Supporting examples from interviews and documentation

## Areas for Improvement
- Identify gaps and challenges
- Prioritize areas needing attention
- Link to stakeholder feedback and assessment results

## Strategic Recommendations
- Specific, actionable steps for improvement
- Timeline suggestions for implementation
- Resource considerations
- Risk mitigation strategies

## Implementation Roadmap
- Phased approach to improvements
- Key milestones and success metrics
- Stakeholder responsibilities
- Monitoring and review process

## Conclusion
- Summary of key points
- Critical success factors
- Next steps
- Future outlook

Remember to:
- Be constructive in your criticism
- Provide evidence-based insights
- Consider the organization's context and maturity level
- Focus on practical, achievable improvements
- Maintain a balanced perspective
- Integrate insights from all assessment components`

interface AuditResponse {
  question: string
  response: number
  questionId: string
}

interface CategoryAssessment {
  score: number
  responses: AuditResponse[]
}

interface FormattedAudit {
  id: string
  name: string
  organization: string
  description: string
  ethical_framework?: string
  risks_and_challenges?: string
  mitigation_strategies?: string
  continuous_monitoring?: string
  overall_score: number
  ethical_assessment: Record<string, CategoryAssessment>
  staff_interviews?: Array<{
    staff_name: string
    position: string
    interview_date: string
    notes: string
  }>
  raci_matrix?: Array<{
    role: string
    responsibility: string
    assignment_type: string
  }>
}

interface ReportPromptParams {
  audit: FormattedAudit
  title: string
  description: string
  customInstructions?: string
}

export function generateReportPrompt({
  audit,
  title,
  description,
  customInstructions,
}: ReportPromptParams): string {
  const {
    organization,
    ethical_assessment,
    overall_score,
    ethical_framework,
    risks_and_challenges,
    mitigation_strategies,
    continuous_monitoring,
    staff_interviews,
    raci_matrix,
  } = audit

  // Format assessment data
  const assessmentDetails = Object.entries(ethical_assessment)
    .map(([category, data]) => {
      const responses = data.responses
        .map(
          (r) =>
            `- ${r.question}\n  Score: ${r.response}/5 (${getScoreDescription(r.response)})`
        )
        .join("\n")

      const categoryScoreDescription = getCategoryScoreDescription(data.score)

      return `
### ${category} (Score: ${data.score}%)
${categoryScoreDescription}

Individual Question Responses:
${responses}`
    })
    .join("\n")

  // Format staff interviews if availableŸ~
  const interviewsSection = staff_interviews?.length
    ? `
## Staff Interviews Summary
${staff_interviews
  .map(
    (interview) => `
- ${interview.staff_name} (${interview.position})
  Date: ${interview.interview_date ? format(new Date(interview.interview_date), "PPP") : "Not conducted"}
  Key Insights: ${interview.notes || "No notes recorded"}`
  )
  .join("\n")}`
    : ""

  // Format RACI matrix if available
  const raciSection = raci_matrix?.length
    ? `
## RACI Matrix Overview
${raci_matrix
  .map(
    (item) => `
- ${item.role}: ${item.responsibility} (${item.assignment_type})`
  )
  .join("\n")}`
    : ""

  // Format governance and monitoring section
  const governanceSection = `
## Governance and Monitoring Framework
- Ethical Framework: ${ethical_framework || "Not provided"}
- Risks and Challenges: ${risks_and_challenges || "Not provided"}
- Mitigation Strategies: ${mitigation_strategies || "Not provided"}
- Continuous Monitoring Approach: ${continuous_monitoring || "Not provided"}`

  // Get overall score description
  const overallScoreDescription = getOverallScoreDescription(overall_score)

  return `Please generate a comprehensive AI ethics audit report for ${organization} with the title: "${title}"

Report Description: ${description}

${customInstructions ? `Additional Instructions: ${customInstructions}\n` : ""}

Organization Overview:
- Overall Ethics Score: ${overall_score}%
${overallScoreDescription}

${governanceSection}

Assessment Results:
${assessmentDetails}

${interviewsSection}

${raciSection}

Please analyze this data and generate a detailed report following the structure outlined in your system prompt. Focus on:
1. Integrating insights from all assessment components
2. Highlighting patterns across different data sources
3. Providing actionable recommendations based on the complete assessment
4. Identifying key themes from staff interviews
5. Clarifying roles and responsibilities from the RACI matrix
6. Evaluating the effectiveness of current governance measures

When analyzing scores:
- Individual question scores are on a scale of 1-5, where:
  1 = Not implemented
  2 = Initial/Ad hoc
  3 = Defined
  4 = Managed
  5 = Optimized

- Category scores are percentages (0-100%) indicating overall maturity in that area:
  0-20% = Critical gaps requiring immediate attention
  21-40% = Significant improvements needed
  41-60% = Developing capabilities
  61-80% = Well-established practices
  81-100% = Industry-leading practices

Please provide specific recommendations for improvement based on these scoring levels.`
}

// Helper functions for score descriptions
function getScoreDescription(score: number): string {
  switch (score) {
    case 1:
      return "Not implemented - No formal processes or controls in place"
    case 2:
      return "Initial/Ad hoc - Basic processes exist but are inconsistent"
    case 3:
      return "Defined - Standardized processes implemented but not fully mature"
    case 4:
      return "Managed - Well-defined processes with regular monitoring"
    case 5:
      return "Optimized - Industry-leading practices with continuous improvement"
    default:
      return "Not assessed"
  }
}

function getCategoryScoreDescription(score: number): string {
  if (score >= 81) {
    return "Industry-leading practices demonstrated in this area. Focus on maintaining excellence and sharing best practices."
  } else if (score >= 61) {
    return "Well-established practices in place. Opportunities exist for further optimization and refinement."
  } else if (score >= 41) {
    return "Developing capabilities with room for maturation. Key processes need strengthening."
  } else if (score >= 21) {
    return "Significant improvements needed. Several critical gaps require attention."
  } else {
    return "Critical gaps requiring immediate attention. Fundamental processes need to be established."
  }
}

function getOverallScoreDescription(score: number): string {
  return `
Overall Maturity Assessment:
${getCategoryScoreDescription(score)}

This score represents the organization's overall AI ethics maturity level across all assessed categories.
Key areas contributing to this score include transparency, privacy, inclusivity, accountability, sustainability, and compliance.`
} 