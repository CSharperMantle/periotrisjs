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

import validateColorScheme from "ajv-json-loader!../json/schema/ColorScheme.json.schema"
import validateMap from "ajv-json-loader!../json/schema/Map.json.schema"

import FileSaver from "file-saver"
import { Link, PageProps, graphql } from "gatsby"
import { useI18next } from "gatsby-plugin-react-i18next"
import { useSnackbar } from "notistack"
import React from "react"

import HomeIcon from "@mui/icons-material/Home"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { IconButton, Tooltip } from "@mui/material"
import { PageID } from "../PageID"
import { queryPath } from "../common"
import { CommonHead, FileFormControl, NumberFormControl } from "../components"
import { customizationFacade } from "../customization"

const tryParseInt = (s: string): readonly [boolean, number] => {
  const v = parseInt(s, 10)
  return [!isNaN(v), v]
}

const App = ({ data }: PageProps<Queries.SettingsPageQuery>) => {
  const { t, changeLanguage, languages, language } = useI18next()

  const routes = data.site?.siteMetadata?.navRoutes
  const homePagePath = queryPath(routes, PageID.PAGE_HOME)
  const gamePagePath = queryPath(routes, PageID.PAGE_GAME)

  const assistanceGridAppearanceOptions = [
    {
      value: "visible",
      label: t("lbl_option_assistance_grid_visible"),
    },
    {
      value: "hidden",
      label: t("lbl_option_assistance_grid_hidden"),
    },
  ]

  const { enqueueSnackbar } = useSnackbar()

  const [assistanceGridMode, setAssistanceGridMode] = React.useState(
    customizationFacade.settings.showGridLine ? "visible" : "hidden"
  )

  const jsonMinifyPreprocessor = (json: string): string => {
    return JSON.stringify(JSON.parse(json))
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        flex: "1 1 auto",
        ml: "auto",
        mr: "auto",
        pt: 4,
        pb: 4,
      }}
    >
      <Stack direction="column" spacing={5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tooltip title={t("cap_home")}>
            <IconButton
              size="large"
              aria-label="home"
              component={Link}
              to={homePagePath}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4">{t("typ_h_settings")}</Typography>
          <Tooltip title={t("cap_game")}>
            <IconButton
              size="large"
              aria-label="game"
              component={Link}
              to={gamePagePath}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="body1">{t("typ_helper_save")}</Typography>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            {t("typ_category_appearance")}
          </Typography>
          <FormControl>
            <TextField
              id="lang-input"
              select
              value={language}
              label={t("lbl_lang")}
              aria-describedby="lang-input-helper-text"
              onChange={async (ev) => {
                await changeLanguage(ev.target.value)
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            <FormHelperText id="lang-input-helper-text">
              {t("typ_lang_helper")}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextField
              id="assistance-grid-input"
              select
              value={assistanceGridMode}
              label={t("lbl_assistance_grid")}
              aria-describedby="assistance-grid-input-helper-text"
              onChange={(ev) => {
                const v = ev.target.value
                customizationFacade.settings.showGridLine = v === "visible"
                setAssistanceGridMode(v)
              }}
            >
              {assistanceGridAppearanceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <FormHelperText id="assistance-grid-input-helper-text">
              {t("typ_assistance_grid_helper")}
            </FormHelperText>
          </FormControl>
          <NumberFormControl
            id="border-thickness-input"
            label={t("lbl_border_thickness")}
            initialContent={customizationFacade.settings.borderThickness.toString()}
            helperText={t("typ_border_thickness_helper")}
            min={0}
            step={1}
            adornments={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.borderThickness = value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
          <FileFormControl
            id="color-scheme-input"
            readOnly
            initialFileContent={JSON.stringify(
              customizationFacade.settings.colorScheme
            )}
            accept="application/json"
            label={t("lbl_color_scheme")}
            helperText={t("typ_color_scheme_helper")}
            tooltipCaption={t("cap_open_button")}
            onFileChange={(newContent) => {
              const obj = JSON.parse(newContent)
              if (validateColorScheme(obj)) {
                customizationFacade.settings.colorScheme = obj
                return true
              } else {
                enqueueSnackbar(t("msg_color_scheme_invalid"), {
                  variant: "error",
                })
                return false
              }
            }}
            contentPreprocessor={jsonMinifyPreprocessor}
          />
        </Stack>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            {t("typ_category_gameplay")}
          </Typography>
          <FileFormControl
            id="game-map-input"
            readOnly
            initialFileContent={JSON.stringify(
              customizationFacade.settings.gameMap
            )}
            accept="application/json"
            label={t("lbl_game_map")}
            helperText={t("typ_game_map_helper")}
            tooltipCaption={t("cap_open_button")}
            onFileChange={(newContent) => {
              const obj = JSON.parse(newContent)
              if (validateMap(obj)) {
                customizationFacade.settings.gameMap = obj
                return true
              } else {
                enqueueSnackbar(t("msg_game_map_invalid"), {
                  variant: "error",
                })
                return false
              }
            }}
            contentPreprocessor={jsonMinifyPreprocessor}
          />
          <NumberFormControl
            id="update-interval-input"
            label={t("lbl_update_interval")}
            initialContent={customizationFacade.settings.gameUpdateIntervalMilliseconds.toString()}
            min={0}
            step={100}
            helperText={t("typ_update_interval_helper")}
            adornments={{
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            }}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.gameUpdateIntervalMilliseconds =
                  value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
        </Stack>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            {t("typ_category_control")}
          </Typography>
          <NumberFormControl
            id="swipe-threshold-input"
            label={t("lbl_swipe_threshold")}
            initialContent={customizationFacade.settings.swipeThreshold.toString()}
            min={0}
            step={5}
            helperText={t("typ_swipe_threshold_helper")}
            adornments={{
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            }}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.swipeThreshold = value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
          <NumberFormControl
            id="swipe-delta-x-input"
            label={t("lbl_swipe_delta_x")}
            initialContent={customizationFacade.settings.swipeDeltaX.toString()}
            min={0}
            step={1}
            helperText={t("typ_swipe_delta_x_helper")}
            adornments={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.swipeDeltaX = value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
          <NumberFormControl
            id="swipe-delta-y-input"
            label={t("lbl_swipe_delta_y")}
            initialContent={customizationFacade.settings.swipeDeltaY.toString()}
            min={0}
            step={1}
            helperText={t("typ_swipe_delta_y_helper")}
            adornments={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.swipeDeltaY = value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
          <NumberFormControl
            id="press-threshold-input"
            label={t("lbl_press_threshold")}
            initialContent={customizationFacade.settings.pressThreshold.toString()}
            min={0}
            step={1}
            helperText={t("typ_press_threshold_helper")}
            adornments={{
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            }}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.pressThreshold = value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
        </Stack>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            {t("typ_category_misc")}
          </Typography>
          <NumberFormControl
            id="concurrency-input"
            label={t("lbl_concurrency")}
            initialContent={customizationFacade.settings.concurrency.toString()}
            helperText={t("typ_concurrency_helper")}
            min={0}
            step={1}
            onChange={(newContent) => {
              const [isValid, value] = tryParseInt(newContent)
              if (isValid) {
                customizationFacade.settings.concurrency = value
                return true
              } else {
                enqueueSnackbar(t("msg_int_expected"), {
                  variant: "error",
                })
                return false
              }
            }}
          />
          <FormControl>
            <Button
              id="export-settings-button"
              variant="outlined"
              onClick={() => {
                FileSaver.saveAs(
                  new Blob([JSON.stringify(customizationFacade.settings)], {
                    type: "application/json;charset=utf-8",
                  }),
                  "settings.json"
                )
                enqueueSnackbar(t("msg_export_settings_succ"), {
                  variant: "success",
                })
              }}
              aria-describedby="export-settings-button-helper-text"
            >
              {t("lbl_export_settings")}
            </Button>
            <FormHelperText id="export-settings-button-helper-text">
              {t("typ_export_settings_helper")}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Button
              id="clear-all-button"
              variant="outlined"
              color="error"
              onClick={() => {
                customizationFacade.clear()
                enqueueSnackbar(t("msg_clear_all"), { variant: "success" })
              }}
              aria-describedby="clear-all-button-helper-text"
            >
              {t("lbl_clear_all")}
            </Button>
            <FormHelperText id="clear-all-button-helper-text">
              {t("typ_clear_all_helper")}
            </FormHelperText>
          </FormControl>
        </Stack>
      </Stack>
    </Container>
  )
}

export default App

export const Head = CommonHead

export const query = graphql`
  query SettingsPage($language: String!) {
    site {
      siteMetadata {
        navRoutes {
          id
          path
        }
      }
    }
    locales: allLocale(
      filter: { ns: { in: ["settings"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
