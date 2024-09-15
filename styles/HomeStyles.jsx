import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop : 30,
  },
  titleTextGreen: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'green',
    marginTop : 30,
  },
  infoBox: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },

});

export default styles;
