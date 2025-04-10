import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot
  } from 'firebase/firestore';
import { db } from './config';
import { Category } from '../types/models';
  
const categoryCollection = collection(db, 'categories');
  
export const createCategory = async (category: Omit<Category, 'id'>) => {
    const docRef = await addDoc(categoryCollection, category);
    return { ...category, id: docRef.id };
};
  
export const getAllCategories = async (): Promise<Category[]> => {
    const snapshot = await getDocs(categoryCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
};
  
export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
    return onSnapshot(categoryCollection, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      callback(categories);
    });
};
  
export const updateCategory = async (id: string, updates: Partial<Category>) => {
    const ref = doc(db, 'categories', id);
    await updateDoc(ref, updates);
};
  
export const deleteCategory = async (id: string) => {
    const ref = doc(db, 'categories', id);
    await deleteDoc(ref);
};
  