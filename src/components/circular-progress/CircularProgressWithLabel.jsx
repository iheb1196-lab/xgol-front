import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip

function CircularProgressWithLabel({ value, height, width, activeColor, defaultColor, label }) {
  // Define tooltip content based on the label value

  const tooltip =
    label === "Accuracy"
      ? "Pronunciation accuracy of the speech. Accuracy indicates how closely the phonemes match a native speaker's pronunciation. Word and full text accuracy scores are aggregated from phoneme-level accuracy score."
      : label === "Fluency"
      ? "Fluency of the given speech. Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words."
      : label === "Completeness"
      ? "Completeness of the speech, calculated by the ratio of pronounced words to the input reference text."
       : label === "Vocabulary"
      ? "Proficiency in lexical usage, which is evaluated by speaker's effective usage of words, on how appropriate is the word used with its context to express an idea."
      : label === "Topic"
      ? "Level of understanding and engagement with the topic, which provides insights into the speaker’s ability to express their thoughts and ideas effectively and the ability to engage with the topic."
       : label === "Grammar"
      ? "Proficiency of the correctness in using grammar. Grammatical errors are jointly evaluated by incorporating the level of proper grammar usage with the lexical."
      : label === "Prosody"
      ? `Prosody of the given speech refers to its naturalness, including elements such as stress, intonation, speaking speed, and rhythm. Note that prosody analysis is available only for English speech. 
      `
      
      :"";

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          height: height,
          width: width,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/*  CircularProgress to show full circle by default */}
        <CircularProgress
          variant="determinate"
          value={100}
          size="100%"
          sx={{
            position: "absolute",
            color: defaultColor,
            zIndex: 1, // Ensure it's below the progress circle
          }}
        />
        {/* CircularProgress with fill color based on progress value */}
        <CircularProgress
          variant="determinate"
          value={value}
          size="100%"
          sx={{
            position: "absolute",
            color: activeColor, // Set fill color based on progress value
            zIndex: 2, // Ensure it's above the grey CircularProgress
          }}
        />
        {/* Text to display progress percentage */}
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            zIndex: 3,
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{
              fontSize: 20,
              fontWeight: "500",
              fontFamily: "Poppins",
              color: "#111322",
            }}
          >
            {value ? `${Math.round(value)}%` : "N/A"}
          </Typography>
        </Box>
      </Box>
      {/* Label with Tooltip */}
      {label && (
        <Box display="flex" alignItems="center" sx={{ marginTop: "8px" }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: "#000000",
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            {label}
          </Typography>
          {/* Tooltip next to the label */}
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <Typography
                variant="body2"
                component="span"
                sx={{
                  marginLeft: "4px",
                  cursor: "pointer",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                ⓘ
              </Typography>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  activeColor: PropTypes.string,
  defaultColor: PropTypes.string,
  label: PropTypes.string,
};

CircularProgressWithLabel.defaultProps = {
  height: "50px",
  width: "50px",
  activeColor: "blue",
  defaultColor: "grey",
};

export default CircularProgressWithLabel;
