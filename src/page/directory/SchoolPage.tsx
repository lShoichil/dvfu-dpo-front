import React, { ChangeEvent, useEffect, useState } from 'react';
import { ShopOutlined } from '@ant-design/icons';
import { Button, Flex, Input, List, Space, Typography } from 'antd';
import { School } from 'data/dto';

import { addSchool, deleteSchool, getSchools, updateSchool } from 'api/DirectoryService';
import { errorMessage, warnMessage } from 'api/MessageService';

const { Text } = Typography;

const SchoolPage = () => {
  const [data, setData] = useState<School[]>([]);
  const [updateNeeded, setUpdateNeeded] = useState(true);
  const [loading, setLoading] = useState(false);

  const [newSchoolName, setNewSchoolName] = useState('');

  const getData = () => {
    setUpdateNeeded(false);
    setLoading(true);
    getSchools()
      .then(({ data }) => setData(data.data))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!updateNeeded) return;
    getData();
  }, [updateNeeded]);

  const handleNameChange = (name: string, id: number) => {
    const newSchool: School = { id, name };
    setData((prev) => prev.map((school) => (school.id === id ? newSchool : school)));

    setLoading(true);
    updateSchool(id, newSchool)
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id: number) => {
    setLoading(true);
    deleteSchool(id)
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (!newSchoolName) return warnMessage('Название школы не должно быть пустым');

    setLoading(true);
    addSchool({ name: newSchoolName })
      .then(() => setUpdateNeeded(true))
      .catch((e) => errorMessage(e))
      .finally(() => setLoading(false));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewSchoolName(e.target.value);
  };

  return (
    <>
      <Flex justify="flex-end">
        <Space.Compact style={{ width: '100%' }}>
          <Input placeholder="Введите название новой школы" onChange={handleChange} allowClear />
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
              avatar={<ShopOutlined />}
              title={<Text editable={{ onChange: (value) => handleNameChange(value, item.id) }}>{item.name}</Text>}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default SchoolPage;
