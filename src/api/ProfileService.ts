import { AxiosResponse } from 'axios';
import { User } from 'data/dto';

import { instance } from './api.config';

// ================== Enums ==================
export enum VerificationStatus {
  NEW = 'new',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export enum EducationType {
  SECONDARY = 'secondary',
  SECONDARY_SPECIAL = 'secondary_special',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

// ================== Interfaces ==================
export interface Resume {
  additional_information: AdditionalInformation;
  document_on_change_of_surname: DocumentOnChangeOfSurname;
  education: EducationDocumentWithStatus;
  opd: OPDWithStatus;
  passport: PassportWithStatus;
  snils: SnilsWithStatus;
  verify: boolean;
}

// ===== Additional Information =====
export interface AdditionalInformation {
  job_title: string;
  organization: string;
  phone: string;
}

// ===== Document on Change of Surname =====
export interface DocumentOnChangeOfSurname {
  document: string;
  message?: string;
  status: VerificationStatus;
}

// ===== Education =====
export interface EducationDocumentWithStatus {
  education_document: EducationDocument;
  message?: string;
  status: VerificationStatus;
}

export interface EducationDocument {
  diploma?: Diploma;
  document: string;
  institution_name: string;
  specialty: string;
  type: EducationType;
  year_of_graduation: string;
}

export interface Diploma {
  // Уточните структуру DiplomaDTO при необходимости
  [key: string]: any;
}

// ===== OPD =====
export interface OPDWithStatus {
  message?: string;
  opd: OPD;
  status: VerificationStatus;
}

export interface OPD {
  date: string; // RFC3339 format
  document: string;
}

// ===== Passport =====
export interface PassportWithStatus {
  message?: string;
  passport: Passport;
  status: VerificationStatus;
}

export interface Passport {
  date_of_birth: string;
  department_code: string;
  gender: Gender;
  issued_by: string;
  issued_when: string;
  name: string;
  nationality: string;
  number: string;
  patronymic?: string;
  place_of_birth: string;
  series: string;
  surname: string;
}

// ===== SNILS =====
export interface SnilsWithStatus {
  message?: string;
  snils: Snils;
  status: VerificationStatus;
}

export interface Snils {
  number: string;
}

export const getMyProfile = (): Promise<AxiosResponse<User>> => {
  return instance.get('/users/my');
};

export const updateMyProfile = (data: User): Promise<AxiosResponse<User>> => {
  return instance.put('/users/my', data);
};

export const getResumeById = (id: string): Promise<AxiosResponse<Resume>> => {
  return instance.get(`/users/${id}/resume`);
};

export const updateMyPassport = (id: string, data: Passport): Promise<AxiosResponse> => {
  return instance.post(`/users/${id}/resume/passport`, data);
};

export const updateMySnils = (id: string, data: Snils): Promise<AxiosResponse> => {
  return instance.post(`/users/${id}/resume/snils`, data);
};
