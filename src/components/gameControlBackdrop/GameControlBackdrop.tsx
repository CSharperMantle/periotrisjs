/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import { navigate } from "gatsby"
import React from "react"

import Backdrop from "@mui/material/Backdrop"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { GameState } from "../../model"
import { useAppSelector } from "../../viewmodel"
import { DelayedIndefProgress } from "./DelayedIndefProgress"

interface IGameNotStartedContentProps {
  readonly homePagePath: string
  readonly startGameHandler: () => void
}

const GameNotStartedContent = (props: IGameNotStartedContentProps) => {
  return (
    <>
      <Typography align="center" maxWidth="md" variant="h6">
        Welcome! Your task: complete the Periodic Table.
      </Typography>
      <Typography align="center" maxWidth="md" variant="body1">
        A/D/S/Swipe: move by one. W/Tap: rotate. Space/Long press: drop.
      </Typography>
      <Stack direction="row" spacing={5}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(props.homePagePath)
          }}
        >
          HOME
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.startGameHandler}
        >
          START
        </Button>
      </Stack>
    </>
  )
}

const GamePreparingContent = () => {
  return (
    <>
      <Typography align="center" maxWidth="md" variant="h6">
        Good luck!
      </Typography>
      <Typography align="center" maxWidth="md" variant="body1">
        Generating new map for you. The game will start in a few seconds.
      </Typography>
      <DelayedIndefProgress delayMs={800} />
    </>
  )
}

interface IGameLostContentProps {
  readonly homePagePath: string
  readonly startGameHandler: () => void
}

const GameLostContent = (props: IGameLostContentProps) => {
  return (
    <>
      <Typography align="center" maxWidth="md" variant="h6">
        Oops...
      </Typography>
      <Typography align="center" maxWidth="md" variant="body1">
        This does not seem to be right. Ready to give it another shot?
      </Typography>
      <Stack direction="row" spacing={5}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(props.homePagePath)
          }}
        >
          HOME
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={props.startGameHandler}
        >
          RETRY
        </Button>
      </Stack>
    </>
  )
}

interface IGameWonContentProps {
  readonly homePagePath: string
  readonly startGameHandler: () => void
}

const GameWonContent = (props: IGameWonContentProps) => {
  return (
    <>
      <Typography align="center" maxWidth="md" variant="h6">
        Congrats!
      </Typography>
      <Typography align="center" maxWidth="md" variant="body1">
        You finished the game! Don&apos;t hesitate to brag about it.
      </Typography>
      <Stack direction="row" spacing={5}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(props.homePagePath)
          }}
        >
          HOME
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.startGameHandler}
        >
          START
        </Button>
      </Stack>
    </>
  )
}

interface IGameStatusBackdropProps {
  readonly homePagePath: string
  readonly startGameHandler: () => void
  readonly switchPauseGameHandler: () => void
}

export const GameControlBackdrop = (props: IGameStatusBackdropProps) => {
  const gameState = useAppSelector(
    (state) => state.game.gameControlBackdrop.gameState
  )

  let content: React.ReactElement
  switch (gameState) {
    case GameState.NotStarted:
      content = (
        <GameNotStartedContent
          homePagePath={props.homePagePath}
          startGameHandler={props.startGameHandler}
        />
      )
      break
    case GameState.Preparing:
      content = <GamePreparingContent />
      break
    case GameState.InProgress:
      content = <></>
      break
    case GameState.Won:
      content = (
        <GameWonContent
          homePagePath={props.homePagePath}
          startGameHandler={props.startGameHandler}
        />
      )
      break
    case GameState.Lost:
      content = (
        <GameLostContent
          homePagePath={props.homePagePath}
          startGameHandler={props.startGameHandler}
        />
      )
      break
    default:
      throw new Error("GameControlBackdrop: unknown game state")
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
      open={gameState !== GameState.InProgress}
    >
      <Stack
        sx={{
          height: "100%",
        }}
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        {content}
      </Stack>
    </Backdrop>
  )
}
