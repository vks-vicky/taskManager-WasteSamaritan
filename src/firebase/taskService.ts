import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { Task } from '../types/models';

const taskCollection = collection(db, 'tasks');

// Create a task
export const createTask = async (task: Omit<Task, 'id'>) => {
    const docRef = await addDoc(taskCollection, task);
    return { ...task, id: docRef.id };
};

// Read all tasks
export const getAllTasks = async (): Promise<Task[]> => {
    const snapshot = await getDocs(taskCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
  })) as Task[];
};

// Real-time subscription
export const subscribeToTasks = (callback: (tasks: Task[]) => void) => {
    return onSnapshot(taskCollection, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
      })) as Task[];
      callback(tasks);
    });
};


// Update a task
export const updateTask = async (id: string, updates: Partial<Task>) => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, updates);
};
  
// Delete a task
export const deleteTask = async (id: string) => {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
};