import React, { useState, useEffect } from 'react';
import { auth } from './firebase.js';
import AddTaskForm from './components/AddTaskForm.jsx';
import UpdateForm from './components/UpdateForm.jsx';
import ToDo from './components/ToDo.jsx';
import FullName from './components/FullName.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import SignIn from './components/auth/login';
import SignUp from "./components/auth/register";
import AuthDetails from "./components/auth/authdetails";
import UserProfile from './components/UserProfile';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [toDo, setToDo] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState('');
  const [fullName, setFullName] = useState('Adyatama Mahabarata');
  const [number, setNumber] = useState('2602158626');
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const addTask = () => {
    if (newTask) {
      let num = toDo.length + 1;
      let newEntry = { id: num, title: newTask, status: false };
      setToDo([...toDo, newEntry]);
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    let newTasks = toDo.filter((task) => task.id !== id);
    setToDo(newTasks);
  };

  const markDone = (id) => {
    let newTask = toDo.map((task) => {
      if (task.id === id) {
        return { ...task, status: !task.status };
      }
      return task;
    });
    setToDo(newTask);
  };

  const cancelUpdate = () => {
    setUpdateData('');
  };

  const changeTask = (e) => {
    let newEntry = {
      id: updateData.id,
      title: e.target.value,
      status: updateData.status ? true : false,
    };
    setUpdateData(newEntry);
  };

  const updateTask = () => {
    let filterRecords = [...toDo].filter((task) => task.id !== updateData.id);
    let updatedObject = [...filterRecords, updateData];
    setToDo(updatedObject);
    setUpdateData('');
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const handleProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="container App">
      <br />
      <br />
      <h2>To Do List</h2>
      <br />
      <br />

      {isAuthenticated ? (
        <>
          <FullName fullName={fullName} number={number} />
          {updateData && updateData ? (
            <UpdateForm
              updateData={updateData}
              changeTask={changeTask}
              updateTask={updateTask}
              cancelUpdate={cancelUpdate}
            />
          ) : (
            <AddTaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
          )}

          <TaskFilter filter={filter} setFilter={setFilter} />

          {toDo && toDo.length ? (
            <ToDo tasks={toDo} filter={filter} markDone={markDone} setUpdateData={setUpdateData} deleteTask={deleteTask} />
          ) : (
            'No Tasks...'
          )}
        </>
      ) : (
        <>
          <SignIn setIsAuthenticated={setIsAuthenticated} />
          <SignUp />
          <AuthDetails />
        </>
      )}

      {/* User Profile Component */}
      {window.location.pathname === '/profile' && <UserProfile currentUser={currentUser} />}
      
      {currentUser && (
  <div>
    <h2>User Profile</h2>
    <p>Logged in as: {currentUser.email}</p>
    <p>UID: {currentUser.uid}</p>
    <p>Date Created: {new Date(currentUser.metadata.creationTime).toLocaleString()}</p>

    <button onClick={handleLogout}>Logout</button>
  </div>
)}

    </div>
    
  );
}

export default App;
