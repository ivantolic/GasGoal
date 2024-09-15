import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/LoginStyles';
import { Accelerometer } from 'expo-sensors';
import { supabase } from '../supabase';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [goalColor, setGoalColor] = useState('green');
  const navigation = useNavigation();

  // Postavljanje senzora
  useEffect(() => {
    let subscription;
    const subscribeToAccelerometer = () => {
      subscription = Accelerometer.addListener((data) => {
        handleAccelerometerChange(data);
      });
    };
    subscribeToAccelerometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Funkcija koja se aktivira na promjene u Accelerometeru
  const handleAccelerometerChange = ({ x }) => {
    const color = getColorBasedOnTilt(x);
    setGoalColor(color);
  };

  // Funkcija za promjenu boje
  const getColorBasedOnTilt = (x) => {
    if (x > 0.5) return 'red';
    if (x < -0.5) return 'blue';
    return 'green'; // Defaultna boja
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      Alert.alert('Uspješno ste se prijavili.');
      navigation.navigate('TabNavigator');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Gas</Text>
          <Text style={[styles.titleTextGreen, { color: goalColor }]}>Goal</Text>
        </View>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <MaterialIcons name="arrow-forward" style={styles.buttonIcon} />
        </TouchableOpacity>

        {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}

        <View style={styles.footerText}>
          <Text>Nemate račun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Kreirajte ga</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
