import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Flex, Input, Space } from 'antd';
import { EducationType, School, User } from 'data/dto';
import { StudyModeTypeRu } from 'data/enum';
import { enumOptionsByKey, getTableParamsForRequest, TableParams } from 'utils';

import { getEducationTypes, getSchools } from 'api/DirectoryService';
import { errorMessage } from 'api/MessageService';
import { getUsers } from 'api/UserService';

import FilterSelect from './ProgramFilterSelect';

const { Search } = Input;

interface IProps {
  loading: boolean;
  tableParams: TableParams;
  setTableParams: (v: TableParams) => void;
  setUpdateNeeded: (v: boolean) => void;
}

const FilterCard: FC<IProps> = ({ loading, tableParams, setTableParams, setUpdateNeeded }) => {
  const [curators, setCurators] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [educationType, setEducationType] = useState<EducationType[]>([]);
  const studyModeOptions = enumOptionsByKey(StudyModeTypeRu);

  const getCuratorsData = () => {
    const params: TableParams = { filters: { roles: ['curator'] } };
    getUsers(getTableParamsForRequest(params))
      .then(({ data }) => setCurators(data.data))
      .catch(errorMessage);
  };

  const getSchoolsData = () => {
    getSchools()
      .then(({ data }) => setSchools(data.data))
      .catch(errorMessage);
  };

  const getStudyModeData = () => {
    getEducationTypes()
      .then(({ data }) => setEducationType(data.data))
      .catch(errorMessage);
  };

  const handleFilterSubmit = () => {
    setUpdateNeeded(true);
  };

  const handleFilterDrop = () => {
    setTableParams({ pagination: { current: 1, pageSize: 6 } });
    setUpdateNeeded(true);
  };

  useEffect(() => {
    getCuratorsData();
    getSchoolsData();
    getStudyModeData();
  }, []);

  const handleFilterChange = (name: string, value: any) => {
    setTableParams({
      ...tableParams,
      filters: { ...tableParams.filters, [name]: value },
      pagination: { ...tableParams.pagination, current: 1 }
    });
  };

  return (
    <Card loading={loading} size="small" variant="borderless">
      <Flex vertical gap="small">
        <Search
          defaultValue={tableParams.filters?.name?.toString()}
          placeholder="Поиск по названию программы"
          onChange={(e) => handleFilterChange('name', e.target.value)}
          onSearch={handleFilterSubmit}
          allowClear
        />

        <Space wrap>
          <FilterSelect
            name={'study_mode'}
            placeholder="Форма обучения"
            options={studyModeOptions}
            tableParams={tableParams}
            setTableParams={setTableParams}
          />

          <FilterSelect
            name={'education_type'}
            placeholder="Тип образования"
            options={educationType.map((type) => ({ value: type.id, label: type.name }))}
            tableParams={tableParams}
            setTableParams={setTableParams}
          />

          <FilterSelect
            name={'curators'}
            placeholder="Кураторы"
            options={curators.map((curator) => ({ value: curator.id, label: curator.name }))}
            tableParams={tableParams}
            setTableParams={setTableParams}
          />

          <FilterSelect
            name={'school'}
            placeholder="Школы"
            options={schools.map((school) => ({ value: school.id, label: school.name }))}
            tableParams={tableParams}
            setTableParams={setTableParams}
          />

          <FilterSelect
            name={'status'}
            placeholder="Статус видимости "
            options={[
              { label: 'Видимая для абитуриентов', value: 'true', disabled: true },
              { label: 'Не видимая для абитуриентов', value: 'false', disabled: true }
            ]}
            tableParams={tableParams}
            setTableParams={setTableParams}
          />

          <Space.Compact>
            <Button onClick={handleFilterSubmit}>Применить фильтры</Button>
            <Button onClick={handleFilterDrop}>Сбросить</Button>
          </Space.Compact>
        </Space>
      </Flex>
    </Card>
  );
};

export default FilterCard;
