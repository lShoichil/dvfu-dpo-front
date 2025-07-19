import React, { useEffect, useState } from 'react';
import { Card, Flex, List, Pagination, Space, Tag, Typography } from 'antd';
import { Program } from 'data/dto';
import { StudyModeTypeRu } from 'data/enum';
import { getTableParamsForRequest, getTableParamsFromSessionStorage, showTotal, TableParams } from 'utils';

import { errorMessage } from 'api/MessageService';
import { getAllPrograms } from 'api/ProgramService';

import FilterCard from './components/ProgramFilterCard';
import { SecureImage } from './components/ProgramSecureImage';

const { Title, Text } = Typography;

const DEFAULT_IMAGE = 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png';

const ProgramsPage = () => {
  const [data, setData] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateNeeded, setUpdateNeeded] = useState<boolean>(true);

  const { tableParams, setTableParams } = getTableParamsFromSessionStorage('programTableParams');

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

  return (
    <Flex vertical gap="middle">
      <FilterCard
        loading={false}
        tableParams={tableParams}
        setTableParams={setTableParams}
        setUpdateNeeded={setUpdateNeeded}
      />

      <List
        loading={loading}
        dataSource={data}
        renderItem={(program: Program) => (
          <List.Item key={program.id}>
            <Card
              size={'small'}
              hoverable
              cover={<SecureImage imagePath={program.image} alt={program.name} defaultImage={DEFAULT_IMAGE} />}
            >
              <Flex vertical gap={'small'}>
                <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                  {program.name}
                </Title>

                <Space wrap>
                  {program.education_type?.name && <Tag color="blue">{program.education_type.name}</Tag>}
                  {program?.study_mode && <Tag color="cyan">{StudyModeTypeRu[program.study_mode]}</Tag>}
                </Space>

                <Flex vertical>
                  <Text strong>{`Академических часов: ${program.academic_hours}`} </Text>
                  <Text type="secondary">{program.school?.name || 'Школа не указана'}</Text>
                </Flex>
              </Flex>
            </Card>
          </List.Item>
        )}
        grid={{ gutter: 12, column: 3 }}
      />

      <Pagination
        current={tableParams.pagination?.current}
        pageSize={tableParams.pagination?.pageSize}
        total={tableParams.pagination?.total}
        align="center"
        showTotal={showTotal}
        hideOnSinglePage={true}
        showSizeChanger={false}
        onChange={(current, pageSize) => {
          setTableParams({ ...tableParams, pagination: { ...tableParams.pagination, current, pageSize } });
          setUpdateNeeded(true);
        }}
      />
    </Flex>
  );
};

export default ProgramsPage;
