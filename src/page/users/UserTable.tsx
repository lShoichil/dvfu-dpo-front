/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Select, Table, TableProps, Tag, Tooltip } from 'antd';
import { User } from 'data/dto';
import { RoleType, RoleTypeRu } from 'data/enum';
import {
  DEFAULT_TABLE_PARAMS,
  enumOptionsByKey,
  getTableParamsForRequest,
  getTableParamsFromSessionStorage,
  handleTableChange,
  TableParams
} from 'utils';

import { errorMessage } from 'api/MessageService';
import { deleteUser, getUsers, updateUser } from 'api/UserService';

const options = enumOptionsByKey(RoleTypeRu);

const UserTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [updateNeeded, setUpdateNeeded] = useState(true);
  const [loading, setLoading] = useState(false);

  const defaultTableParams = {
    ...DEFAULT_TABLE_PARAMS,
    filters: { ...DEFAULT_TABLE_PARAMS.filters, verify: [true], deleted: [false] }
  };
  const { tableParams, setTableParams } = getTableParamsFromSessionStorage('userTableParams', defaultTableParams);

  const columns: TableProps<User>['columns'] = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Фамилия', dataIndex: 'surname', key: 'surname' },
    { title: 'Отчество', dataIndex: 'patronymic', key: 'patronymic' },
    { title: 'Email', key: 'email', dataIndex: 'email' },
    {
      title: 'Роль',
      key: 'role',
      dataIndex: 'role',
      render: (value: RoleType, record) => (
        <Select
          popupMatchSelectWidth={false}
          defaultValue={RoleTypeRu[value]}
          onChange={(value) => handleRoleChange(record, value as RoleType)}
          options={options}
        />
      )
    },
    {
      title: 'Статус',
      key: 'verify',
      dataIndex: 'verify',
      align: 'center',
      filters: [
        { text: 'Подтверждён', value: true },
        { text: 'Не подтверждён', value: false }
      ],
      defaultFilteredValue: tableParams.filters?.verify,
      render: (value) => (
        <Tag color={value ? 'green' : 'red'} icon={value ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {value ? 'Подтверждён' : 'Не подтверждён'}
        </Tag>
      )
    },
    {
      title: 'Статус',
      key: 'deleted',
      dataIndex: 'deleted',
      align: 'center',
      filters: [
        { text: 'Удалён', value: true },
        { text: 'Активный', value: false }
      ],
      defaultFilteredValue: tableParams.filters?.deleted,
      render: (value) => (
        <Tag color={value ? 'volcano' : 'geekblue'} icon={value ? <DeleteOutlined /> : <SafetyOutlined />}>
          {value ? 'Удалён' : 'Активный'}
        </Tag>
      )
    },
    {
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title={'Вы уверены что хотите удалить этого пользователя?'}
          onConfirm={() => handleDelete(record.id)}
          placement="bottom"
        >
          <Tooltip title={'Удаление пользователя'}>
            <DeleteOutlined />
          </Tooltip>
        </Popconfirm>
      )
    }
  ];

  const getData = (params: TableParams) => {
    console.log(params);

    setUpdateNeeded(false);
    setLoading(true);
    getUsers(getTableParamsForRequest(params))
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

  const handleRoleChange = (record: User, newRole: RoleType) => {
    const updatedData = { ...record, role: newRole };

    setLoading(true);
    updateUser(record.id, updatedData)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    deleteUser(id)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Список пользователей">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        onChange={(pagination, filters, sorter) => {
          handleTableChange<User>(pagination, filters, sorter, tableParams, setTableParams, setUpdateNeeded);
        }}
        scroll={{ x: 'max-content' }}
        pagination={tableParams.pagination}
      />
    </Card>
  );
};

export default UserTable;
