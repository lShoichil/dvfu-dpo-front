import React, { FC } from 'react';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { TableParams } from 'utils';

interface IProps {
  name: string;
  placeholder: string;
  options: DefaultOptionType[];
  tableParams: TableParams;
  setTableParams: (v: TableParams) => void;
}

const FilterSelect: FC<IProps> = ({ name, placeholder, options, tableParams, setTableParams }) => {
  const filterOption = (inputValue: string, option: DefaultOptionType | undefined) =>
    (option?.title ?? option?.label ?? '').toString().toLowerCase().includes(inputValue.toLowerCase());

  const handleFilterChange = (value: any) => {
    setTableParams({
      ...tableParams,
      filters: { ...tableParams.filters, [name]: value },
      pagination: { ...tableParams.pagination, current: 1 }
    });
  };

  return (
    <Select
      placeholder={placeholder}
      mode={'multiple'}
      style={{ width: 180 }}
      allowClear
      popupMatchSelectWidth={false}
      maxTagCount={'responsive'}
      filterOption={filterOption}
      defaultValue={tableParams.filters?.[name]}
      onChange={handleFilterChange}
      options={options}
    />
  );
};

export default FilterSelect;
