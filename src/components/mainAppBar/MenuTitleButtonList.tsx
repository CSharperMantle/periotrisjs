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

import { Link } from "gatsby"
import { map } from "lodash"
import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import type { IPageLocationElement } from "../CommonLayout"

interface IMenuTitleButtonListProps {
  readonly pageLocation: IPageLocationElement[]
  readonly handleCloseMenu: (event: React.MouseEvent<HTMLElement>) => void
}

export const MenuTitleButtonList = (
  props: IMenuTitleButtonListProps
): React.ReactElement => {
  return (
    <>
      {map(props.pageLocation, (page) => (
        <Button
          key={page.name}
          onClick={props.handleCloseMenu}
          sx={{ my: 2, color: "white", display: "block" }}
          component={Link}
          to={page.path}
        >
          <Box textAlign="center" margin="0 auto">
            {page.name}
          </Box>
        </Button>
      ))}
    </>
  )
}
