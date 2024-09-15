import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect} from '@react-navigation/native';
import { supabase } from '../supabase'; 
import styles from '../styles/VehiclesStyles';


const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehicleKm, setNewVehicleKm] = useState(''); 
  const [newVehicleConsumption, setNewVehicleConsumption] = useState(''); 
  const [newVehicleType, setNewVehicleType] = useState('car'); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
      const { data, error } = await supabase
        .from('vozila')
        .select('*')
        .eq('user_id', session.user.id); // Dohvati samo vozila trenutnog korisnika

      if (error) {
        Alert.alert('Greška', error.message);
      } else {
        setVehicles(data);
      }
    } else {
      Alert.alert('Niste prijavljeni', 'Molimo prijavite se.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchVehicles();
    }, [])
  );

  const deleteVehicle = async (vehicleId) => {
    try {
      const { error: fuelError } = await supabase
        .from('gorivo')
        .delete()
        .eq('vehicle_id', vehicleId);
  
      if (fuelError) {
        Alert.alert('Greška prilikom brisanja podataka o gorivu', fuelError.message);
        return;
      }

      const { error: vehicleError } = await supabase
        .from('vozila')
        .delete()
        .eq('id', vehicleId);
  
      if (vehicleError) {
        Alert.alert('Greška prilikom brisanja vozila', vehicleError.message);
      } else {
        Alert.alert('Vozilo je uspješno obrisano!');
        
        fetchVehicles();
      }
    } catch (error) {
      Alert.alert('Greška prilikom brisanja vozila', error.message);
    }
  };
  
  const handleSaveVehicle = async () => {
    if (!newVehicleName || !newVehicleKm || !newVehicleConsumption) {
      Alert.alert('Greška', 'Unesite sve podatke o vozilu.');
      return;
    }

    // Prebaci zarez u tocku
    const consumptionValue = newVehicleConsumption.replace(',', '.');
    const kilometersValue = newVehicleKm.replace(',', '.');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        Alert.alert('Greška', 'Ne mogu dohvatiti sesiju.');
        return;
      }

      if (!session || !session.user) {
        Alert.alert('Greška', 'Niste prijavljeni.');
        return;
      }

      if (editingVehicle) {
        const { data, error } = await supabase
          .from('vozila')
          .update({
            name: newVehicleName,
            kilometers: kilometersValue,
            consumption: consumptionValue,
            type: newVehicleType,
          })
          .eq('id', editingVehicle.id);

        if (error) {
          Alert.alert('Greška', error.message);
        } else {
          Alert.alert('Vozilo je uspješno ažurirano!');
        }
      } else {
        const { data, error } = await supabase
          .from('vozila')
          .insert([{
            name: newVehicleName,
            kilometers: kilometersValue,
            consumption: consumptionValue,
            user_id: session.user.id,
            type: newVehicleType, // (automobil ili motor)
          }]);

        if (error) {
          Alert.alert('Greška', error.message);
        } else {
          Alert.alert('Vozilo je uspješno dodano!');
        }
      }

      setModalVisible(false);
      fetchVehicles(); 
      resetForm(); 
    } catch (error) {
      Alert.alert('Greška', 'Došlo je do neočekivane greške.');
    }
  };

  // Resetiraj formu
  const resetForm = () => {
    setNewVehicleName('');
    setNewVehicleKm('');
    setNewVehicleConsumption('');
    setNewVehicleType('car');
    setEditingVehicle(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Vozila</Text>
          <TouchableOpacity onPress={() => { resetForm(); setModalVisible(true); }}>
            <MaterialIcons name="add" style={styles.addButton} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingVehicle ? 'Uredi vozilo' : 'Dodaj novo vozilo'}
                </Text>

                <Picker
                  selectedValue={newVehicleType}
                  onValueChange={(itemValue) => setNewVehicleType(itemValue)}
                >
                  <Picker.Item label="Automobil" value="car" />
                  <Picker.Item label="Motor" value="motorcycle" />
                </Picker>

                <TextInput
                  placeholder="Ime vozila"
                  value={newVehicleName}
                  onChangeText={setNewVehicleName}
                  style={styles.input}
                  placeholderTextColor="grey"
                />
                
                <TextInput
                  placeholder="Kilometri"
                  value={newVehicleKm}
                  onChangeText={setNewVehicleKm}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholderTextColor="grey"
                />
                <TextInput
                  placeholder="Potrošnja (L/km)"
                  value={newVehicleConsumption}
                  onChangeText={setNewVehicleConsumption}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholderTextColor="grey"
                />

                <Button title={editingVehicle ? 'Ažuriraj vozilo' : 'Dodaj vozilo'} onPress={handleSaveVehicle} />
                <Button title="Zatvori" onPress={() => setModalVisible(false)} color="red" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {vehicles.length > 0 ? (
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.vehicleItem}>
                <TouchableOpacity
                  onPress={() => {
                    setEditingVehicle(item);
                    setNewVehicleName(item.name);
                    setNewVehicleKm(item.kilometers.toString());
                    setNewVehicleConsumption(item.consumption.toString());
                    setNewVehicleType(item.type); // Postavi tip vozila u Picker
                    setModalVisible(true);
                  }}
                >
                  <MaterialIcons
                    name={item.type === 'car' ? 'directions-car' : 'motorcycle'}
                    style={styles.vehicleIcon}
                  />
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{item.name}</Text>
                    <Text style={styles.vehicleDetails}>
                      {item.kilometers}km  {item.consumption}L/km
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteVehicle(item.id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text>Nema vozila za prikazati.</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Vehicles;
