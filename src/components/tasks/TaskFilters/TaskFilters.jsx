import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import './TaskFilters.scss';

export function TaskFilters(props) {

    const handleDeleteFilters = () => {
        props.onChangeFilters({
            textFilter: '',
            statusFilter: 'all',
            endDateFilter: '',
            sortOrder: 'none'
        })
    }
    return (
        <section className="task-filters">
            <TextField
                className="task-filters__text-field"
                name="textFilter"
                onChange={props.onChangeFilters}
                label='Поиск по тексту'
                placeholder='Текст для поиска'
                value={props.filters.textFilter}
            />

            <FormControl fullWidth className="task-filters__form-control">
                <InputLabel id="status-select-label">Статус</InputLabel>
                <Select
                    labelId="status-select-label"
                    id="status-select"
                    name="statusFilter"
                    value={props.filters.statusFilter}
                    label="Статус"
                    onChange={props.onChangeFilters}
                >
                    <MenuItem value='all'>Все</MenuItem>
                    <MenuItem value='true'>Выполненные</MenuItem>
                    <MenuItem value='false'>Не выполненные</MenuItem>
                </Select>
            </FormControl>

            <TextField
                className="task-filters__text-field"
                label="Дата окончания"
                type="date"
                name="endDateFilter"
                value={props.filters.endDateFilter}
                onChange={props.onChangeFilters}
                InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth className="task-filters__form-control">
                <InputLabel id="sort-select-label">Сортировка</InputLabel>
                <Select
                    labelId="sort-select-label"
                    id="sort-select"
                    name="sortOrder"
                    value={props.filters.sortOrder}
                    label="Сортировка"
                    onChange={props.onChangeFilters}
                >
                    <MenuItem value='none'>Без сортировки</MenuItem>
                    <MenuItem value='alphabet'>По алфавиту (названию)</MenuItem>
                    <MenuItem value='createdAt'>По дате добавления</MenuItem>
                    <MenuItem value='endDateAsc'>По дате окончания (ближайшие)</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="outlined"
                color="secondary"
                onClick={handleDeleteFilters}
                className="task-filters__reset-button"
            >
                Сбросить фильтры
            </Button>
        </section>
    );
}