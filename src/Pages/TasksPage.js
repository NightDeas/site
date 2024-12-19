import React, { useState, useEffect, createElement } from "react";
import ApiService from "../ApiService";
import { Button, Flex, Grid, Row, Space, Table, Tag, message, Col, Select, Switch, Radio } from 'antd';
import { render } from "@testing-library/react";
import { formatDate } from "date-fns"
import { differenceInDays } from "date-fns";
import { Typography } from "antd";
import CreateModal from "../Modals/TasksEditModal"
import {Navigate, useNavigate} from 'react-router-dom'

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
               <Button type="primary" onClick={() => editTask(record)}>Редактировать</Button>
               <Button type="primary" onClick={() => completeTask(record)} disabled={record.isCompleted == true}>Завершить задачу</Button>
               </Flex> 
            }
        }
    ];
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectStatusTask, setSelectStatusTask ] = useState(null);

    const showModal = () => setIsModalVisible(true);

    const handleCancel = () => setIsModalVisible(false);
    const handleOk = () => setIsModalVisible(false);
    const editTask = (record) => {
        setIsCreate(false);
        setSelectedRowData(record);
        showModal();
    }
    const createTask = () => {
        setIsCreate(true);
        setSelectedRowData(false);
        showModal();
    }

    const handleChangeStatus = (e) => {
        setSelectStatusTask(e.target.value);
    }
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.GetTasks(selectStatusTask);
                if (response.code == 200)
                    setData(response.data);
                if (response.code == 401)
                    navigate("/Login");
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

        const intervalId = setInterval(async () => {
            const response = await ApiService.GetTasks(selectStatusTask);
            if (response.status == 200)
                {
                    setData(response.data);
                }
                if (response.status == 401)
                    navigate("/Login");
        }, 3000);

        return () => clearInterval(intervalId);
    }, [selectStatusTask]);

    const completeTask = async (record) => {
        var response = await ApiService.PutTaskIsComplete(record.id, true);
        console.log(response);
        if (response.status == 200)
        {
            message.success('Задача помечена как "Выполнено"');
        } else{
            message.error('Статус задачи не был сохранен');
        }
    }


    return (
        <>
        <CreateModal
        isCreate={isCreate}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        task = {selectedRowData}
        />
            <Row>
                <Col span={12}>
                <Typography.Title>Задачи</Typography.Title>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                <Typography.Title level={3}>Фильтры</Typography.Title>
                <Space>
                    <Typography.Text gap={15} level={5}>Статус задачи</Typography.Text>
                    <Radio.Group gap={15} onChange={handleChangeStatus}>
                        <Radio value={null}>Не выбрано</Radio>
                        <Radio value={true}>Выполнено</Radio>
                        <Radio value={false}>Не выполнено</Radio>
                    </Radio.Group>
                </Space>
                </Col>
            </Row>
            <Row >
                <Col span={2}></Col>
                <Col span={20}>
                <Table dataSource={data} columns={columns} rowKey='id'/>
                </Col>
                <Col span={2}></Col>
            </Row>
            <Row>
                <Space align="center"  style={{justifyContent:'center', width: "100%", margin: '10px'}}>
                  <Button type="primary" style={{padding: '20px'}} onClick={createTask}>Создать задачу</Button>
                </Space>
            </Row>
        </>
    );
}

export default Tasks;