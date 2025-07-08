import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { TaskDetail } from '../TaskDetail/TaskDetail';

import './TaskItem.scss';

export function TaskItem({ id, title, description, status, createdAt, endDate, onDelete, onChange }) {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
    };

    const handleChangeStatus = () => {
        if (onChange) {
            onChange(id);
        }
    };

    const handleOpenDetailModal = () => {
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
    };

    const isEndDateUrgent = endDate && !status && (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24) <= 3;

    return (
        <div className={`task-item ${status ? 'task-item--completed' : ''}`}>
            <div className="task-item__content">
                <p className="task-item__title">{title}</p>
                {description && <p className="task-item__description">{description}</p>}

                <div className="task-item__date-group">
                    <p className="task-item__created-at">
                        <AddCircleOutlineIcon fontSize="small" /> Добавлено: {new Date(createdAt).toLocaleDateString()}
                    </p>
                    <IconButton
                        aria-label="view-details"
                        onClick={handleOpenDetailModal}
                        size="small"
                        className="task-item__info-button"
                    >
                        <InfoOutlinedIcon />
                    </IconButton>
                </div>

                {endDate && (
                    <p className={`task-item__end-date ${isEndDateUrgent ? 'task-item__end-date--urgent' : ''}`}>
                        <EventIcon fontSize="small" /> Дата окончания: {new Date(endDate).toLocaleDateString()}
                    </p>
                )}
            </div>

            <div className="task-item__actions">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={status}
                            onChange={handleChangeStatus}
                            color="primary"
                            className="task-item__checkbox"
                        />
                    }
                    label="Задача выполнена"
                    className="task-item__status-label"
                />

                <DeleteIcon className="task-item__delete-button" onClick={handleDelete} />
            </div>

            <TaskDetail
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                task={{ id, title, description, status, createdAt, endDate }}
            />
        </div>
    );
}