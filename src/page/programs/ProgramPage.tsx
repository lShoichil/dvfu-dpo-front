/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Table, TableProps, Tooltip } from 'antd';
import { Program } from 'data/dto';
import { StudyModeType, StudyModeTypeRu } from 'data/enum';
import {
  enumFilterByKey,
  getTableParamsForRequest,
  getTableParamsFromSessionStorage,
  handleTableChange,
  TableParams
} from 'utils';

import { errorMessage } from 'api/MessageService';
import { deleteProgram, getAllPrograms } from 'api/ProgramService';

const ProgramPage = () => {
  const [data, setData] = useState<Program[]>([]);
  const [updateNeeded, setUpdateNeeded] = useState(true);
  const [loading, setLoading] = useState(false);

  const { tableParams, setTableParams } = getTableParamsFromSessionStorage('userTableParams');

  const columns: TableProps<Program>['columns'] = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    { title: 'Акад. часов', dataIndex: 'academic_hours', key: 'academic_hours', align: 'center', width: 100 },
    { title: 'Тип образования', dataIndex: 'education_type', key: 'education_type', render: (value) => value?.name },
    { title: 'Школы', dataIndex: 'school', key: 'school', render: (value) => value?.name },
    {
      title: 'Форма обучения',
      dataIndex: 'study_mode',
      key: 'study_mode',
      filters: enumFilterByKey(StudyModeTypeRu),
      defaultFilteredValue: tableParams.filters?.study_mode,
      render: (value: StudyModeType) => StudyModeTypeRu[value]
    },
    {
      key: 'action',
      width: 50,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title={'Вы уверены что хотите удалить эту программу?'}
          onConfirm={() => handleDelete(record.id)}
          placement="bottom"
        >
          <Tooltip title={'Удаление '}>
            <DeleteOutlined />
          </Tooltip>
        </Popconfirm>
      )
    }
  ];

  const getData = (params: TableParams) => {
    setUpdateNeeded(false);
    setLoading(true);
    getAllPrograms(getTableParamsForRequest(params))
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
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    updateNeeded && getData(tableParams);
  }, [updateNeeded]);

  const handleDelete = (id: string) => {
    setLoading(true);
    deleteProgram(id)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Программы">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        onChange={(pagination, filters, sorter) => {
          handleTableChange<Program>(pagination, filters, sorter, tableParams, setTableParams, setUpdateNeeded);
        }}
        scroll={{ x: 1000, y: 600 }}
        pagination={tableParams.pagination}
      />
    </Card>
  );
};

export default ProgramPage;
