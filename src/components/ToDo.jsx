import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ToDo = ({ tasks, filter, markDone, setUpdateData, deleteTask }) => {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.status;
    if (filter === 'completed') return task.status;
    return false;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        title: '',
        description: '',
        completed: false,
        created: Timestamp.now()
      });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='addTodo' name='addTodo'>
      </form>
      {filteredTasks.map((task, index) => (
        <div className="col taskBg" key={task.id}>
          <div className={task.status ? 'done' : ''}>
            <span className="taskNumber">{index + 1}</span>
            <span className="taskText">{task.title}</span>
          </div>
          <div className="iconsWrap">
            <span
              title="Completed / Not Completed"
              onClick={() => markDone(task.id)}
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>
            {!task.status && (
              <span
                title="Edit"
                onClick={() =>
                  setUpdateData({
                    id: task.id,
                    title: task.title,
                    status: task.status ? true : false,
                  })
                }
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
            )}
            <span title="Delete" onClick={() => deleteTask(task.id)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToDo;
