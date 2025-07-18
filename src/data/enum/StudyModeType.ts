export enum StudyModeType {
  FULL_TIME = 'full-time',
  DISTANCE = 'distance',
  BLENDED = 'blended'
}

export const StudyModeTypeRu = {
  [StudyModeType.FULL_TIME]: 'Полная',
  [StudyModeType.DISTANCE]: 'Онлайн',
  [StudyModeType.BLENDED]: 'Частичная'
};
