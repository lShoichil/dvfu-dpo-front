import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, List, Pagination, Space, Tag, Tooltip, Typography } from 'antd';
import { Thread } from 'data/dto';
import { StudyModeTypeRu } from 'data/enum';
import dayjs from 'dayjs';
import { useHasRole } from 'hooks/useHasRole';
import {
  formatIntAmount,
  getTableParamsForRequest,
  getTableParamsFromSessionStorage,
  showTotal,
  TableParams
} from 'utils';

import { errorMessage } from 'api/MessageService';
import { getAllTreads, getOpenTreads } from 'api/TreadsService';

import FilterCard from '../programs/components/ProgramFilterCard';
import { SecureImage } from '../programs/components/ProgramSecureImage';
import ThreadModal from './ThreadModal';

const { Title, Text, Paragraph } = Typography;

const ThreadsPage = () => {
  const [data, setData] = useState<Thread[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateNeeded, setUpdateNeeded] = useState<boolean>(true);

  const { hasRoleAdmin, hasRoleCurator, hasRoleApplicant } = useHasRole();
  const { tableParams, setTableParams } = getTableParamsFromSessionStorage('treadsTableParams');

  const getData = (params: TableParams) => {
    const finParams = getTableParamsForRequest({ ...params, pagination: { ...params.pagination, pageSize: 6 } });

    setUpdateNeeded(false);
    setLoading(true);

    const request = hasRoleApplicant ? getOpenTreads : getAllTreads;
    request(finParams)
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread>();
  const [isModalEdit, setIsModalEdit] = useState(false);

  const handleCreateThreadClick = () => {
    setIsModalEdit(false);
    setSelectedThread(undefined);
    setIsModalOpen(true);
  };

  const handleCardClick = (thread: Thread) => {
    setIsModalEdit(true);
    setSelectedThread(thread);
    setIsModalOpen(true);
  };

  return (
    <Flex vertical gap="middle">
      <FilterCard
        loading={false}
        tableParams={tableParams}
        setTableParams={setTableParams}
        setUpdateNeeded={setUpdateNeeded}
      />

      {(hasRoleAdmin || hasRoleCurator) && (
        <Button color="primary" variant="dashed" onClick={handleCreateThreadClick} icon={<PlusOutlined />}>
          {'Добавить'}
        </Button>
      )}

      <ThreadModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        setUpdateNeeded={setUpdateNeeded}
        thread={selectedThread}
        isEdit={isModalEdit}
      />

      <List
        loading={loading}
        dataSource={data}
        renderItem={(thread: Thread) => {
          const { program } = thread;

          return (
            <List.Item key={program.id}>
              <Card
                hoverable
                size={'small'}
                onClick={() => handleCardClick(thread)}
                actions={[
                  <Tooltip key={`${thread.id}-price`} title="Стоимость в рублях">
                    {<Text strong>{`${formatIntAmount(thread.price.rubles)} ₽`}</Text>}
                  </Tooltip>,
                  <Tooltip key={`${thread.id}-start_date`} title="Дата старта программы">
                    {<Text strong>{`${dayjs(thread?.start_date).format('DD.MM.YYYY')}`}</Text>}
                  </Tooltip>,
                  <Tooltip key={`${thread.id}-hours`} title="Длительность в академических часах">
                    {<Text strong>{`${program.academic_hours} ч.`}</Text>}
                  </Tooltip>
                ]}
                cover={<SecureImage imagePath={program.image} alt={program.name} />}
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
                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 1, tooltip: program.school?.name || 'Школа не указана' }}
                      style={{ margin: 0 }}
                    >
                      {program.school?.name || 'Школа не указана'}
                    </Paragraph>
                  </Flex>
                </Flex>
              </Card>
            </List.Item>
          );
        }}
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

export default ThreadsPage;
