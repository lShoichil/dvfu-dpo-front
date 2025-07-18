import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Flex,
  Input,
  List,
  Pagination,
  Select,
  SelectProps,
  Space,
  TablePaginationConfig,
  Tag,
  Typography
} from 'antd';
import { EducationType, Program, School, User } from 'data/dto';
import { StudyModeTypeRu } from 'data/enum';
import {
  enumOptionsByKey,
  getTableParamsForRequest,
  getTableParamsFromSessionStorage,
  showTotal,
  TableParams
} from 'utils';

import { getEducationTypes, getSchools } from 'api/DirectoryService';
import { errorMessage } from 'api/MessageService';
import { getAllPrograms } from 'api/ProgramService';
import { getUsers } from 'api/UserService';

import { SecureImage } from './SecureImage';

const { Search } = Input;
const { Title, Text } = Typography;

const DEFAULT_IMAGE = 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png';

const ProgramsPage = () => {
  const [curators, setCurators] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [educationType, setEducationType] = useState<EducationType[]>([]);
  const studyModeOptions = enumOptionsByKey(StudyModeTypeRu);

  const [data, setData] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateNeeded, setUpdateNeeded] = useState<boolean>(true);

  const { tableParams, setTableParams } = getTableParamsFromSessionStorage('programTableParams');

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

  const getData = (params: TableParams) => {
    const finParams = getTableParamsForRequest({ ...params, pagination: { ...params.pagination, pageSize: 6 } });

    setUpdateNeeded(false);
    setLoading(true);
    getAllPrograms(finParams)
      .then(({ data }) => {
        setData(data.data);
        setTableParams({
          ...params,
          pagination: {
            ...params.pagination,
            pageSize: data.page_size,
            total: data.total
          }
        });
      })
      .catch(errorMessage)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (updateNeeded) getData(tableParams);
  }, [updateNeeded]);

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

  const paginationConfig: TablePaginationConfig = {
    ...tableParams.pagination,
    align: 'center',
    showTotal,
    hideOnSinglePage: true,
    showSizeChanger: false,
    onChange: (page, pageSize) => {
      setTableParams({
        ...tableParams,
        pagination: { ...tableParams.pagination, current: page, pageSize }
      });
      setUpdateNeeded(true);
    }
  };

  const filterSelectConfig: SelectProps = {
    mode: 'multiple',
    style: { width: 200 },
    popupMatchSelectWidth: false,
    maxTagCount: 'responsive'
  };

  return (
    <Flex vertical gap="middle" className="programs-page">
      <Card variant="borderless">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Search
            placeholder="Поиск по названию программы"
            onChange={(e) => handleFilterChange('name', e.target.value)}
            allowClear
          />

          <Space wrap>
            <Select
              placeholder="Форма обучения"
              onChange={(value) => handleFilterChange('study_mode', value)}
              options={studyModeOptions}
              {...filterSelectConfig}
            />

            <Select
              placeholder="Тип образования"
              onChange={(value) => handleFilterChange('education_type', value)}
              options={educationType.map((type) => ({
                value: type.id,
                label: type.name
              }))}
              {...filterSelectConfig}
            />

            <Select
              placeholder="Кураторы"
              onChange={(value) => handleFilterChange('curators', value)}
              options={curators.map((curator) => ({
                value: curator.id,
                label: curator.name
              }))}
              {...filterSelectConfig}
            />

            <Select
              placeholder="Школы"
              onChange={(value) => handleFilterChange('school', value)}
              options={schools.map((school) => ({
                value: school.id,
                label: school.name
              }))}
              {...filterSelectConfig}
            />

            <Input
              style={{ width: 150 }}
              placeholder="Часов от"
              onChange={(e) => handleFilterChange('hours_from', e.target.value)}
              type="number"
            />

            <Button onClick={() => setUpdateNeeded(true)}>Применить фильтры</Button>

            <Button
              onClick={() => {
                setTableParams({ pagination: { current: 1, pageSize: 6 } });
                setUpdateNeeded(true);
              }}
            >
              Сбросить
            </Button>
          </Space>
        </Space>
      </Card>

      <List
        loading={loading}
        dataSource={data}
        renderItem={(program: Program) => (
          <List.Item key={program.id}>
            <Card
              size={'small'}
              hoverable
              cover={
                <SecureImage
                  imagePath={program.image}
                  alt={program.name}
                  defaultImage={DEFAULT_IMAGE} // Путь к заглушке
                />
              }
            >
              <Flex vertical gap={'small'}>
                <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                  {program.name}
                </Title>

                <Space wrap>
                  <Tag color="blue">{program.education_type.name}</Tag>

                  <Tag color="cyan">{StudyModeTypeRu[program.study_mode]}</Tag>
                </Space>

                <Flex vertical>
                  <Text strong>{`Академических часов: ${program.academic_hours}`} </Text>
                  <Text type="secondary">{program.school?.name || 'Школа не указана'}</Text>
                </Flex>

                {!!program.curators?.length && (
                  <>
                    <Text strong>Кураторы: </Text>
                    <Text ellipsis={{ tooltip: program.curators.map((c) => c.name).join(', ') }}>
                      {program.curators.map((c) => c.name).join(', ')}
                    </Text>
                  </>
                )}
              </Flex>
            </Card>
          </List.Item>
        )}
        grid={{ gutter: 12, column: 3 }}
      />

      <Pagination {...paginationConfig} />
    </Flex>
  );
};

export default ProgramsPage;
