import React from "react"

import type { GatsbyBrowser } from "gatsby"

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({
  element,
  props,
}) => {
  type TLayoutElement = typeof element.type & { Layout: React.ElementType }

  const Layout = (element.type as TLayoutElement).Layout ?? React.Fragment
  return <Layout {...props}>{element}</Layout>
}
