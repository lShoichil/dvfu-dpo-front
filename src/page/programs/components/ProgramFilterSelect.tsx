import React, { FC } from 'react';
import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { TableParams } from 'utils';

interface IProps {
  name: string;
  placeholder: string;
  options: DefaultOptionType[];
  isMultiple?: boolean;
  disabled?: boolean;
  tableParams: TableParams;
  setTableParams: (v: TableParams) => void;
  setUpdateNeeded: (v: boolean) => void;
}

const FilterSelect: FC<IProps> = ({
  name,
  placeholder,
  options,
  isMultiple,
  disabled,
  tableParams,
  setTableParams,
  setUpdateNeeded
}) => {
  const mode = isMultiple ? 'multiple' : undefined;

  const filterOption = (inputValue: string, option: DefaultOptionType | undefined) =>
    (option?.title ?? option?.label ?? '').toString().toLowerCase().includes(inputValue.toLowerCase());

  const handleFilterChange = (value: any) => {
    setTableParams({
      ...tableParams,
      filters: { ...tableParams.filters, [name]: value },
      pagination: { ...tableParams.pagination, current: 1 }
    });
    setUpdateNeeded(true);
  };

  return (
    <Select
      placeholder={placeholder}
      mode={mode}
      style={{ width: 180 }}
      allowClear
      popupMatchSelectWidth={false}
      maxTagCount={'responsive'}
      filterOption={filterOption}
      defaultValue={tableParams.filters?.[name]}
      onChange={handleFilterChange}
      options={options}
      disabled={disabled}
    />
  );
};

export default FilterSelect;
