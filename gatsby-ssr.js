import { renderStatic } from "@fluentui/merge-styles/lib/server"
import { renderToString } from "react-dom/server"
import React from "react"

export const replaceRenderer = ({
    bodyComponent,
    replaceBodyHTMLString,
    setHeadComponents,
}) => {
    const { html, css } = renderStatic(() => {
        return renderToString(bodyComponent)
    })
    replaceBodyHTMLString(html)
    setHeadComponents([<style dangerouslySetInnerHTML={{ __html: css}} />])
}