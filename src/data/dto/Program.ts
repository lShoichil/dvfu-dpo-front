import { StudyModeType } from 'data/enum';

import { EducationType, School, User } from '.';

export interface Program {
  id: string;
  name: string;
  academic_hours: number;
  curators: User[];
  description: string;
  education_type: EducationType;
  image: string;
  school: School;
  study_mode: StudyModeType;
  offer_pay: boolean;
  contract_pay: boolean;
}
