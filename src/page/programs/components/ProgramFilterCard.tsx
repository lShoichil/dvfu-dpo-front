import React, { FC, useEffect, useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Badge, Button, Card, DatePicker, Flex, Input, InputNumber, Space } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { EducationType, Program, School, User } from 'data/dto';
import { StatusType, StudyModeTypeRu } from 'data/enum';
import dayjs from 'dayjs';
import { useHasRole } from 'hooks/useHasRole';
import { enumOptionsByKey, getTableParamsForRequest, TableParams } from 'utils';

import { getEducationTypes, getSchools } from 'api/DirectoryService';
import { errorMessage } from 'api/MessageService';
import { getAllPrograms } from 'api/ProgramService';
import { getUsers } from 'api/UserService';

import FilterSelect from './ProgramFilterSelect';

const { Search } = Input;

interface IProps {
  loading: boolean;
  tableParams: TableParams;
  setTableParams: (v: any) => void;
  setUpdateNeeded: (v: boolean) => void;
}

const FilterCard: FC<IProps> = ({ loading, tableParams, setTableParams, setUpdateNeeded }) => {
  const { hasRoleApplicant } = useHasRole();
  const [program, setProgram] = useState<Program[]>([]);
  const [curators, setCurators] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [educationType, setEducationType] = useState<EducationType[]>([]);
  const studyModeOptions = enumOptionsByKey(StudyModeTypeRu);

  const getCuratorsData = () => {
    if (hasRoleApplicant) return;

    const params: TableParams = { filters: { roles: ['curator'] } };
    getUsers(getTableParamsForRequest(params))
      .then(({ data }) => setCurators(data.data))
      .catch(errorMessage);
  };

  const getProgramsData = () => {
    getAllPrograms(getTableParamsForRequest({ pagination: { pageSize: 1200 } }))
      .then(({ data }) => setProgram(data.data))
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

  useEffect(() => {
    getProgramsData();
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
    setUpdateNeeded(true);
  };

  const startDate = tableParams.filters?.start ? dayjs(tableParams.filters.start.toString()) : undefined;
  const finishDate = tableParams.filters?.finish ? dayjs(tableParams.filters.finish.toString()) : undefined;
  const handleDateChange = (date: dayjs.Dayjs, type: 'start' | 'finish') => {
    const isoString = date?.toISOString();
    const formattedDate = isoString?.replace(/\.\d{3}Z$/, 'Z');
    setTableParams({
      ...tableParams,
      filters: { ...tableParams.filters, [type]: formattedDate },
      pagination: { ...tableParams.pagination, current: 1 }
    });
    setUpdateNeeded(true);
  };

  const startPrice = tableParams?.filters?.price_from ? Number(tableParams.filters.price_from) : undefined;
  const endPrice = tableParams?.filters?.price_to ? Number(tableParams.filters.price_to) : undefined;

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
            isMultiple
            options={studyModeOptions}
            tableParams={tableParams}
            setTableParams={setTableParams}
            setUpdateNeeded={setUpdateNeeded}
          />

          <FilterSelect
            name={'education_type'}
            placeholder="Тип образования"
            isMultiple
            options={educationType.map((type) => ({ value: type.id, label: type.name }))}
            tableParams={tableParams}
            setTableParams={setTableParams}
            setUpdateNeeded={setUpdateNeeded}
          />

          <FilterSelect
            name={'school'}
            placeholder="Школы"
            isMultiple
            options={schools.map((school) => ({ value: school.id, label: school.name }))}
            tableParams={tableParams}
            setTableParams={setTableParams}
            setUpdateNeeded={setUpdateNeeded}
          />

          {/* todo: Виртуал скролл по 20 записей + поиск */}
          <FilterSelect
            name={'programs'}
            placeholder="Программы"
            isMultiple
            options={program.map((program) => ({ value: program.id, label: program.name }))}
            tableParams={tableParams}
            setTableParams={setTableParams}
            setUpdateNeeded={setUpdateNeeded}
          />

          <Space.Compact>
            <InputNumber
              defaultValue={startPrice}
              onInput={(value) => handleFilterChange('price_from', value)}
              placeholder="Цена от"
              controls={false}
            />

            <InputNumber
              defaultValue={endPrice}
              onInput={(value) => handleFilterChange('price_to', value)}
              placeholder="Цена до"
              controls={false}
            />
          </Space.Compact>

          <Button onClick={() => setUpdateNeeded(true)}>{'Применить фильтры'}</Button>
        </Space>

        <Space wrap>
          {!hasRoleApplicant && (
            <>
              {/* todo: Виртуал скролл по 20 записей + поиск */}
              <FilterSelect
                name={'curators'}
                placeholder="Кураторы"
                isMultiple
                options={curators.map((curator) => ({ value: curator.id, label: curator.name }))}
                tableParams={tableParams}
                setTableParams={setTableParams}
                setUpdateNeeded={setUpdateNeeded}
              />

              <Space.Compact>
                <DatePicker
                  placeholder="Дата начала"
                  format={'DD.MM.YYYY'}
                  defaultValue={startDate}
                  onChange={(date) => handleDateChange(date, 'start')}
                />

                <DatePicker
                  placeholder="Дата окончания"
                  format={'DD.MM.YYYY'}
                  defaultValue={finishDate}
                  onChange={(date) => handleDateChange(date, 'finish')}
                />
              </Space.Compact>

              <FilterSelect
                name={'status'}
                placeholder="Статус потока"
                isMultiple={false}
                options={[
                  { label: <Badge status="processing" text="Активный" />, value: StatusType.ACTIVE },
                  { label: <Badge status="success" text="Закрытый" />, value: StatusType.CLOSED }
                ]}
                tableParams={tableParams}
                setTableParams={setTableParams}
                setUpdateNeeded={setUpdateNeeded}
              />

              <FilterSelect
                name={'public'}
                placeholder="Видимость"
                isMultiple={false}
                options={[
                  { label: <EyeTwoTone />, value: true } as unknown as DefaultOptionType,
                  { label: <EyeInvisibleOutlined />, value: false } as unknown as DefaultOptionType
                ]}
                tableParams={tableParams}
                setTableParams={setTableParams}
                setUpdateNeeded={setUpdateNeeded}
              />
            </>
          )}
        </Space>
      </Flex>
    </Card>
  );
};

export default FilterCard;
