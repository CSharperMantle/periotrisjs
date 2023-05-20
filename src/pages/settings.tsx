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

import { graphql } from "gatsby"
import { useI18next } from "gatsby-plugin-react-i18next"
import { map } from "lodash"
import { useSnackbar } from "notistack"
import React from "react"

import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { CommonHead, FileFormControl, NumberFormControl } from "../components"
import { customizationFacade } from "../customization"

const App = (): React.ReactElement => {
  const { t, changeLanguage, languages, language } = useI18next()

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

  const handleAssistanceGridModeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    customizationFacade.settings.showGridLine = value === "visible"
    setAssistanceGridMode(value)
  }

  const handleLangChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await changeLanguage(event.target.value)
  }

  const jsonMinifyPreprocessor = (json: string): string => {
    return JSON.stringify(JSON.parse(json))
  }

  const handleColorSchemeFileChange = (newContent: string): boolean => {
    const obj = JSON.parse(newContent)
    if (validateColorScheme(obj)) {
      customizationFacade.settings.colorScheme = obj
      return true
    }
    enqueueSnackbar(t("msg_color_scheme_invalid"), { variant: "error" })
    return false
  }

  const handleGameMapFileChange = (newContent: string): boolean => {
    const obj = JSON.parse(newContent)
    if (validateMap(obj)) {
      customizationFacade.settings.gameMap = obj
      return true
    }
    enqueueSnackbar(t("msg_game_map_invalid"), {
      variant: "error",
    })
    return false
  }

  const handleUpdateIntervalChange = (newContent: string): boolean => {
    const value = parseInt(`0${newContent}`, 10)
    if (isNaN(value)) {
      enqueueSnackbar(t("msg_update_interval_invalid"), { variant: "error" })
      return false
    }
    customizationFacade.settings.gameUpdateIntervalMilliseconds = value
    return true
  }

  const handleBorderThicknessChange = (newContent: string): boolean => {
    const value = parseInt(`0${newContent}`, 10)
    if (isNaN(value) || value <= 0) {
      enqueueSnackbar(t("msg_border_thickness_invalid"), { variant: "error" })
      return false
    }
    customizationFacade.settings.borderThickness = value
    return true
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
              onChange={handleLangChange}
            >
              {map(languages, (lang) => (
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
              onChange={handleAssistanceGridModeChange}
            >
              {map(assistanceGridAppearanceOptions, (option) => (
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
            onChange={handleBorderThicknessChange}
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
            onFileChange={handleColorSchemeFileChange}
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
            onFileChange={handleGameMapFileChange}
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
            onChange={handleUpdateIntervalChange}
          />
        </Stack>
      </Stack>
    </Container>
  )
}

export default App

export const Head = CommonHead

export const query = graphql`
  query SettingsPage($language: String!) {
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
