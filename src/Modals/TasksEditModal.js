import { Button, DatePicker, Form, message, Input, Modal, Select, Space, Switch, Typography } from "antd";
import { Footer } from "antd/es/layout/layout";
import { createElement, useEffect, useState } from "react";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import DescriptionsItem from "antd/es/descriptions/Item";
import dayjs from 'dayjs';
import ApiService from "../ApiService";
import { beTarask } from "date-fns/locale";


const CreateModal = ({ isCreate, open, onCancel, onOk, task }) =>{

    const title = isCreate ? "Добавление задачи" : "Редактирование задачи";
    const [employees, setEmployees] = useState([]);
    const [form] = Form.useForm();
    useEffect(() =>{
        if (open == false)
            return;
        const fetchData = async () => {
            const employees = await ApiService.GetEmployees();
            console.log(employees);
            if (Array.isArray(employees))
            {
                setEmployees(employees);
            }
            else
            {
                console.log('Данные из Api не являются массивом');
            }
            console.log(task);
                form.setFieldsValue({
                  description: task.description || '',
                  deadline: task.deadLine ? dayjs(task.deadLine) : dayjs(),
                  isCompleted: task.isCompleted || false,
                  employeeId: task.employeeId || undefined,
                });
    }
    fetchData();
    }, [open == true, task]);

    const handleOk = async () => {
        try{
            await form.validateFields();
            const values = form.getFieldsValue();
            console.log(values);
        
            console.log(task.id);
            if (task.id != null)
            {
                var taskRequest = {
                    description: values.description,
                    deadline: values.deadline.add(1, 'day').toISOString(),
                    isCompleted: values.isCompleted,
                    employeeId: values.employeeId,
                };
                var result = await ApiService.PutTask(task.id, taskRequest);
                console.log(result);
                if (result.status == 200)
                {
                    console.log('Сущность обновлена');
                    message.success(`Задача обновлена`);
                } else if (result.status == 403)
                {
                    console.log('Недостаточно прав доступа');
                    message.error(`Недостаточно прав доступа`);
                } else {
                    console.log('Сущность не обновлена');
                    message.error(`Задача не обновлена`);
                }
            }
            else
            {
                var taskRequest = {
                    description: values.description,
                    deadLine: values.deadline.add(1, 'day').toISOString(),
                    employeeId: values.employeeId,
                };
                var response = await ApiService.PostTask(taskRequest);
                console.log('TaskPost response', response);
                if (response.status == 200)
                {
                    console.log(`Сущность добавлена: ${response.data}`);
                    message.success(`Задача добавлена`);
                }else
                {
                    message.error(`Ошибка при добавлении задачи`);
                }
            }
            onOk();
        }
        catch (error){
            console.log(error);
        }

    }

   return <Modal
    title= {title}
    open={open}
    onCancel={onCancel}
    onOk={handleOk}
    okText="Сохранить"
    >
    <Form form={form}>
        <Form.Item
        label="Описание"
        name="description"
        rules={[{ required: true, message: 'Введите описание задачи'}]}
        >
            <Input
            placeholder="Пофиксить все баги"
            // onChange={handleInputDescriptonChange}
            ></Input>
        </Form.Item>
        <Form.Item
        label="Дедлайн"
        name="deadline"
        rules={[{ required: true, message: 'Укажите дедлайн для задачи'}]}>
            <DatePicker
            mode='date'
            format={'DD.MM.YYYY'}
            style={{minWidth: '100%', position: 'relative'}}
            // onChange={handleDeadLineChange}
            placeholder="Через 10 минут должно быть готово"
            ></DatePicker>
        </Form.Item>
        <Form.Item label='Статус задачи' name='isCompleted' valuePropName="checked" required={true} rules={'Статус задачи обязателен для заполнения'}>
            <Switch checkedChildren="Выполнено" unCheckedChildren="Не выполнено" />
        </Form.Item>
        <Form.Item name='employeeId' label='Сотрудник:'>
            <Select name='employee'
            //  onChange={(handleEmployeeIdChange)}
              placeholder='Выберите трудягу'>
                {employees.map((employee) => (
                    <Select.Option key={employee.id} value={employee.id}>
                        {employee.lastName} {employee.firstName} {employee.patronymic}
                    </Select.Option>
                ))};
            </Select>
        </Form.Item>
    </Form>
</Modal>
}

export default CreateModal;