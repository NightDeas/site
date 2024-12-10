import React, { useState, useEffect } from "react";
import ApiService from "../ApiService";
import { Button, Flex, Grid, Row, Space, Table, Tag, Col } from 'antd';
import { render } from "@testing-library/react";
import { formatDate } from "date-fns"
import { differenceInDays } from "date-fns";
import { Typography } from "antd";
const Tasks = () => {    
    const today = new Date();
    const [data, setData] = useState([]);
    const columns = [
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'Description'
        },
        {
            title: 'Дата создания',
            dataIndex: 'created',
            key: 'Created',
            render: (date) => formatDate(new Date(date), 'dd.MM.yyyy HH:mm'),
        },
        {
            title: 'Срок сдачи',
            dataIndex: 'deadLine',
            key: 'DeadLine',
            render: (date) => formatDate(new Date(date), 'dd.MM.yyyy HH:mm'),
        
        },
        {
            title: 'Статус',
            dataIndex: 'isCompleted',
            key: 'isCompleted',
            render: (value) => value ? <Tag bordered='false' color="success">Выполнено</Tag> : <Tag bordered='false' color="red">Не Выполнено</Tag>,
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) =>{
               return <Flex vertical gap={5}>
               <Button type="primary" danger>Удалить</Button>
               <Button type="primary">Редактировать</Button>
               </Flex> 
            }
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasks = await ApiService.GetTasks();
                console.log(tasks);
                // var transformTasks = transformData(tasks);
                setData(tasks);
                console.log(tasks);
            } catch (error) {
                console.log(error);
            }
        }

        // const transformData = (data) => {
        //     if (!data || !Array.isArray(data)) return [];
        //     return data.map(item => ({
        //         ...item, 
        //         IsCompleted: 
        //     }));
        // }

        fetchData();
    }, []);
    return (
        <>
            <Row>
                <Col span={12}>
                <Typography.Title>Задачи</Typography.Title>
                </Col>
            </Row>
            <Row style={{height: '100px'}}>
                <Col span={2}></Col>
                <Col  span={20}>
                <Table dataSource={data} columns={columns} />
                </Col>
                <Col span={2}></Col>
            </Row>
        </>
    );
}

export default Tasks;