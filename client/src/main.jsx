import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { store, persistor } from '../src/redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import SocketProvider from '../src/context/SocketProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </PersistGate>
  </Provider>
)
// persistor.purge();