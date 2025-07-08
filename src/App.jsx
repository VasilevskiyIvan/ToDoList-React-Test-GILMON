import { useState, useEffect, useCallback } from 'react';
import { TaskItem } from './components/tasks/TaskItem/TaskItem';
import { AddTaskForm } from './components/tasks/AddTaskForm/AddTaskForm';
import { TaskFilters } from './components/tasks/TaskFilters/TaskFilters';
import { Header } from './components/layout/Header';
import { AuthModal } from './components/accounts/AuthModal';
import { Button } from '@mui/material';
import './App.scss';

const LOCAL_STORAGE_ALL_TASKS_KEY = "allUsersTasks";
const LOCAL_STORAGE_CURRENT_USER_KEY = 'currentUser';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const loadTasksForUser = useCallback((username) => {
    const allTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_TASKS_KEY)) || {};
    const userTasks = allTasks[username] || [];
    setTasks(userTasks);
  }, []);

  const saveTasksForCurrentUser = useCallback((currentTasks) => {
    if (loggedInUser) {
      const allTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_TASKS_KEY)) || {};
      allTasks[loggedInUser] = currentTasks;
      localStorage.setItem(LOCAL_STORAGE_ALL_TASKS_KEY, JSON.stringify(allTasks));
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      loadTasksForUser(loggedInUser);
    } else {
      setTasks([]);
    }
  }, [loggedInUser, loadTasksForUser]);

  useEffect(() => {
    saveTasksForCurrentUser(tasks);
  }, [tasks, saveTasksForCurrentUser]);

  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, { ...newTask, id: Date.now(), createdAt: new Date().toISOString(), user: loggedInUser }]);
  };

  const handleDeleteTask = (idTask) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== idTask));
  };

  const handleChangeStatus = (idTask) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === idTask) {
          return { ...task, status: !task.status };
        }
        return task;
      });
    });
  };

  const [filters, setFilters] = useState({
    textFilter: '',
    statusFilter: 'all',
    endDateFilter: '',
    sortOrder: 'none'
  });

  function handleChangeFilters(newFilters) {
    if (newFilters && newFilters.target) {
      const { name, value } = newFilters.target;
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value,
      }));
    } else {
      setFilters(newFilters);
    }
  }

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesText = task.title.toLowerCase().includes(filters.textFilter.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(filters.textFilter.toLowerCase()));

      let matchesStatus = true;
      if (filters.statusFilter === 'true') {
        matchesStatus = task.status === true;
      } else if (filters.statusFilter === 'false') {
        matchesStatus = task.status === false;
      }
      let matchesEndDate = true;
      if (filters.endDateFilter) {
        matchesEndDate = task.endDate === filters.endDateFilter;
      }

      return matchesText && matchesStatus && matchesEndDate;
    })
    .sort((a, b) => {
      if (filters.sortOrder === 'alphabet') {
        return a.title.localeCompare(b.title);
      } else if (filters.sortOrder === 'createdAt') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filters.sortOrder === 'endDateAsc') {
        const dateA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
        return dateA - dateB;
      }
      return 0;
    });

  const handleLoginSuccess = (username) => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, username);
    setLoggedInUser(username);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    setLoggedInUser(null);
    setTasks([]);
    setFilters({
      textFilter: '',
      statusFilter: 'all',
      endDateFilter: '',
      sortOrder: 'none'
    });
  };

  return (
    <div className="app">
      <Header
        isAuthenticated={!!loggedInUser}
        username={loggedInUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
      />

      <main className="app__main-content">
        <h1 className="app__title">Задачи</h1>

        {loggedInUser ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAddTaskModalOpen(true)}
              sx={{ mb: 2 }}
              className="app__add-task-button"
            >
              Добавить новую задачу
            </Button>

            <AddTaskForm
              onAddTask={handleAddTask}
              isOpen={isAddTaskModalOpen}
              onClose={() => setIsAddTaskModalOpen(false)}
              currentUser={loggedInUser}
            />

            <TaskFilters filters={filters} onChangeFilters={handleChangeFilters} />

            <h2 className="app__subtitle">Список текущих задач</h2>

            <div className="app__task-list">
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((taskItem) => (
                  <TaskItem
                    key={taskItem.id}
                    {...taskItem}
                    onDelete={handleDeleteTask}
                    onChange={handleChangeStatus}
                  />
                ))
              ) : (
                <p className="app__empty-message">Задач пока нет или они не соответствуют текущим фильтрам</p>
              )}
            </div>
          </>
        ) : (
          <div className="app__no-user-content">
            <p className="app__no-user-message">Для управления задачами требуется войти</p>
            <p className="app__no-user-message">P.s. вход реализован совершенно формально, только для демонстрации и удобства. Можете зарегистрировать <strong>любой логин и пароль</strong>. Данные о пользователях и их задачах хранятся в localStorage. Совершенно никакой защиты и проверок не предусмотрено, поскольку задание, как я понял, не требовало использовать внешние сервисы для авторизации по типу Firebase или написание бекенда</p>
            <p className="app__no-user-message">В данной реализации были выполнены все обязательные и дополнительные требования к тестовому заданию. Я постарался не сильно мудрить и использовать только то, что фигурировало в ТЗ, однако сделать приложение достаточно приятным и удобным</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsAuthModalOpen(true)}
              className="app__register-button-center"
            >
              Регистрация / Вход
            </Button>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;