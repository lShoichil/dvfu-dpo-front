import { AxiosResponse } from 'axios';
import { EducationType } from 'page/directory/EducationTypePage';
import { School } from 'page/directory/SchoolPage';

import { instance } from './api.config';

export const getSchools = (): Promise<AxiosResponse<{ schools: School[] }>> => {
  return instance.get('/schools');
};

export const addSchool = (data: { name: string }): Promise<AxiosResponse<School>> => {
  return instance.post('/schools', data);
};

export const updateSchool = (id: number, data: School): Promise<AxiosResponse<School>> => {
  return instance.put(`/schools/${id}`, data);
};

export const deleteSchool = (id: number): Promise<AxiosResponse<School>> => {
  return instance.delete(`/schools/${id}`);
};

// --------

export const getEducationTypes = (): Promise<AxiosResponse<{ education_types: EducationType[] }>> => {
  return instance.get('/education-types');
};

export const addEducationType = (data: { name: string }): Promise<AxiosResponse<School>> => {
  return instance.post('/education-types', data);
};

export const updateEducationType = (id: number, data: School): Promise<AxiosResponse<School>> => {
  return instance.put(`/education-types/${id}`, data);
};

export const deleteEducationType = (id: number): Promise<AxiosResponse<School>> => {
  return instance.delete(`/education-types/${id}`);
};
