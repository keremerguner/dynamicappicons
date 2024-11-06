import React, {useState, useEffect} from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {changeIcon, getIcon, resetIcon} from 'react-native-change-icon';
import RNRestart from 'react-native-restart';

const {width} = Dimensions.get('window');

// Header komponenti
const Header = ({companyName, companyLogo, onLogout}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={companyLogo}
          style={styles.companyLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>{companyName}</Text>
      </View>
      <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Çıkış</Text>
      </TouchableOpacity>
    </View>
  );
};

// Bilgi kartı komponenti
const InfoCard = ({title, value}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

// Mock kullanıcı verileri güncellendi
const mockUsers = [
  {
    username: 'Bestera@bestera.com',
    password: '123',
    appIcon: 'logo1',
    companyName: 'BestERA Company',
    companyLogo: require('../dynamicappicon/src/assets/images/bestera.png'),
    role: 'Yönetici',
    lastLogin: '06.11.2024 09:30',
  },
  {
    username: 'Tav@tav.com',
    password: '123',
    appIcon: 'logo2',
    companyName: 'Tav Company',
    companyLogo: require('../dynamicappicon/src/assets/images/tav.png'), 
    role: 'Kullanıcı',
    lastLogin: '06.11.2024 10:15',
  },
];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAppIcon, setCurrentAppIcon] = useState('logo1');

  useEffect(() => {
    const getCurrentIcon = async () => {
      const currentIcon = await getIcon();
      setCurrentAppIcon(currentIcon === 'Default' ? 'logo1' : currentIcon);
    };
    getCurrentIcon();
  }, []);

  const handleLogin = () => {
    const user = mockUsers.find(
      user => user.username === username && user.password === password,
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      changeAppIcon(user.appIcon);
    } else {
      Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentUser(null);
  };

  const changeAppIcon = async iconName => {
    try {
      if (iconName === 'logo1' && Platform.OS === 'ios') {
        await resetIcon();
      } else {
        await changeIcon(iconName).then(() => {
          if (Platform.OS === 'ios') {
            return;
          }
          RNRestart.Restart();
        });
      }
      setCurrentAppIcon(iconName);
    } catch (error) {
      console.log('error', error);
    }
  };

  // Login ekranı
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginTitle}>Hoş Geldiniz</Text>
            <Text style={styles.loginSubtitle}>
              Devam etmek için giriş yapın
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonLabel}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ana ekran
  return (
    <SafeAreaView style={styles.container}>
      <Header
        companyName={currentUser?.companyName}
        companyLogo={currentUser?.companyLogo}
        onLogout={handleLogout}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hoş geldiniz,</Text>
          <Text style={styles.usernameText}>{currentUser?.username}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <InfoCard title="Kullanıcı Rolü" value={currentUser?.role} />
          <InfoCard title="Son Giriş" value={currentUser?.lastLogin} />
          <InfoCard title="Aktif İkon" value={currentAppIcon} />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Ayarlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Bildirimler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#A78FD7',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    width: width / 2 - 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: width / 3 - 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: '#A78FD7',
    fontWeight: '600',
  },
  // Login screen styles
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loginHeader: {
    marginBottom: 30,
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    height: 50,
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#A78FD7',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
