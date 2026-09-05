import "./feedbackRenderer.scss";
import { Icon } from "@iconify/react";

const SECTION_ICONS = {
  "overall impression": "mdi:message-star-outline",
  "what you did well": "mdi:thumb-up-outline",
  "progress since your previous practice": "mdi:chart-timeline-variant-shimmer",
  "what to improve": "mdi:trending-up",
  "focus for your next take": "mdi:target",
};

const sectionIcon = (title) =>
  SECTION_ICONS[title.trim().toLowerCase()] || "mdi:message-star-outline";

/** Renders **bold** spans inside a line of feedback text. */
const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

/**
 * Lightweight renderer for the coach feedback markdown
 * (## sections, - bullets, **bold**). Safe for progressive streaming:
 * partial text renders cleanly as it arrives.
 */
const FeedbackRenderer = ({ text, streaming }) => {
  if (!text) return null;

  const blocks = [];
  let currentSection = null;

  text.split("\n").forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    if (line.startsWith("## ")) {
      currentSection = {
        title: line.slice(3).trim(),
        items: [],
        key: `section-${index}`,
      };
      blocks.push(currentSection);
    } else if (line.trim().startsWith("- ")) {
      const item = { type: "bullet", text: line.trim().slice(2), key: `l-${index}` };
      if (currentSection) currentSection.items.push(item);
      else blocks.push(item);
    } else if (line.trim() !== "") {
      const item = { type: "paragraph", text: line.trim(), key: `l-${index}` };
      if (currentSection) currentSection.items.push(item);
      else blocks.push(item);
    }
  });

  // Groups consecutive bullets into a <ul>, paragraphs stay as <p>.
  const renderItems = (items) => {
    const rendered = [];
    let bulletGroup = [];
    const flushBullets = () => {
      if (bulletGroup.length > 0) {
        rendered.push(
          <ul key={`ul-${bulletGroup[0].key}`}>
            {bulletGroup.map((item) => (
              <li key={item.key}>{renderInline(item.text)}</li>
            ))}
          </ul>
        );
        bulletGroup = [];
      }
    };
    items.forEach((item) => {
      if (item.type === "bullet") {
        bulletGroup.push(item);
      } else {
        flushBullets();
        rendered.push(<p key={item.key}>{renderInline(item.text)}</p>);
      }
    });
    flushBullets();
    return rendered;
  };

  return (
    <div className="feedback_renderer">
      {blocks.map((block) =>
        block.title !== undefined ? (
          <div className="feedback_section" key={block.key}>
            <h4>
              <Icon icon={sectionIcon(block.title)} width={18} />
              {block.title}
            </h4>
            {renderItems(block.items)}
          </div>
        ) : (
          renderItems([block])
        )
      )}
      {streaming && <span className="streaming_cursor" />}
    </div>
  );
};

export default FeedbackRenderer;
