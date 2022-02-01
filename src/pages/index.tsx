import React from "react"
import { HashRouter, Route, Routes } from "react-router-dom"

import {
  AboutPage,
  CommonLayout,
  GamePage,
  HomePage,
  SettingsPage,
} from "../components"

const App = (): React.ReactElement => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<HomePage />} />
          <Route path="game" element={<GamePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
