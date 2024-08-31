import React from 'react'
import { Table } from 'antd';

const Tables = ({dataSource,columns,components,pagination,rowClassName}) => {
    return (
        <Table
            components={components}
            bordered
            dataSource={dataSource}
            columns={columns}
            rowClassName={rowClassName}
            pagination={pagination}
        />
    )
}

export default Tables