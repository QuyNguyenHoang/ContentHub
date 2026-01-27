import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from './nav'
import { Link } from 'react-router-dom'

// ✅ import SVG đúng kiểu Vite / TS
import logo from '../../../assets/icon/react.svg'
import sygnet from '../../../assets/icon/react.svg'

interface RootState {
  sidebarShow: boolean
  sidebarUnfoldable: boolean
}

const AppSidebar: React.FC = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state: RootState) => state.sidebarShow)
  const unfoldable = useSelector((state: RootState) => state.sidebarUnfoldable)

  return (
    <CSidebar
      position="fixed"
      colorScheme="dark"
      className="border-end"
      visible={sidebarShow}
      unfoldable={unfoldable}
      onVisibleChange={(visible) =>
        dispatch({ type: 'set', sidebarShow: visible })
      }
    >
      <CSidebarHeader className="border-bottom">

        {/* ✅ KHÔNG bọc <Link> bên trong nữa → tránh <a> lồng <a> */}
        <CSidebarBrand as={Link} to="/">
          <img
            src={logo}
            className="sidebar-brand-full"
            height={32}
            alt="Logo"
          />
          <img
            src={sygnet}
            className="sidebar-brand-narrow"
            height={32}
            alt="Sygnet"
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() =>
            dispatch({ type: 'set', sidebarShow: false })
          }
        />
      </CSidebarHeader>

      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({
              type: 'set',
              sidebarUnfoldable: !unfoldable,
            })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
