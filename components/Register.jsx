import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import styles from '../styles/RegisterStyles'; 
import loginStyles from '../styles/LoginStyles'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { supabase } from '../supabase'; 
import { useNavigation } from '@react-navigation/native'; 
import { Accelerometer } from 'expo-sensors'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); 
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

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju!');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Ako je registracija uspjesna dodaj korisnika u tablicu
      const { user } = data;
      const { error: insertError } = await supabase
        .from('korisnici')
        .insert([{ uid: user.id, email: user.email, username: username }]);

      if (insertError) {
        setError(insertError.message);
      } else {
        console.log('User registered and inserted in database:', user);
        Alert.alert("Uspješno ste se registrirali.");
        navigation.navigate('Login');
      }
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
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <MaterialIcons name="arrow-forward" style={styles.buttonIcon} />
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={loginStyles.footerText}>
          <Text>Već imate račun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={loginStyles.linkText}>Prijavite se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;
