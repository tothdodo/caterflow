import { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RegisterApi } from '../../generated';
import { LoadingModal } from "react-native-loading-modal";
import { useTokenContext } from '../../contexts/TokenContext';
export const Register = ({ navigation }) => {

  const { setToken } = useTokenContext();

  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const register = async () => {
    if (email.length === 0) {
      alert('Please fill the email field.');
      return;
    }
    if (email !== emailConfirm) {
      alert('Emails do not match.');
      return;
    }
    if (password.length === 0) {
      alert('Please fill the password field.');
      return;
    }
    if (password !== passwordConfirm) {
      alert('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const registerApi = new RegisterApi();
      await registerApi.apiRegisterPost({ email: email, password: password }).then((response) => {
        if (response.status === 200 && response.data.tokenString) {
          const token = response.data.tokenString;
          setToken(token);
          navigation.navigate('Welcome');
        }
      });
    } catch (error: any) {
      alert(error.response.data);
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
          onChangeText={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Email"
          placeholderTextColor="black"
          onChangeText={(email) => setEmailConfirm(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          onChangeText={(password) => setPasswordConfirm(password)}
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={{ color: "white" }}>Already a member?</Text>
        <TouchableOpacity>
          <Text onPress={() => navigation.navigate('Login')} style={styles.login}>Log in</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => register()} style={styles.registerBtn}>
        <Text style={{ color: "white", fontWeight: 'bold' }}>Register</Text>
      </TouchableOpacity>
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
    width: 100,
    height: 100,
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
  registerBtn:
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
  login: {
    textDecorationLine: 'underline',
    color: "white",
    marginLeft: 5,
  },
  loginContainer: {
    flexDirection: 'row',
  }
});