/**
 * CLARITY SERVICE (V1.60)
 * Lightweight, real-time detection for spelling, repeated words, and professional clarity.
 */

export type IssueType = 'SPELLING' | 'CLARITY' | 'GRAMMAR' | 'INTENT';

export interface ClarityIssue {
  id: string;
  type: IssueType;
  text: string;
  startIndex: number;
  endIndex: number;
  suggestions: string[];
}

// Intent patterns
const VAGUE_PHRASES = ["need help", "looking for", "anyone here", "someone who can", "help wanted", "need developer", "need designer"];

// Lightweight dictionary for common tech/business misspellings
const COMMON_ERRORS: Record<string, string[]> = {
  "teh": ["the"],
  "recieve": ["receive"],
  "adress": ["address"],
  "collab": ["partner", "collaboration"],
  "requirement": ["requirement"], // common typo check
  "definately": ["definitely"],
  "sepereate": ["separate"],
  "occured": ["occurred"],
  "untill": ["until"],
  "wich": ["which"],
  "beleive": ["believe"],
  "buisness": ["business"],
  "oppurtunity": ["opportunity"],
  "proffesional": ["professional"],
  "synergy": ["alignment", "collaboration"], // Overused clarity check
  "very": ["extremely", "highly"], // Clarity
  "good": ["excellent", "strategic", "valuable"], // Clarity
};

export const ClarityService = {
  async analyze(text: string, mode: 'POST' | 'CHAT' = 'POST', type?: string): Promise<ClarityIssue[]> {
    if (!text || text.length < 3) return [];

    const issues: ClarityIssue[] = [];
    
    // 1. INTENT DETECTION (Step 1)
    if (mode === 'POST') {
      const lowerText = text.toLowerCase();
      
      // Vague requests
      const vagueMatch = VAGUE_PHRASES.find(p => lowerText.includes(p));
      if (vagueMatch) {
        issues.push({
          id: 'intent-vague',
          type: 'INTENT',
          text: vagueMatch,
          startIndex: lowerText.indexOf(vagueMatch),
          endIndex: lowerText.indexOf(vagueMatch) + vagueMatch.length,
          suggestions: ["Specify exact role", "Define the task"]
        });
      }

      // Low detail check
      if (text.length < 30) {
        issues.push({
          id: 'intent-detail',
          type: 'INTENT',
          text: text,
          startIndex: 0,
          endIndex: text.length,
          suggestions: [
            type === 'REQUIREMENT' ? "Add task + timeline" :
            type === 'PARTNER' ? "Add role + commitment" : "Add topic + time"
          ]
        });
      }
    }

    // 2. REPEATED WORDS DETECTION (Grammar - Enabled for both)
    const repeatedWordRegex = /\b(\w+)\s+\1\b/gi;
    let match;
    while ((match = repeatedWordRegex.exec(text)) !== null) {
      issues.push({
        id: `repeat-${match.index}`,
        type: 'GRAMMAR',
        text: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        suggestions: [match[1]]
      });
    }

    // 2. SPELLING & CLARITY (Dictionary based)
    const normalizedWords = text.split(/(\s+)/); // Preserve spaces for indexing
    let currentPos = 0;

    normalizedWords.forEach(segment => {
      const word = segment.trim().toLowerCase();
      if (word && COMMON_ERRORS[word]) {
        const isClarityWord = word === 'synergy' || word === 'very' || word === 'good';
        
        // Only add clarity issues in POST mode
        if (isClarityWord && mode === 'CHAT') {
           currentPos += segment.length;
           return;
        }

        issues.push({
          id: `dict-${currentPos}`,
          type: isClarityWord ? 'CLARITY' : 'SPELLING',
          text: segment.trim(),
          startIndex: currentPos,
          endIndex: currentPos + segment.trim().length,
          suggestions: COMMON_ERRORS[word]
        });
      }
      currentPos += segment.length;
    });

    return issues.slice(0, 10); // Limit max issues (Step 6)
  },

  /**
   * ✨ PROFESSIONAL UPGRADE
   * Advanced professional restructuring.
   */
  async refine(text: string, type: string = 'POST'): Promise<string> {
    if (text.length < 5) return text;
    
    let refined = text
      .replace(/i need/gi, "I am seeking")
      .replace(/i want/gi, "I am looking for")
      .replace(/thanks/gi, "I appreciate your time")
      .replace(/hello/gi, "Greetings")
      .replace(/\bcan someone\b/gi, "I am interested in connecting with a professional who can")
      .trim();

    // Contextual enrichment
    if (type === 'REQUIREMENT' && !refined.includes('by')) {
      refined += " with a goal to complete this by [Timeline].";
    } else if (type === 'PARTNER' && !refined.includes('collaborate')) {
      refined += " for a focused collaboration on [Project Name].";
    } else if (type === 'MEETUP' && !refined.includes('discuss')) {
      refined += " to discuss strategy and insights.";
    }

    return refined;
  }
};
