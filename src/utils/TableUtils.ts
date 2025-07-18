/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PaginationProps, TablePaginationConfig } from 'antd';
import { ColumnFilterItem, FilterValue, SorterResult } from 'antd/es/table/interface';

export interface TableParams {
  filters?: Record<string, FilterValue | null>;
  sorting?: string;
  pagination?: TablePaginationConfig;
}

export const DEFAULT_TABLE_PARAMS: TableParams = {
  pagination: {
    current: 1,
    defaultCurrent: 1,
    pageSize: 10,
    pageSizeOptions: [5, 10, 15],
    showSizeChanger: true,
    hideOnSinglePage: false
  }
};

// export const PAGINATION_FOR_TABLE: TableParams = {
//   pagination: {
//     defaultPageSize: 10,
//     showSizeChanger: true,
//     pageSizeOptions: [10, 20, 30, 50, 100]
//   }
// };

export const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

export const getTableParamsFromSessionStorage = (key: string) => {
  const setTableParams = (params: TableParams) => window.sessionStorage.setItem(key, JSON.stringify(params));
  const getTableParams = () => JSON.parse(window.sessionStorage.getItem(key) ?? '{}');

  const preTableParams = getTableParams();
  const tableParams = preTableParams?.pagination ? preTableParams : DEFAULT_TABLE_PARAMS;
  return { tableParams, setTableParams };
};

export const handleTableChange = <T>(
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<T> | SorterResult<T>[],
  tableParams: TableParams,
  setTableParams: (params: TableParams) => void,
  setUpdateNeeded?: (value: boolean) => void
) => {
  setTableParams({
    ...tableParams,
    sorting: (sorter as SorterResult<T>).order ? (sorter as SorterResult<T>).columnKey?.toString() : 'id',
    filters: { ...tableParams.filters, ...filters },
    pagination: { ...tableParams.pagination, ...pagination }
  });
  setUpdateNeeded && setUpdateNeeded(true);
};

export const filtersToString = (filters?: Record<string, string[] | FilterValue | null>): string => {
  if (!filters) return '';

  return Object.keys(filters)?.reduce((query, key) => {
    if (!filters[key] || !(filters[key]?.length > 0)) return query;
    return query + `${key}=${filters[key].join(',')}&`;
  }, '');
};

export const getTableParamsForRequest = (params: TableParams): string => {
  const obj = {
    page: params.pagination?.current ?? 1,
    page_size: params.pagination?.pageSize ?? 10,
    filters: filtersToString(params.filters) ?? ''
  };

  const paramsString = Object.keys(obj)
    .reduce(
      (previousValue, currentValue) => previousValue + `${currentValue}=${obj[currentValue as keyof typeof obj]}&`,
      '?'
    )
    .replace('&&', '')
    .replace('filters=', '');
  return paramsString.endsWith('&') ? paramsString.slice(0, paramsString.length - 1) : paramsString;
};

export const enumFilterByKey = (type: any, hasRuValue = false): ColumnFilterItem[] => {
  return Object.keys(type).map((key) => {
    const result = hasRuValue ? { text: key, value: type[key] } : { text: type[key], value: key };
    return result;
  });
};

export const enumOptionsByKey = (type: any, hasRuValue = false) => {
  return Object.keys(type).map((key) => {
    const result = hasRuValue ? { label: key, value: type[key] } : { label: type[key], value: key };
    return result;
  });
};
