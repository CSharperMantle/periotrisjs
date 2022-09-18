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
import _ from "lodash"
import React from "react"

import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

import type { IPageLocationElement } from "../CommonLayout"

interface IMenuPageLinkListProps {
  pageLocation: IPageLocationElement[]
  handleCloseMenu: (event: React.MouseEvent<HTMLElement>) => void
}

export const MenuPageLinkList = (
  props: IMenuPageLinkListProps
): React.ReactElement => {
  return (
    <>
      {_.map(props.pageLocation, (page) => (
        <MenuItem key={page.name} onClick={props.handleCloseMenu}>
          <Typography
            textAlign="center"
            component={Link}
            to={page.path}
            sx={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {page.name}
          </Typography>
        </MenuItem>
      ))}
    </>
  )
}
