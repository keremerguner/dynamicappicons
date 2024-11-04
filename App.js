import React, {useState, useEffect} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {changeIcon, getIcon, resetIcon} from 'react-native-change-icon';
import RNRestart from 'react-native-restart';

// Mock kullanıcı verileri
const mockUsers = [
  {
    username: "user1",
    password: "pass1",
    appIcon: "logo1"
  },
  {
    username: "user2",
    password: "pass2",
    appIcon: "logo2"
  }
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
      user => user.username === username && user.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      changeAppIcon(user.appIcon);
    } else {
      Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı!');
    }
  };

  const changeAppIcon = async (iconName) => {
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
          <Text style={styles.title}>Giriş Yap</Text>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}>
            <Text style={styles.buttonLabel}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Ana ekran
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hoş geldin, {currentUser?.username}</Text>
      <Text style={styles.subtitle}>Aktif ikon: {currentAppIcon}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsLoggedIn(false);
          setUsername('');
          setPassword('');
          setCurrentUser(null);
        }}>
        <Text style={styles.buttonLabel}>Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    marginHorizontal: 12,
  },
  subtitle: {
    fontSize: 16,
    marginHorizontal: 12,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#A78FD7',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A78FD7',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 6,
    marginTop: 10,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;