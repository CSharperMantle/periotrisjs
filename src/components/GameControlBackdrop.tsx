import { observer } from "mobx-react"
import React, { useContext } from "react"

import Backdrop from "@mui/material/Backdrop"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import hourglassNotDone from "../../assets/icon/noto-color-emoji/hourglass-not-done.svg"
import partyingFace from "../../assets/icon/noto-color-emoji/partying-face.svg"
import thinkingFace from "../../assets/icon/noto-color-emoji/thinking-face.svg"
import winkingFace from "../../assets/icon/noto-color-emoji/winking-face.svg"
import { GameState } from "../model"
import { GameViewModelContext } from "../viewmodel"

interface IContentProps {
  image: { src: string; alt: string }
  title: string
  description?: string
  button?: {
    caption: string
    color: "primary" | "secondary"
    onClick?: () => void
  }
}

const Content = ({
  image,
  title,
  description,
  button,
}: IContentProps): React.ReactElement => {
  return (
    <>
      <img src={image.src} alt={image.alt} width="128" height="128" />
      <Typography align="center" variant="h6">
        {title}
      </Typography>
      {description && (
        <Typography align="center" variant="body1">
          {description}
        </Typography>
      )}
      {button && (
        <Button
          variant="contained"
          color={button.color}
          onClick={button.onClick}
        >
          {button.caption}
        </Button>
      )}
    </>
  )
}

interface IGameNotStartedContentProps {
  startGameHandler: () => void
}

const GameNotStartedContent = (
  props: IGameNotStartedContentProps
): React.ReactElement => {
  return (
    <Content
      image={{ src: winkingFace, alt: "Winking face" }}
      title="Welcome! Your task: complete the Periodic Table."
      description="A/D/S/Swipe: move by one. W/Tap: rotate. Space/Long press: drop."
      button={{
        caption: "I'm ready",
        color: "primary",
        onClick: props.startGameHandler,
      }}
    />
  )
}

const GamePreparingContent = (): React.ReactElement => {
  return (
    <Content
      image={{ src: hourglassNotDone, alt: "Hourglass with sand running" }}
      title="Good luck!"
      description="The game will start in a few seconds."
    />
  )
}

interface IGameLostContentProps {
  startGameHandler: () => void
}

const GameLostContent = (props: IGameLostContentProps): React.ReactElement => {
  return (
    <Content
      image={{ src: thinkingFace, alt: "Thinking face" }}
      title="Oops..."
      description="This does not seem to be right. Ready to give it another shot?"
      button={{
        caption: "Try again",
        color: "secondary",
        onClick: props.startGameHandler,
      }}
    />
  )
}

interface IGameWonContentProps {
  startGameHandler: () => void
}

const GameWonContent = (props: IGameWonContentProps): React.ReactElement => {
  return (
    <Content
      image={{ src: partyingFace, alt: "Partying face" }}
      title="Congrats."
      description="You won the game! Don't hesitate to brag about it."
      button={{
        caption: "Restart",
        color: "secondary",
        onClick: props.startGameHandler,
      }}
    />
  )
}

interface IGameStatusBackdropProps {
  startGameHandler: () => void
  switchPauseGameHandler: () => void
}

export const GameControlBackdrop = observer(
  (props: IGameStatusBackdropProps): React.ReactElement => {
    const viewModel = useContext(GameViewModelContext)

    let content: React.ReactElement
    switch (viewModel.gameState) {
      case GameState.NotStarted:
        content = (
          <GameNotStartedContent startGameHandler={props.startGameHandler} />
        )
        break
      case GameState.Preparing:
        content = <GamePreparingContent />
        break
      case GameState.InProgress:
        content = <></>
        break
      case GameState.Won:
        content = <GameWonContent startGameHandler={props.startGameHandler} />
        break
      case GameState.Lost:
        content = <GameLostContent startGameHandler={props.startGameHandler} />
        break
      default:
        throw new Error("Unknown game state")
    }

    return (
      <Backdrop
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          paddingLeft: 2,
          paddingRight: 2,
          zIndex: "modal",
        }}
        open={viewModel.gameState !== GameState.InProgress}
      >
        <Stack
          sx={{
            height: "100%",
          }}
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          {content}
        </Stack>
      </Backdrop>
    )
  }
)
