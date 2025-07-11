import React, { memo, useEffect, useState } from 'react';
import { BankOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { Button, Space, Table, TableProps, Tag } from 'antd';

import { errorMessage } from 'api/MessageService';
import { getAllPrograms } from 'api/ProgramServise';

const mokeData = [
  {
    key: '1',
    name: 'Веб-разработка на React',
    school: 'Школа программирования XYZ',
    price: '49900.99 ₽',
    type: 'Профессиональная переподготовка',
    start_date: '15.10.2023',
    study_mode: 'Онлайн, вечерние занятия',
    tags: ['frontend', 'react']
  },
  {
    key: '2',
    name: 'Data Science с нуля',
    school: 'Академия искусственного интеллекта',
    price: '65900.00 ₽',
    type: 'Повышение квалификации',
    start_date: '01.11.2023',
    study_mode: 'Очно-заочная форма',
    tags: ['data', 'python']
  },
  {
    key: '3',
    name: 'UX/UI дизайн',
    school: 'Школа дизайна ArtFuture',
    price: '32900.50 ₽',
    type: 'Интенсивный курс',
    start_date: '20.10.2023',
    study_mode: 'Онлайн, гибкий график',
    tags: ['design', 'ui']
  },
  {
    key: '4',
    name: 'Мобильная разработка на Flutter',
    school: 'Школа программирования XYZ',
    price: '42900.00 ₽',
    type: 'Профессиональная переподготовка',
    start_date: '05.11.2023',
    study_mode: 'Онлайн, дневные занятия',
    tags: ['mobile', 'flutter']
  }
];

interface ProgramType {
  key: string;
  name: string;
  school: string;
  price: string;
  type: string;
  start_date: string;
  study_mode: string;
  tags: string[];
}

const AdminProgramPage = () => {
  const [data, setData] = useState(mokeData);
  const [loading, setLoading] = useState(false);
  const [updateNeeded, setUpdateNeeded] = useState(true);

  const getData = () => {
    setUpdateNeeded(false);
    setLoading(true);
    getAllPrograms()
      .then(({ data }) => setData(data.programs))
      .catch(errorMessage)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!updateNeeded) return;
    getData();
  }, [updateNeeded]);

  const columns: TableProps<ProgramType>['columns'] = [
    {
      title: 'Название программы',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Школа',
      dataIndex: 'school',
      key: 'school',
      render: (school) => (
        <span>
          <BankOutlined style={{ marginRight: 8 }} />
          {school}
        </span>
      )
    },
    {
      title: 'Стоимость',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Tag icon={<DollarOutlined />} color="green">
          {price}
        </Tag>
      )
    },
    {
      title: 'Тип программы',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Дата начала',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {date}
        </span>
      )
    },
    {
      title: 'Формат обучения',
      dataIndex: 'study_mode',
      key: 'study_mode',
      render: (mode) => (
        <Tag icon={<ClockCircleOutlined />} color="blue">
          {mode}
        </Tag>
      )
    },
    {
      title: 'Действия',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button size="small">Подробнее</Button>
        </Space>
      )
    }
  ];

  return <Table columns={columns} dataSource={data} bordered style={{ padding: 24 }} />;
};

export default memo(AdminProgramPage);
