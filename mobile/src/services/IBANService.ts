import axios from 'axios';
import {IBAN, APIResponse, IBANValidationResponse} from '../types';

const API_BASE_URL = 'https://web-production-e9d13.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    if (error.response?.status >= 500) {
      throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    } else if (error.response?.status === 404) {
      throw new Error('İstenen kaynak bulunamadı.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.error || 'Geçersiz istek.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('İstek zaman aşımına uğradı.');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Ağ bağlantısı hatası.');
    }
    throw new Error('Bilinmeyen bir hata oluştu.');
  }
);

export const ibanService = {
  async getAllIBANs(): Promise<IBAN[]> {
    const response = await api.get<APIResponse<IBAN[]>>('/ibans');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'IBAN\'lar yüklenemedi');
  },

  async createIBAN(ibanData: Omit<IBAN, 'id' | 'created_at'>): Promise<IBAN> {
    const response = await api.post<APIResponse<IBAN>>('/ibans', ibanData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'IBAN eklenemedi');
  },

  async updateIBAN(id: number, ibanData: Partial<IBAN>): Promise<IBAN> {
    const response = await api.put<APIResponse<IBAN>>(`/ibans/${id}`, ibanData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'IBAN güncellenemedi');
  },

  async deleteIBAN(id: number): Promise<void> {
    const response = await api.delete<APIResponse<void>>(`/ibans/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'IBAN silinemedi');
    }
  },

  async validateIBAN(ibanNumber: string): Promise<IBANValidationResponse> {
    const response = await api.post<APIResponse<IBANValidationResponse>>('/ibans/validate', {
      iban_number: ibanNumber,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'IBAN doğrulanamadı');
  },
};
