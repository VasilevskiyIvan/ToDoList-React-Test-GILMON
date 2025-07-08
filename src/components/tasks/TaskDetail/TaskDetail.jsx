import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import './TaskDetail.scss';

export function TaskDetail({ isOpen, onClose, task }) {
    if (!task) {
        return null;
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="task-detail-modal-title"
            aria-describedby="task-detail-modal-description"
            className="task-detail-modal"
        >
            <Box className="task-detail-modal__content">
                <div className="task-detail-modal__header">
                    <Typography id="task-detail-modal-title" variant="h2" component="h2">
                        {task.title}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        className="task-detail-modal__close-button"
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="task-detail-modal__info">
                    {task.description && (
                        <Typography className="task-detail-modal__item task-detail-modal__item--description">
                            <DescriptionIcon className="task-detail-modal__icon" />
                            <strong>Описание:</strong> {task.description}
                        </Typography>
                    )}
                    <Typography className="task-detail-modal__item">
                        <AddCircleOutlineIcon className="task-detail-modal__icon" />
                        <strong>Добавлено:</strong> {new Date(task.createdAt).toLocaleDateString()}
                    </Typography>
                    {task.endDate && (
                        <Typography className="task-detail-modal__item">
                            <EventIcon className="task-detail-modal__icon" />
                            <strong>Дата окончания:</strong> {new Date(task.endDate).toLocaleDateString()}
                        </Typography>
                    )}
                    <Typography className="task-detail-modal__item task-detail-modal__item--status">
                        {task.status ? <CheckCircleOutlineIcon className="task-detail-modal__icon task-detail-modal__icon--completed" /> : 
                        <RadioButtonUncheckedIcon className="task-detail-modal__icon task-detail-modal__icon--pending" />}
                        <strong>Статус:</strong> {task.status ? 'Выполнена' : 'Не выполнена'}
                    </Typography>
                </div>
            </Box>
        </Modal>
    );
}