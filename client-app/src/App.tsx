import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AnalyticsPage from './components/AnalyticsPage';
import LinkHistoryPage from './components/LinkHistoryPage';
import NavBar from './components/NavBar';

const App: React.FC = () => {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact component={MainPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/analytics" component={AnalyticsPage} />
                <Route path="/linkhistory" component={LinkHistoryPage} />
            </Switch>
        </Router>
    );
};

export default App;
