import React, { FC, useEffect, useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, InputNumber, Modal, Radio, Select, Space } from 'antd';
import { Price, Program, Thread } from 'data/dto';
import dayjs from 'dayjs';
import { getTableParamsForRequest } from 'utils';

import { errorMessage, successMessage } from 'api/MessageService';
import { getAllPrograms, getProgram } from 'api/ProgramService';
import { closeTread, createTread, deleteTread } from 'api/TreadsService';

const { Item } = Form;

export interface TreadDto {
  finish_date: string;
  max_members: number;
  price: Price;
  program_id: string;
  public: boolean;
  start_date: string;
}

interface IProps {
  thread?: Thread;
  isEdit: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  setUpdateNeeded: (v: boolean) => void;
}

const ThreadModal: FC<IProps> = ({ thread, isEdit, open, setOpen, setUpdateNeeded }) => {
  const [form] = Form.useForm();
  const [program, setProgram] = useState<Program>();
  const [programs, setPrograms] = useState<Program[]>([]);

  const getProgramsData = () => {
    getAllPrograms(getTableParamsForRequest({ pagination: { pageSize: 1000 } }))
      .then(({ data }) => setPrograms(data.data))
      .catch(errorMessage);
  };

  const getProgramById = (id: string) => {
    getProgram(id)
      .then(({ data }) => setProgram(data))
      .catch(errorMessage);
  };

  useEffect(() => {
    getProgramsData();
  }, []);

  useEffect(() => {
    if (thread?.program?.id) getProgramById(thread.program.id);
  }, [thread]);

  const modalTitle = isEdit ? 'Редактирование потока' : 'Создание потока';
  const initialValues = {
    ...thread,
    rubles: thread?.price?.rubles,
    penny: 0,
    start_date: thread?.start_date ? dayjs(thread?.start_date) : undefined,
    finish_date: thread?.finish_date ? dayjs(thread?.finish_date) : undefined,
    program_id: isEdit ? { label: program?.name, value: program?.id } : undefined
  };

  const createNewThread = () => {
    const values = form.getFieldsValue();
    const data: TreadDto = {
      ...values,
      program_id: values?.program_id?.value,
      price: { rubles: values?.rubles, penny: values?.penny || 1 },
      rubles: undefined
    };

    createTread(data)
      .then((response) => {
        if (response?.status === 201) {
          successMessage();
          setOpen(false);
          setUpdateNeeded(true);
        }
      })
      .catch(errorMessage);
  };

  const handleClose = () => {
    const id = thread?.id?.toString() || '';
    if (!id) return;

    closeTread(id)
      .then((response) => {
        if (response?.status === 200) {
          successMessage();
          setOpen(false);
          setUpdateNeeded(true);
        }
      })
      .catch(errorMessage);
  };

  const handleDelete = () => {
    const id = thread?.id?.toString() || '';
    if (!id) return;

    deleteTread(id)
      .then((response) => {
        if (response?.status === 200) {
          successMessage();
          setOpen(false);
          setUpdateNeeded(true);
        }
      })
      .catch(errorMessage);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onOk={createNewThread}
      onCancel={handleCancel}
      footer={isEdit ? null : undefined}
      afterOpenChange={() => form.resetFields()}
    >
      <Form form={form} initialValues={initialValues} disabled={isEdit}>
        <Item name={'program_id'} label={'Программа'}>
          <Select
            allowClear
            labelInValue
            options={programs.map((it) => ({ label: it.name, value: it.id }))}
            popupMatchSelectWidth={false}
            maxTagCount={'responsive'}
            filterOption={(inputValue, option) =>
              (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </Item>

        <Flex justify="space-between">
          <Item name={'max_members'} label={'Макс. кол-во человек'}>
            <InputNumber />
          </Item>
          <Item name={'public'} label={'Видимость'} layout="horizontal">
            <Radio.Group>
              <Radio value={true}>{<EyeTwoTone />}</Radio>
              <Radio value={false}>{<EyeInvisibleOutlined />}</Radio>
            </Radio.Group>
          </Item>
        </Flex>

        <Flex justify="space-between">
          <Item name={'rubles'} label={'Цена'}>
            <InputNumber />
          </Item>

          <Space.Compact>
            <Item name={'start_date'}>
              <DatePicker placeholder="Дата начала" format={'DD.MM.YYYY'} />
            </Item>
            <Item name={'finish_date'}>
              <DatePicker placeholder="Дата окончания" format={'DD.MM.YYYY'} />
            </Item>
          </Space.Compact>
        </Flex>
      </Form>

      {isEdit && (
        <Flex gap="small" justify="flex-end">
          <Button color="primary" variant="outlined" onClick={handleClose}>
            Закрыть поток
          </Button>
          <Button color="danger" variant="outlined" onClick={handleDelete}>
            Удалить поток
          </Button>
        </Flex>
      )}
    </Modal>
  );
};

export default ThreadModal;
