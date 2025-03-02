import { AntDesign, EvilIcons, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const HomeRootLayout = () => {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: '#34967C',
        headerShown: false
    }} >
      <Tabs.Screen name="create" options={{
        title: 'Create',
        tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
      }} />
      <Tabs.Screen name="vote" options={{
        title: 'Vote',
        headerShown: true,
        tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
      }} />
      <Tabs.Screen name="results" options={{
        title: 'Show',
        headerShown: true,
        tabBarIcon: ({ color }) => <EvilIcons name="heart" size={27} color={color} />
      }} />
      
    </Tabs>
  )
}

export default HomeRootLayout;