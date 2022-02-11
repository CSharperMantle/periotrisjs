import { observer } from "mobx-react"
import React, { useContext } from "react"

import { Backdrop, Button, Stack, Typography } from "@mui/material"

import hourglassNotDone from "../../assets/icon/noto-color-emoji/hourglass-not-done.svg"
import partyingFace from "../../assets/icon/noto-color-emoji/partying-face.svg"
import thinkingFace from "../../assets/icon/noto-color-emoji/thinking-face.svg"
import winkingFace from "../../assets/icon/noto-color-emoji/winking-face.svg"
import { GameState } from "../model"
import { GameViewModelContext } from "../viewmodel"

interface IGameNotStartedContentProps {
  startGameHandler: () => void
}

const GameNotStartedContent = (
  props: IGameNotStartedContentProps
): React.ReactElement => {
  return (
    <>
      <img src={winkingFace} alt="Winking face" width="128" height="128" />
      <Typography align="center" variant="h6">
        Welcome! Your task: complete the Periodic Table.
      </Typography>
      <Typography align="center" variant="body1">
        A/D/S/Swipe: move by one. W/Tap: rotate. Space/Long press: drop.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={props.startGameHandler}
      >
        I&apos;m ready
      </Button>
    </>
  )
}

const GamePreparingContent = (): React.ReactElement => {
  return (
    <>
      <img
        src={hourglassNotDone}
        alt="Hourglass with sand running"
        width="128"
        height="128"
      />
      <Typography align="center" variant="h6">
        Good luck! Please wait while we prepare your game.
      </Typography>
    </>
  )
}

interface IGameLostContentProps {
  startGameHandler: () => void
}

const GameLostContent = (props: IGameLostContentProps): React.ReactElement => {
  return (
    <>
      <img src={thinkingFace} alt="Thinking face" width="128" height="128" />
      <Typography align="center" variant="h6">
        Oops... This does not seem to be right.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={props.startGameHandler}
      >
        Try again
      </Button>
    </>
  )
}

interface IGameWonContentProps {
  startGameHandler: () => void
}

const GameWonContent = (props: IGameWonContentProps): React.ReactElement => {
  return (
    <>
      <img src={partyingFace} alt="Partying face" width="128" height="128" />
      <Typography align="center" variant="h6">
        Congrats! You won!
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={props.startGameHandler}
      >
        Restart
      </Button>
    </>
  )
}

interface IGameStatusBackdropProps {
  startGameHandler: () => void
  pauseUnpauseGameHandler: () => void
}

const GameControlBackdrop = observer(
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

export { GameControlBackdrop }
