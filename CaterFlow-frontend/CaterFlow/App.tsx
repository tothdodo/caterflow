import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./screens/login/Login";
import { NavigationContainer } from '@react-navigation/native';
import { Register } from "./screens/register/Register";
import { StatusBar } from 'expo-status-bar';
import { Welcome } from "./screens/welcome/Welcome";
import { JoinUnit } from "./screens/joinUnit/JoinUnit";
import { CreateUnit } from "./screens/createUnit/CreateUnit";
import { MyUnits } from "./screens/myUnits/MyUnits";
import { UnitWelcome } from "./screens/unitWelcome/UnitWelcome";
import { ManageMenu } from "./screens/manageMenu/ManageMenu";
import { Products } from "./screens/manageMenu/Products";
import { Categories } from "./screens/manageMenu/Categories";
import { ActiveOrders } from "./screens/orderPickup/ActiveOrders";
import { NewOrderPickup } from "./screens/orderPickup/NewOrderPickup";
import { NewSubOrderPickup } from "./screens/orderPickup/NewSubOrderPickup";
import { OrderOverview } from "./screens/orderOverview/OrderOverview";
import { KitchenFlow } from "./screens/flows/KitchenFlow";
import { DrinkFlow } from "./screens/flows/DrinkFlow";
import { TokenProvider } from "./contexts/TokenContext";
import { UnitProvider } from "./contexts/UnitContext";
import { ManageStaff } from "./screens/manageStaff/ManageStaff";
import { Payment } from "./screens/payment/Payment";
import { AddProduct } from "./screens/manageMenu/AddProduct";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <TokenProvider>
      <UnitProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Welcome" component={Welcome}/>
            <Stack.Screen name="JoinUnit" component={JoinUnit}/>
            <Stack.Screen name="CreateUnit" component={CreateUnit}/>
            <Stack.Screen name="MyUnits" component={MyUnits}/>
            <Stack.Screen name="UnitWelcome" component={UnitWelcome}/>
            <Stack.Screen name="ManageMenu" component={ManageMenu}/>
            <Stack.Screen name="ManageStaff" component={ManageStaff}/>
            <Stack.Screen name="ActiveOrders" component={ActiveOrders}/>
            <Stack.Screen name="NewOrderPickup" component={NewOrderPickup}/>
            <Stack.Screen name="NewSubOrderPickup" component={NewSubOrderPickup}/>
            <Stack.Screen name="OrderOverview" component={OrderOverview}/>
            <Stack.Screen name="DrinkFlow" component={DrinkFlow}/>
            <Stack.Screen name="KitchenFlow" component={KitchenFlow}/>
            <Stack.Screen name="Payment" component={Payment}/>
            <Stack.Screen name="Categories" component={Categories}/>
            <Stack.Screen name="Products" component={Products}/>
            <Stack.Screen name="AddProduct" component={AddProduct}/>
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </UnitProvider>
    </TokenProvider>
  )
}


