import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useIBAN} from '../context/IBANContext';
import {IBAN} from '../types';
import {formatIBAN, getIBANDisplayName} from '../utils/ibanUtils';
import IBANCard from '../components/IBANCard';

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

export default function HomeScreen({navigation}: Props) {
  const {ibans, loading, error, loadIBANs, deleteIBAN, clearError} = useIBAN();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIBANs, setFilteredIBANs] = useState<IBAN[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: error,
      });
      clearError();
    }
  }, [error]);

  useEffect(() => {
    filterIBANs();
  }, [ibans, searchQuery]);

  const filterIBANs = () => {
    if (!searchQuery.trim()) {
      setFilteredIBANs(ibans);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = ibans.filter(
      iban =>
        iban.iban_number.toLowerCase().includes(query) ||
        iban.bank_name.toLowerCase().includes(query) ||
        iban.account_holder.toLowerCase().includes(query) ||
        (iban.description && iban.description.toLowerCase().includes(query))
    );
    setFilteredIBANs(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadIBANs();
    } catch (error) {
      // Error handled by context
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (iban: IBAN) => {
    navigation.navigate('EditIBAN', {iban});
  };

  const handleDelete = (iban: IBAN) => {
    Alert.alert(
      'IBAN Sil',
      `${formatIBAN(iban.iban_number)} numaralı IBAN'ı silmek istediğinizden emin misiniz?`,
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteIBAN(iban.id);
              Toast.show({
                type: 'success',
                text1: 'Başarılı',
                text2: 'IBAN başarıyla silindi',
              });
            } catch (error) {
              // Error handled by context
            }
          },
        },
      ]
    );
  };

  const renderIBANItem = ({item}: {item: IBAN}) => (
    <IBANCard
      iban={item}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="card-outline" size={64} color={Colors.gray400} />
      <Text style={styles.emptyTitle}>Henüz IBAN eklenmemiş</Text>
      <Text style={styles.emptySubtitle}>
        İlk IBAN'ınızı eklemek için alt menüdeki + butonunu kullanın
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color={Colors.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="IBAN, banka veya hesap sahibi ara..."
          placeholderTextColor={Colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredIBANs.length} IBAN {searchQuery ? 'bulundu' : 'kayıtlı'}
        </Text>
      </View>
    </View>
  );

  if (loading && ibans.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>IBAN'lar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredIBANs}
        renderItem={renderIBANItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredIBANs.length === 0 ? styles.emptyListContainer : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray600,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.gray900,
  },
  clearButton: {
    padding: 4,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: Colors.gray600,
    fontWeight: '500',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray700,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
});
