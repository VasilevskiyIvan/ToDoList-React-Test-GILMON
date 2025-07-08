import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import './Header.scss';

export function Header({ isAuthenticated, username, onLoginClick, onLogoutClick }) {
    return (
        <AppBar position="static" className="app-header">
            <Toolbar className="app-header__toolbar">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="app-header__title">
                    Планировщик задач (Решение тестового, Василевский И.В.)
                </Typography>
                <Box className="app-header__auth-controls">
                    {isAuthenticated ? (
                        <>
                            <Typography variant="body1" className="app-header__username">
                                Пользователь: {username}
                            </Typography>
                            <Button color="inherit" onClick={onLogoutClick} className="app-header__button">
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={onLoginClick} className="app-header__button">
                            Войти / Зарегистрироваться
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}