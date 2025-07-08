import {
    TextField,
    Button,
    Box,
    Alert,
    Typography,
    Modal,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

import './AddTaskForm.scss';

export function AddTaskForm({ onAddTask, isOpen, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        endDate: ''
    });
    const [errors, setErrors] = useState({});
    const [saveMessage, setSaveMessage] = useState('');
    const [messageSeverity, setMessageSeverity] = useState('info');

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '',
                description: '',
                endDate: ''
            });
            setErrors({});
            setSaveMessage('');
            setMessageSeverity('info');
        }
    }, [isOpen]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    }

    function validateForm() {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Заголовок обязателен';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            setSaveMessage('Заполните все обязательные поля');
            setMessageSeverity('error');
            return;
        }

        const newTask = {
            id: Date.now(),
            ...formData,
            status: false,
            createdAt: new Date().toISOString()
        };

        if (onAddTask) {
            onAddTask(newTask);
        }

        setSaveMessage('Задача успешно сохранена!');
        setMessageSeverity('success');

        setTimeout(() => {
            setSaveMessage('');
            setMessageSeverity('info');
            if (onClose) {
                onClose();
            }
        }, 1500);
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="add-task-modal-title"
            aria-describedby="add-task-modal-description"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                className="add-task-modal__content"
            >
                <div className="add-task-modal__header">
                    <Typography id="add-task-modal-title" variant="h6" component="h2">
                        Добавить новую задачу
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        className="add-task-modal__close-button"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <TextField
                    label="Заголовок*"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title}
                    margin="normal"
                    placeholder="Введите заголовок задачи"
                    className="add-task-modal__text-field"
                />

                <TextField
                    label="Описание*"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description}
                    margin="normal"
                    placeholder="Введите описание задачи"
                    multiline
                    rows={5}
                    className="add-task-modal__text-field"
                />

                <TextField
                    label="Дата окончания"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    placeholder="2025-07-07"
                    className="add-task-modal__text-field"
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="add-task-modal__save-button"
                >
                    Сохранить задачу
                </Button>

                {saveMessage && (
                    <Alert
                        severity={messageSeverity}
                        className="add-task-modal__alert"
                    >
                        {saveMessage}
                    </Alert>
                )}
            </Box>
        </Modal>
    );
}