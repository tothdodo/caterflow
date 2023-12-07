import { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LoginApi } from '../../generated';
import { LoadingModal } from "react-native-loading-modal";
import { useTokenContext } from '../../contexts/TokenContext';

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState('admin@caterflow.hu');
  const [password, setPassword] = useState('#Admin1234');
  const [loading, setLoading] = useState(false);

  const { setToken } = useTokenContext();

  const login = async () => {
    if (email.length === 0) {
      alert('Please fill the email field.');
      return;
    }
    if (password.length === 0) {
      alert('Please fill the password field.');
      return;
    }

    setLoading(true);
    try {
      const registerApi = new LoginApi();
      await registerApi.apiLoginLoginPost({ email: email, password: password }).then((response) => {
        if (response.status === 200 && response.data.tokenString) {
          const token = response.data.tokenString;
          setToken(token);
          navigation.navigate('Welcome');
        }
      });
    } catch (error: any) {
      alert("Invalid credentials.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.logo} source={require('../../assets/catering_logo.jpg')} />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="black"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={() => login()} >
        <Text style={{ color: "white", fontWeight: 'bold' }}>LOGIN</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={{ color: "white" }}>Not a member yet?</Text>
        <TouchableOpacity>
          <Text onPress={() => navigation.navigate('Register')} style={styles.register}>Register</Text>
        </TouchableOpacity>
      </View>
      <LoadingModal modalVisible={loading} color={"#920941"} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    textAlign: 'center',
    height: 50,
    flex: 1,
    padding: 10,
  },
  forgotButton: {
    height: 30,
    marginBottom: 30,
    color: "white",
  },
  loginBtn:
  {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: "#920941",
  },
  register: {
    textDecorationLine: 'underline',
    color: "white",
    marginLeft: 5,
  },
  registerContainer: {
    flexDirection: 'row',
  }
});