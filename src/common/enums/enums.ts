export enum UserRole {
  STUDENT = "student",
  ADMIN = "amdin",
}

export enum SectionEnum {
  PART_ONE = "part 1",
  PART_TWO = "part 2",
  PART_THREE = "part 3",
  PART_FOUR = "part 4",
}

export enum SectionRangeEnum {
  RANGE1 = "1-10",
  RANGE2 = "11-20",
  RANGE3 = "21-30",
  RANGE4 = "31-40",
}

// Listening Question Types in IELTS
export enum ListeningQuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE", // Example: Choose the correct answer A, B, or C
  MATCHING = "MATCHING", // Example: Match the speakers with the topics discussed
  PLAN_MAP_DIAGRAM_LABELING = "PLAN_MAP_DIAGRAM_LABELING",
  // Example: Label the parts of a map, building, or diagram

  FORM_COMPLETION = "FORM_COMPLETION", // Example: Complete the registration form with missing words
  NOTE_COMPLETION = "NOTE_COMPLETION", // Example: Complete lecture notes with no more than TWO words
  TABLE_COMPLETION = "TABLE_COMPLETION", // Example: Fill in a table about train schedules
  FLOWCHART_COMPLETION = "FLOWCHART_COMPLETION",
  // Example: Complete the stages in a process flowchart
  SUMMARY_COMPLETION = "SUMMARY_COMPLETION", // Example: Complete a short summary of a talk

  SENTENCE_COMPLETION = "SENTENCE_COMPLETION", // Example: Complete the sentence with one word
  SHORT_ANSWER = "SHORT_ANSWER", // Example: Answer the question in no more than THREE words
}
