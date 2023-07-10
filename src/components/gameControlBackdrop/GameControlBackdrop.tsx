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
import { useI18next } from "gatsby-plugin-react-i18next"

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
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" maxWidth="sm" variant="h6">
        {t("typ_h_not_started_intro")}
      </Typography>
      <Typography align="center" maxWidth="sm" variant="body1" paragraph>
        {t("typ_p_not_started_intro")}
      </Typography>
      <Stack direction="row" spacing={5}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(props.homePagePath)
          }}
        >
          {t("cap_home")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.startGameHandler}
        >
          {t("cap_start")}
        </Button>
      </Stack>
    </>
  )
}

const GamePreparingContent = () => {
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" maxWidth="sm" variant="h6">
        {t("typ_h_preparing")}
      </Typography>
      <Typography align="center" maxWidth="sm" variant="body1" paragraph>
        {t("typ_p_preparing")}
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
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" maxWidth="sm" variant="h6">
        {t("typ_h_lost")}
      </Typography>
      <Typography align="center" maxWidth="sm" variant="body1" paragraph>
        {t("typ_p_lost")}
      </Typography>
      <Stack direction="row" spacing={5}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(props.homePagePath)
          }}
        >
          {t("cap_home")}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={props.startGameHandler}
        >
          {t("cap_retry")}
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
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" maxWidth="sm" variant="h6">
        {t("typ_h_won")}
      </Typography>
      <Typography align="center" maxWidth="sm" variant="body1" paragraph>
        {t("typ_p_won")}
      </Typography>
      <Stack direction="row" spacing={5}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(props.homePagePath)
          }}
        >
          {t("cap_home")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.startGameHandler}
        >
          {t("cap_start")}
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
