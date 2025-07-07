import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
//npx expo install @react-native-async-storage/async-storage

const AuthContext = createContext()
//func. p/ salvar o token e o user (se necessário)
export const AuthProvider = ({children}) => {
    const [userToken, setUserToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    //isLoading vai carregar o token ao iniciar

    const signIn = async (token, userData) => {
        try {
            await AsyncStorage.setItem('userToken', token)
            setUserToken(token)
            //await AsyncStorage.setItem('userToken', JSON.stringfy(userData))
            //caso alguém precise passar os dados junto
        } catch (e){
            console.error('Erro ao salvar token do user :(', e)
        }
    }
}

