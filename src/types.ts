import { z } from "zod";

export const Severity = z.enum(['critical', 'high', 'medium', 'low', 'suggestion']);
export type Severity = z.infer<typeof Severity>;

export const FindingCategory = z.enum(['correctness', 'testing', 'accessibility', 'architecture', 'quality', 'performance', 'security']);
export type FindingCategory = z.infer<typeof FindingCategory>;

export const FindingStatus = z.enum(['confirmed', 'likely', 'suggestion']);
export type FindingStatus = z.infer<typeof FindingStatus>;

export const Confidence = z.enum(['high', 'medium', 'low']);
export type Confidence = z.infer<typeof Confidence>;

export const CheckStatus = z.enum(['passed', 'failed', 'not_run']);
export type CheckStatus = z.infer<typeof CheckStatus>;

export const ReviewVerdict = z.enum(['approve', 'request_changes', 'needs_manual_review']);
export type ReviewVerdict = z.infer<typeof ReviewVerdict>;

export interface Finding {
    severity: Severity;
    category: FindingCategory;
    status: FindingStatus;
    confidence: Confidence;
    file: string;
    line: number | null;
    title: string;
    description: string;
    recommendation: string;
}

export interface ReviewResult {
    verdict: ReviewVerdict;
    summary: string;
    findings: Finding[];
    checks: {
        tests: CheckStatus;
        lint: CheckStatus;
        typecheck: CheckStatus;
    }
}