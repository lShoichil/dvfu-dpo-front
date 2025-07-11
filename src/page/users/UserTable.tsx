import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Select, Space, Table, TableProps, Tag } from 'antd';
import { User } from 'data/dto';

import { errorMessage } from 'api/MessageService';
import { deleteUser, getUsers } from 'api/UserServise';

const options = [
  { value: 'jack', label: 'Администратор' },
  { value: 'lucy', label: 'Куратор' },
  { value: 'tom', label: 'Пользователь' }
];

const UserTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [updateNeeded, setUpdateNeeded] = useState(true);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const confirm = () => setOpen(false);
  const cancel = () => setOpen(false);

  const columns: TableProps<User>['columns'] = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Фамилия', dataIndex: 'surname', key: 'surname' },
    { title: 'Отчество', dataIndex: 'patronymic', key: 'patronymic' },
    { title: 'Email', key: 'email', dataIndex: 'email' },
    {
      title: 'Роль',
      key: 'role',
      dataIndex: 'role',
      render: (value) => <Select defaultValue={value} options={options} />
    },
    {
      title: 'Статусы',
      key: 'statuses',
      dataIndex: 'statuses',
      render: (_, record) => {
        return (
          <Space>
            <Tag
              color={record.verify ? 'green' : 'red'}
              icon={record.verify ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            >
              {record.verify ? 'Подтверждён' : 'Не подтверждён'}
            </Tag>
            <Tag
              color={record.deleted ? 'volcano' : 'geekblue'}
              icon={record.deleted ? <DeleteOutlined /> : <SafetyOutlined />}
            >
              {record.deleted ? 'Удалён' : 'Активный'}
            </Tag>
          </Space>
        );
      }
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button color="primary" variant="link">
            Сохранить изменения
          </Button>
          <Popconfirm
            title="Удалить пользователя"
            description="Вы уверены что хотите удалить этого пользователя?"
            open={open}
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button color="danger" variant="link" onClick={() => handleDelete(record.id)}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const getData = () => {
    setUpdateNeeded(false);
    setLoading(true);
    getUsers()
      .then(({ data }) => setData(data.users))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!updateNeeded) return;
    getData();
  }, [updateNeeded]);

  const handleDelete = (id: string) => {
    setLoading(true);
    deleteUser(id)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  return (
    <Card title="Список пользователей">
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} bordered />
    </Card>
  );
};

export default UserTable;
