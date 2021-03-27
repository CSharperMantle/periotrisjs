import React from "react"
import { Stack, Text, Link, FontWeights, DefaultButton } from "@fluentui/react"
import "./index.css"
import { PeriotrisModel } from "../model/PeriotrisModel"

const boldStyle = { root: { fontWeight: FontWeights.semibold } }

/* TEST CODE */
const model = new PeriotrisModel()
/* END TEST CODE */

class App extends React.Component {
  public render() {
    return (
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        verticalFill
        styles={{
          root: {
            width: "960px",
            margin: "0 auto",
            textAlign: "center",
            color: "#605e5c",
          },
        }}
        className="App"
        gap={15}
      >
        <img
          src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
          alt="logo"
        />
        <Text variant="xxLarge" styles={boldStyle}>
          Welcome to Your UI Fabric App
        </Text>
        <Text variant="large">
          For a guide on how to customize this project, check out the UI Fabric
          documentation.
        </Text>
        <Text variant="large" styles={boldStyle}>
          Essential Links
        </Text>
        <Stack horizontal gap={15} horizontalAlign="center">
          <Link href="https://developer.microsoft.com/en-us/fabric">Docs</Link>
          <Link href="https://stackoverflow.com/questions/tagged/office-ui-fabric">
            Stack Overflow
          </Link>
          <Link href="https://github.com/officeDev/office-ui-fabric-react/">
            Github
          </Link>
          <Link href="https://twitter.com/officeuifabric">Twitter</Link>
        </Stack>
        <Text variant="large" styles={boldStyle}>
          Design System
        </Text>
        <Stack horizontal gap={15} horizontalAlign="center">
          <Link href="https://developer.microsoft.com/en-us/fabric#/styles/icons">
            Icons
          </Link>
          <Link href="https://developer.microsoft.com/en-us/fabric#/styles/typography">
            Typography
          </Link>
          <Link href="https://developer.microsoft.com/en-us/fabric#/styles/themegenerator">
            Theme
          </Link>
        </Stack>
        <Stack horizontal gap={15} horizontalAlign="center"></Stack>
        <DefaultButton
          text="model.startGame()"
          onClick={() => {
            model.startGame()
            console.log(model)
          }}
        />
        <DefaultButton
          text="model.update()"
          onClick={() => {
            model.update()
            console.log(model)
          }}
        />
        <DefaultButton
          text="model.instantDropActiveTetrimino()"
          onClick={() => {
            model.instantDropActiveTetrimino()
            console.log(model)
          }}
        />
      </Stack>
    )
  }
}

export default App
