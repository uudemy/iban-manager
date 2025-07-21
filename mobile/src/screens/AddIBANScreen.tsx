import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useIBAN} from '../context/IBANContext';
import {formatIBANInput, cleanIBAN, isValidIBANLength} from '../utils/ibanUtils';
import {ibanService} from '../services/IBANService';

const Colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
};

interface Props {
  navigation: any;
}

export default function AddIBANScreen({navigation}: Props) {
  const {addIBAN, loading} = useIBAN();
  const [formData, setFormData] = useState({
    iban_number: 'TR',
    bank_name: '',
    account_holder: '',
    description: '',
  });
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    isValidating: boolean;
  }>({
    isValid: false,
    message: '',
    isValidating: false,
  });

  useEffect(() => {
    validateIBAN(formData.iban_number);
  }, [formData.iban_number]);

  const validateIBAN = async (iban: string) => {
    const cleanedIBAN = cleanIBAN(iban);
    
    if (cleanedIBAN.length < 4) {
      setValidationStatus({
        isValid: false,
        message: '',
        isValidating: false,
      });
      return;
    }

    if (!isValidIBANLength(cleanedIBAN)) {
      setValidationStatus({
        isValid: false,
        message: 'IBAN 26 karakter olmalıdır',
        isValidating: false,
      });
      return;
    }

    setValidationStatus({
      isValid: false,
      message: '',
      isValidating: true,
    });

    try {
      const result = await ibanService.validateIBAN(cleanedIBAN);
      setValidationStatus({
        isValid: result.is_valid,
        message: result.is_valid ? '✓ Geçerli IBAN' : '✗ Geçersiz IBAN',
        isValidating: false,
      });
    } catch (error) {
      setValidationStatus({
        isValid: false,
        message: '✗ IBAN doğrulanamadı',
        isValidating: false,
      });
    }
  };

  const handleIBANChange = (value: string) => {
    const formatted = formatIBANInput(value);
    setFormData(prev => ({...prev, iban_number: formatted}));
  };

  const handleSubmit = async () => {
    // Validation
    if (!validationStatus.isValid) {
      Alert.alert('Hata', 'Lütfen geçerli bir IBAN girin');
      return;
    }

    if (!formData.bank_name.trim()) {
      Alert.alert('Hata', 'Banka adı boş olamaz');
      return;
    }

    if (!formData.account_holder.trim()) {
      Alert.alert('Hata', 'Hesap sahibi boş olamaz');
      return;
    }

    try {
      await addIBAN({
        iban_number: cleanIBAN(formData.iban_number),
        bank_name: formData.bank_name.trim(),
        account_holder: formData.account_holder.trim(),
        description: formData.description.trim(),
      });

      Toast.show({
        type: 'success',
        text1: 'Başarılı',
        text2: 'IBAN başarıyla eklendi',
      });

      // Reset form
      setFormData({
        iban_number: 'TR',
        bank_name: '',
        account_holder: '',
        description: '',
      });

      // Navigate to home
      navigation.navigate('Home');
    } catch (error) {
      // Error handled by context
    }
  };

  const isFormValid = validationStatus.isValid && 
    formData.bank_name.trim() && 
    formData.account_holder.trim();

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* IBAN Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              IBAN Numarası <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.ibanInput,
                  validationStatus.isValid && styles.validInput,
                  validationStatus.message && !validationStatus.isValid && styles.invalidInput,
                ]}
                value={formData.iban_number}
                onChangeText={handleIBANChange}
                placeholder="TR12 3456 7890 1234 5678 90"
                placeholderTextColor={Colors.gray400}
                autoCapitalize="characters"
                maxLength={31} // 26 characters + 5 spaces
              />
              {validationStatus.isValidating && (
                <View style={styles.validationIcon}>
                  <Icon name="ellipsis-horizontal" size={16} color={Colors.warning} />
                </View>
              )}
              {!validationStatus.isValidating && validationStatus.message && (
                <View style={styles.validationIcon}>
                  <Icon 
                    name={validationStatus.isValid ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={validationStatus.isValid ? Colors.success : Colors.danger} 
                  />
                </View>
              )}
            </View>
            {validationStatus.message && (
              <Text style={[
                styles.validationMessage,
                validationStatus.isValid ? styles.validMessage : styles.invalidMessage
              ]}>
                {validationStatus.message}
              </Text>
            )}
          </View>

          {/* Bank Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Banka Adı <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.bank_name}
              onChangeText={(value) => setFormData(prev => ({...prev, bank_name: value}))}
              placeholder="Örn: Türkiye İş Bankası"
              placeholderTextColor={Colors.gray400}
            />
          </View>

          {/* Account Holder */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Hesap Sahibi <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.account_holder}
              onChangeText={(value) => setFormData(prev => ({...prev, account_holder: value}))}
              placeholder="Örn: Ahmet Yılmaz"
              placeholderTextColor={Colors.gray400}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => setFormData(prev => ({...prev, description: value}))}
              placeholder="İsteğe bağlı açıklama..."
              placeholderTextColor={Colors.gray400}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.disabledButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <View style={styles.buttonContent}>
              <Icon name="ellipsis-horizontal" size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Ekleniyor...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="add-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.buttonText}>IBAN Ekle</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.gray900,
  },
  ibanInput: {
    fontFamily: 'monospace',
    paddingRight: 50,
  },
  validInput: {
    borderColor: Colors.success,
  },
  invalidInput: {
    borderColor: Colors.danger,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  validationIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  validationMessage: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  validMessage: {
    color: Colors.success,
  },
  invalidMessage: {
    color: Colors.danger,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.gray400,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
