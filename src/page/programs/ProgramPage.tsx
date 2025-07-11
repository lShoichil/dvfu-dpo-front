import React, { memo, useEffect, useState } from 'react';
import { BankOutlined, CalendarOutlined, DollarOutlined, EditOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Switch, Tag } from 'antd';
import dayjs from 'dayjs';

import { errorMessage } from 'api/MessageService';
import { getAllPrograms } from 'api/ProgramServise';

const { Meta } = Card;
const { TextArea } = Input;

interface ProgramType {
  id: string;
  name: string;
  description: string;
  education_type: {
    name: string;
  };
  image: string;
  price: {
    rubles: number;
    penny: number;
  };
  school: {
    name: string;
    logo?: string;
  };
  start_date: string;
  study_mode: string;
  isHidden?: boolean;
}

interface UserType {
  role: 'curator' | 'applicant';
}

const ProgramPage = () => {
  const [data, setData] = useState([]);
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

  // useEffect(() => {
  //   if (!updateNeeded) return;
  //   getData();
  // }, [updateNeeded]);

  // ...

  const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState<UserType>({ role: 'applicant' });
  const [programs, setPrograms] = useState<ProgramType[]>([]);

  // Моковые данные
  useEffect(() => {
    const mockPrograms: ProgramType[] = [
      {
        id: '1',
        name: 'Нутрициология',
        description:
          'Профессиональный курс по основам правильного питания и диетологии. Изучите состав продуктов, их влияние на организм и научитесь составлять индивидуальные программы питания.',
        education_type: {
          name: 'Повышение квалификации'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 1800,
          penny: 0
        },
        school: {
          name: 'Школа здоровья',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
        },
        start_date: '2025-02-01',
        study_mode: 'Онлайн',
        isHidden: false
      },
      {
        id: '2',
        name: 'Веб-разработка на JavaScript',
        description:
          'Полный курс по современной веб-разработке. Освойте JavaScript, React, Node.js и другие ключевые технологии для создания интерактивных веб-приложений.',
        education_type: {
          name: 'Профессиональная переподготовка'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 3500,
          penny: 0
        },
        school: {
          name: 'Академия программирования',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
        },
        start_date: '2025-03-15',
        study_mode: 'Онлайн',
        isHidden: false
      },
      {
        id: '3',
        name: 'Графический дизайн',
        description:
          'Курс для начинающих дизайнеров. Изучите Adobe Photoshop, Illustrator и Figma. Научитесь создавать логотипы, фирменный стиль и рекламные материалы.',
        education_type: {
          name: 'Базовый курс'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 2200,
          penny: 50
        },
        school: {
          name: 'Школа дизайна',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
        },
        start_date: '2025-01-10',
        study_mode: 'Очно-заочная',
        isHidden: false
      },
      {
        id: '4',
        name: 'Маркетинг в социальных сетях',
        description:
          'Научитесь продвигать бизнес в социальных сетях. Освойте таргетированную рекламу, контент-маркетинг и аналитику.',
        education_type: {
          name: 'Интенсивный курс'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 1500,
          penny: 0
        },
        school: {
          name: 'Бизнес Академия',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
        },
        start_date: '2025-04-05',
        study_mode: 'Онлайн',
        isHidden: false
      },
      {
        id: '5',
        name: 'Английский для IT-специалистов',
        description:
          'Специализированный курс английского языка для программистов и IT-специалистов. Техническая лексика, документация и собеседования.',
        education_type: {
          name: 'Специализированный курс'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 1200,
          penny: 0
        },
        school: {
          name: 'Языковая школа',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
        },
        start_date: '2025-02-20',
        study_mode: 'Онлайн',
        isHidden: true // Скрытая программа
      },
      {
        id: '6',
        name: 'Основы бухгалтерского учета',
        description:
          'Курс для начинающих бухгалтеров и предпринимателей. Изучите основы налогового учета, составление отчетности и работу с 1С.',
        education_type: {
          name: 'Профессиональная переподготовка'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 2800,
          penny: 0
        },
        school: {
          name: 'Финансовая академия',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
        },
        start_date: '2025-03-01',
        study_mode: 'Очно',
        isHidden: false
      },
      {
        id: '7',
        name: 'Психология общения',
        description:
          'Научитесь эффективно выстраивать коммуникации в бизнесе и личной жизни. Техники переговоров, разрешения конфликтов и публичных выступлений.',
        education_type: {
          name: 'Практический курс'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 1900,
          penny: 0
        },
        school: {
          name: 'Центр психологии',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
        },
        start_date: '2025-01-25',
        study_mode: 'Очно-заочная',
        isHidden: false
      },
      {
        id: '8',
        name: 'Управление проектами',
        description:
          'Освойте методологии Agile, Scrum и Kanban. Научитесь управлять командой, сроками и бюджетом проекта.',
        education_type: {
          name: 'Повышение квалификации'
        },
        image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        price: {
          rubles: 3200,
          penny: 0
        },
        school: {
          name: 'Бизнес Академия',
          logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
        },
        start_date: '2025-04-10',
        study_mode: 'Онлайн',
        isHidden: false
      }
    ];
    setPrograms(mockPrograms);
  }, []);

  const formatPrice = (price: { rubles: number; penny: number }) => {
    return `${price.rubles}.${price.penny.toString().padStart(2, '0')} ₽`;
  };

  const handleCardClick = (program: ProgramType) => {
    setSelectedProgram(program);
    form.setFieldsValue({
      ...program,
      start_date: dayjs(program.start_date)
    });
    setIsModalVisible(true);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    form.validateFields().then((values) => {
      const updatedPrograms = programs.map((p) =>
        p.id === selectedProgram?.id
          ? {
              ...p,
              price: {
                rubles: values.price_rubles,
                penny: values.price_penny || 0
              },
              start_date: values.start_date.format('YYYY-MM-DD'),
              isHidden: values.isHidden
            }
          : p
      );

      setPrograms(updatedPrograms);
      setSelectedProgram(updatedPrograms.find((p) => p.id === selectedProgram?.id) || null);
      setIsEditing(false);
      message.success('Изменения сохранены');
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const toggleUserRole = () => {
    setUser((prev: { role: string }) => ({
      role: prev.role === 'curator' ? 'applicant' : 'curator'
    }));
  };

  const visiblePrograms = user.role === 'curator' ? programs : programs.filter((p) => !p.isHidden);

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={toggleUserRole} style={{ marginBottom: 16 }}>
        Переключить роль: {user.role === 'curator' ? 'Куратор' : 'Абитуриент'}
      </Button>

      <Row gutter={[16, 16]}>
        {visiblePrograms.map((program) => (
          <Col xs={24} sm={12} md={8} lg={6} key={program.id}>
            <Card
              hoverable
              onClick={() => handleCardClick(program)}
              cover={<img alt={program.name} src={program.image} style={{ height: 160, objectFit: 'cover' }} />}
              actions={
                user.role === 'curator' && program.isHidden
                  ? [<EyeInvisibleOutlined key="hidden" style={{ color: '#ff4d4f' }} />]
                  : []
              }
            >
              <Meta
                title={program.name}
                description={
                  <>
                    <Tag color="blue">{program.study_mode}</Tag>
                    <Tag>{program.education_type.name}</Tag>
                    <div style={{ marginTop: 8 }}>
                      <BankOutlined /> {program.school.name}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <DollarOutlined /> {formatPrice(program.price)}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <CalendarOutlined /> {dayjs(program.start_date).format('DD.MM.YYYY')}
                    </div>
                    {user.role === 'curator' && program.isHidden && (
                      <Tag color="red" style={{ marginTop: 8 }}>
                        Скрыта
                      </Tag>
                    )}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={selectedProgram?.name}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProgram && (
          <>
            <img
              src={selectedProgram.image}
              alt={selectedProgram.name}
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />

            <Form
              form={form}
              initialValues={{
                ...selectedProgram,
                price_rubles: selectedProgram.price.rubles,
                price_penny: selectedProgram.price.penny,
                start_date: dayjs(selectedProgram.start_date)
              }}
            >
              <Row gutter={16}>
                <Col span={isEditing ? 18 : 24}>
                  <h3>Информация о программе</h3>

                  {isEditing ? (
                    <>
                      <Form.Item
                        name="price_rubles"
                        label="Цена (рубли)"
                        rules={[{ required: true, message: 'Введите сумму' }]}
                        style={{ margin: 5 }}
                      >
                        <Input type="number" prefix={<DollarOutlined />} />
                      </Form.Item>

                      <Form.Item name="price_penny" label="Цена (копейки)" style={{ margin: 5 }}>
                        <Input type="number" min={0} max={99} />
                      </Form.Item>

                      <Form.Item
                        name="start_date"
                        label="Дата старта"
                        rules={[{ required: true, message: 'Выберите дату' }]}
                        style={{ margin: 5 }}
                      >
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item name="isHidden" label="Скрыть программу" valuePropName="checked" style={{ margin: 5 }}>
                        <Switch />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Форма обучения:</strong> {selectedProgram.study_mode}
                      </p>
                      <p>
                        <strong>Тип образования:</strong> {selectedProgram.education_type.name}
                      </p>
                      <p>
                        <strong>Школа:</strong> {selectedProgram.school.name}
                      </p>
                      <p>
                        <strong>Цена:</strong> {formatPrice(selectedProgram.price)}
                      </p>
                      <p>
                        <strong>Дата старта:</strong> {dayjs(selectedProgram.start_date).format('DD.MM.YYYY')}
                      </p>
                      {user.role === 'curator' && (
                        <p>
                          <strong>Статус:</strong> {selectedProgram.isHidden ? 'Скрыта' : 'Доступна'}
                        </p>
                      )}
                    </>
                  )}

                  {isEditing ? (
                    <Form.Item label="Описание" name="description">
                      <TextArea rows={4} />
                    </Form.Item>
                  ) : (
                    <p>{selectedProgram.description}</p>
                  )}
                </Col>

                {!isEditing && user.role === 'curator' && (
                  <Button type="primary" block icon={<EditOutlined />} onClick={handleEditClick}>
                    Редактировать
                  </Button>
                )}

                {!isEditing && user.role === 'applicant' && (
                  <Button type="primary" htmlType="submit" block>
                    Отправить заявку
                  </Button>
                )}
              </Row>

              {isEditing && (
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                  <Button onClick={handleCancelEdit} style={{ marginRight: 8 }}>
                    Отменить
                  </Button>
                  <Button type="primary" onClick={handleSaveChanges}>
                    Сохранить изменения
                  </Button>
                </div>
              )}
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default memo(ProgramPage);
