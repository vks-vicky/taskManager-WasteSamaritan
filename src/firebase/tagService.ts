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
import { Tag } from '../types/models';
  
const tagCollection = collection(db, 'tags');
  
export const createTag = async (tag: Omit<Tag, 'id'>) => {
    const docRef = await addDoc(tagCollection, tag);
    return { ...tag, id: docRef.id };
};
  
export const getAllTags = async (): Promise<Tag[]> => {
    const snapshot = await getDocs(tagCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tag[];
};
  
export const subscribeToTags = (callback: (tags: Tag[]) => void) => {
    return onSnapshot(tagCollection, (snapshot) => {
      const tags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tag[];
      callback(tags);
    });
};
  
export const updateTag = async (id: string, updates: Partial<Tag>) => {
    const ref = doc(db, 'tags', id);
    await updateDoc(ref, updates);
};
  
export const deleteTag = async (id: string) => {
    const ref = doc(db, 'tags', id);
    await deleteDoc(ref);
};
  