import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // gray-50
    padding: 6,
    paddingTop: 20, // Add padding to move the content down
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
  },
  signInText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  welcomeText: {
    fontFamily: 'Mochiy', 
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  liveVotesText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  tabBarStyle: {
    height: 60,
    paddingBottom: 8,
    backgroundColor: '#f8fafc',
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '500',
  },
  backButton: {
    marginLeft: 16,
  },
});

export { styles };