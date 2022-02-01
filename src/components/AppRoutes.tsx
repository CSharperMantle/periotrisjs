import React from "react"
import { Route, Routes, HashRouter } from "react-router-dom"

import { AboutPage, CommonLayout, GamePage, HomePage, SettingsPage } from "."

const AppRoutes = (): React.ReactElement => {
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

export default AppRoutes
