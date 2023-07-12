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

import { Link as GatsbyLink } from "gatsby"
import { useI18next } from "gatsby-plugin-react-i18next"
import React from "react"

import Backdrop from "@mui/material/Backdrop"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Fade from "@mui/material/Fade"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

import { GameState } from "../../model"
import { useAppSelector } from "../../viewmodel"
import { DelayedIndefProgress } from "./DelayedIndefProgress"

interface IButtonCommonProps {
  readonly returnPath: string
  readonly okHandler: () => void
  readonly disabled: boolean
}

const GameNotStartedContent = () => {
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" variant="h6">
        {t("typ_h_not_started_intro")}
      </Typography>
      <Typography align="center" variant="body1" paragraph>
        {t("typ_p_not_started_intro")}
      </Typography>
    </>
  )
}

const GameNotStartedButtons = (props: IButtonCommonProps) => {
  const { t } = useI18next()

  return (
    <Stack direction="row" spacing={5}>
      <Button
        variant="outlined"
        color="primary"
        component={GatsbyLink}
        to={props.returnPath}
      >
        {t("cap_home")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={props.disabled}
        onClick={props.okHandler}
      >
        {t("cap_start")}
      </Button>
    </Stack>
  )
}

const GamePreparingContent = () => {
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" variant="h6">
        {t("typ_h_preparing")}
      </Typography>
      <Typography align="center" variant="body1" paragraph>
        {t("typ_p_preparing")}
      </Typography>
      <DelayedIndefProgress delayMs={800} />
    </>
  )
}

const GameLostContent = () => {
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" variant="h6">
        {t("typ_h_lost")}
      </Typography>
      <Typography align="center" variant="body1" paragraph>
        {t("typ_p_lost")}
      </Typography>
    </>
  )
}

const GameLostButtons = (props: IButtonCommonProps) => {
  const { t } = useI18next()

  return (
    <Stack direction="row" spacing={5}>
      <Button
        variant="outlined"
        color="primary"
        component={GatsbyLink}
        to={props.returnPath}
      >
        {t("cap_home")}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        disabled={props.disabled}
        onClick={props.okHandler}
      >
        {t("cap_retry")}
      </Button>
    </Stack>
  )
}

const GameWonContent = () => {
  const { t } = useI18next()

  return (
    <>
      <Typography align="center" variant="h6">
        {t("typ_h_won")}
      </Typography>
      <Typography align="center" variant="body1" paragraph>
        {t("typ_p_won")}
      </Typography>
    </>
  )
}

const GameWonButtons = (props: IButtonCommonProps) => {
  const { t } = useI18next()

  return (
    <Stack direction="row" spacing={5}>
      <Button
        variant="outlined"
        color="primary"
        component={GatsbyLink}
        to={props.returnPath}
      >
        {t("cap_home")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={props.disabled}
        onClick={props.okHandler}
      >
        {t("cap_start")}
      </Button>
    </Stack>
  )
}

interface IGameStatusBackdropProps {
  readonly homePagePath: string
  readonly startGameHandler: () => void
  readonly switchPauseGameHandler: () => void
}

export const GameControlBackdrop = (props: IGameStatusBackdropProps) => {
  const isPortrait = useMediaQuery("(orientation: portrait)")
  const { t } = useI18next()

  const gameState = useAppSelector(
    (state) => state.game.gameControlBackdrop.gameState
  )

  let content: React.ReactElement
  let buttons: React.ReactElement
  switch (gameState) {
    case GameState.NotStarted:
      content = <GameNotStartedContent />
      buttons = (
        <GameNotStartedButtons
          returnPath={props.homePagePath}
          okHandler={props.startGameHandler}
          disabled={isPortrait}
        />
      )
      break
    case GameState.Preparing:
      content = <GamePreparingContent />
      buttons = <></>
      break
    case GameState.InProgress:
      content = <></>
      buttons = <></>
      break
    case GameState.Won:
      content = <GameWonContent />
      buttons = (
        <GameWonButtons
          returnPath={props.homePagePath}
          okHandler={props.startGameHandler}
          disabled={isPortrait}
        />
      )
      break
    case GameState.Lost:
      content = <GameLostContent />
      buttons = (
        <GameLostButtons
          returnPath={props.homePagePath}
          okHandler={props.startGameHandler}
          disabled={isPortrait}
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
      <Container maxWidth="sm">
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
          <Fade in={isPortrait}>
            <Typography align="center" variant="body1" paragraph>
              <strong>{t("typ_p_portrait")}</strong>
            </Typography>
          </Fade>
          {buttons}
        </Stack>
      </Container>
    </Backdrop>
  )
}
