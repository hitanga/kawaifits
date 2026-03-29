import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Product, User, Order } from '../types';

export const FirebaseService = {
  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    const path = 'products';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  subscribeToProducts: (callback: (products: Product[]) => void) => {
    const path = 'products';
    return onSnapshot(collection(db, path), (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      callback(products);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<string> => {
    const path = 'products';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...product,
        images: product.images || [product.image]
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<void> => {
    const path = `products/${id}`;
    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // USERS
  getUserProfile: async (uid: string): Promise<User | null> => {
    const path = `users/${uid}`;
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      return docSnap.exists() ? (docSnap.data() as User) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  createUserProfile: async (user: User): Promise<void> => {
    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, 'users', user.uid), user);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // ORDERS
  createOrder: async (order: Omit<Order, 'id'>): Promise<string> => {
    const path = 'orders';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...order,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  getOrdersByUser: async (userUid: string): Promise<Order[]> => {
    const path = 'orders';
    try {
      const q = query(collection(db, path), where('userUid', '==', userUid), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Order));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};
