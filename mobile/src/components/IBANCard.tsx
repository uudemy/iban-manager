import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {IBAN} from '../types';
import {formatIBAN, getIBANDisplayName} from '../utils/ibanUtils';
import {Clipboard} from 'react-native';
import Toast from 'react-native-toast-message';

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
  iban: IBAN;
  onEdit: () => void;
  onDelete: () => void;
}

export default function IBANCard({iban, onEdit, onDelete}: Props) {
  const handleCopy = async () => {
    try {
      await Clipboard.setString(iban.iban_number);
      Toast.show({
        type: 'success',
        text1: 'Kopyalandı',
        text2: 'IBAN panoya kopyalandı',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'IBAN kopyalanırken hata oluştu',
      });
    }
  };

  const createdDate = new Date(iban.created_at).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.ibanNumber}>{formatIBAN(iban.iban_number)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
            <Icon name="copy-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Icon name="pencil-outline" size={20} color={Colors.warning} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Icon name="trash-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Banka</Text>
            <Text style={styles.infoValue}>{iban.bank_name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Hesap Sahibi</Text>
            <Text style={styles.infoValue}>{iban.account_holder}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Eklenme Tarihi</Text>
            <Text style={styles.infoValue}>{createdDate}</Text>
          </View>
        </View>

        {iban.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Açıklama</Text>
            <Text style={styles.descriptionText}>{iban.description}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  ibanNumber: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.gray900,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.gray900,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  descriptionLabel: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
});
