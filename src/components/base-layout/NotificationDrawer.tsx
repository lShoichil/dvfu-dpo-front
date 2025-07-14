import React, { memo, useState } from 'react';
import { CommentOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Alert, Drawer, FloatButton, Form, Input, Modal } from 'antd';

const { Item } = Form;
const { TextArea } = Input;

const NotificationDrawer = () => {
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton badge={{ count: 2, color: 'blue' }} icon={<QuestionCircleOutlined />} onClick={showDrawer} />
        <FloatButton icon={<CommentOutlined />} onClick={showModal} />
      </FloatButton.Group>

      <Drawer title="Уведомления" closable={{ 'aria-label': 'Close Button' }} onClose={onClose} open={open}>
        <Alert message="Проверка документов" description="Ваши документы прошли проверку!" type="info" />
        <br />
        <Alert
          message="Проверка документов"
          description="Куратор отклонил ваш СНИЛС, ознакомьтесь с замечанием"
          type="warning"
        />
      </Drawer>

      <Modal
        title={'Есть вопрос по платформе? Опишите его в форме ниже.'}
        centered
        open={isModalOpen}
        onOk={handleOk}
        okText="Отправить"
        cancelText="Отменить"
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Item name="name" style={{ margin: 10 }}>
            <Input placeholder="Ваше имя" />
          </Item>
          <Item name="telephone" style={{ margin: 10 }}>
            <Input placeholder="Ваш телефон" />
          </Item>
          <Item name="email" style={{ margin: 10 }}>
            <Input placeholder="Ваш email" />
          </Item>
          <Item name="question" style={{ margin: 10 }}>
            <TextArea placeholder="Ваш вопрос" rows={4} />
          </Item>
          <Item style={{ margin: 10 }}>
            <p style={{ margin: 0 }}>
              Отправляя вопрос, вы соглашаетесь с политикой конфиденциальности и даете согласие на обработку
              персональных данных.
            </p>
          </Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(NotificationDrawer);
