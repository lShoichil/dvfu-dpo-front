import React from 'react';
import { ArrowUpOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Input, List, Progress, Segmented, Space, Statistic, Typography } from 'antd';

const { Search } = Input;

const { Timer } = Statistic;
const gridStyle: React.CSSProperties = {
  textAlign: 'center'
};
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Dayjs is also OK

const { Text } = Typography;

const courses = [
  {
    title: 'Основы программирования',
    description: 'Базовые концепции алгоритмов и структур данных',
    instructor: 'Иванов Алексей',
    startDate: '2023-12-10 10:00',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
  },
  {
    title: 'React для начинающих',
    description: 'Полное руководство по современному фронтенду',
    instructor: 'Петрова Мария',
    startDate: '2023-12-09 14:30',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'
  },
  {
    title: 'Анализ данных',
    description: 'Pandas, NumPy и визуализация данных на Python',
    instructor: 'Сидоров Дмитрий',
    startDate: '2023-12-08 11:15',
    status: 'completed',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png'
  },
  {
    title: 'Базы данных',
    description: 'SQL и проектирование реляционных баз данных...',
    instructor: 'Кузнецова Анна',
    startDate: '2023-12-07 16:45',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
  },
  {
    title: 'Веб-дизайн',
    description: 'Принципы UI/UX и работа в Figma для начинающих',
    instructor: 'Васильев Игорь',
    startDate: '2023-12-06 09:20',
    status: 'completed',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
  }
];

const MyProgramPage = () => {
  return (
    <>
      <Card>
        <Card.Grid hoverable style={gridStyle}>
          <Statistic title="Активных курсов" value={5} />
        </Card.Grid>
        <Card.Grid hoverable style={gridStyle}>
          <Statistic
            title="Среднее время прохождения"
            value={'3 недели'}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card.Grid>
        <Card.Grid hoverable style={gridStyle}>
          <Timer title={'До начала следующего потока'} type="countdown" value={deadline} />
        </Card.Grid>
      </Card>

      {/* Основной список курсов */}
      <Card
        title={'Мои программы'}
        extra={
          <Space wrap>
            <Segmented options={['Активные', 'Новые', 'Завершенные']} />
            <Search placeholder="Введите название программы" style={{ width: 200 }} />
          </Space>
        }
      >
        <List
          dataSource={courses}
          itemLayout="horizontal"
          renderItem={(item) => (
            <List.Item
              actions={[
                <div key="instructor">
                  <Text type="secondary">Преподаватель:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {item.instructor}
                  </Text>
                </div>,

                <div key="date">
                  <Text type="secondary">Дата начала:</Text>
                  <Text style={{ marginLeft: 8 }}>{item.startDate}</Text>
                </div>,

                <div key="status">
                  <Text type="secondary">Статус:</Text>
                  <Text
                    strong
                    style={{
                      marginLeft: 8,
                      color: item.status === 'completed' ? '#52c41a' : '#1890ff'
                    }}
                  >
                    {item.status === 'completed' ? 'Завершен' : 'В процессе'}
                  </Text>
                </div>,

                <Progress
                  key="progress"
                  percent={item.status === 'completed' ? 100 : 50}
                  status={item.status === 'completed' ? 'success' : 'active'}
                />
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar shape="square" size="large" src={item.avatar} icon={<UserOutlined />} />}
                title={<Text ellipsis>{item.title}</Text>}
                description={<Text type="secondary">{item.description}</Text>}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default MyProgramPage;
