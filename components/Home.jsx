import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../supabase';
import styles from '../styles/HomeStyles';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]); 
  const [fuelAmount, setFuelAmount] = useState(''); 
  const [fuelPrice, setFuelPrice] = useState(''); 
  const [lastTrip, setLastTrip] = useState(''); 
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Odabrano vozilo
  const [expandedVehicles, setExpandedVehicles] = useState([]); // Prosirena vozila za accordion
  const [spendingGoal, setSpendingGoal] = useState(''); // Unos cilja potrosnje
  const [alertedVehicles, setAlertedVehicles] = useState([]); // Pracenje za vozila koja smo vec primila notifikaciju
  const route = useRoute(); 

  // Dohvati sva vozila korisnika
  const fetchVehicles = async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Greška prilikom dohvaćanja sesije:', sessionError);
      return;
    }

    const { data, error } = await supabase
      .from('vozila')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Greška prilikom dohvaćanja vozila:', error);
    } else if (data.length > 0) {
      setVehicles(data); // Postavi vozila ako postoje
      setSelectedVehicle(data[0].id); // Postavi prvo vozilo kao zadano
    } else {
      setVehicles([]); // Ako nema vozila, ocisti listu
      setSelectedVehicle(null);
      console.log('Nema vozila za prikazati.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVehicles(); // Osvjezi vozila kad se ekran vrati u fokus
    }, [])
  );
  

  // Funkcija za prosirivanje/sklapanje accordiona za vozilo
  const toggleAccordion = (vehicleId) => {
    setExpandedVehicles((prevState) =>
      prevState.includes(vehicleId)
        ? prevState.filter((id) => id !== vehicleId)
        : [...prevState, vehicleId]
    );
  };

  // Funkcija za odjavu
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigation.replace('Login'); 
    } else {
      Alert.alert('Greška prilikom odjave', error.message);
    }
  };

  // Funkcija za azuriranje cilja potrosnje unutar accordiona
  const handleSaveSpendingGoal = async (vehicleId) => {
    try {
      if (!spendingGoal) {
        Alert.alert('Molimo unesite cilj potrošnje.');
        return;
      }

      const { error } = await supabase
        .from('vozila')
        .update({ spending_goal: parseFloat(spendingGoal) })
        .eq('id', vehicleId);

      if (error) {
        console.error('Greška prilikom ažuriranja cilja:', error);
        Alert.alert('Greška prilikom spremanja cilja potrošnje.');
      } else {
        Alert.alert('Cilj potrošnje uspješno spremljen!');
        fetchVehicles(); // Osvježi vozila
        setAlertedVehicles(alertedVehicles.filter((id) => id !== vehicleId)); // Resetiraj notifikaciju za vozilo
      }
    } catch (error) {
      console.error('Neočekivana greška prilikom spremanja cilja:', error);
    }
  };

  // Provjera ukupne potrosnje
  const checkSpendingGoal = (totalCost, vehicle) => {
    if (vehicle.spending_goal && totalCost > vehicle.spending_goal && !alertedVehicles.includes(vehicle.id)) {
      Alert.alert(
        'Upozorenje!',
        `Premašili ste ciljanu potrošnju za ${vehicle.name}.`
      );
      setAlertedVehicles([...alertedVehicles, vehicle.id]); // Dodaj vozilo u popis notifikacija
    }
  };

  const handleAddFuelData = async (vehicleId) => {
    try {
      if (!fuelAmount && !fuelPrice && !lastTrip) {
        Alert.alert('Molimo unesite barem jedno polje za ažuriranje.');
        return;
      }

      // Zamjena zareza i tocke prije pretvaranja u broj
      const correctedFuelAmount = fuelAmount.replace(',', '.');
      const correctedFuelPrice = fuelPrice.replace(',', '.');

      // Azuriraj kilometre samo ako je unesen prijedeni put
      if (lastTrip) {
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vozila')
          .select('kilometers')
          .eq('id', vehicleId)
          .single();

        if (vehicleError) {
          console.error('Greška prilikom dohvaćanja vozila:', vehicleError);
          Alert.alert('Greška prilikom dohvaćanja podataka o vozilu.');
          return;
        }

        const updatedKilometers = vehicleData.kilometers + parseFloat(lastTrip);

        const { error: updateError } = await supabase
          .from('vozila')
          .update({ kilometers: updatedKilometers })
          .eq('id', vehicleId);

        if (updateError) {
          console.error('Greška prilikom ažuriranja kilometara:', updateError);
          Alert.alert('Greška prilikom ažuriranja podataka o vozilu.');
          return;
        }

        fetchVehicles(); // Osvježi prikaz vozila
        Alert.alert('Kilometri uspješno ažurirani!');
        setLastTrip('');
      }

      // Unesi podatke o gorivu samo ako su oba polja unesena
      if (fuelAmount && fuelPrice) {
        let fuelData = {
          vehicle_id: vehicleId,
          fuel_amount: parseFloat(correctedFuelAmount),
          fuel_price: parseFloat(correctedFuelPrice),
          cost: parseFloat((parseFloat(correctedFuelAmount) * parseFloat(correctedFuelPrice)).toFixed(2)),
          date: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('gorivo').insert([fuelData]);

        if (error) {
          Alert.alert('Greška prilikom unosa podataka o gorivu', error.message);
        } else {
          Alert.alert('Podaci o gorivu uspješno uneseni!');
          setFuelAmount('');
          setFuelPrice('');
        }
      }
    } catch (error) {
      console.error('Neočekivana greška prilikom unosa podataka:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Gas</Text>
          <Text style={styles.titleTextGreen}>Goal</Text>
        </View>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Odjava</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.statsText}>Unos podataka o gorivu i prijedenom putu:</Text>

        <Text style={styles.label}>Odaberite vozilo:</Text>
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
          style={styles.picker}
        >
          {vehicles.map((vehicle) => (
            <Picker.Item key={vehicle.id} label={vehicle.name} value={vehicle.id} />
          ))}
        </Picker>

        <TextInput
          placeholder="Količina goriva (L)"
          value={fuelAmount}
          onChangeText={setFuelAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Cijena goriva (€/L)"
          value={fuelPrice}
          onChangeText={setFuelPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Posljednji prijedeni put (km)"
          value={lastTrip}
          onChangeText={setLastTrip}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button
          title={`Unesi podatke za ${selectedVehicle ? (vehicles.find(v => v.id === selectedVehicle)?.name || '') : ''}`}
          onPress={() => handleAddFuelData(selectedVehicle)}
        />
      </View>

      {vehicles.length > 0 ? (
        vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.infoBox}>
            {/* Naslov vozila */}
            <TouchableOpacity onPress={() => toggleAccordion(vehicle.id)}>
              <Text style={styles.statsTitle}>{vehicle.name}</Text>
            </TouchableOpacity>

            {expandedVehicles.includes(vehicle.id) && (
              <View>
                <FuelHistory vehicleId={vehicle.id} checkSpendingGoal={checkSpendingGoal} vehicle={vehicle} />

                <Text style={styles.statsText}>Ciljani trošak: {vehicle.spending_goal || 'Nema postavljenog cilja'}</Text>
                <TextInput
                  placeholder="Postavi cilj troška (u €)"
                  value={spendingGoal}
                  onChangeText={setSpendingGoal}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Button
                  title="Spremi cilj potrošnje"
                  onPress={() => handleSaveSpendingGoal(vehicle.id)}
                />
              </View>
            )}
          </View>
        ))
      ) : (
        <Text>Nema vozila za prikazati.</Text>
      )}
    </ScrollView>
  );
};

const FuelHistory = ({ vehicleId, checkSpendingGoal, vehicle }) => {
  const [fuelData, setFuelData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // Dohvati podatke o gorivu za odabrano vozilo
  useEffect(() => {
    const fetchFuelData = async () => {
      const { data, error } = await supabase
        .from('gorivo')
        .select('*')
        .eq('vehicle_id', vehicleId);

      if (error) {
        console.error('Greška prilikom dohvaćanja podataka o gorivu:', error);
      } else {
        setFuelData(data || []);
        const total = data?.reduce((sum, entry) => sum + entry.cost, 0) || 0;
        setTotalCost(total);

        // Provjera cilja potrosnje
        checkSpendingGoal(total, vehicle);
      }
    };

    fetchFuelData();
  }, [vehicleId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View>
      <Text style={styles.statsText}>Ukupni trošak za vozilo: {totalCost} €</Text>
      <Text style={styles.statsText}>Posljednji unosi goriva:</Text>
      {
        fuelData.length > 0 ? (
          fuelData.map((entry, index) => (
            <Text key={index} style={styles.statsText}>
              {formatDate(entry.date)} - {entry.fuel_amount}L - {entry.cost}€
            </Text>
          ))
        ) : (
          <Text style={styles.statsText}>Nema unosa za ovo vozilo.</Text>
        )
      }
    </View>
  );
};

export default Home;
