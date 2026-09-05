import Stack from "@mui/material/Stack";
import AccountPopover from "./common/account-popover";
// ----------------------------------------------------------------------

export default function Header({ text }) {

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      justifyContent={"space-between"}
    >
      <div className="pt-6">
        <div className="font-bold text-2xl mb-6">Welcome to your {text}</div>
        <p className="mb-4">Discover Your Statistics Here!</p>
      </div>
      <AccountPopover />
    </Stack>
  );
}

