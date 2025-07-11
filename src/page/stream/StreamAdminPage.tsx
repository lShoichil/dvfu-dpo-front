import React, { useEffect, useState } from 'react';
import { Button, Card, Checkbox, DatePicker, Flex, Image, Input, List, Select, Space, Tag, Typography } from 'antd';
import { User } from 'data/dto';
import dayjs from 'dayjs';
import { EducationType } from 'page/directory/EducationTypePage';
import { School } from 'page/directory/SchoolPage';

import { errorMessage } from 'api/MessageService';
import { getAdminStream } from 'api/StreamService';

export interface Stream {
  id: string;
  status: string;
  start_date: string;
  finish_date: string;
  max_members: number;
  public: boolean;
  price: {
    penny: number;
    rubles: number;
  };
  program: {
    id: string;
    name: string;
    academic_hours: number;
    curators: User[];
    description: string;
    education_type: EducationType;
    image: string;
    school: School;
    study_mode: string;
  };
}

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const PAGE_SIZE = 9;
const DEFAULT_IMAGE = 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png';

const StreamAdminPage = () => {
  const [data, setData] = useState<Stream[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [updateNeeded, setUpdateNeeded] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Состояния для фильтров
  const [filters, setFilters] = useState({
    name: '',
    study_mode: [],
    education_type: [],
    school: [],
    curators: [],
    programs: [],
    price_from: undefined,
    price_to: undefined,
    date_range: null,
    public: undefined,
    status: ''
  });

  const getData = () => {
    setUpdateNeeded(false);
    setLoading(true);

    const params = {
      ...filters,
      start: dayjs(filters.date_range?.[0])?.format('YYYY-MM-DD'),
      finish: dayjs(filters.date_range?.[1])?.format('YYYY-MM-DD'),
      page: currentPage,
      limit: PAGE_SIZE
    };

    getAdminStream(params)
      .then((response) => {
        setData(response.data.treads);
        setTotal(response.data.total || 0);
      })
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (updateNeeded) {
      getData();
    }
  }, [updateNeeded, filters, currentPage]);

  const handleFilterChange = (name: any, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Сброс на первую страницу при изменении фильтров
    setUpdateNeeded(true);
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      study_mode: [],
      education_type: [],
      school: [],
      curators: [],
      programs: [],
      price_from: undefined,
      price_to: undefined,
      date_range: null,
      public: undefined,
      status: ''
    });
    setCurrentPage(1);
    setUpdateNeeded(true);
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    setUpdateNeeded(true);
  };

  const formatPrice = (price: any) => {
    return `${price.rubles} руб. ${price.penny} коп.`;
  };

  return (
    <Flex vertical gap="middle" className="stream-admin-page">
      <Card variant="borderless">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Search
            placeholder="Поиск по названию"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            allowClear
          />

          <Space wrap>
            <Select
              mode="multiple"
              placeholder="Форма обучения"
              style={{ width: 200 }}
              value={filters.study_mode}
              onChange={(value) => handleFilterChange('study_mode', value)}
              options={[
                { value: 'fulltime', label: 'Очная' },
                { value: 'parttime', label: 'Очно-заочная' },
                { value: 'online', label: 'Онлайн' }
              ]}
            />

            <Select
              mode="multiple"
              placeholder="Тип образования"
              style={{ width: 200 }}
              value={filters.education_type}
              onChange={(value) => handleFilterChange('education_type', value)}
              options={[
                { value: 1, label: 'Профессиональное' },
                { value: 2, label: 'Дополнительное' }
              ]}
            />

            <RangePicker
              placeholder={['Дата начала', 'Дата окончания']}
              value={filters.date_range}
              onChange={(dates) => handleFilterChange('date_range', dates)}
            />

            <Input.Group compact>
              <Input
                style={{ width: 100 }}
                placeholder="Цена от"
                value={filters.price_from}
                onChange={(e) => handleFilterChange('price_from', e.target.value)}
              />
              <Input
                style={{ width: 100 }}
                placeholder="Цена до"
                value={filters.price_to}
                onChange={(e) => handleFilterChange('price_to', e.target.value)}
              />
            </Input.Group>

            <Checkbox checked={filters.public} onChange={(e) => handleFilterChange('public', e.target.checked)}>
              Только публичные
            </Checkbox>

            <Button onClick={resetFilters}>Сбросить</Button>
          </Space>
        </Space>
      </Card>

      <List
        loading={loading}
        dataSource={data}
        pagination={{ defaultPageSize: 6 }}
        renderItem={(stream) => (
          <List.Item key={stream.id} style={{ padding: '8px' }}>
            <Card
              hoverable
              cover={
                <Image
                  alt={stream.program.name}
                  src={DEFAULT_IMAGE}
                  preview={false}
                  height={160}
                  style={{ objectFit: 'cover' }}
                />
              }
              bodyStyle={{ padding: '12px' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: 0, minHeight: '44px' }}>
                  {stream.program.name}
                </Title>

                <Space wrap>
                  <Tag color={stream.status === 'active' ? 'green' : 'red'} style={{ margin: 0 }}>
                    {stream.status === 'active' ? 'Активный' : 'Неактивный'}
                  </Tag>
                  <Tag style={{ margin: 0 }}>
                    {stream.program.study_mode === 'distance'
                      ? 'Дистанционный'
                      : stream.program.study_mode === 'blended'
                      ? 'Смешанный'
                      : stream.program.study_mode === 'fulltime'
                      ? 'Очный'
                      : stream.program.study_mode}
                  </Tag>
                </Space>

                <Text type="secondary" ellipsis style={{ display: 'block' }}>
                  {stream.program.school?.name || 'Школа не указана'}
                </Text>

                <div>
                  <Text strong>Даты: </Text>
                  <Text>
                    {new Date(stream.start_date).toLocaleDateString()} -{' '}
                    {new Date(stream.finish_date).toLocaleDateString()}
                  </Text>
                </div>

                <div>
                  <Text strong>Цена: </Text>
                  <Text>{formatPrice(stream.price)}</Text>
                </div>

                <div>
                  <Text strong>Часов: </Text>
                  <Text>{stream.program.academic_hours}</Text>
                </div>

                {stream.program.curators?.length > 0 && (
                  <div>
                    <Text strong>Кураторы: </Text>
                    <Text ellipsis={{ tooltip: stream.program.curators.map((c) => c.name).join(', ') }}>
                      {stream.program.curators.map((c) => c.name).join(', ')}
                    </Text>
                  </div>
                )}
              </Space>
            </Card>
          </List.Item>
        )}
        grid={{ gutter: 16, column: 3 }}
      />
    </Flex>
  );
};

export default StreamAdminPage;
