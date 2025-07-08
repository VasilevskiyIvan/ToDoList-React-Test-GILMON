import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './AuthModal.scss';

const LOCAL_STORAGE_USERS_KEY = 'registeredUsers';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'currentUser';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageSeverity, setMessageSeverity] = useState('info');

    useEffect(() => {
        if (isOpen) {
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setMessage('');
            setMessageSeverity('info');
        }
    }, [isOpen, isRegisterMode]);

    const handleAuth = (e) => {
        e.preventDefault();
        let users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || {};

        if (isRegisterMode) {
            if (!username || !password || !confirmPassword) {
                setMessage('Заполните все поля');
                setMessageSeverity('error');
                return;
            }
            if (password !== confirmPassword) {
                setMessage('Пароли не совпадают');
                setMessageSeverity('error');
                return;
            }
            if (users[username]) {
                setMessage('Пользователь с таким именем уже существует');
                setMessageSeverity('error');
                return;
            }
            users[username] = password;
            localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
            setMessage('Регистрация прошла успешно! Можете войти');
            setMessageSeverity('success');
            setIsRegisterMode(false);
        } else {
            if (!username || !password) {
                setMessage('Пожалуйста, введите имя пользователя и пароль');
                setMessageSeverity('error');
                return;
            }
            if (users[username] === password) {
                localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, username);
                setMessage('Вход выполнен успешно!');
                setMessageSeverity('success');
                if (onLoginSuccess) {
                    onLoginSuccess(username);
                }
                setTimeout(() => onClose(), 1000);
            } else {
                setMessage('Неверное имя пользователя или пароль.');
                setMessageSeverity('error');
            }
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="auth-modal-title"
            aria-describedby="auth-modal-description"
        >
            <Box component="form" onSubmit={handleAuth} className="auth-modal__content">
                <div className="auth-modal__header">
                    <Typography id="auth-modal-title" variant="h6" component="h2">
                        {isRegisterMode ? 'Регистрация' : 'Вход'}
                    </Typography>
                    <IconButton aria-label="close" onClick={onClose} className="auth-modal__close-button">
                        <CloseIcon />
                    </IconButton>
                </div>

                <TextField
                    label="Имя пользователя"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    className="auth-modal__text-field"
                />
                <TextField
                    label="Пароль"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    className="auth-modal__text-field"
                />
                {isRegisterMode && (
                    <TextField
                        label="Повторите пароль"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        className="auth-modal__text-field"
                    />
                )}

                {message && (
                    <Alert severity={messageSeverity} className="auth-modal__alert">
                        {message}
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="auth-modal__submit-button"
                >
                    {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
                </Button>

                <Button
                    variant="text"
                    color="primary"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="auth-modal__toggle-button"
                >
                    {isRegisterMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </Button>
            </Box>
        </Modal>
    );
}