import React, { ChangeEvent, useEffect, useState } from 'react';
import { ClusterOutlined } from '@ant-design/icons';
import { Button, Flex, Input, List, Space, Typography } from 'antd';

import { addEducationType, deleteEducationType, getEducationTypes, updateEducationType } from 'api/DirectoryService';
import { errorMessage, warnMessage } from 'api/MessageService';

const { Text } = Typography;

export interface EducationType {
  id: number;
  name: string;
}

const EducationTypePage = () => {
  const [data, setData] = useState<EducationType[]>([]);
  const [updateNeeded, setUpdateNeeded] = useState(true);
  const [loading, setLoading] = useState(false);

  const [newEduName, setNewEduName] = useState('');

  const getData = () => {
    setUpdateNeeded(false);
    setLoading(true);
    getEducationTypes()
      .then(({ data }) => setData(data.education_types))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!updateNeeded) return;
    getData();
  }, [updateNeeded]);

  const handleNameChange = (name: string, id: number) => {
    const newSchool: EducationType = { id, name };
    setData((prev) => prev.map((school) => (school.id === id ? newSchool : school)));

    setLoading(true);
    updateEducationType(id, newSchool)
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    setLoading(true);
    deleteEducationType(id)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (!newEduName) return warnMessage('Название типа образование не должно быть пустым');

    setLoading(true);
    addEducationType({ name: newEduName })
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEduName(e.target.value);
  };

  return (
    <>
      <Flex justify="flex-end">
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Введите название типа образования" onChange={handleChange} allowClear />
          <Button type="primary" loading={loading} onClick={handleAdd}>
            Добавить
          </Button>
        </Space.Compact>
      </Flex>

      <List
        itemLayout="horizontal"
        dataSource={data}
        loading={loading}
        pagination={{}}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button color="danger" variant="link" key={item.id + 'button-2'} onClick={() => handleDelete(item.id)}>
                Удалить
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<ClusterOutlined />}
              title={<Text editable={{ onChange: (value) => handleNameChange(value, item.id) }}>{item.name}</Text>}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default EducationTypePage;
