import React from "react"

import loadable from "@loadable/component"

const AppRoutes = loadable(() => import("../components/AppRoutes"))

const App = (): React.ReactElement => {
  return <AppRoutes />
}

export default App
