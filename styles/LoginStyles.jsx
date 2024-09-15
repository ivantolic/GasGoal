import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  footerText: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: 'green',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 60,
    height: 60,
  },
  buttonIcon: {
    color: 'white', 
    fontSize: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
  },
  titleTextGreen: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'green',
  },
});
