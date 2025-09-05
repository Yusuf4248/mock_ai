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
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  // Example: You will hear a conversation between a student and a librarian about borrowing books. Choose the correct answer (A, B, or C). What is the maximum number of books the student can borrow? A) 3 B) 5 C) 7 (Answer: B) 5)
  MATCHING = "MATCHING",
  // Example: You will hear a tour guide talking about different attractions in a city. Match the attractions (1-4) to the features they offer (A-F). 1. Museum 2. Zoo 3. Park 4. Theater A) Live performances B) Animal exhibits C) Historical artifacts D) Guided tours E) Picnic areas F) Art galleries (Answers: 1. C, 2. B, 3. E, 4. A)
  LABELING = "LABELING", 
  // Example: You will hear a description of a university campus. Label the map below with the correct locations (A-D). A) Library B) Cafeteria C) Lecture Hall D) Sports Center
  COMPLETION = "COMPLETION",
  // Example: You will hear a lecture about climate change. Complete the notes below. Climate change is caused by ___ (e.g., greenhouse gases) and leads to ___ (e.g., rising temperatures).
  SENTENCE_COMPLETION = "SENTENCE_COMPLETION",
  // Example: You will hear a conversation about a job interview. Complete the sentence. The interview is scheduled for ___ (e.g., next Monday at 10 a.m.).
  SHORT_ANSWER = "SHORT_ANSWER",
  // Example: You will hear a guide explaining a museum tour. Answer the question. What is the main exhibit? (Answer: Ancient Egyptian artifacts)
}
