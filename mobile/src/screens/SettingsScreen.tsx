import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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

export default function SettingsScreen({navigation}: Props) {
  const handleAbout = () => {
    Alert.alert(
      'IBAN Manager',
      'Version 1.0.0\n\nIBAN numaralarınızı güvenli bir şekilde saklayın ve yönetin.\n\nGeliştirici: IBAN Manager Team',
      [{text: 'Tamam', style: 'default'}]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Gizlilik',
      'IBAN verileriniz sadece cihazınızda ve güvenli sunucularda saklanır. Verileriniz üçüncü taraflarla paylaşılmaz.',
      [{text: 'Tamam', style: 'default'}]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Destek',
      'Sorunlarınız için lütfen uygulama mağazasından bizimle iletişime geçin.',
      [{text: 'Tamam', style: 'default'}]
    );
  };

  const settingsItems = [
    {
      title: 'Hakkında',
      icon: 'information-circle-outline',
      onPress: handleAbout,
      color: Colors.primary,
    },
    {
      title: 'Gizlilik',
      icon: 'shield-checkmark-outline',
      onPress: handlePrivacy,
      color: Colors.success,
    },
    {
      title: 'Destek',
      icon: 'help-circle-outline',
      onPress: handleSupport,
      color: Colors.warning,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Icon name="settings" size={48} color={Colors.primary} />
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <Text style={styles.headerSubtitle}>
          Uygulama ayarları ve bilgileri
        </Text>
      </View>

      <View style={styles.section}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingItem,
              index === settingsItems.length - 1 && styles.lastItem,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.settingContent}>
              <View style={[styles.iconContainer, {backgroundColor: `${item.color}15`}]}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.settingTitle}>{item.title}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>IBAN Manager v1.0.0</Text>
        <Text style={styles.footerSubtext}>
          IBAN'larınızı güvenle yönetin
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.gray500,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.gray900,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray600,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.gray400,
    textAlign: 'center',
  },
});
