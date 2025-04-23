import {
  AuthenticationResult,
  Configuration,
  EventMessage,
  EventType,
  PopupRequest,
  PublicClientApplication,
} from '@azure/msal-browser'
import type {AppConfig} from '@/conf/AppConfig'

export const getMsalInstance = (config: AppConfig) => {
  const msalConfig: Configuration = {
    auth: {
      clientId: config.microsoft.clientId,
      authority: 'https://login.microsoftonline.com/' + config.microsoft.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
    },
    system: {
      // allowNativeBroker: false, // Disables WAM Broker
    },
  }

  // Add here scopes for id token to be used at MS Identity Platform endpoints.
  const loginRequest: PopupRequest = {
    scopes: ['User.Read'],
  }

  // TO get picture me/photo/$value

  // Add here the endpoints for MS Graph API services you would like to use.
  const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  }

  const msalInstance = new PublicClientApplication(msalConfig)
  const accounts = msalInstance.getAllAccounts()
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0])
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult
      const account = payload.account
      msalInstance.setActiveAccount(account)
    }
  })

  return msalInstance
}
