import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { account } from "../../../mock/account";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../features/auth/authSlice";
import { useRouter } from "../../../routes/hooks";
import { jwtDecode } from "jwt-decode";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
  },
  {
    label: "Profile",
    icon: "eva:person-fill",
  },
  {
    label: "Settings",
    icon: "eva:settings-2-fill",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  // const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const accessToken = localStorage.getItem("accessToken");
  const [decoded, setDecoded] = useState("");
  useEffect(() => {
    if (accessToken) {
      setDecoded(jwtDecode(accessToken));
    }
  }, [accessToken]);

  const router = useRouter();
  const [open, setOpen] = useState(null);
  const dispatch = useDispatch();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    try {
      dispatch(userLogout())
        .unwrap()
        .then(() => router.push("/login"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 50,
          height: 50,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            border: (theme) => `solid 4px violet`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={decoded?.username}
          sx={{
            width: 46,
            height: 46,
            border: (theme) => `solid 1px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 300,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {decoded?.username}
          </Typography>
          {decoded && (
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {decoded?.emails[0]}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))} */}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
