import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IBAN} from '../types';
import {ibanService} from '../services/IBANService';

interface IBANState {
  ibans: IBAN[];
  loading: boolean;
  error: string | null;
}

interface IBANContextType extends IBANState {
  loadIBANs: () => Promise<void>;
  addIBAN: (iban: Omit<IBAN, 'id' | 'created_at'>) => Promise<void>;
  updateIBAN: (id: number, iban: Partial<IBAN>) => Promise<void>;
  deleteIBAN: (id: number) => Promise<void>;
  clearError: () => void;
}

type IBANAction =
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_IBANS'; payload: IBAN[]}
  | {type: 'ADD_IBAN'; payload: IBAN}
  | {type: 'UPDATE_IBAN'; payload: IBAN}
  | {type: 'DELETE_IBAN'; payload: number}
  | {type: 'SET_ERROR'; payload: string}
  | {type: 'CLEAR_ERROR'};

const initialState: IBANState = {
  ibans: [],
  loading: false,
  error: null,
};

function ibanReducer(state: IBANState, action: IBANAction): IBANState {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, loading: action.payload};
    case 'SET_IBANS':
      return {...state, ibans: action.payload, loading: false, error: null};
    case 'ADD_IBAN':
      return {...state, ibans: [action.payload, ...state.ibans], loading: false};
    case 'UPDATE_IBAN':
      return {
        ...state,
        ibans: state.ibans.map(iban => 
          iban.id === action.payload.id ? action.payload : iban
        ),
        loading: false,
      };
    case 'DELETE_IBAN':
      return {
        ...state,
        ibans: state.ibans.filter(iban => iban.id !== action.payload),
        loading: false,
      };
    case 'SET_ERROR':
      return {...state, error: action.payload, loading: false};
    case 'CLEAR_ERROR':
      return {...state, error: null};
    default:
      return state;
  }
}

const IBANContext = createContext<IBANContextType | undefined>(undefined);

export function IBANProvider({children}: {children: React.ReactNode}) {
  const [state, dispatch] = useReducer(ibanReducer, initialState);

  // Load cached IBANs on app start
  useEffect(() => {
    loadCachedIBANs();
    loadIBANs();
  }, []);

  const loadCachedIBANs = async () => {
    try {
      const cached = await AsyncStorage.getItem('cached_ibans');
      if (cached) {
        const ibans = JSON.parse(cached);
        dispatch({type: 'SET_IBANS', payload: ibans});
      }
    } catch (error) {
      console.error('Error loading cached IBANs:', error);
    }
  };

  const cacheIBANs = async (ibans: IBAN[]) => {
    try {
      await AsyncStorage.setItem('cached_ibans', JSON.stringify(ibans));
    } catch (error) {
      console.error('Error caching IBANs:', error);
    }
  };

  const loadIBANs = async () => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const ibans = await ibanService.getAllIBANs();
      dispatch({type: 'SET_IBANS', payload: ibans});
      await cacheIBANs(ibans);
    } catch (error: any) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      console.error('Error loading IBANs:', error);
    }
  };

  const addIBAN = async (ibanData: Omit<IBAN, 'id' | 'created_at'>) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const newIBAN = await ibanService.createIBAN(ibanData);
      dispatch({type: 'ADD_IBAN', payload: newIBAN});
      await cacheIBANs([newIBAN, ...state.ibans]);
    } catch (error: any) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      throw error;
    }
  };

  const updateIBAN = async (id: number, ibanData: Partial<IBAN>) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const updatedIBAN = await ibanService.updateIBAN(id, ibanData);
      dispatch({type: 'UPDATE_IBAN', payload: updatedIBAN});
      const updatedIBANs = state.ibans.map(iban => 
        iban.id === id ? updatedIBAN : iban
      );
      await cacheIBANs(updatedIBANs);
    } catch (error: any) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      throw error;
    }
  };

  const deleteIBAN = async (id: number) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      await ibanService.deleteIBAN(id);
      dispatch({type: 'DELETE_IBAN', payload: id});
      const filteredIBANs = state.ibans.filter(iban => iban.id !== id);
      await cacheIBANs(filteredIBANs);
    } catch (error: any) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      throw error;
    }
  };

  const clearError = () => {
    dispatch({type: 'CLEAR_ERROR'});
  };

  const value: IBANContextType = {
    ...state,
    loadIBANs,
    addIBAN,
    updateIBAN,
    deleteIBAN,
    clearError,
  };

  return <IBANContext.Provider value={value}>{children}</IBANContext.Provider>;
}

export function useIBAN() {
  const context = useContext(IBANContext);
  if (context === undefined) {
    throw new Error('useIBAN must be used within an IBANProvider');
  }
  return context;
}
