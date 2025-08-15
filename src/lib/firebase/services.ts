import { db, storage } from './config';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Tipos
export interface User {
  id?: string;
  email: string;
  name?: string;
  role: 'admin' | 'professor';
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Course {
  id?: string;
  name: string;
  description?: string;
  type: 'graduacao' | 'pos_graduacao' | 'extensao' | 'ead' | 'institucional';
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Discipline {
  id?: string;
  name: string;
  code: string;
  workload: number;
  courseType: 'graduacao' | 'pos_graduacao' | 'extensao' | 'ead' | 'institucional';
  courseId: string;
  hasEADHours: boolean;
  hasPracticalHours: boolean;
  hasIntegratedProject: boolean;
  hasPresentialExam: boolean;
  isLicenciatura: boolean;
  hasComplementaryEval: boolean;
  hasExtensionCurriculum: boolean;
  needsPresentialTool: boolean;
  status: 'criada' | 'atribuida' | 'em_progresso' | 'concluida' | 'atrasada';
  deliveryDate?: Timestamp;
  lastAccess?: Timestamp;
  createdById: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Session {
  id?: string;
  disciplineId: string;
  name: string;
  type: 'apresentacao' | 'roteiro' | 'avaliacao';
  order: number;
  isCompleted: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Serviços de Usuários
export const userService = {
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'users'), {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getById(id: string) {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  async getByEmail(email: string) {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  },

  async update(id: string, data: Partial<User>) {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async getAll() {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }
};

// Serviços de Cursos
export const courseService = {
  async create(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...course,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getById(id: string) {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
  },

  async update(id: string, data: Partial<Course>) {
    const docRef = doc(db, 'courses', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async getAll() {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }
};

// Serviços de Disciplinas
export const disciplineService = {
  async create(discipline: Omit<Discipline, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'disciplines'), {
      ...discipline,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getById(id: string) {
    const docRef = doc(db, 'disciplines', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Discipline;
    }
    return null;
  },

  async update(id: string, data: Partial<Discipline>) {
    const docRef = doc(db, 'disciplines', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async getAll() {
    const q = query(collection(db, 'disciplines'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discipline));
  },

  async getByProfessor(professorId: string) {
    const q = query(
      collection(db, 'disciplines'), 
      where('createdById', '==', professorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discipline));
  }
};

// Serviços de Sessões
export const sessionService = {
  async create(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...session,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getByDiscipline(disciplineId: string) {
    const q = query(
      collection(db, 'sessions'), 
      where('disciplineId', '==', disciplineId),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  },

  async update(id: string, data: Partial<Session>) {
    const docRef = doc(db, 'sessions', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Serviços de Upload de Arquivos
export const storageService = {
  async uploadFile(file: File, path: string) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return {
      path: snapshot.ref.fullPath,
      url: downloadURL,
      name: file.name,
      size: file.size,
      type: file.type
    };
  },

  async deleteFile(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  getFileUrl(path: string) {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }
};

// Serviço de Templates
export interface Template {
  id?: string;
  name: string;
  sessionName: string;
  numberingType: 'numbers' | 'letters' | 'roman';
  minAuthorMaterials: number;
  minStudyActivities: number;
  minEvaluations: number;
  quizConfig: {
    minQuestions: number;
    minAlternatives: number;
  };
  essayConfig: {
    minQuestions: number;
    mandatoryFeedback: boolean;
  };
  mcConfig: {
    minQuestions: number;
    minAlternatives: number;
    mandatoryFeedback: boolean;
  };
  isActive: boolean;
  isDefault: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const templateService = {
  async create(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, 'templates'), {
      ...template,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getById(id: string) {
    const docRef = doc(db, 'templates', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Template;
    }
    return null;
  },

  async getAll() {
    const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
  },

  async getDefault() {
    const q = query(collection(db, 'templates'), where('isDefault', '==', true));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Template;
    }
    return null;
  },

  async update(id: string, data: Partial<Template>) {
    const docRef = doc(db, 'templates', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};