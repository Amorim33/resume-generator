import { createMockQueryResult } from 'slonik';
import { randomUUID } from 'crypto';
import { Resume } from '../modules/resume/dto/resume-schema';

export const resumeMock: Resume = {
  id: randomUUID(),
  user_id: randomUUID(),
  html: '<p>Test resume</p>',
};

export const resumeQuery = createMockQueryResult([resumeMock]);
